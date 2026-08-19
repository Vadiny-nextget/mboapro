import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Home, Link2, Briefcase, MessageCircle } from "lucide-react";
import { authService } from "../services/authService";
import { ApiError } from "../types/api.types";
import { useAuthStore } from "../store/useAuthStore";
import { cameroonRegions } from "../data/cameroonRegions";
import { Button, Input, InputSelect, Textarea } from "../components/ui/Input";

export default function UpgradeToProviderPage() {
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!region) next.region = "Région requise.";
    if (!city.trim()) next.city = "Ville requise.";
    if (!address.trim()) next.address = "Adresse requise.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setGlobalError("");
    try {
      const session = await authService.upgradeToProvider({
        description: description || undefined,
        whatsapp: whatsapp || undefined,
        portfolioUrl: portfolioUrl || undefined,
        yearsExperience: yearsExperience || undefined,
        region,
        city,
        address,
      });
      setSession(session);
      setTimeout(() => {
        navigate("/prestataire/prestations/nouveau");
      }, 4500);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.fieldErrors) setErrors(apiError.fieldErrors);
      setGlobalError(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="font-heading text-xl font-bold text-primary">
          Devenir prestataire
        </h1>
        <p className="mt-1 text-sm text-secondary">
          Complétez votre profil professionnel.
        </p>
      </div>

      <form
        className="animate-fade-in-up flex flex-col gap-4 rounded-2xl border border-subtle bg-surface p-6 shadow-md"
      >
        <Textarea
          label="Description professionnelle (optionnel)"
          id="description_optionel"
          css="max-w-full!"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Présentez votre activité..."
        />

        <Input
          id="upgrade-country"
          label="Pays"
          value="Cameroun"
          disabled
          Icon={MapPin}
        />
        <InputSelect
          id="upgrade-region"
          title="Région"
          value={region}
          error={errors.region}
          onChange={(e) => setRegion(e.target.value)}
          items={cameroonRegions.map((r) => ({ name: r, value: r }))}
        />
        <Input
          id="upgrade-city"
          label="Ville"
          value={city}
          error={errors.city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Input
          id="upgrade-address"
          label="Adresse / Quartier"
          Icon={Home}
          value={address}
          error={errors.address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Input
          id="upgrade-whatsapp"
          label="Numéro WhatsApp (optionnel)"
          Icon={MessageCircle}
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
        />
        <Input
          id="upgrade-portfolioUrl"
          label="Portfolio / site web (optionnel)"
          Icon={Link2}
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
        />
        <Input
          id="upgrade-years"
          type="number"
          min={0}
          label="Années d'expérience"
          Icon={Briefcase}
          value={yearsExperience}
          onChange={(e) => setYearsExperience(e.target.value)}
        />

        {globalError && <p className="text-sm text-danger">{globalError}</p>}

        <Button
          type="submit"
          onClick={handleSubmit}
          loading={isSubmitting}
          backgroundColor="var(--color-primary-500)"
          className="justify-center text-white"
        >
          Devenir prestataire
        </Button>
        <p className="text-center text-xs text-muted">
          Vous pourrez publier votre premier service juste après.
        </p>
      </form>
    </div>
  );
}
