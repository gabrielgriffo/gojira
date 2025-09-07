// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![save_theme_to_config])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
