import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Coins, X } from "lucide-react";
import SkillAutocomplete from "../../components/ui/SkillAutocomplete";
import { catalogService } from "../../services/catalogService";
import { ApiError } from "../../types/api.types";
import type { Category, PriceUnit, Service } from "../../types/catalog.types";
import { cameroonRegions } from "../../data/cameroonRegions";
import {
  Button,
  Input,
  InputFilesUpload,
  InputSelect,
  Textarea,
} from "../../components/ui/Input";

const PRICE_UNIT_LABELS: Record<PriceUnit, string> = {
  fixed: "Prix fixe",
  hourly: "Par heure",
  starting_from: "À partir de",
};

export default function EditServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [service, setService] = useState<Service | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState<PriceUnit>("fixed");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      catalogService.getServiceBySlug(slug),
      catalogService.getCategories(),
    ]).then(([s, cats]) => {
      setService(s);
      setCategories(cats);
      setTitle(s.title);
      setDescription(s.description);
      setPrice(String(s.price));
      setPriceUnit(s.priceUnit);
      setRegion(s.region);
      setCity(s.city);
      setSkills(s.skills.map((sk) => sk.name));
      setExistingImages(s.images);
      setIsLoading(false);
    });
  }, [slug]);

  const removeExistingImage = (url: string) =>
    setExistingImages((imgs) => imgs.filter((i) => i !== url));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Titre requis.";
    if (!description.trim()) next.description = "Description requise.";
    if (!price) next.price = "Prix requis.";
    if (!region) next.region = "Région requise.";
    if (!city.trim()) next.city = "Ville requise.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !validate()) return;

    setIsSubmitting(true);
    setGlobalError("");
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("price", price);
      fd.append("priceUnit", priceUnit);
      fd.append("region", region);
      fd.append("city", city);
      fd.append("availability", service.availability);
      fd.append("existingImages", JSON.stringify(existingImages));
      skills.forEach((skill) => fd.append("skills[]", skill));
      newImages.forEach((file) => fd.append("images[]", file));

      const updated = await catalogService.updateService(service.id, fd);
      navigate(`/services/${updated.slug}`);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.fieldErrors) setErrors(apiError.fieldErrors);
      setGlobalError(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !service) {
    return <div className="skeleton h-96 w-full max-w-2xl rounded-lg" />;
  }

  const categoryId =
    categories.find((c) => c.slug === service.category.slug)?.id ?? null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-heading text-xl font-bold text-primary">
        Modifier le service
      </h1>
      <p className="mb-6 text-sm text-secondary">
        La catégorie ne peut pas être modifiée après publication.
      </p>

      <form className="flex flex-col gap-4">
        <Input
          id="edit-title"
          label="Titre du service"
          value={title}
          error={errors.title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="rounded-md border border-subtle bg-surface-alt px-3 py-2.5 text-sm text-muted">
          Catégorie :{" "}
          <span className="font-medium text-secondary">
            {service.category.title}
          </span>
        </div>

        <div>
          <label className="mb-1.5 block text-sm">Compétences proposées</label>
          <SkillAutocomplete
            categoryId={categoryId}
            selected={skills}
            onChange={setSkills}
            maxSkills={5}
          />
        </div>
        <Textarea
          label="Description"
          id="description_edit_service"
          rows={4}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setErrors({ ...errors, description: "" });
          }}
          error={errors.description}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="edit-price"
            type="number"
            label="Prix (FCFA)"
            Icon={Coins}
            value={price}
            error={errors.price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <InputSelect
            id="edit-price-unit"
            title="Type de tarif"
            value={priceUnit}
            onChange={(e) => setPriceUnit(e.target.value as PriceUnit)}
            items={Object.entries(PRICE_UNIT_LABELS).map(([value, name]) => ({
              name,
              value,
            }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InputSelect
            id="edit-region"
            title="Région"
            value={region}
            error={errors.region}
            onChange={(e) => setRegion(e.target.value)}
            items={cameroonRegions.map((r) => ({ name: r, value: r }))}
          />
          <Input
            id="edit-city"
            label="Ville"
            Icon={MapPin}
            value={city}
            error={errors.city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        {existingImages.length > 0 && (
          <div>
            <label className="mb-1.5 block text-sm">Images actuelles</label>
            <div className="flex flex-wrap gap-2">
              {existingImages.map((url) => (
                <div
                  key={url}
                  className="relative h-20 w-20 overflow-hidden rounded-md border border-subtle"
                >
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(url)}
                    className="absolute right-1 top-1 rounded-full bg-gray-950/70 p-0.5 text-white"
                    aria-label="Retirer"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <InputFilesUpload
          label="Ajouter de nouvelles photos"
          allowedTypes={["image/jpeg", "image/png", "image/webp"]}
          maxFiles={5}
          onFilesChange={(files: File[] | File) =>
            setNewImages(files as File[])
          }
        />

        {globalError && <p className="text-sm text-danger">{globalError}</p>}

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={() => navigate("/prestataire/prestations")}
            className="flex-1 justify-center border border-subtle bg-transparent text-primary"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            loading={isSubmitting}
            backgroundColor="var(--color-primary-500)"
            className="flex-1 justify-center text-white"
          >
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
}
