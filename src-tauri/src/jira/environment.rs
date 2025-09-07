use std::fs;
use std::env;
use std::process::Command;
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum StorageBackend {
    NativeKeyring,
    EncryptedFile,
    InMemory, // Para testes
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EnvironmentInfo {
    pub is_wsl: bool,
    pub is_wsl2: bool,
    pub has_keyring: bool,
    pub has_desktop_environment: bool,
    pub storage_backend: StorageBackend,
    pub security_level: SecurityLevel,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SecurityLevel {
    High,    // Keyring nativo disponível
    Medium,  // Arquivo criptografado
    Low,     // Fallback básico
}

impl EnvironmentInfo {
    pub fn detect() -> Self {
        let is_wsl = Self::detect_wsl();
        let is_wsl2 = Self::detect_wsl2();
        let has_keyring = Self::detect_keyring();
        let has_desktop_environment = Self::detect_desktop_environment();

        let storage_backend = Self::determine_storage_backend(has_keyring, is_wsl);
        let security_level = Self::determine_security_level(&storage_backend);

        Self {
            is_wsl,
            is_wsl2,
            has_keyring,
            has_desktop_environment,
            storage_backend,
            security_level,
        }
    }

    fn detect_wsl() -> bool {
        // Verificar /proc/version para indicadores WSL
        if let Ok(version) = fs::read_to_string("/proc/version") {
            return version.to_lowercase().contains("wsl") || 
                   version.to_lowercase().contains("microsoft");
        }

        // Verificar variável de ambiente WSL
        env::var("WSL_DISTRO_NAME").is_ok() || env::var("WSLENV").is_ok()
    }

    fn detect_wsl2() -> bool {
        if !Self::detect_wsl() {
            return false;
        }

        // WSL2 usa kernel Linux real
        if let Ok(version) = fs::read_to_string("/proc/version") {
            return version.contains("WSL2") || 
                   (!version.contains("WSL") && version.contains("Microsoft"));
        }

        false
    }

    fn detect_keyring() -> bool {
        // Verificar se gnome-keyring está disponível
        if Self::command_exists("gnome-keyring-daemon") {
            return true;
        }

        // Verificar se KDE Wallet está disponível
        if Self::command_exists("kwalletd5") || Self::command_exists("kwalletd") {
            return true;
        }

        // Verificar se secret-tool está disponível
        if Self::command_exists("secret-tool") {
            return true;
        }

        // Verificar se dbus-daemon está rodando (necessário para keyring)
        if let Ok(output) = Command::new("pgrep").args(["-x", "dbus-daemon"]).output() {
            if !output.stdout.is_empty() {
                // Verificar se há um serviço de secrets ativo
                if let Ok(_) = Command::new("dbus-send")
                    .args([
                        "--session",
                        "--print-reply",
                        "--dest=org.freedesktop.secrets",
                        "/org/freedesktop/secrets",
                        "org.freedesktop.DBus.Introspectable.Introspect"
                    ])
                    .output() {
                    return true;
                }
            }
        }

        false
    }

    fn detect_desktop_environment() -> bool {
        // Verificar variáveis de ambiente de desktop
        let desktop_vars = [
            "XDG_CURRENT_DESKTOP",
            "DESKTOP_SESSION",
            "GNOME_DESKTOP_SESSION_ID",
            "KDE_FULL_SESSION",
        ];

        for var in &desktop_vars {
            if env::var(var).is_ok() {
                return true;
            }
        }

        // Verificar se X11 ou Wayland estão rodando
        env::var("DISPLAY").is_ok() || env::var("WAYLAND_DISPLAY").is_ok()
    }

    fn command_exists(cmd: &str) -> bool {
        Command::new("which")
            .arg(cmd)
            .output()
            .map(|output| output.status.success())
            .unwrap_or(false)
    }

    fn determine_storage_backend(has_keyring: bool, is_wsl: bool) -> StorageBackend {
        if has_keyring && !is_wsl {
            // Keyring nativo disponível e não é WSL
            StorageBackend::NativeKeyring
        } else {
            // Usar arquivo criptografado como fallback
            StorageBackend::EncryptedFile
        }
    }

    fn determine_security_level(backend: &StorageBackend) -> SecurityLevel {
        match backend {
            StorageBackend::NativeKeyring => SecurityLevel::High,
            StorageBackend::EncryptedFile => SecurityLevel::Medium,
            StorageBackend::InMemory => SecurityLevel::Low,
        }
    }

    #[allow(dead_code)]
    pub fn get_security_description(&self) -> String {
        match self.security_level {
            SecurityLevel::High => {
                "Máxima segurança: credenciais armazenadas no keyring nativo do sistema".to_string()
            }
            SecurityLevel::Medium => {
                if self.is_wsl {
                    "Boa segurança: credenciais criptografadas em arquivo local (ambiente WSL detectado)".to_string()
                } else {
                    "Boa segurança: credenciais criptografadas em arquivo local".to_string()
                }
            }
            SecurityLevel::Low => {
                "Segurança básica: armazenamento temporário".to_string()
            }
        }
    }

    #[allow(dead_code)]
    pub fn get_improvement_suggestions(&self) -> Vec<String> {
        let mut suggestions = Vec::new();

        if self.is_wsl && !self.has_keyring {
            suggestions.push("Para melhor segurança no WSL2, considere instalar gnome-keyring:".to_string());
            suggestions.push("sudo apt install gnome-keyring".to_string());
            suggestions.push("Depois execute: gnome-keyring-daemon --start --components=secrets".to_string());
        }

        if !self.has_desktop_environment && !self.is_wsl {
            suggestions.push("Sistema sem ambiente desktop detectado. Instale um gerenciador de keyring:".to_string());
            suggestions.push("Ubuntu/Debian: sudo apt install gnome-keyring".to_string());
            suggestions.push("Fedora: sudo dnf install gnome-keyring".to_string());
        }

        suggestions
    }

    #[allow(dead_code)]
    pub fn should_show_security_warning(&self) -> bool {
        matches!(self.security_level, SecurityLevel::Medium | SecurityLevel::Low)
    }
}