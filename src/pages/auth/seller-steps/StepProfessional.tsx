import { useMemo, useState } from "react";
import { Link2, Briefcase, Phone, MessageCircle } from "lucide-react";
import clsx from "clsx";
import {
  Input,
  InputSelect,
  InputFilesUpload,
  Button,
} from "../../../components/ui/Input";
import { useSellerOnboardingStore } from "../../../store/useSellerOnboardingStore";
import { serviceCategories } from "../../../data/serviceCategories";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { authService } from "../../../services/authService";
import type { ApiError } from "../../../types/api.types";

const MAX_SKILLS = 5;

interface StepProfessionalProps {
  onComplete?: () => void;
}

export default function StepProfessional({
  onComplete,
}: StepProfessionalProps) {
  const store = useSellerOnboardingStore();

  const { professional, setProfessional, prevStep, reset } = store;
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();


  const [form, setForm] = useState(professional);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.yearsExperience) next.yearsExperience = "Champ requis.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

   /** Assemble toutes les données collectées sur les 5 étapes en multipart/form-data. */
  const buildFormData = (): FormData => {
    const fd = new FormData();
    fd.append('verificationToken', store.verificationToken);
    fd.append('firstName', store.personal.firstName);
    fd.append('lastName', store.personal.lastName);
    fd.append('description', store.personal.description);
    fd.append('preferredLanguage', store.personal.preferredLanguage);
    fd.append('password', store.personal.password);
    fd.append('confirmPassword', store.personal.confirmPassword);

    fd.append('region', store.location.region);
    fd.append('city', store.location.city);
    fd.append('address', store.location.address);
    fd.append('street', store.location.street);
    fd.append('postalCode', store.location.postalCode);

    fd.append('portfolioUrl', form.portfolioUrl);
    fd.append('yearsExperience', form.yearsExperience);
    fd.append('whatsapp', form.whatsapp);

    if (store.avatarFile) fd.append('avatar', store.avatarFile);

    return fd;
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setProfessional(form);
    setIsSubmitting(true);
    setGlobalError("")

    try {
      const session = await authService.registerProvider(buildFormData());
      setSession(session);
      reset(); // vide le wizard : plus rien à reprendre après un compte créé avec succès
      onComplete?.();
      navigate('/prestataire/prestations/nouveau');
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
      <h4 className="font-heading text-lg font-bold text-primary">Activité</h4>
      <Input
        id="portfolioUrl"
        label="Portfolio / site web (optionnel)"
        Icon={Link2}
        placeholder="https://..."
        value={form.portfolioUrl}
        onChange={(e) =>
          setForm((f) => ({ ...f, portfolioUrl: e.target.value }))
        }
      />
      <Input
        id="yearsExperience"
        type="number"
        min={0}
        label="Années d'expérience"
        Icon={Briefcase}
        value={form.yearsExperience}
        error={errors.yearsExperience}
        onChange={(e) =>
          {setForm((f) => ({ ...f, yearsExperience: e.target.value })); setErrors({ ...errors, yearsExperience: "" });
}        }
      />
      <Input
        id="whatsapp"
        label="Numéro WhatsApp (optionnel)"
        Icon={MessageCircle}
        placeholder="677123456"
        value={form.whatsapp}
        onChange={(e) =>
          setForm((f) => ({ ...f, whatsapp: e.target.value.replace(/\D/g, '') }))
        }
      />
      {globalError && <p className="text-sm text-danger">{globalError}</p>}

      <div className="flex gap-3">
        <Button
          type="button"
          handleClick={prevStep}
          className="flex-1 justify-center border border-subtle bg-transparent text-primary"
        >
          Retour
        </Button>
        <Button
          type="submit"
          handleClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          backgroundColor="var(--color-primary-500)"
          className="flex-1 justify-center text-white"
        >
          Créer mon compte
        </Button>
      </div>

      <p className="text-center text-xs text-muted">
        Les informations de paiement seront demandées plus tard, dans votre
        espace prestataire.
      </p>
      <p className="text-center text-xs text-muted">
        Vous pourrez publier votre premier service (catégorie, compétences, photos) juste après.
      </p>
    </form>
  );
}
