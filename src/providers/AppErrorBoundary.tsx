import type { ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Input';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  // Traduction avec fallback si i18n n'est pas encore prêt (erreur très précoce au boot)
  const { t } = useTranslation('common', { useSuspense: false });

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-(--bg-page) px-4 text-center">
      <div className="animate-scale-in rounded-full bg-danger/10 p-4 text-danger">
        <AlertTriangle size={32} />
      </div>

      <h1 className="font-heading text-xl font-bold text-primary">
        {t('errors.boundaryTitle', 'Une erreur est survenue')}
      </h1>
      <p className="max-w-md text-sm text-secondary">
        {t('errors.boundaryMessage', 'Quelque chose s\u2019est mal passé. Vous pouvez réessayer ou retourner à l\u2019accueil.')}
      </p>

      <div className="mt-2 flex gap-3">
        <Button className='border! border-strong! text-primary! bg-transparent! hover:bg-surface-alt!' handleClick={resetErrorBoundary}>
          <RotateCcw size={16} />{t('errors.retry', 'Réessayer')}
        </Button>
        <Button handleClick={() => (window.location.href = '/')}>
          <Home size={16} />{t('errors.backHome', 'Retour à l\u2019accueil')}
        </Button>
      </div>

      {import.meta.env.DEV && (
        <details className="mt-6 w-full max-w-lg rounded-md border border-subtle bg-surface p-4 text-left">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-muted">
            {t('errors.details', 'Détails techniques')} (dev only)
          </summary>
          <pre className="mt-2 overflow-auto whitespace-pre-wrap text-xs text-danger">
            {error?.message}
            {'\n'}
            {error?.stack}
          </pre>
        </details>
      )}
    </div>
  );
}

/**
 * Encapsule l'application entière. Toute erreur non gérée dans le rendu
 * React (hors handlers d'événements et code async non catché) remonte ici.
 */
export default function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        // TODO: brancher un service de monitoring (Sentry, etc.)
        console.error('[MboaPro] Erreur non interceptée :', error, info.componentStack);
      }}
      onReset={() => {
        // Nettoyage éventuel avant réessai (ex: reset d'un store zustand)
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}