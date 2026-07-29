import { useState } from "react";
import { MapPin, Home, Hash } from "lucide-react";
import { Input, InputSelect, Button } from "../../../components/ui/Input";
import { useSellerOnboardingStore } from "../../../store/useSellerOnboardingStore";
import { cameroonRegions } from "../../../data/cameroonRegions";

export default function StepLocation() {
  const { location, setLocation, nextStep, prevStep } =
    useSellerOnboardingStore();
  const [form, setForm] = useState(location);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.region) next.region = "Région requise.";
    if (!form.city.trim()) next.city = "Ville requise.";
    if (!form.address.trim()) next.address = "Adresse requise.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLocation(form);
    nextStep();
  };

  return (
    <form className="flex flex-col gap-4 w-full">
      <h4 className="font-heading text-lg font-bold text-primary">
        Localisation
      </h4>
      <Input
        id="country"
        label="Pays"
        value={form.country}
        disabled
        Icon={MapPin}
      />

      <InputSelect
        id="region"
        title="Sélectionnez votre région"
        value={form.region}
        error={errors.region}
        onChange={(e) => {
          update("region", e.target.value);
          setErrors({ ...errors, region: "" });
        }}
        items={cameroonRegions.map((r) => ({ name: r, value: r }))}
      />

      <Input
        id="city"
        label="Ville"
        placeholder="Ex: Douala"
        value={form.city}
        error={errors.city}
        onChange={(e) => {
          update("city", e.target.value);
          setErrors({ ...errors, city: "" });
        }}
      />

      <Input
        id="address"
        label="Adresse / Quartier"
        Icon={Home}
        placeholder="Ex: Bonamoussadi, Rue des Manguiers"
        value={form.address}
        error={errors.address}
        onChange={(e) => {
          update("address", e.target.value);
          setErrors({ ...errors, address: "" });
        }}
      />

      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between gap-3">
        <Input
          id="street"
          label="Rue / Repère"
          placeholder="Ex: Face pharmacie X"
          value={form.street}
          onChange={(e) => update("street", e.target.value)}
        />
        <Input
          id="postalCode"
          label="Code postal (optionnel)"
          Icon={Hash}
          value={form.postalCode}
          onChange={(e) => update("postalCode", e.target.value)}
        />
      </div>

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
          backgroundColor="var(--color-primary-500)"
          className="flex-1 justify-center text-white"
        >
          Continuer
        </Button>
      </div>
    </form>
  );
}
