import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Globe } from 'lucide-react';
import clsx from 'clsx';
import { authService } from '../../../services/authService';
import { ApiError } from '../../../types/api.types';
import { useAuthStore } from '../../../store/useAuthStore';
import { useClientOnboardingStore } from '../../../store/useClientOnboardingStore';
import { Button, Input, InputFileUpload } from '../../../components/ui/Input';

export default function StepClientPersonalInfo() {
  const store = useClientOnboardingStore();
  const { personal, setPersonal, setAvatarFile, prevStep, reset } = store;
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  const [form, setForm] = useState(personal);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof typeof form, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = 'Prénom requis.';
    if (!form.lastName.trim()) next.lastName = 'Nom requis.';
    if (form.password.length < 8) next.password = '8 caractères minimum.';
    if (form.password !== form.confirmPassword) next.confirmPassword = 'Les mots de passe ne correspondent pas.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setPersonal(form);
    setIsSubmitting(true);
    setGlobalError('');

    try {
      const session = await authService.registerClient({
        verificationToken: store.verificationToken,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
        confirmPassword: form.confirmPassword,
        preferredLanguage: form.preferredLanguage,
      });
      setSession(session);
      reset();
      navigate('/client');
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.fieldErrors) setErrors(apiError.fieldErrors);
      setGlobalError(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-4">
      <h4 className="font-heading text-lg font-bold text-primary">Profil</h4>
      <InputFileUpload
        label="Photo de profil (optionnel)"
        allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
        maxSize={3}
        onFilesChange={(file: File|File[]) => setAvatarFile(file as File)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="client-firstName"
          label="Prénom"
          Icon={User}
          value={form.firstName}
          error={errors.firstName}
          onChange={(e) => update('firstName', e.target.value)}
        />
        <Input
          id="client-lastName"
          label="Nom"
          value={form.lastName}
          error={errors.lastName}
          onChange={(e) => update('lastName', e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-sm">
          <Globe size={14} /> Langue préférée
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['fr', 'en'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => update('preferredLanguage', lang)}
              className={clsx(
                'rounded-md border py-2 text-sm font-medium transition-colors',
                form.preferredLanguage === lang
                  ? 'border-primary-500 bg-primary-50 text-primary-600'
                  : 'border-subtle text-secondary'
              )}
            >
              {lang === 'fr' ? 'Français' : 'English'}
            </button>
          ))}
        </div>
      </div>

      <Input
        id="client-password"
        type="password"
        label="Mot de passe"
        Icon={Lock}
        value={form.password}
        error={errors.password}
        onChange={(e) => update('password', e.target.value)}
      />
      <Input
        id="client-confirmPassword"
        type="password"
        label="Confirmer le mot de passe"
        Icon={Lock}
        value={form.confirmPassword}
        error={errors.confirmPassword}
        onChange={(e) => update('confirmPassword', e.target.value)}
      />

      {globalError && <p className="text-sm text-danger">{globalError}</p>}

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={prevStep}
          className="flex-1 justify-center border border-subtle bg-transparent text-primary"
        >
          Retour
        </Button>
        <Button
          type="submit" onClick={handleSubmit}
          loading={isSubmitting}
          backgroundColor="var(--color-primary-500)"
          className="flex-1 justify-center text-white"
        >
          Créer mon compte
        </Button>
      </div>
    </form>
  );
}