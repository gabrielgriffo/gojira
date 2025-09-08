// @ts-ignore - Tauri API pode não estar disponível durante desenvolvimento
const invoke = typeof window !== 'undefined' && '__TAURI_IPC__' in window 
  ? (window as any).__TAURI_IPC__.invoke 
  : () => Promise.resolve();
import type { JiraConfig, JiraUser, JiraProject, JiraIssue, JiraConnectionStatus, EnvironmentInfo } from '../types/jira';
import { StorageBackend, SecurityLevel } from '../types/jira';

const isTauri = typeof window !== 'undefined' && '__TAURI_IPC__' in window;

export class JiraService {
  // Verificar se tem configuração JIRA
  static async hasConfig(): Promise<boolean> {
    if (isTauri) {
      return invoke('has_jira_config');
    } else {
      // Mock para desenvolvimento
      return localStorage.getItem('goji_dev_jira_config') !== null;
    }
  }

  // Salvar configuração JIRA
  static async saveConfig(
    url: string,
    email: string,
    token: string
  ): Promise<void> {
    if (isTauri) {
      return invoke('save_jira_config', { url, email, token });
    } else {
      // Mock para desenvolvimento
      console.warn('🚨 Modo desenvolvimento: credenciais JIRA salvas localmente (INSEGURO)');
      const config: JiraConfig = {
        url,
        email,
        token,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem('goji_dev_jira_config', JSON.stringify(config));
    }
  }

  // Recuperar configuração JIRA (token mascarado)
  static async getConfig(): Promise<JiraConfig | null> {
    if (isTauri) {
      return invoke('get_jira_config');
    } else {
      // Mock para desenvolvimento
      const stored = localStorage.getItem('goji_dev_jira_config');
      if (stored) {
        const config = JSON.parse(stored);
        config.token = '••••••••••••••••'; // Mascarar token
        return config;
      }
      return null;
    }
  }

  // Testar conexão com JIRA
  static async testConnection(): Promise<boolean> {
    if (isTauri) {
      return invoke('test_jira_connection');
    } else {
      // Mock sempre retorna sucesso após delay
      return new Promise(resolve => 
        setTimeout(() => resolve(true), 1000)
      );
    }
  }

  // Limpar configuração JIRA
  static async clearConfig(): Promise<void> {
    if (isTauri) {
      return invoke('clear_jira_config');
    } else {
      localStorage.removeItem('goji_dev_jira_config');
    }
  }

  // Obter usuário atual do JIRA
  static async getCurrentUser(): Promise<JiraUser> {
    if (isTauri) {
      const userJson: string = await invoke('get_current_jira_user');
      return JSON.parse(userJson);
    } else {
      // Mock para desenvolvimento
      return {
        accountId: '123456789',
        displayName: 'Usuário de Desenvolvimento',
        emailAddress: 'dev@exemplo.com',
        active: true
      };
    }
  }

  // Obter projetos do JIRA
  static async getProjects(): Promise<JiraProject[]> {
    if (isTauri) {
      const projectsJson: string = await invoke('get_jira_projects');
      return JSON.parse(projectsJson);
    } else {
      // Mock para desenvolvimento
      return [
        {
          id: '1',
          key: 'PROJ',
          name: 'Projeto de Exemplo',
          description: 'Projeto mock para desenvolvimento',
          projectTypeKey: 'software'
        },
        {
          id: '2', 
          key: 'TEST',
          name: 'Projeto de Testes',
          description: 'Outro projeto mock',
          projectTypeKey: 'software'
        }
      ];
    }
  }

  // Buscar issues usando JQL
  static async searchIssues(jql: string, maxResults: number = 50): Promise<JiraIssue[]> {
    if (isTauri) {
      const issuesJson: string = await invoke('search_jira_issues', { jql, maxResults });
      return JSON.parse(issuesJson);
    } else {
      // Mock para desenvolvimento
      return [
        {
          id: '1',
          key: 'PROJ-1',
          summary: 'Issue de exemplo',
          status: 'To Do',
          assignee: 'João Silva',
          reporter: 'Maria Santos',
          created: new Date(Date.now() - 86400000).toISOString(),
          updated: new Date().toISOString()
        },
        {
          id: '2',
          key: 'PROJ-2', 
          summary: 'Outra issue de exemplo',
          status: 'In Progress',
          assignee: 'Pedro Oliveira',
          reporter: 'Ana Costa',
          created: new Date(Date.now() - 172800000).toISOString(),
          updated: new Date(Date.now() - 3600000).toISOString()
        }
      ];
    }
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
    if (isTauri) {
      const envInfoJson: string = await invoke('get_jira_environment_info');
      return JSON.parse(envInfoJson);
    } else {
      // Mock para desenvolvimento
      return {
        is_wsl: false,
        is_wsl2: false,
        has_keyring: false,
        has_desktop_environment: true,
        storage_backend: StorageBackend.InMemory,
        security_level: SecurityLevel.Low
      };
    }
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