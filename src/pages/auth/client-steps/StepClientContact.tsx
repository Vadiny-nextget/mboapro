import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import clsx from 'clsx';
import { authService } from '../../../services/authService';
import { ApiError } from '../../../types/api.types';
import { useClientOnboardingStore } from '../../../store/useClientOnboardingStore';
import type { ContactType } from '../../../types/onboarding.types';
import { Button, Input, InputCheck, InputTel } from '../../../components/ui/Input';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^6\d{8}$/;

export default function StepClientContact() {
  const { contact, setContact, nextStep } = useClientOnboardingStore();
  const [mode, setMode] = useState<ContactType>(contact.type);
  const [identifier, setIdentifier] = useState(contact.identifier);
  const [acceptedTerms, setAcceptedTerms] = useState(contact.acceptedTerms);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'email' && !EMAIL_REGEX.test(identifier)) {
      setError('Adresse email invalide.');
      return;
    }
    if (mode === 'phone' && !PHONE_REGEX.test(identifier)) {
      setError('Numéro invalide (ex: 677123456).');
      return;
    }
    if (!acceptedTerms) {
      setError('Vous devez accepter les conditions d\u2019utilisation.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await authService.sendOtp(identifier, 'register_client');
      setContact({ identifier, type: mode, acceptedTerms });
      nextStep();
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 429 && apiError.meta?.secondsRemaining) {
        setError(`Veuillez attendre ${apiError.meta.secondsRemaining}s avant de réessayer.`);
      } else {
        setError(apiError.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-4">
      <h4 className="font-heading text-lg font-bold text-primary">Contact</h4>
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-surface-alt p-1">
        <button
          type="button"
          onClick={() => setMode('email')}
          className={clsx(
            'flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors',
            mode === 'email' ? 'bg-surface text-primary shadow-sm' : 'text-muted'
          )}
        >
          <Mail size={15} /> Email
        </button>
        <button
          type="button"
          onClick={() => setMode('phone')}
          className={clsx(
            'flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors',
            mode === 'phone' ? 'bg-surface text-primary shadow-sm' : 'text-muted'
          )}
        >
          <Phone size={15} /> Téléphone
        </button>
      </div>

      {mode === 'email' ? (
        <Input
          id="client-contact-email"
          type="email"
          label="Adresse email"
          placeholder="vous@exemple.com"
          Icon={Mail}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
      ) : (
        <Input
          id="client-contact-phone"
          label="Numéro de téléphone"
          Ico="+237"
          type='tel'
          inputMode='numeric'
          value={identifier}
          placeholder="6XX XX XX XX"
          onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, ''))}
        />
      )}

      
            <InputCheck
              id="acceptedTerms"
              css="text-sm"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              label={
                <>
                  J'accepte les{" "}
                  <Link
                    to="/conditions"
                    target="_blank"
                    className="font-medium text-primary-500/75! hover:underline!"
                  >
                    conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link
                    to="/confidentialite"
                    target="_blank"
                    className="font-medium text-primary-500/75! hover:underline!"
                  >
                    politique de confidentialité
                  </Link>
                </>
              }
            />

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button
        type="submit" handleClick={handleSubmit}
        loading={isSubmitting}
        backgroundColor="var(--color-primary-500)"
        className="justify-center text-white"
      >
        Continuer
      </Button>

      <p className="mt-4 text-center text-sm text-secondary">
        Déjà inscrit ?{" "}
        <Link
          to="/connexion"
          className="font-semibold text-primary-500! hover:underline!"
        >
          Se connecter
        </Link>
      </p>
    </form>
  );
}