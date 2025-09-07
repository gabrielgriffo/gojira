import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';

export type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'gojira-language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Detectar idioma do sistema para valor inicial
  const getSystemLanguage = (): Language => {
    if (typeof window !== 'undefined' && navigator.language) {
      const systemLang = navigator.language.toLowerCase();
      return systemLang.startsWith('pt') ? 'pt' : 'en';
    }
    return 'en'; // Padrão inglês se não conseguir detectar
  };

  const [language, setLanguageState] = useLocalStorage<Language>(LANGUAGE_STORAGE_KEY, getSystemLanguage());
  const { i18n } = useTranslation();

  // Função setLanguage personalizada
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  // Aplicar idioma quando mudar
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}