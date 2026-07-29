import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import frCommon from './locales/fr/common.json';
import enCommon from './locales/en/common.json';

export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_STORAGE_KEY = 'mboapro-lang';

/**
 * Détecte la langue initiale :
 * 1. Choix explicite déjà stocké (localStorage)
 * 2. Langue du navigateur si supportée
 * 3. Français par défaut (langue principale au Cameroun)
 */
function detectInitialLanguage(): SupportedLanguage {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage;
  }

  const browserLang = navigator.language.slice(0, 2);
  if (SUPPORTED_LANGUAGES.includes(browserLang as SupportedLanguage)) {
    return browserLang as SupportedLanguage;
  }

  return 'fr';
}

i18n.use(initReactI18next).init({
  resources: {
    fr: { common: frCommon },
    en: { common: enCommon },
  },
  lng: detectInitialLanguage(),
  fallbackLng: 'fr',
  defaultNS: 'common',
  ns: ['common'],
  interpolation: {
    escapeValue: false, // React échappe déjà le HTML
  },
  react: {
    useSuspense: true, // s'appuie sur le <Suspense> déjà en place dans main.tsx
  },
});

export function persistLanguage(lang: SupportedLanguage) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
}

export { LANGUAGE_STORAGE_KEY };
export default i18n;