// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod jira;
use jira::{config_manager::{JiraConfigManager, JiraConfig}, client::JiraClient};
use chrono::Utc;

#[tauri::command]
fn save_theme_to_config(theme: &str) -> Result<(), String> {
    use std::path::Path;
    use std::fs;
    
    // Caminho para o arquivo de configuração
    let config_path = Path::new("src-tauri/tauri.conf.json");
    
    // Ler o arquivo atual
    let config_content = fs::read_to_string(config_path)
        .map_err(|e| format!("Erro ao ler configuração: {}", e))?;
    
    // Parse do JSON
    let mut config: serde_json::Value = serde_json::from_str(&config_content)
        .map_err(|e| format!("Erro ao fazer parse do JSON: {}", e))?;
    
    // Mapear theme para o formato esperado pelo Tauri
    let tauri_theme = match theme {
        "light" => "Light",
        "dark" => "Dark",
        _ => "Dark" // fallback
    };
    
    // Atualizar o tema na configuração
    if let Some(app) = config.get_mut("app") {
        if let Some(windows) = app.get_mut("windows") {
            if let Some(windows_array) = windows.as_array_mut() {
                if let Some(first_window) = windows_array.get_mut(0) {
                    first_window["theme"] = serde_json::Value::String(tauri_theme.to_string());
                }
            }
        }
    }
    
    // Escrever o arquivo atualizado
    let updated_content = serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Erro ao serializar JSON: {}", e))?;
    
    fs::write(config_path, updated_content)
        .map_err(|e| format!("Erro ao escrever configuração: {}", e))?;
    
    Ok(())
}

// Comandos JIRA para gerenciar credenciais
#[tauri::command]
async fn save_jira_config(
    url: String,
    email: String,
    token: String,
) -> Result<(), String> {
    let config = JiraConfig {
        url: url.trim_end_matches('/').to_string(),
        email,
        token,
        created_at: Utc::now(),
        last_used: None,
    };

    let manager = JiraConfigManager::new()
        .map_err(|e| format!("Erro ao inicializar gerenciador: {:?}", e))?;
    
    manager.save_config(&config)
        .map_err(|e| format!("Erro ao salvar configuração: {:?}", e))
}

#[tauri::command]
async fn get_jira_config() -> Result<Option<JiraConfig>, String> {
    let manager = JiraConfigManager::new()
        .map_err(|e| format!("Erro ao inicializar gerenciador: {:?}", e))?;
    
    // Não retornar o token por segurança - mascarar
    if let Some(mut config) = manager.get_config()
        .map_err(|e| format!("Erro ao recuperar configuração: {:?}", e))? {
        
        config.token = "••••••••••••••••".to_string(); // Mascarar token
        Ok(Some(config))
    } else {
        Ok(None)
    }
}

#[tauri::command]
async fn test_jira_connection() -> Result<bool, String> {
    let manager = JiraConfigManager::new()
        .map_err(|e| format!("Erro ao inicializar gerenciador: {:?}", e))?;
    
    manager.test_config().await
        .map_err(|e| format!("Erro ao testar conexão: {:?}", e))
}

#[tauri::command]
async fn clear_jira_config() -> Result<(), String> {
    let manager = JiraConfigManager::new()
        .map_err(|e| format!("Erro ao inicializar gerenciador: {:?}", e))?;
    
    manager.clear_config()
        .map_err(|e| format!("Erro ao limpar configuração: {:?}", e))
}

#[tauri::command]
async fn has_jira_config() -> Result<bool, String> {
    let manager = JiraConfigManager::new()
        .map_err(|e| format!("Erro ao inicializar gerenciador: {:?}", e))?;
    
    let config = manager.get_config()
        .map_err(|e| format!("Erro ao verificar configuração: {:?}", e))?;
    
    Ok(config.is_some())
}

#[tauri::command]
async fn get_current_jira_user() -> Result<String, String> {
    let client = JiraClient::new()
        .map_err(|e| format!("Erro ao criar cliente JIRA: {:?}", e))?;
    
    let user = client.get_current_user().await
        .map_err(|e| format!("Erro ao obter usuário atual: {:?}", e))?;
    
    Ok(serde_json::to_string(&user).unwrap())
}

#[tauri::command]
async fn get_jira_projects() -> Result<String, String> {
    let client = JiraClient::new()
        .map_err(|e| format!("Erro ao criar cliente JIRA: {:?}", e))?;
    
    let projects = client.get_projects().await
        .map_err(|e| format!("Erro ao obter projetos: {:?}", e))?;
    
    Ok(serde_json::to_string(&projects).unwrap())
}

#[tauri::command]
async fn search_jira_issues(jql: String, max_results: u32) -> Result<String, String> {
    let client = JiraClient::new()
        .map_err(|e| format!("Erro ao criar cliente JIRA: {:?}", e))?;
    
    let issues = client.search_issues(&jql, max_results).await
        .map_err(|e| format!("Erro ao buscar issues: {:?}", e))?;
    
    Ok(serde_json::to_string(&issues).unwrap())
}

#[tauri::command]
async fn get_jira_environment_info() -> Result<String, String> {
    let manager = JiraConfigManager::new()
        .map_err(|e| format!("Erro ao inicializar gerenciador: {:?}", e))?;
    
    let env_info = manager.get_environment_info();
    Ok(serde_json::to_string(&env_info).unwrap())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            save_theme_to_config,
            save_jira_config,
            get_jira_config,
            test_jira_connection,
            clear_jira_config,
            has_jira_config,
            get_current_jira_user,
            get_jira_projects,
            search_jira_issues,
            get_jira_environment_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
