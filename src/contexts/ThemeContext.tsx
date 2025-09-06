import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'gojira-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>(THEME_STORAGE_KEY, 'system');

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
    
    // Remover classes existentes
    root.classList.remove('dark', 'light');
    
    if (currentTheme === 'system') {
      const systemTheme = getSystemTheme();
      root.classList.add(systemTheme);
      if (systemTheme === 'dark') {
        root.classList.add('dark');
      }
    } else {
      root.classList.add(currentTheme);
      if (currentTheme === 'dark') {
        root.classList.add('dark');
      }
    }

    // Debug log para desenvolvimento
    if (import.meta.env.DEV) {
      console.log('🎨 Theme applied:', currentTheme, '| Root classes:', Array.from(root.classList));
    }
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

  // Aplicar tema inicial - executar apenas uma vez na montagem
  useEffect(() => {
    // Forçar aplicação do tema após um pequeno delay para garantir que o DOM está pronto
    const timeoutId = setTimeout(() => {
      applyTheme(theme);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []); // Array vazio para executar apenas na montagem

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