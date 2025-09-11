// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::Manager;

mod jira;
use jira::{config_manager::{JiraConfigManager, JiraConfig}, client::JiraClient};
use chrono::Utc;


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

// Comandos para controle de janela
#[tauri::command]
async fn show_main_window(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        window.show().map_err(|e| format!("Erro ao mostrar janela: {}", e))?;
        window.set_focus().map_err(|e| format!("Erro ao focar janela: {}", e))?;
    }
    Ok(())
}

#[tauri::command]
async fn hide_main_window(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        window.hide().map_err(|e| format!("Erro ao esconder janela: {}", e))?;
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_window_state::Builder::default()
            .with_filename("../Goji/.window-state.json")
            .build())
        .invoke_handler(tauri::generate_handler![
            save_jira_config,
            get_jira_config,
            test_jira_connection,
            clear_jira_config,
            has_jira_config,
            get_current_jira_user,
            get_jira_projects,
            search_jira_issues,
            get_jira_environment_info,
            show_main_window,
            hide_main_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
