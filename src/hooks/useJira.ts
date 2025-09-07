import { useState, useCallback } from 'react';
import { JiraService } from '../services/jiraService';
import type { JiraConfig, JiraUser, JiraProject, JiraIssue, JiraConnectionStatus, EnvironmentInfo } from '../types/jira';

export const useJira = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const saveConfig = useCallback(async (url: string, email: string, token: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validar dados antes de salvar
      const urlValidation = JiraService.validateJiraUrl(url);
      if (!urlValidation.valid) {
        throw new Error(urlValidation.error);
      }

      const emailValidation = JiraService.validateEmail(email);
      if (!emailValidation.valid) {
        throw new Error(emailValidation.error);
      }

      const tokenValidation = JiraService.validateToken(token);
      if (!tokenValidation.valid) {
        throw new Error(tokenValidation.error);
      }

      await JiraService.saveConfig(url, email, token);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao salvar configuração';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getConfig = useCallback(async (): Promise<JiraConfig | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await JiraService.getConfig();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao obter configuração';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const testConnection = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await JiraService.testConnection();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao testar conexão';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearConfig = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await JiraService.clearConfig();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao limpar configuração';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasConfig = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await JiraService.hasConfig();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao verificar configuração';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCurrentUser = useCallback(async (): Promise<JiraUser | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await JiraService.getCurrentUser();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao obter usuário';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProjects = useCallback(async (): Promise<JiraProject[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await JiraService.getProjects();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao obter projetos';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchIssues = useCallback(async (jql: string, maxResults: number = 50): Promise<JiraIssue[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await JiraService.searchIssues(jql, maxResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar issues';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getConnectionStatus = useCallback(async (): Promise<JiraConnectionStatus> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await JiraService.getConnectionStatus();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao verificar status';
      setError(errorMessage);
      return {
        connected: false,
        lastChecked: new Date(),
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getEnvironmentInfo = useCallback(async (): Promise<EnvironmentInfo | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await JiraService.getEnvironmentInfo();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao obter informações do ambiente';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // Estados
    isLoading,
    error,

    // Ações
    clearError,
    saveConfig,
    getConfig,
    testConnection,
    clearConfig,
    hasConfig,
    getCurrentUser,
    getProjects,
    searchIssues,
    getConnectionStatus,
    getEnvironmentInfo,

    // Utilitários de validação
    validateJiraUrl: JiraService.validateJiraUrl,
    validateEmail: JiraService.validateEmail,
    validateToken: JiraService.validateToken,

    // Utilitários de segurança
    getSecurityDescription: JiraService.getSecurityDescription,
    getSecuritySuggestions: JiraService.getSecuritySuggestions,
    shouldShowSecurityWarning: JiraService.shouldShowSecurityWarning,
  };
};