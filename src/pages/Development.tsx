export default function Development() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
        Desenvolvimento
      </h1>
      
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-4 font-semibold text-neutral-800 dark:text-neutral-200">
              Editor de Código
            </h3>
            <div className="h-64 w-full animate-pulse rounded bg-gray-900 dark:bg-neutral-900">
              <div className="flex h-8 items-center border-b border-gray-700 px-4">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <div className="h-4 w-48 animate-pulse bg-gray-700"></div>
                  <div className="h-4 w-32 animate-pulse bg-gray-700"></div>
                  <div className="h-4 w-56 animate-pulse bg-gray-700"></div>
                  <div className="h-4 w-24 animate-pulse bg-gray-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-3 font-semibold text-neutral-800 dark:text-neutral-200">
              Arquivos Recentes
            </h3>
            <div className="space-y-2">
              {[...new Array(5)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-pulse rounded bg-blue-500"></div>
                  <div className="h-3 flex-1 animate-pulse rounded bg-gray-200 dark:bg-neutral-700"></div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-3 font-semibold text-neutral-800 dark:text-neutral-200">
              Status do Build
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Frontend
                </span>
                <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">
                  Sucesso
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Backend
                </span>
                <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">
                  Sucesso
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Testes
                </span>
                <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  Executando
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-3 font-semibold text-neutral-800 dark:text-neutral-200">
            Terminal
          </h3>
          <div className="h-32 rounded bg-black p-3 text-green-400">
            <div className="text-sm font-mono">
              <div>$ npm run dev</div>
              <div>✓ Server running on http://localhost:1420</div>
              <div>✓ Ready in 1.2s</div>
              <div className="animate-pulse">█</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-3 font-semibold text-neutral-800 dark:text-neutral-200">
            Git Status
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-neutral-600 dark:text-neutral-400">
                Branch: main
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="text-neutral-600 dark:text-neutral-400">
                3 commits ahead
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              <span className="text-neutral-600 dark:text-neutral-400">
                2 files modified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}