import ThemeSelector from '../components/ui/ThemeSelector';
import LanguageSelector from '../components/ui/LanguageSelector';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
        {t('settings.title')}
      </h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-4 font-semibold text-neutral-800 dark:text-neutral-200">
            {t('settings.appearance.title')}
          </h3>
          <div className="space-y-6">
            <ThemeSelector />
            <LanguageSelector />
            <div className="flex items-center justify-between">
              <label className="text-sm text-neutral-600 dark:text-neutral-400">
                {t('settings.appearance.compactMode')}
              </label>
              <div className="h-6 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-700"></div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-4 font-semibold text-neutral-800 dark:text-neutral-200">
            {t('settings.notifications.title')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-neutral-600 dark:text-neutral-400">
                {t('settings.notifications.desktop')}
              </label>
              <div className="h-6 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-700"></div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-neutral-600 dark:text-neutral-400">
                {t('settings.notifications.systemAlerts')}
              </label>
              <div className="h-6 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-700"></div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-4 font-semibold text-neutral-800 dark:text-neutral-200">
            {t('settings.performance.title')}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-neutral-600 dark:text-neutral-400">
                {t('settings.performance.memoryLimit')}
              </label>
              <div className="mt-2 h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-neutral-700"></div>
            </div>
            <div>
              <label className="text-sm text-neutral-600 dark:text-neutral-400">
                {t('settings.performance.connectionTimeout')}
              </label>
              <div className="mt-2 h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-neutral-700"></div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-4 font-semibold text-neutral-800 dark:text-neutral-200">
            {t('settings.about.title')}
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {t('settings.about.version', { version: '1.0.0' })}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {t('settings.about.lastUpdate', { date: 'Hoje' })}
            </p>
            <button className="mt-4 rounded bg-neutral-200 px-4 py-2 text-sm hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600">
              {t('settings.about.checkUpdates')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}