import { useLanguage, Language } from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

interface LanguageOption {
  value: Language;
  getLabel: (t: any) => string;
}

const languageOptions: LanguageOption[] = [
  {
    value: 'pt',
    getLabel: (t) => t('language.pt')
  },
  {
    value: 'en',
    getLabel: (t) => t('language.en')
  }
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {t('settings.appearance.language')}
      </label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 transition-colors hover:border-neutral-300 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-600 dark:focus:border-green-400 dark:focus:ring-green-400"
      >
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.getLabel(t)}
          </option>
        ))}
      </select>
    </div>
  );
}