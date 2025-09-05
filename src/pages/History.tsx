export default function History() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Histórico
        </h1>
        <button className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600">
          Limpar Histórico
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-2 font-semibold text-neutral-800 dark:text-neutral-200">
            Hoje
          </h3>
          <p className="text-2xl font-bold text-blue-500">127</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            operações
          </p>
        </div>
        
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-2 font-semibold text-neutral-800 dark:text-neutral-200">
            Esta Semana
          </h3>
          <p className="text-2xl font-bold text-green-500">892</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            operações
          </p>
        </div>
        
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-2 font-semibold text-neutral-800 dark:text-neutral-200">
            Este Mês
          </h3>
          <p className="text-2xl font-bold text-orange-500">3.2k</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            operações
          </p>
        </div>
        
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-2 font-semibold text-neutral-800 dark:text-neutral-200">
            Total
          </h3>
          <p className="text-2xl font-bold text-purple-500">15.7k</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            operações
          </p>
        </div>
      </div>
      
      <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
        <div className="border-b border-neutral-200 p-4 dark:border-neutral-700">
          <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
            Atividade Recente
          </h3>
        </div>
        
        <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {[
            { time: "14:32", action: "Build executado com sucesso", type: "success", file: "main.rs" },
            { time: "14:28", action: "Arquivo modificado", type: "edit", file: "Dashboard.tsx" },
            { time: "14:25", action: "Comando executado", type: "command", file: "npm run dev" },
            { time: "14:20", action: "Commit realizado", type: "git", file: "feat: add dashboard" },
            { time: "14:15", action: "Teste executado", type: "test", file: "component.test.tsx" },
            { time: "14:10", action: "Deploy iniciado", type: "deploy", file: "production" },
            { time: "14:05", action: "Erro corrigido", type: "error", file: "utils.ts:42" },
            { time: "14:00", action: "Biblioteca instalada", type: "package", file: "@tabler/icons-react" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4">
              <div className="flex-shrink-0">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${
                  item.type === 'success' ? 'bg-green-500' :
                  item.type === 'edit' ? 'bg-blue-500' :
                  item.type === 'command' ? 'bg-purple-500' :
                  item.type === 'git' ? 'bg-orange-500' :
                  item.type === 'test' ? 'bg-yellow-500' :
                  item.type === 'deploy' ? 'bg-pink-500' :
                  item.type === 'error' ? 'bg-red-500' :
                  'bg-gray-500'
                }`}>
                  {item.type === 'success' ? '✓' :
                   item.type === 'edit' ? '✎' :
                   item.type === 'command' ? '$' :
                   item.type === 'git' ? '⚡' :
                   item.type === 'test' ? '⚗' :
                   item.type === 'deploy' ? '🚀' :
                   item.type === 'error' ? '⚠' :
                   '📦'}
                </div>
              </div>
              
              <div className="flex-1">
                <p className="font-medium text-neutral-800 dark:text-neutral-200">
                  {item.action}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {item.file}
                </p>
              </div>
              
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}