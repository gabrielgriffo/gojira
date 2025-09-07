import React, { useState, useEffect } from 'react';
import { useJira } from '../../hooks/useJira';
import type { EnvironmentInfo } from '../../types/jira';
import { SecurityLevel } from '../../types/jira';
import { IconShield, IconShieldCheck, IconShieldX, IconInfoCircle, IconChevronDown, IconChevronUp } from '@tabler/icons-react';

interface SecurityStatusProps {
  className?: string;
}

export const SecurityStatus: React.FC<SecurityStatusProps> = ({ className = '' }) => {
  const { getEnvironmentInfo, getSecurityDescription, getSecuritySuggestions, shouldShowSecurityWarning } = useJira();
  const [envInfo, setEnvInfo] = useState<EnvironmentInfo | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEnvironmentInfo();
  }, []);

  const loadEnvironmentInfo = async () => {
    setIsLoading(true);
    const info = await getEnvironmentInfo();
    setEnvInfo(info);
    setIsLoading(false);
  };

  const getSecurityIcon = (level: SecurityLevel) => {
    switch (level) {
      case 'High':
        return <IconShieldCheck className="h-5 w-5 text-green-500" />;
      case 'Medium':
        return <IconShield className="h-5 w-5 text-yellow-500" />;
      case 'Low':
        return <IconShieldX className="h-5 w-5 text-red-500" />;
      default:
        return <IconShield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSecurityColor = (level: SecurityLevel) => {
    switch (level) {
      case 'High':
        return 'text-green-600 dark:text-green-400';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Low':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getBadgeColor = (level: SecurityLevel) => {
    switch (level) {
      case 'High':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      case 'Low':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="h-5 w-5 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
        <div className="h-4 w-32 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
      </div>
    );
  }

  if (!envInfo) {
    return null;
  }

  const securityDescription = getSecurityDescription(envInfo.security_level, envInfo.is_wsl);
  const suggestions = getSecuritySuggestions(envInfo);
  const showWarning = shouldShowSecurityWarning(envInfo.security_level);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Status Principal */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getSecurityIcon(envInfo.security_level)}
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getSecurityColor(envInfo.security_level)}`}>
                Status de Segurança
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getBadgeColor(envInfo.security_level)}`}>
                {envInfo.security_level === 'High' ? 'Alta' : 
                 envInfo.security_level === 'Medium' ? 'Média' : 'Baixa'}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {securityDescription}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <IconInfoCircle className="h-4 w-4" />
          Detalhes
          {showDetails ? <IconChevronUp className="h-3 w-3" /> : <IconChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Aviso de Segurança */}
      {showWarning && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 dark:bg-yellow-900/20 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <IconInfoCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                {envInfo.is_wsl ? 'Ambiente WSL Detectado' : 'Keyring Nativo Indisponível'}
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                {envInfo.is_wsl 
                  ? 'Suas credenciais estão seguras, mas usando armazenamento local criptografado.'
                  : 'Para máxima segurança, instale um gerenciador de keyring no sistema.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Detalhes Expandidos */}
      {showDetails && (
        <div className="space-y-3">
          {/* Informações do Ambiente */}
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 dark:bg-gray-800 dark:border-gray-700">
            <h4 className="text-xs font-medium text-gray-800 dark:text-gray-200 mb-2">
              Informações do Ambiente
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">WSL:</span>
                <span className={envInfo.is_wsl ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}>
                  {envInfo.is_wsl ? (envInfo.is_wsl2 ? 'WSL2' : 'WSL1') : 'Não'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Keyring:</span>
                <span className={envInfo.has_keyring ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}>
                  {envInfo.has_keyring ? 'Disponível' : 'Indisponível'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Desktop:</span>
                <span className={envInfo.has_desktop_environment ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}>
                  {envInfo.has_desktop_environment ? 'Sim' : 'Não'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Armazenamento:</span>
                <span className="font-medium">
                  {envInfo.storage_backend === 'NativeKeyring' ? 'Keyring' :
                   envInfo.storage_backend === 'EncryptedFile' ? 'Arquivo' : 'Memória'}
                </span>
              </div>
            </div>
          </div>

          {/* Sugestões de Melhoria */}
          {suggestions.length > 0 && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 dark:bg-blue-900/20 dark:border-blue-800">
              <h4 className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-2">
                Sugestões para Melhorar a Segurança
              </h4>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="text-xs text-blue-700 dark:text-blue-300">
                    {suggestion.startsWith('sudo ') || suggestion.startsWith('gnome-keyring') ? (
                      <code className="bg-blue-100 dark:bg-blue-900/30 px-1 py-0.5 rounded font-mono text-xs">
                        {suggestion}
                      </code>
                    ) : (
                      <p>{suggestion}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};