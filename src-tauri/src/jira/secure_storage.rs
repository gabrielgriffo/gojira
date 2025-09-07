use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path::PathBuf;
use std::os::unix::fs::PermissionsExt;
use keyring::Entry;
use aes_gcm::{Aes256Gcm, Key, Nonce, KeyInit};
use aes_gcm::aead::{Aead, OsRng};
use rand::RngCore;
use serde::{Serialize, Deserialize};
use base64::{Engine as _, engine::general_purpose};
use crate::jira::error::JiraError;
use crate::jira::environment::{EnvironmentInfo, StorageBackend};

#[derive(Serialize, Deserialize)]
struct EncryptedData {
    nonce: Vec<u8>,
    ciphertext: Vec<u8>,
}

pub struct SecureStorage {
    environment: EnvironmentInfo,
    keyring_entry: Option<Entry>,
    file_path: Option<PathBuf>,
    cipher_key: Key<Aes256Gcm>,
}

impl SecureStorage {
    pub fn new(service: &str, username: &str) -> Result<Self, JiraError> {
        let environment = EnvironmentInfo::detect();
        
        let keyring_entry = match environment.storage_backend {
            StorageBackend::NativeKeyring => {
                Some(Entry::new(service, username)?)
            }
            _ => None,
        };

        let file_path = match environment.storage_backend {
            StorageBackend::EncryptedFile => {
                Some(Self::get_secure_file_path(service, username)?)
            }
            _ => None,
        };

        let cipher_key = Self::get_or_create_cipher_key(&environment, &keyring_entry, &file_path)?;

        Ok(Self {
            environment,
            keyring_entry,
            file_path,
            cipher_key,
        })
    }

    pub fn store(&self, data: &str) -> Result<(), JiraError> {
        match &self.environment.storage_backend {
            StorageBackend::NativeKeyring => {
                if let Some(entry) = &self.keyring_entry {
                    // Ainda criptografar mesmo no keyring para dupla proteção
                    let encrypted = self.encrypt_data(data.as_bytes())?;
                    let encrypted_b64 = general_purpose::STANDARD.encode(serde_json::to_vec(&encrypted)?);
                    entry.set_password(&encrypted_b64)?;
                } else {
                    return Err(JiraError::InvalidConfig("Keyring não disponível".to_string()));
                }
            }
            StorageBackend::EncryptedFile => {
                if let Some(file_path) = &self.file_path {
                    let encrypted = self.encrypt_data(data.as_bytes())?;
                    let encrypted_data = serde_json::to_vec(&encrypted)?;
                    
                    // Criar diretório se não existir
                    if let Some(parent) = file_path.parent() {
                        fs::create_dir_all(parent)
                            .map_err(|e| JiraError::InvalidConfig(format!("Erro ao criar diretório: {}", e)))?;
                    }
                    
                    // Escrever arquivo com permissões restritas
                    let mut file = OpenOptions::new()
                        .write(true)
                        .create(true)
                        .truncate(true)
                        .open(file_path)
                        .map_err(|e| JiraError::InvalidConfig(format!("Erro ao criar arquivo: {}", e)))?;
                    
                    file.write_all(&encrypted_data)
                        .map_err(|e| JiraError::InvalidConfig(format!("Erro ao escrever arquivo: {}", e)))?;
                    
                    // Definir permissões 600 (apenas proprietário pode ler/escrever)
                    #[cfg(unix)]
                    {
                        let metadata = file.metadata()
                            .map_err(|e| JiraError::InvalidConfig(format!("Erro ao obter metadados: {}", e)))?;
                        let mut permissions = metadata.permissions();
                        permissions.set_mode(0o600);
                        file.set_permissions(permissions)
                            .map_err(|e| JiraError::InvalidConfig(format!("Erro ao definir permissões: {}", e)))?;
                    }
                } else {
                    return Err(JiraError::InvalidConfig("Caminho do arquivo não disponível".to_string()));
                }
            }
            StorageBackend::InMemory => {
                // Para testes - não implementar armazenamento persistente
                return Err(JiraError::InvalidConfig("Armazenamento em memória não suportado".to_string()));
            }
        }

        Ok(())
    }

    pub fn retrieve(&self) -> Result<Option<String>, JiraError> {
        match &self.environment.storage_backend {
            StorageBackend::NativeKeyring => {
                if let Some(entry) = &self.keyring_entry {
                    match entry.get_password() {
                        Ok(encrypted_b64) => {
                            let encrypted_bytes = general_purpose::STANDARD.decode(&encrypted_b64)?;
                            let encrypted: EncryptedData = serde_json::from_slice(&encrypted_bytes)?;
                            let decrypted = self.decrypt_data(&encrypted)?;
                            Ok(Some(String::from_utf8_lossy(&decrypted).to_string()))
                        }
                        Err(keyring::Error::NoEntry) => Ok(None),
                        Err(e) => Err(JiraError::Keyring(e)),
                    }
                } else {
                    Err(JiraError::InvalidConfig("Keyring não disponível".to_string()))
                }
            }
            StorageBackend::EncryptedFile => {
                if let Some(file_path) = &self.file_path {
                    match fs::read(file_path) {
                        Ok(encrypted_data) => {
                            let encrypted: EncryptedData = serde_json::from_slice(&encrypted_data)?;
                            let decrypted = self.decrypt_data(&encrypted)?;
                            Ok(Some(String::from_utf8_lossy(&decrypted).to_string()))
                        }
                        Err(ref e) if e.kind() == std::io::ErrorKind::NotFound => Ok(None),
                        Err(e) => Err(JiraError::InvalidConfig(format!("Erro ao ler arquivo: {}", e))),
                    }
                } else {
                    Err(JiraError::InvalidConfig("Caminho do arquivo não disponível".to_string()))
                }
            }
            StorageBackend::InMemory => {
                Ok(None)
            }
        }
    }

