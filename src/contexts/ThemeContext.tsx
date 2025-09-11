import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getCurrentWindow } from '@tauri-apps/api/window';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'goji-theme';

// Função auxiliar para aplicar tema via API do Tauri
const applyTauriTheme = async (currentTheme: Theme, systemTheme: 'light' | 'dark') => {
  try {
    const window = getCurrentWindow();
    let effectiveTheme = currentTheme;
    
    if (currentTheme === 'system') {
      effectiveTheme = systemTheme;
    }
    
    // Aplicar tema na janela atual
    await window.setTheme(effectiveTheme as 'light' | 'dark');
    
    // Salvar no arquivo de configuração para próximas inicializações
    // await invoke('save_theme_to_config', { theme: effectiveTheme });

  } catch (error) {
    console.warn('Erro ao aplicar tema via Tauri:', error);
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useLocalStorage<Theme>(THEME_STORAGE_KEY, 'system');

  // Detectar preferência do sistema
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Aplicar tema atual ao documento
  const applyTheme = (currentTheme: Theme) => {
    const root = document.documentElement;
    const systemTheme = getSystemTheme();
    
    // Remover classes existentes
    root.classList.remove('dark', 'light');
    
    // Determinar o tema efetivo
    const effectiveTheme = currentTheme === 'system' ? systemTheme : currentTheme;
    
    // Adicionar apenas a classe do tema efetivo
    root.classList.add(effectiveTheme);

    // Aplicar tema via Tauri
    applyTauriTheme(currentTheme, systemTheme);
  };

  // Função setTheme personalizada
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Escutar mudanças na preferência do sistema
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    // Usar a API moderna quando disponível
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback para navegadores mais antigos
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  // Aplicar tema quando mudar
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    systemTheme: getSystemTheme()
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}