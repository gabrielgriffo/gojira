export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
        Dashboard
      </h1>
      
      <div className="flex gap-2">
        {[...new Array(4)].map((_, idx) => (
          <div
            key={"dashboard-cards-" + idx}
            className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
          ></div>
        ))}
      </div>
      
      <div className="flex flex-1 gap-2">
        {[...new Array(2)].map((_, idx) => (
          <div
            key={"dashboard-charts-" + idx}
            className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
          ></div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
            Estatísticas Gerais
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Visão geral do sistema
          </p>
        </div>
        
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
            Atividade Recente
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Últimas ações realizadas
          </p>
        </div>
        
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
            Status do Sistema
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Tudo funcionando normalmente
          </p>
        </div>
      </div>
    </div>
  );
}