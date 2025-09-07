import React, { useState, useEffect } from 'react';
import { useJira } from '../../hooks/useJira';
import { SecurityStatus } from './SecurityStatus';
import type { JiraConfig } from '../../types/jira';
import { IconCheck, IconX, IconExternalLink, IconLoader2 } from '@tabler/icons-react';

export const JiraConfigForm: React.FC = () => {
  const {
    isLoading,
    error,
    saveConfig,
    getConfig,
    testConnection,
    clearConfig,
    clearError,
    validateJiraUrl,
    validateEmail,
    validateToken,
  } = useJira();

  const [config, setConfig] = useState<JiraConfig | null>(null);
  const [formData, setFormData] = useState({
    url: '',
    email: '',
    token: '',
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const existingConfig = await getConfig();
    if (existingConfig) {
      setConfig(existingConfig);
      setFormData({
        url: existingConfig.url,
        email: existingConfig.email,
        token: '••••••••••••••••', // Mascarar token existente
      });
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    const urlValidation = validateJiraUrl(formData.url);
    if (!urlValidation.valid) {
      errors.url = urlValidation.error || 'URL inválida';
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      errors.email = emailValidation.error || 'Email inválido';
    }

    const tokenValidation = validateToken(formData.token);
    if (!tokenValidation.valid) {
      errors.token = tokenValidation.error || 'Token inválido';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    // Usar token existente se não foi alterado
    const tokenToSave = formData.token.includes('••••') && config 
      ? config.token 
      : formData.token;

    const success = await saveConfig(
      formData.url,
      formData.email,
      tokenToSave
    );

    if (success) {
      setSuccessMessage('Credenciais JIRA salvas com sucesso!');
      await loadConfig();
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    clearError();
    setSuccessMessage(null);
    
    const result = await testConnection();
    
    if (result) {
      setConnectionStatus('success');
      setSuccessMessage('Conexão com JIRA funcionando perfeitamente!');
    } else {
      setConnectionStatus('error');
    }
    
    setIsTestingConnection(false);
  };

  const handleClearConfig = async () => {
    if (confirm('Tem certeza que deseja remover as credenciais do JIRA?')) {
      const success = await clearConfig();
      if (success) {
        setConfig(null);
        setFormData({ url: '', email: '', token: '' });
        setConnectionStatus('idle');
        setSuccessMessage('Credenciais JIRA removidas com sucesso!');
      }
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'success':
        return <IconCheck className="h-5 w-5 text-green-500" />;
      case 'error':
        return <IconX className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const isFormValid = formData.url.trim() && formData.email.trim() && formData.token.trim() && Object.keys(validationErrors).length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            Configuração do JIRA
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Configure suas credenciais para integração com o JIRA
          </p>
        </div>
        {connectionStatus !== 'idle' && (
          <div className="flex items-center gap-2">
            {getConnectionStatusIcon()}
            <span className={`text-sm ${connectionStatus === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {connectionStatus === 'success' ? 'Conectado' : 'Falha na conexão'}
            </span>
          </div>
        )}
      </div>

      {/* Status de Segurança */}
      <SecurityStatus />

      {/* Mensagens de feedback */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 dark:bg-red-900/20 dark:border-red-800">
          <div className="flex items-start">
            <IconX className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200">Erro</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 dark:bg-green-900/20 dark:border-green-800">
          <div className="flex items-start">
            <IconCheck className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            URL da Instância JIRA
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://minhaempresa.atlassian.net"
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200 ${
              validationErrors.url ? 'border-red-300 dark:border-red-600' : 'border-neutral-300 dark:border-neutral-600'
            }`}
            required
          />
          {validationErrors.url && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.url}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Email do JIRA
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="usuario@empresa.com"
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200 ${
              validationErrors.email ? 'border-red-300 dark:border-red-600' : 'border-neutral-300 dark:border-neutral-600'
            }`}
            required
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Token de API
            </label>
            <a 
              href="https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 flex items-center gap-1"
            >
              Como criar um token
              <IconExternalLink className="h-3 w-3" />
            </a>
          </div>
          <input
            type="password"
            value={formData.token}
            onChange={(e) => setFormData(prev => ({ ...prev, token: e.target.value }))}
            placeholder="ATATT3xFfGF0T5..."
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200 ${
              validationErrors.token ? 'border-red-300 dark:border-red-600' : 'border-neutral-300 dark:border-neutral-600'
            }`}
            required
          />
          {validationErrors.token && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.token}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Configuração'
            )}
          </button>

          {config && (
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isTestingConnection ? (
                <>
                  <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                'Testar Conexão'
              )}
            </button>
          )}
        </div>

        {config && (
          <button
            type="button"
            onClick={handleClearConfig}
            className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Remover Configuração
          </button>
        )}
      </form>

      {/* Informações da configuração */}
      {config && (
        <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <h4 className="font-medium text-neutral-800 dark:text-neutral-200 mb-2">Status da Configuração</h4>
          <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
            <p><strong>Criada em:</strong> {new Date(config.created_at).toLocaleString('pt-BR')}</p>
            {config.last_used && (
              <p><strong>Último uso:</strong> {new Date(config.last_used).toLocaleString('pt-BR')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};