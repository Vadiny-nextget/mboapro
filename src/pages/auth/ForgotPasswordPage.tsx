import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';
import type { ApiError } from '../../types/api.types';
import { Button, Input, InputOtp } from '../../components/ui/Input';

type Phase = 'identifier' | 'otp' | 'password' | 'done';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await authService.forgotPassword(identifier);
      setPhase('otp');
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Veuillez saisir les 6 chiffres reçus.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const { verificationToken: token } = await authService.verifyOtp(identifier, otp, 'password_reset');
      setVerificationToken(token);
      setPhase('password');
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('8 caractères minimum.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await authService.resetPassword({ verificationToken, newPassword, confirmPassword });
      setPhase('done');
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (phase === 'done') {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 size={40} className="text-success" />
        <h1 className="font-heading text-lg font-bold text-primary">Mot de passe réinitialisé</h1>
        <p className="text-sm text-secondary">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
        <Button
          onClick={() => navigate('/connexion')}
          backgroundColor="var(--color-primary-500)"
          className="mt-2 justify-center text-white"
        >
          Retour à la connexion
        </Button>
      </div>
    );
  }

  if (phase === 'otp') {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="font-heading text-lg font-bold text-primary">Vérification</h1>
          <p className="mt-1 text-sm text-secondary">
            Si un compte existe pour <span className="font-semibold text-primary">{identifier}</span>, un code a été envoyé.
          </p>
        </div>
        <InputOtp value={otp} onChange={setOtp} error={error} disabled={isLoading} />
        <Button
          loading={isLoading}
          onClick={handleVerifyOtp}
          backgroundColor="var(--color-primary-500)"
          className="justify-center text-white"
        >
          Vérifier
        </Button>
      </div>
    );
  }

  if (phase === 'password') {
    return (
      <form className="flex flex-col gap-4">
        <h1 className="font-heading text-lg font-bold text-primary">Nouveau mot de passe</h1>
        <Input id="newPassword" type="password"
          css="max-w-full!" label="Nouveau mot de passe" Icon={Lock} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <Input id="confirmNewPassword"
          css="max-w-full!" type="password" label="Confirmer le mot de passe" Icon={Lock} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" onClick={handleReset} loading={isLoading} backgroundColor="var(--color-primary-500)" className="justify-center text-white">
          Réinitialiser
        </Button>
      </form>
    );
  }

  return (
    <form className="flex flex-col gap-4">
      <h1 className="font-heading text-lg font-bold text-primary">Mot de passe oublié</h1>
      <p className="text-sm text-secondary">Recevez un code pour réinitialiser votre mot de passe.</p>
      <Input id="forgot-identifier" 
          css="max-w-full!" label="Email ou téléphone" Icon={Mail} value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" onClick={handleSendCode} loading={isLoading} backgroundColor="var(--color-primary-500)" className="justify-center text-white">
        Envoyer le code
      </Button>
      <p className="text-center text-sm text-secondary">
        <Link to="/connexion" className="font-semibold text-primary-500 hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </form>
  );
}