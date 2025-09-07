use thiserror::Error;

#[derive(Error, Debug)]
pub enum JiraError {
    #[error("Keyring error: {0}")]
    Keyring(#[from] keyring::Error),
    
    #[error("Encryption error")]
    Encryption,
    
    #[error("Decryption error")]
    Decryption,
    
    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),
    
    #[error("Base64 error: {0}")]
    Base64(#[from] base64::DecodeError),
    
    #[error("HTTP error: {0}")]
    Http(#[from] reqwest::Error),
    
    #[error("Invalid configuration: {0}")]
    InvalidConfig(String),
    
    #[error("Authentication failed")]
    AuthenticationFailed,
}