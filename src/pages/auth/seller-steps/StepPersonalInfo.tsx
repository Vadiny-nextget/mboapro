import { useState } from "react";
import { User, Lock, FileText, Globe } from "lucide-react";
import clsx from "clsx";
import {
  Input,
  InputFileUpload,
  Button,
  InputCheck,
} from "../../../components/ui/Input";
import { useSellerOnboardingStore } from "../../../store/useSellerOnboardingStore";

export default function StepPersonalInfo() {
  const {
    personal,
    setPersonal,
    avatarFile,
    setAvatarFile,
    nextStep,
    prevStep,
  } = useSellerOnboardingStore();
  const [form, setForm] = useState(personal);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: keyof typeof form, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = "Prénom requis.";
    if (!form.lastName.trim()) next.lastName = "Nom requis.";
    if (form.password.length < 8) next.password = "8 caractères minimum.";
    if (form.password !== form.confirmPassword)
      next.confirmPassword = "Les mots de passe ne correspondent pas.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setPersonal(form);
    nextStep();
  };

  return (
    <form className="flex flex-col gap-4 w-full">
      <h4 className="font-heading text-lg font-bold text-primary">Profil</h4>
      <InputFileUpload
        label="Photo de profil"
        allowedTypes={["image/jpeg", "image/png", "image/webp"]}
        maxSize={3}
        fileUrl={avatarFile ? URL.createObjectURL(avatarFile) : ""}
        onFilesChange={(file: File|File[]) => setAvatarFile(file as File)}
      />

      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between gap-3">
        <Input
          Icon={User}
          label="Prénom"
          id="firstName"
          value={form.firstName}
          error={errors.firstName}
          onChange={(e) => {
            update("firstName", e.target.value);
            setErrors({ ...errors, firstName: "" });
          }}
        />
        <Input
          Icon={User}
          label="Nom"
          id="lastName"
          value={form.lastName}
          error={errors.lastName}
          onChange={(e) => {
            update("lastName", e.target.value);
            setErrors({ ...errors, lastName: "" });
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm">Description professionnelle</label>
        <div className="relative">
          <FileText size={18} className="absolute left-4 top-4 text-muted" />
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Présentez votre activité en quelques phrases..."
            className="w-full rounded-2xl border border-subtle bg-surface py-3 pl-12 pr-4 text-sm text-primary outline-none focus:border-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-sm">
          <Globe size={14} /> Langue de travail préférée
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(["fr", "en"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => update("preferredLanguage", lang)}
              className={clsx(
                "rounded-md border py-2 text-sm font-medium transition-colors",
                form.preferredLanguage === lang
                  ? "border-primary-500 bg-primary-50 text-primary-600"
                  : "border-subtle text-secondary",
              )}
            >
              {lang === "fr" ? "Français" : "English"}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between gap-3">
        <Input
          Icon={Lock}
          label="Mot de passe"
          id="password"
          type="password"
          value={form.password}
          error={errors.password}
          onChange={(e) => {
            update("password", e.target.value);
            setErrors({ ...errors, password: "" });
          }}
        />
        <Input
          id="confirmPassword"
          type="password"
          label="Confirmer le mot de passe"
          Icon={Lock}
          value={form.confirmPassword}
          error={errors.confirmPassword}
          onChange={(e) => {
            update("confirmPassword", e.target.value);
            setErrors({ ...errors, confirmPassword: "" });
          }}
        />
      </div>

      <InputCheck
        id="is_verify_2fa"
        css="text-sm"
        checked={form.is_verify_2fa}
        onChange={(e) => update("is_verify_2fa", e.target.checked)}
        label={<>Activez la double authentification</>}
      />

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={prevStep}
          className="flex-1 justify-center border border-subtle bg-transparent text-primary"
        >
          Retour
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          backgroundColor="var(--color-primary-500)"
          className="flex-1 justify-center text-white"
        >
          Continuer
        </Button>
      </div>
    </form>
  );
}
