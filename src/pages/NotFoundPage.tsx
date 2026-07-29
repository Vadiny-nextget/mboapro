// NotFoundPage.tsx
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="font-heading text-6xl font-bold text-primary-500">404</span>
      <h1 className="text-xl font-semibold">Page introuvable</h1>
      <Link to="/" className="rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-on-primary">
        Retour à l'accueil
      </Link>
    </div>
  );
}