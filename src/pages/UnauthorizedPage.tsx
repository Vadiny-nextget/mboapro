// UnauthorizedPage.tsx
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <ShieldAlert size={48} className="text-danger" />
      <h1 className="font-heading text-2xl font-bold">Accès non autorisé</h1>
      <p className="text-secondary">Vous n'avez pas les droits pour accéder à cette page.</p>
      <Link to="/" className="rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-on-primary">
        Retour à l'accueil
      </Link>
    </div>
  );
}