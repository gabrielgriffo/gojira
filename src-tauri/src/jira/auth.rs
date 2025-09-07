use crate::jira::{config_manager::JiraConfigManager, error::JiraError};
use base64::{Engine as _, engine::general_purpose};

pub struct JiraAuth {
    config_manager: JiraConfigManager,
}

impl JiraAuth {
    pub fn new() -> Result<Self, JiraError> {
        Ok(Self {
            config_manager: JiraConfigManager::new()?,
        })
    }

    pub fn get_auth_header(&self) -> Result<Option<String>, JiraError> {
        if let Some(config) = self.config_manager.get_config()? {
            let credentials = format!("{}:{}", config.email, config.token);
            let encoded = general_purpose::STANDARD.encode(credentials);
            Ok(Some(format!("Basic {}", encoded)))
        } else {
            Ok(None)
        }
    }


    pub fn update_last_used(&self) -> Result<(), JiraError> {
        self.config_manager.update_last_used()
    }
}