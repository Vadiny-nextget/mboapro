import { useEffect, useState } from 'react';
import { User, Lock, Globe } from 'lucide-react';
import clsx from 'clsx';
import Avatar from '../../components/ui/Avatar';
import { profileService } from '../../services/profileService';
import { ApiError } from '../../types/api.types';
import { useAuthStore } from '../../store/useAuthStore';
import { Button, Input, InputFileUpload } from '../../components/ui/Input';

export default function MyProfilePageClient() {
  const authUser = useAuthStore((s) => s.user);
  const setSession = useAuthStore((s) => s.setSession);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'fr' | 'en'>('fr');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    profileService.getMe().then((p) => {
      setFirstName(p.firstName);
      setLastName(p.lastName);
      setPreferredLanguage(p.preferredLanguage);
      setIsLoading(false);
    });
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setProfileError('');
    setProfileSuccess(false);
    try {
      const fd = new FormData();
      fd.append('firstName', firstName);
      fd.append('lastName', lastName);
      fd.append('preferredLanguage', preferredLanguage);
      if (avatarFile) fd.append('avatar', avatarFile);

      const updated = await profileService.updateMe(fd);
      if (authUser) {
        setSession({ user: { ...authUser, ...updated }, accessToken: useAuthStore.getState().accessToken!, refreshToken: useAuthStore.getState().refreshToken! });
      }
      setProfileSuccess(true);
    } catch (err) {
      setProfileError((err as ApiError).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (newPassword.length < 8) errors.newPassword = '8 caractères minimum.';
    if (newPassword !== confirmPassword) errors.confirmPassword = 'Les mots de passe ne correspondent pas.';
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsChangingPassword(true);
    setPasswordSuccess(false);
    try {
      await profileService.changePassword({ currentPassword: currentPassword || undefined, newPassword, confirmPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess(true);
    } catch (err) {
      setPasswordErrors({ currentPassword: (err as ApiError).message });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) return <div className="skeleton h-96 w-full max-w-lg rounded-lg" />;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 font-heading text-xl font-bold text-primary">Mon profil</h1>

      <form className="flex flex-col gap-4 rounded-lg border border-subtle bg-surface p-6">
        <div className="flex items-center gap-4">
          <Avatar src={authUser?.avatarUrl ?? undefined} name={`${firstName} ${lastName}`} size="lg" />
          <div className="flex-1">
            <InputFileUpload label="Changer la photo" allowedTypes={['image/jpeg', 'image/png', 'image/webp']} maxSize={3} onFilesChange={(e)=>setAvatarFile(e as File)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input id="profile-firstName" label="Prénom" Icon={User} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input id="profile-lastName" label="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm"><Globe size={14} /> Langue préférée</label>
          <div className="grid grid-cols-2 gap-2">
            {(['fr', 'en'] as const).map((lang) => (
              <button key={lang} type="button" onClick={() => setPreferredLanguage(lang)}
                className={clsx('rounded-md border py-2 text-sm font-medium', preferredLanguage === lang ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-subtle text-secondary')}>
                {lang === 'fr' ? 'Français' : 'English'}
              </button>
            ))}
          </div>
        </div>

        {profileError && <p className="text-sm text-danger">{profileError}</p>}
        {profileSuccess && <p className="text-sm text-success">Profil mis à jour avec succès.</p>}

        <Button type="submit" onClick={handleProfileSubmit} loading={isSaving} backgroundColor="var(--color-primary-500)" className="justify-center text-white">Enregistrer</Button>
      </form>

      <form className="mt-6 flex flex-col gap-4 rounded-lg border border-subtle bg-surface p-6">
        <h2 className="font-heading text-lg font-bold text-primary">Mot de passe</h2>
        <Input id="current-password" type="password" label="Mot de passe actuel (si déjà défini)" Icon={Lock} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <Input id="new-password" type="password" label="Nouveau mot de passe" Icon={Lock} value={newPassword} error={passwordErrors.newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <Input id="confirm-new-password" type="password" label="Confirmer" Icon={Lock} value={confirmPassword} error={passwordErrors.confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        {passwordErrors.currentPassword && <p className="text-sm text-danger">{passwordErrors.currentPassword}</p>}
        {passwordSuccess && <p className="text-sm text-success">Mot de passe mis à jour.</p>}
        <Button type="submit" onClick={handlePasswordSubmit} loading={isChangingPassword} backgroundColor="var(--color-primary-500)" className="justify-center text-white">Changer le mot de passe</Button>
      </form>
    </div>
  );
}