use serde::{Serialize, Deserialize};
use chrono::{DateTime, Utc};
use base64::{Engine as _, engine::general_purpose};
use crate::jira::error::JiraError;
use crate::jira::secure_storage::SecureStorage;
use crate::jira::environment::EnvironmentInfo;

#[derive(Serialize, Deserialize, Clone)]
pub struct JiraConfig {
    pub url: String,
    pub email: String,
    pub token: String,
    pub created_at: DateTime<Utc>,
    pub last_used: Option<DateTime<Utc>>,
}

pub struct JiraConfigManager {
    secure_storage: SecureStorage,
}

impl JiraConfigManager {
    pub fn new() -> Result<Self, JiraError> {
        let secure_storage = SecureStorage::new("goji", "jira_config")?;
        
        Ok(Self {
            secure_storage,
        })
    }

    // Salvar configuração JIRA
    pub fn save_config(&self, config: &JiraConfig) -> Result<(), JiraError> {
        // Validar configuração
        if config.url.trim().is_empty() || !config.url.starts_with("https://") {
            return Err(JiraError::InvalidConfig("URL deve começar com https://".to_string()));
        }
        
        if config.email.trim().is_empty() || !config.email.contains('@') {
            return Err(JiraError::InvalidConfig("Email deve ser válido".to_string()));
        }
        
        if config.token.trim().is_empty() {
            return Err(JiraError::InvalidConfig("Token não pode estar vazio".to_string()));
        }

        // Serializar configuração
        let json_data = serde_json::to_string(config)?;
        
        // Salvar usando SecureStorage
        self.secure_storage.store(&json_data)?;
        
        Ok(())
    }

    // Recuperar configuração JIRA
    pub fn get_config(&self) -> Result<Option<JiraConfig>, JiraError> {
        if let Some(json_data) = self.secure_storage.retrieve()? {
            let config: JiraConfig = serde_json::from_str(&json_data)?;
            Ok(Some(config))
        } else {
            Ok(None)
        }
    }

    // Testar configuração
    pub async fn test_config(&self) -> Result<bool, JiraError> {
        if let Some(config) = self.get_config()? {
            // Fazer uma chamada simples à API para testar
            let client = reqwest::Client::builder()
                .timeout(std::time::Duration::from_secs(30))
                .build()?;
                
            let auth_header = Self::create_auth_header(&config);
            
            let response = client
                .get(&format!("{}/rest/api/3/myself", config.url))
                .header("Authorization", auth_header)
                .header("Accept", "application/json")
                .send()
                .await?;
                
            Ok(response.status().is_success())
        } else {
            Ok(false)
        }
    }

    // Limpar configuração
    pub fn clear_config(&self) -> Result<(), JiraError> {
        self.secure_storage.delete()
    }

    // Atualizar timestamp de último uso
    pub fn update_last_used(&self) -> Result<(), JiraError> {
        if let Some(mut config) = self.get_config()? {
            config.last_used = Some(Utc::now());
            self.save_config(&config)?;
        }
        Ok(())
    }

    // Obter informações sobre o ambiente de segurança
    pub fn get_environment_info(&self) -> &EnvironmentInfo {
        self.secure_storage.get_environment_info()
    }

    // === MÉTODOS PRIVADOS ===

    fn create_auth_header(config: &JiraConfig) -> String {
        let credentials = format!("{}:{}", config.email, config.token);
        let encoded = general_purpose::STANDARD.encode(credentials);
        format!("Basic {}", encoded)
    }
}