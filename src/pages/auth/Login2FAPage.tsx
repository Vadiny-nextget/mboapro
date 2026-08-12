import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ApiError } from '../../types/api.types';
import { useAuthStore } from '../../store/useAuthStore';
import { Button, InputOtp } from '../../components/ui/Input';

export default function Login2FAPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const identifier = (location.state as { identifier?: string })?.identifier ?? '';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!identifier) {
    return (
      <div className="text-center">
        <p className="text-sm text-secondary">Session expirée, veuillez vous reconnecter.</p>
        <Link to="/connexion" className="mt-3 inline-block text-sm font-semibold text-primary-500 hover:underline">
          Retour à la connexion
        </Link>
      </div>
    );
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Veuillez saisir les 6 chiffres reçus.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const session = await authService.verifyLogin2fa(identifier, otp);
      setSession(session);
      navigate(`/${session.user.role}`);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-heading text-lg font-bold text-primary">Double authentification</h1>
        <p className="mt-1 text-sm text-secondary">
          Un code a été envoyé à <span className="font-semibold text-primary">{identifier}</span>
        </p>
      </div>

      <InputOtp value={otp} onChange={setOtp} error={error} disabled={isLoading} />

      <Button
        type="button"
        loading={isLoading}
        handleClick={handleVerify}
        backgroundColor="var(--color-primary-500)"
        className="justify-center text-white"
      >
        Vérifier
      </Button>
    </div>
  );
}