    pub fn delete(&self) -> Result<(), JiraError> {
        match &self.environment.storage_backend {
            StorageBackend::NativeKeyring => {
                if let Some(entry) = &self.keyring_entry {
                    entry.delete_password().map_err(JiraError::Keyring)?;
                }
            }
            StorageBackend::EncryptedFile => {
                if let Some(file_path) = &self.file_path {
                    if file_path.exists() {
                        fs::remove_file(file_path)
                            .map_err(|e| JiraError::InvalidConfig(format!("Erro ao deletar arquivo: {}", e)))?;
                    }
                }
            }
            StorageBackend::InMemory => {
                // Nada a fazer
            }
        }

        Ok(())
    }

    pub fn get_environment_info(&self) -> &EnvironmentInfo {
        &self.environment
    }

    // Métodos privados

    fn get_secure_file_path(service: &str, username: &str) -> Result<PathBuf, JiraError> {
        let mut path = dirs::config_dir()
            .or_else(|| dirs::home_dir().map(|p| p.join(".config")))
            .ok_or_else(|| JiraError::InvalidConfig("Não foi possível encontrar diretório de configuração".to_string()))?;
        
        path.push(service);
        path.push(format!("{}.enc", username));
        Ok(path)
    }

    fn get_or_create_cipher_key(
        _environment: &EnvironmentInfo,
        keyring_entry: &Option<Entry>,
        file_path: &Option<PathBuf>,
    ) -> Result<Key<Aes256Gcm>, JiraError> {
        // Tentar recuperar chave existente do keyring se disponível
        if let Some(entry) = keyring_entry {
            if let Ok(key_data) = entry.get_password() {
                if key_data.len() >= 44 { // Base64 de 32 bytes = 44 chars
                    if let Ok(key_bytes) = general_purpose::STANDARD.decode(&key_data[..44]) {
                        if key_bytes.len() == 32 {
                            return Ok(Key::<Aes256Gcm>::from_slice(&key_bytes).clone());
                        }
                    }
                }
            }
        }

        // Tentar recuperar chave de arquivo de chave separado
        if let Some(config_path) = file_path {
            let key_path = config_path.with_extension("key");
            if let Ok(key_data) = fs::read_to_string(&key_path) {
                if let Ok(key_bytes) = general_purpose::STANDARD.decode(key_data.trim()) {
                    if key_bytes.len() == 32 {
                        return Ok(Key::<Aes256Gcm>::from_slice(&key_bytes).clone());
                    }
                }
            }
        }

        // Gerar nova chave
        let mut key_bytes = [0u8; 32];
        OsRng.fill_bytes(&mut key_bytes);
        let key = Key::<Aes256Gcm>::from_slice(&key_bytes).clone();

        // Salvar nova chave
        let key_b64 = general_purpose::STANDARD.encode(&key_bytes);
        
        if let Some(entry) = keyring_entry {
            let _ = entry.set_password(&key_b64);
        } else if let Some(config_path) = file_path {
            let key_path = config_path.with_extension("key");
            if let Some(parent) = key_path.parent() {
                let _ = fs::create_dir_all(parent);
            }
            if let Ok(mut file) = OpenOptions::new().write(true).create(true).truncate(true).open(&key_path) {
                let _ = file.write_all(key_b64.as_bytes());
                
                // Definir permissões 600 para arquivo de chave
                #[cfg(unix)]
                {
                    if let Ok(metadata) = file.metadata() {
                        let mut permissions = metadata.permissions();
                        permissions.set_mode(0o600);
                        let _ = file.set_permissions(permissions);
                    }
                }
            }
        }

        Ok(key)
    }

    fn encrypt_data(&self, plaintext: &[u8]) -> Result<EncryptedData, JiraError> {
        let cipher = Aes256Gcm::new(&self.cipher_key);
        
        let mut nonce_bytes = [0u8; 12];
        OsRng.fill_bytes(&mut nonce_bytes);
        let nonce = Nonce::from_slice(&nonce_bytes);
        
        let ciphertext = cipher.encrypt(nonce, plaintext)
            .map_err(|_| JiraError::Encryption)?;
        
        Ok(EncryptedData {
            nonce: nonce_bytes.to_vec(),
            ciphertext,
        })
    }

    fn decrypt_data(&self, encrypted: &EncryptedData) -> Result<Vec<u8>, JiraError> {
        let cipher = Aes256Gcm::new(&self.cipher_key);
        let nonce = Nonce::from_slice(&encrypted.nonce);
        
        cipher.decrypt(nonce, encrypted.ciphertext.as_slice())
            .map_err(|_| JiraError::Decryption)
    }
}