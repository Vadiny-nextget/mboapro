import type { ReactNode } from 'react';
import '../i18n'; // effectue l'initialisation d'i18next (side-effect import)

interface I18nProviderProps {
  children: ReactNode;
}

/**
 * N'a pas besoin de Context React : react-i18next expose déjà
 * i18n globalement via son propre système interne (I18nextProvider
 * implicite pris en charge par initReactI18next). Ce wrapper garantit
 * juste que l'import d'initialisation se fait avant le rendu des enfants,
 * et sert de point d'extension si besoin plus tard (ex: <Suspense> dédié,
 * détection de langue asynchrone via IP, etc.).
 */
export default function I18nProvider({ children }: I18nProviderProps) {
  return <>{children}</>;
}