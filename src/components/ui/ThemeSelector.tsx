import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';
import { useTheme, Theme } from '../../contexts/ThemeContext';
import { clsx } from 'clsx';

interface ThemeOption {
  value: Theme;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    label: 'Claro',
    icon: IconSun,
    description: 'Sempre usar tema claro'
  },
  {
    value: 'dark',
    label: 'Escuro', 
    icon: IconMoon,
    description: 'Sempre usar tema escuro'
  },
  {
    value: 'system',
    label: 'Sistema',
    icon: IconDeviceDesktop,
    description: 'Seguir configuração do sistema'
  }
];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Tema da Aplicação
      </label>
      <div className="grid grid-cols-3 gap-2">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = theme === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={clsx(
                'flex flex-col items-center gap-2 rounded-lg p-3 text-xs transition-all duration-200',
                'border border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600',
                'hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
                isSelected && [
                  'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300',
                  'shadow-sm ring-1 ring-blue-200 dark:ring-blue-800'
                ]
              )}
              type="button"
            >
              <Icon 
                className={clsx(
                  'h-4 w-4',
                  isSelected 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-neutral-500 dark:text-neutral-400'
                )} 
              />
              <span className={clsx(
                'font-medium',
                isSelected 
                  ? 'text-blue-700 dark:text-blue-300' 
                  : 'text-neutral-700 dark:text-neutral-300'
              )}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {themeOptions.find(opt => opt.value === theme)?.description}
      </p>
    </div>
  );
}