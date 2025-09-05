export default function Monitoring() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Monitoramento
        </h1>
        <div className="flex gap-2">
          <button className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600">
            ● Live
          </button>
          <button className="rounded border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-800">
            Pausar
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
              CPU
            </h3>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </div>
          <p className="mt-2 text-2xl font-bold text-green-500">23%</p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-neutral-700">
            <div className="h-2 w-1/4 rounded-full bg-green-500"></div>
          </div>
        </div>
        
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
              Memória
            </h3>
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
          </div>
          <p className="mt-2 text-2xl font-bold text-yellow-500">67%</p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-neutral-700">
            <div className="h-2 w-2/3 rounded-full bg-yellow-500"></div>
          </div>
        </div>
        
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
              Disco
            </h3>
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-500">45%</p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-neutral-700">
            <div className="h-2 w-1/2 rounded-full bg-blue-500"></div>
          </div>
        </div>
        
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
              Rede
            </h3>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </div>
          <p className="mt-2 text-2xl font-bold text-green-500">12MB/s</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">↓ 8MB/s ↑ 4MB/s</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-4 font-semibold text-neutral-800 dark:text-neutral-200">
            Gráfico de Performance
          </h3>
          <div className="h-48 w-full animate-pulse rounded bg-gray-100 dark:bg-neutral-700">
            <div className="flex h-full items-end justify-center gap-1 p-4">
              {[...new Array(12)].map((_, idx) => (
                <div
                  key={idx}
                  className={`w-4 bg-blue-500 ${
                    Math.random() > 0.5 ? 'h-1/2' : Math.random() > 0.3 ? 'h-3/4' : 'h-1/4'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-4 font-semibold text-neutral-800 dark:text-neutral-200">
            Processos Ativos
          </h3>
          <div className="space-y-3">
            {[
              { name: "Tauri App", cpu: "15%", memory: "234MB", status: "running" },
              { name: "Node.js", cpu: "8%", memory: "156MB", status: "running" },
              { name: "Vite Dev Server", cpu: "5%", memory: "89MB", status: "running" },
              { name: "TypeScript", cpu: "3%", memory: "67MB", status: "idle" },
              { name: "Rust Compiler", cpu: "12%", memory: "312MB", status: "running" },
            ].map((process, idx) => (
              <div key={idx} className="flex items-center justify-between rounded border border-neutral-100 p-3 dark:border-neutral-600">
                <div className="flex-1">
                  <p className="font-medium text-neutral-800 dark:text-neutral-200">
                    {process.name}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    CPU: {process.cpu} | RAM: {process.memory}
                  </p>
                </div>
                <div className={`rounded px-2 py-1 text-xs ${
                  process.status === 'running' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {process.status === 'running' ? 'Executando' : 'Inativo'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <h3 className="mb-4 font-semibold text-neutral-800 dark:text-neutral-200">
          Logs do Sistema
        </h3>
        <div className="h-48 overflow-y-auto rounded bg-black p-4 text-sm font-mono text-green-400">
          <div>[14:32:15] INFO: Sistema iniciado com sucesso</div>
          <div>[14:32:16] INFO: Conectando ao banco de dados...</div>
          <div>[14:32:17] INFO: Conexão estabelecida</div>
          <div>[14:32:18] INFO: Servidor HTTP iniciado na porta 1420</div>
          <div>[14:32:19] INFO: WebSocket server ativo</div>
          <div>[14:32:20] INFO: Monitoramento ativado</div>
          <div>[14:32:21] WARN: CPU usage above 70%</div>
          <div>[14:32:22] INFO: Garbage collection triggered</div>
          <div>[14:32:23] INFO: Memory usage normalized</div>
          <div>[14:32:24] INFO: Backup automático realizado</div>
          <div>[14:32:25] INFO: Sistema funcionando normalmente</div>
          <div className="animate-pulse">█</div>
        </div>
      </div>
    </div>
  );
}