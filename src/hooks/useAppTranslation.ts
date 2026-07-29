import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, persistLanguage, type SupportedLanguage } from '../i18n';

/**
 * Wrapper autour de useTranslation qui expose aussi le changement
 * de langue avec persistance automatique dans localStorage.
 */
export function useAppTranslation() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
    persistLanguage(lang);
    document.documentElement.lang = lang;
  };

  return {
    t,
    currentLanguage: i18n.language as SupportedLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    changeLanguage,
  };
}