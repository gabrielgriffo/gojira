import { invoke } from '@tauri-apps/api/core';
import type { JiraConfig, JiraUser, JiraProject, JiraIssue, JiraConnectionStatus, EnvironmentInfo } from '../types/jira';
import { SecurityLevel } from '../types/jira';

export class JiraService {
  // Verificar se tem configuração JIRA
  static async hasConfig(): Promise<boolean> {
    return invoke('has_jira_config');
  }

  // Salvar configuração JIRA
  static async saveConfig(
    url: string,
    email: string,
    token: string
  ): Promise<void> {
    return invoke('save_jira_config', { url, email, token });
  }

  // Recuperar configuração JIRA (token mascarado)
  static async getConfig(): Promise<JiraConfig | null> {
    return invoke('get_jira_config');
  }

  // Testar conexão com JIRA
  static async testConnection(): Promise<boolean> {
    return invoke('test_jira_connection');
  }

  // Limpar configuração JIRA
  static async clearConfig(): Promise<void> {
    return invoke('clear_jira_config');
  }

  // Obter usuário atual do JIRA
  static async getCurrentUser(): Promise<JiraUser> {
    const userJson: string = await invoke('get_current_jira_user');
    return JSON.parse(userJson);
  }

  // Obter projetos do JIRA
  static async getProjects(): Promise<JiraProject[]> {
    const projectsJson: string = await invoke('get_jira_projects');
    return JSON.parse(projectsJson);
  }

  // Buscar issues usando JQL
  static async searchIssues(jql: string, maxResults: number = 50): Promise<JiraIssue[]> {
    const issuesJson: string = await invoke('search_jira_issues', { jql, maxResults });
    return JSON.parse(issuesJson);
  }

  // Verificar status da conexão
  static async getConnectionStatus(): Promise<JiraConnectionStatus> {
    try {
      const isConnected = await this.testConnection();
      
      if (isConnected) {
        const user = await this.getCurrentUser();
        return {
          connected: true,
          user,
          lastChecked: new Date()
        };
      } else {
        return {
          connected: false,
          lastChecked: new Date(),
          error: 'Falha na conexão com JIRA'
        };
      }
    } catch (error) {
      return {
        connected: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  // Validar URL do JIRA
  static validateJiraUrl(url: string): { valid: boolean; error?: string } {
    if (!url.trim()) {
      return { valid: false, error: 'URL não pode estar vazia' };
    }

    if (!url.startsWith('https://')) {
      return { valid: false, error: 'URL deve começar com https://' };
    }

    try {
      new URL(url);
      return { valid: true };
    } catch {
      return { valid: false, error: 'URL inválida' };
    }
  }

  // Validar email
  static validateEmail(email: string): { valid: boolean; error?: string } {
    if (!email.trim()) {
      return { valid: false, error: 'Email não pode estar vazio' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Email deve ter formato válido' };
    }

    return { valid: true };
  }

  // Validar token
  static validateToken(token: string): { valid: boolean; error?: string } {
    if (!token.trim()) {
      return { valid: false, error: 'Token não pode estar vazio' };
    }

    if (token.includes('••••')) {
      return { valid: true }; // Token mascarado existente
    }

    if (token.length < 10) {
      return { valid: false, error: 'Token parece muito curto' };
    }

    return { valid: true };
  }

  // Obter informações do ambiente de segurança
  static async getEnvironmentInfo(): Promise<EnvironmentInfo> {
    const envInfoJson: string = await invoke('get_jira_environment_info');
    return JSON.parse(envInfoJson);
  }

  // Obter descrição do nível de segurança
  static getSecurityDescription(securityLevel: SecurityLevel, isWsl: boolean): string {
    switch (securityLevel) {
      case SecurityLevel.High:
        return "Máxima segurança: credenciais armazenadas no keyring nativo do sistema";
      case SecurityLevel.Medium:
        if (isWsl) {
          return "Boa segurança: credenciais criptografadas em arquivo local (ambiente WSL detectado)";
        } else {
          return "Boa segurança: credenciais criptografadas em arquivo local";
        }
      case SecurityLevel.Low:
        return "Segurança básica: armazenamento temporário (apenas para desenvolvimento)";
      default:
        return "Nível de segurança desconhecido";
    }
  }

  // Obter sugestões de melhoria de segurança
  static getSecuritySuggestions(envInfo: EnvironmentInfo): string[] {
    const suggestions: string[] = [];

    if (envInfo.is_wsl && !envInfo.has_keyring) {
      suggestions.push("Para melhor segurança no WSL2, considere instalar gnome-keyring:");
      suggestions.push("sudo apt install gnome-keyring");
      suggestions.push("Depois execute: gnome-keyring-daemon --start --components=secrets");
    }

    if (!envInfo.has_desktop_environment && !envInfo.is_wsl) {
      suggestions.push("Sistema sem ambiente desktop detectado. Instale um gerenciador de keyring:");
      suggestions.push("Ubuntu/Debian: sudo apt install gnome-keyring");
      suggestions.push("Fedora: sudo dnf install gnome-keyring");
    }

    return suggestions;
  }

  // Verificar se deve mostrar aviso de segurança
  static shouldShowSecurityWarning(securityLevel: SecurityLevel): boolean {
    return securityLevel === SecurityLevel.Medium || securityLevel === SecurityLevel.Low;
  }
}