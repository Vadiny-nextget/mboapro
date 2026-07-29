import { useMemo, useState } from "react";
import { Link2, Briefcase } from "lucide-react";
import clsx from "clsx";
import {
  Input,
  InputSelect,
  InputFilesUpload,
  Button,
} from "../../../components/ui/Input";
import { useSellerOnboardingStore } from "../../../store/useSellerOnboardingStore";
import { serviceCategories } from "../../../data/serviceCategories";

const MAX_SKILLS = 5;

interface StepProfessionalProps {
  onComplete?: () => void;
}

export default function StepProfessional({
  onComplete,
}: StepProfessionalProps) {
  const { professional, setProfessional, setPortfolioImages, prevStep } =
    useSellerOnboardingStore();
  const [form, setForm] = useState(professional);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSkills = useMemo(
    () => serviceCategories.find((c) => c.id === form.category)?.skills ?? [],
    [form.category],
  );

  const handleCategoryChange = (categoryId: string) => {
    setForm((f) => ({ ...f, category: categoryId, skills: [] }));
  };

  const toggleSkill = (skill: string) => {
    setForm((f) => {
      const alreadySelected = f.skills.includes(skill);
      if (alreadySelected) {
        return { ...f, skills: f.skills.filter((s) => s !== skill) };
      }
      if (f.skills.length >= MAX_SKILLS) return f;
      return { ...f, skills: [...f.skills, skill] };
    });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.category) next.category = "Catégorie requise.";
    if (form.skills.length === 0)
      next.skills = "Sélectionnez au moins une compétence.";
    if (!form.yearsExperience) next.yearsExperience = "Champ requis.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setProfessional(form);
    setIsSubmitting(true);
    // TODO: appel API final de création du compte prestataire (multipart avec fichiers)
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete?.();
    }, 900);
  };

  return (
    <form className="flex flex-col gap-4">
      <h4 className="font-heading text-lg font-bold text-primary">Activité</h4>
      <InputSelect
        id="category"
        title="Choisissez votre catégorie de service"
        value={form.category}
        error={errors.category}
        onChange={(e) => {handleCategoryChange(e.target.value); setErrors({ ...errors, category: "" });}}
        items={serviceCategories.map((c) => ({ name: c.label, value: c.id }))}
      />

      {form.category && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm">Compétences</label>
            <span className="text-xs text-muted">
              {form.skills.length}/{MAX_SKILLS} sélectionnées
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableSkills.map((skill) => {
              const isSelected = form.skills.includes(skill);
              const isDisabled =
                !isSelected && form.skills.length >= MAX_SKILLS;
              return (
                <button
                  key={skill}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {toggleSkill(skill); setErrors({...errors, skills: ""})}}
                  className={clsx(
                    "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                    isSelected
                      ? "border-primary-500 bg-primary-500 text-on-primary"
                      : "border-subtle text-secondary hover:border-primary-300",
                    isDisabled && "cursor-not-allowed opacity-40",
                  )}
                >
                  {skill}
                </button>
              );
            })}
          </div>
          {errors.skills && (
            <p className="mt-1.5 text-sm text-danger">{errors.skills}</p>
          )}
        </div>
      )}

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

      <InputFilesUpload
        label="Photos illustrant vos réalisations (max 5)"
        allowedTypes={["image/jpeg", "image/png", "image/webp"]}
        maxFiles={5}
        onFilesChange={(files: File[]) => setPortfolioImages(files)}
      />

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
    </form>
  );
}
