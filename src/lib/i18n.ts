import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { pt } from '../locales/pt';
import { en } from '../locales/en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: {
        translation: pt
      },
      en: {
        translation: en
      }
    },
    fallbackLng: 'pt',
    debug: import.meta.env.DEV,
    
    interpolation: {
      escapeValue: false // React já faz o escape automaticamente
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'goji-language',
      caches: ['localStorage'],
    }
  });

export default i18n;