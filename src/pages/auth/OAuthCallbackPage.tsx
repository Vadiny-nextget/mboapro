import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import { ApiError } from '../../types/api.types';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [error, setError] = useState<string | null>(searchParams.get('error'));

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code || error) return;

    authService
      .exchangeOAuthCode(code)
      .then((session) => {
        setSession(session);
        navigate(`/${session.user.role}`, { replace: true });
      })
      .catch((err) => setError((err as ApiError).message));
  }, [searchParams, error, navigate, setSession]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <AlertTriangle size={36} className="text-danger" />
        <h1 className="font-heading text-lg font-bold text-primary">Connexion impossible</h1>
        <p className="text-sm text-secondary">{error}</p>
        <Link to="/connexion" className="mt-2 text-sm font-semibold text-primary-500 hover:underline">
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <div className="spinner spinner--lg" />
      <p className="text-sm text-secondary">Connexion en cours...</p>
    </div>
  );
}