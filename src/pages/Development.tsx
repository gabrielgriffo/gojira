import { useState, useEffect } from 'react';
import { useJira } from '../hooks/useJira';
import { JiraService } from '../services/jiraService';
import { saveWindowState, restoreStateCurrent, StateFlags } from '@tauri-apps/plugin-window-state';
import type { JiraIssue } from '../types/jira';
import { CometCard } from '../components/ui/CometCard';

export default function Development() {
  const { searchIssues, getConnectionStatus } = useJira();
  const [issues, setIssues] = useState<JiraIssue[]>([]);

  // Carregar tarefas automaticamente ao abrir a página
  useEffect(() => {
    const loadJiraIssues = async () => {
      try {
        const status = await getConnectionStatus();
        if (status.connected) {
          let jiraIssues = await searchIssues('status IN ("Desenvolvendo", "Desenvolver") AND assignee = currentUser()');
          setIssues(jiraIssues);
        }
      } catch (error) {
        console.error('Erro ao carregar tarefas do JIRA:', error);
      }
    };

    loadJiraIssues();
  }, [searchIssues, getConnectionStatus]);

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleTestJira = async () => {
    try {
      console.log('🔄 Verificando conexão com JIRA...');
      
      // Verificar se está conectado primeiro
      const status = await getConnectionStatus();
      
      if (!status.connected) {
        console.log('❌ Precisa conectar ao JIRA primeiro');
        console.log('📝 Configure as credenciais do JIRA na página de Configurações');
        return;
      }

      console.log('✅ Conectado ao JIRA');
      console.log('🔍 Buscando tarefas com status "Desenvolvendo"...');

      // Buscar tarefas com status 'Desenvolvendo' - vamos tentar variações do nome do status
      let issues = await searchIssues('status = "Desenvolvendo" AND assignee = currentUser()');
      
      if (issues.length === 0) {
        console.log('ℹ️  Nenhuma tarefa encontrada com status "Desenvolvendo". Tentando "In Progress"...');
        issues = await searchIssues('status = "In Progress" AND assignee = currentUser()');
      }

      if (issues.length === 0) {
        console.log('ℹ️  Nenhuma tarefa encontrada com status "In Progress". Buscando todas as tarefas atribuídas...');
        issues = await searchIssues('assignee = currentUser()');
      }

      console.log(`🔍 Total de tarefas encontradas: ${issues.length}`);
      console.log('📋 Tarefas do JIRA:', issues);
      
      // Salvar as issues no estado para exibir na tela
      setIssues(issues);
      
    } catch (error) {
      console.error('❌ Erro ao buscar tarefas do JIRA:', error);
      if (error instanceof Error) {
        console.error('📝 Detalhes do erro:', error.message);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Desenvolvimento
        </h1>
        
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                console.log('🔧 Testando conexão básica com Tauri...');
                const hasConfig = await JiraService.hasConfig();
                console.log('✅ Tauri funcionando! hasConfig:', hasConfig);
              } catch (error) {
                console.error('❌ Erro na conexão com Tauri:', error);
              }
            }}
            className="rounded bg-green-500 px-3 py-2 text-white hover:bg-green-600 transition-colors text-sm"
          >
            Testar Tauri
          </button>
          
          <button
            onClick={handleTestJira}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors"
          >
            Testar JIRA
          </button>

          <button
            onClick={async () => {
              try {
                console.log('💾 Salvando estado atual da janela...');
                await saveWindowState(StateFlags.ALL);
                console.log('✅ Estado da janela salvo com sucesso!');
                
                // Demonstrar que funciona restaurando em 2 segundos
                setTimeout(async () => {
                  console.log('🔄 Restaurando estado da janela...');
                  await restoreStateCurrent(StateFlags.ALL);
                  console.log('✅ Estado da janela restaurado!');
                }, 2000);
              } catch (error) {
                console.error('❌ Erro no plugin window-state:', error);
              }
            }}
            className="rounded bg-purple-500 px-3 py-2 text-white hover:bg-purple-600 transition-colors text-sm"
          >
            Testar Plugin
          </button>
        </div>
      </div>

      {/* Lista de Tarefas em Desenvolvimento */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            Tarefas em Desenvolvimento
          </h2>
          <span className="rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {issues.length} {issues.length === 1 ? 'tarefa' : 'tarefas'}
          </span>
        </div>

        {issues.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2">
              Nenhuma tarefa encontrada
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Conecte-se ao JIRA ou clique no botão "Testar JIRA" para carregar suas tarefas em desenvolvimento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue) => (
              <CometCard key={issue.id}>
                <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="mb-3 flex items-start justify-between">
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {issue.key}
                    </span>
                    <span className="rounded bg-orange-100 px-2 py-1 text-xs text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                      {issue.status}
                    </span>
                  </div>
                  
                  <h3 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200 leading-tight">
                    {issue.summary}
                  </h3>
                  
                  <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center justify-between">
                      <span>Responsável:</span>
                      <span className="font-medium">{issue.assignee || 'Não atribuído'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Criado:</span>
                      <span>{formatDate(issue.created)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Atualizado:</span>
                      <span>{formatDate(issue.updated)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Reporter:</span>
                      <span className="font-medium">{issue.reporter || 'Desconhecido'}</span>
                    </div>
                  </div>
                </div>
              </CometCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}