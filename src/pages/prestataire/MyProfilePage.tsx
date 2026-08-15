import { useEffect, useState } from 'react';
import { User, MapPin, Home, Link2, Briefcase, MessageCircle, Lock, Globe } from 'lucide-react';
import clsx from 'clsx';
import Avatar from '../../components/ui/Avatar';
import { profileService } from '../../services/profileService';
import { ApiError } from '../../types/api.types';
import { useAuthStore } from '../../store/useAuthStore';
import { cameroonRegions } from '../../data/cameroonRegions';
import { Button, Input, InputFileUpload, InputSelect } from '../../components/ui/Input';

export default function MyProfilePagePrestataire() {
  const authUser = useAuthStore((s) => s.user);
  const setSession = useAuthStore((s) => s.setSession);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [description, setDescription] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'fr' | 'en'>('fr');
  const [whatsapp, setWhatsapp] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

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
      setDescription(p.description ?? '');
      setPreferredLanguage(p.preferredLanguage);
      if (p.providerProfile) {
        setWhatsapp(p.providerProfile.whatsapp ?? '');
        setPortfolioUrl(p.providerProfile.portfolio_url ?? '');
        setYearsExperience(String(p.providerProfile.years_experience ?? ''));
        setRegion(p.providerProfile.region);
        setCity(p.providerProfile.city);
        setAddress(p.providerProfile.address);
      }
      setIsLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!region) next.region = 'Région requise.';
    if (!city.trim()) next.city = 'Ville requise.';
    if (!address.trim()) next.address = 'Adresse requise.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setIsSaving(true);
    setGlobalError('');
    setSuccessMsg(false);
    try {
      const fd = new FormData();
      fd.append('firstName', firstName);
      fd.append('lastName', lastName);
      fd.append('description', description);
      fd.append('preferredLanguage', preferredLanguage);
      fd.append('whatsapp', whatsapp);
      fd.append('portfolioUrl', portfolioUrl);
      fd.append('yearsExperience', yearsExperience);
      fd.append('region', region);
      fd.append('city', city);
      fd.append('address', address);
      if (avatarFile) fd.append('avatar', avatarFile);

      const updated = await profileService.updateMe(fd);
      if (authUser) {
        setSession({ user: { ...authUser, ...updated }, accessToken: useAuthStore.getState().accessToken!, refreshToken: useAuthStore.getState().refreshToken! });
      }
      setSuccessMsg(true);
    } catch (err) {
      setGlobalError((err as ApiError).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (newPassword.length < 8) errs.newPassword = '8 caractères minimum.';
    if (newPassword !== confirmPassword) errs.confirmPassword = 'Les mots de passe ne correspondent pas.';
    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;

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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-subtle bg-surface p-6">
        <div className="flex items-center gap-4">
          <Avatar src={authUser?.avatarUrl ?? undefined} name={`${firstName} ${lastName}`} size="lg" />
          <div className="flex-1">
            <InputFileUpload label="Changer la photo" allowedTypes={['image/jpeg', 'image/png', 'image/webp']} maxSize={3} onFilesChange={(e)=>setAvatarFile(e as File)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input id="p-firstName" label="Prénom" Icon={User} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input id="p-lastName" label="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm">Description professionnelle</label>
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-2xl border border-subtle bg-surface p-3 text-sm text-primary outline-none focus:border-primary-500" />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm"><Globe size={14} /> Langue de travail</label>
          <div className="grid grid-cols-2 gap-2">
            {(['fr', 'en'] as const).map((lang) => (
              <button key={lang} type="button" onClick={() => setPreferredLanguage(lang)}
                className={clsx('rounded-md border py-2 text-sm font-medium', preferredLanguage === lang ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-subtle text-secondary')}>
                {lang === 'fr' ? 'Français' : 'English'}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-subtle" />

        <Input id="p-country" label="Pays" value="Cameroun" disabled Icon={MapPin} />
        <InputSelect id="p-region" title="Région" value={region} error={errors.region} onChange={(e) => setRegion(e.target.value)} items={cameroonRegions.map((r) => ({ name: r, value: r }))} />
        <Input id="p-city" label="Ville" value={city} error={errors.city} onChange={(e) => setCity(e.target.value)} />
        <Input id="p-address" label="Adresse / Quartier" Icon={Home} value={address} error={errors.address} onChange={(e) => setAddress(e.target.value)} />
        <Input id="p-whatsapp" label="WhatsApp" Icon={MessageCircle} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))} />
        <Input id="p-portfolio" label="Portfolio / site web" Icon={Link2} value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} />
        <Input id="p-years" type="number" min={0} label="Années d'expérience" Icon={Briefcase} value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} />

        {globalError && <p className="text-sm text-danger">{globalError}</p>}
        {successMsg && <p className="text-sm text-success">Profil mis à jour avec succès.</p>}

        <Button type="submit" loading={isSaving} backgroundColor="var(--color-primary-500)" className="justify-center text-white">Enregistrer</Button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="mt-6 flex flex-col gap-4 rounded-lg border border-subtle bg-surface p-6">
        <h2 className="font-heading text-lg font-bold text-primary">Mot de passe</h2>
        <Input id="pp-current" type="password" label="Mot de passe actuel (si déjà défini)" Icon={Lock} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <Input id="pp-new" type="password" label="Nouveau mot de passe" Icon={Lock} value={newPassword} error={passwordErrors.newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <Input id="pp-confirm" type="password" label="Confirmer" Icon={Lock} value={confirmPassword} error={passwordErrors.confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        {passwordErrors.currentPassword && <p className="text-sm text-danger">{passwordErrors.currentPassword}</p>}
        {passwordSuccess && <p className="text-sm text-success">Mot de passe mis à jour.</p>}
        <Button type="submit" loading={isChangingPassword} backgroundColor="var(--color-primary-500)" className="justify-center text-white">Changer le mot de passe</Button>
      </form>
    </div>
  );
}