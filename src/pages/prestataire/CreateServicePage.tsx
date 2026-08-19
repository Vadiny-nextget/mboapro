import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Coins } from "lucide-react";
import SkillAutocomplete from "../../components/ui/SkillAutocomplete";
import { catalogService } from "../../services/catalogService";
import { ApiError } from "../../types/api.types";
import type { Category, PriceUnit } from "../../types/catalog.types";
import { cameroonRegions } from "../../data/cameroonRegions";
import {
  Button,
  Input,
  InputFilesUpload,
  InputSelect,
  Textarea,
} from "../../components/ui/Input";
import CategorySuggestionFlow from "../../components/prestataire/CategorySuggestionFlow";

const PRICE_UNIT_LABELS: Record<PriceUnit, string> = {
  fixed: "Prix fixe",
  hourly: "Par heure",
  starting_from: "À partir de",
};

export default function CreateServicePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState<PriceUnit>("fixed");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [suggestion, setSuggestion] = useState({
    title: "",
    description: "",
    justification: "",
  });

  useEffect(() => {
    catalogService.getCategories().then(setCategories);
  }, []);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Titre requis.";
    if (!useCustomCategory && !categoryId)
      next.categoryId = "Catégorie requise.";
    if (useCustomCategory && !suggestion.title.trim())
      next.categoryId = "Nom de catégorie requis.";
    if (!description.trim()) next.description = "Description requise.";
    if (!price) next.price = "Prix requis.";
    if (!region) next.region = "Région requise.";
    if (!city.trim()) next.city = "Ville requise.";
    if (skills.length === 0)
      next.skills = "Sélectionnez au moins une compétence.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

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

      if (useCustomCategory) {
        fd.append("categorySuggestionTitle", suggestion.title);
        fd.append("categorySuggestionDescription", suggestion.description);
        fd.append("categorySuggestionJustification", suggestion.justification);
      } else {
        fd.append("categoryId", categoryId);
      }

      skills.forEach((skill) => fd.append("skills[]", skill));
      images.forEach((file) => fd.append("images[]", file));

      const service = await catalogService.createService(fd);
      navigate(
        useCustomCategory
          ? "/prestataire/prestations" // pas de slug public tant que non publié
          : `/services/${service.slug}`,
      );
      navigate(`/services/${service.slug}`);
    } catch (err) {
      const apiError = err as ApiError;
      setGlobalError(apiError.message);
      if (apiError.status === 402) {
        setTimeout(() => {
          navigate("/prestataire/activation-paiement");
        }, 5000);
        return;
      }
      if (apiError.fieldErrors) setErrors(apiError.fieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-heading text-xl font-bold text-primary">
        Publier un service
      </h1>
      <p className="mb-6 text-sm text-secondary">
        Créez une nouvelle annonce pour l'une de vos prestations.
      </p>

      <form className="flex flex-col gap-4">
        <Input
          id="service-title"
          label="Titre du service"
          placeholder='Ex: "Nadia Coiffure — Tresses & Locks à domicile"'
          value={title}
          error={errors.title}
          css="max-w-full!"
          onChange={(e) => {
            setTitle(e.target.value);
            setErrors({ ...errors, title: "" });
          }}
        />

        {/* <InputSelect
          id="service-category"
          title="Catégorie"
          className='max-w-full!'
          value={categoryId}
          error={errors.categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setSkills([]);
            setErrors({...errors, categoryId:""})
          }}
          items={categories.map((c) => ({ name: c.title, value: c.id }))}
        /> */}
        {!useCustomCategory ? (
          <>
            <InputSelect
              id="service-category"
              className="max-w-full!"
              title="Catégorie"
              value={categoryId}
              error={errors.categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSkills([]);
              }}
              items={categories.map((c) => ({ name: c.title, value: c.id }))}
            />
            <button
              type="button"
              onClick={() => {
                setUseCustomCategory(true);
                setCategoryId("");
                setSkills([]);
              }}
              className="self-start text-sm font-medium text-primary-500 hover:underline"
            >
              Ma catégorie n'existe pas
            </button>
          </>
        ) : (
          <>
            <CategorySuggestionFlow {...suggestion} onChange={setSuggestion} />
            <button
              type="button"
              onClick={() => setUseCustomCategory(false)}
              className="self-start text-sm font-medium text-secondary hover:underline"
            >
              ← Revenir à la liste des catégories
            </button>
          </>
        )}

        {(categoryId || useCustomCategory) && (
          <div>
            <label className="mb-1.5 block text-sm">
              Compétences proposées
            </label>
            <SkillAutocomplete
              categoryId={useCustomCategory ? null : categoryId}
              allowWithoutCategory={useCustomCategory}
              selected={skills}
              onChange={setSkills}
              maxSkills={5}
            />
            {errors.skills && (
              <p className="mt-1 text-sm text-danger">{errors.skills}</p>
            )}
          </div>
        )}

        {/* {categoryId && (
          <div>
            <label className="mb-1.5 block text-sm">Compétences proposées</label>
            <SkillAutocomplete categoryId={categoryId} selected={skills} onChange={setSkills} maxSkills={5} />
            {errors.skills && <p className="mt-1 text-sm text-danger">{errors.skills}</p>}
          </div>
        )} */}

        <Textarea
          id="description_service"
          label="Description"
          title="Catégorie"
          css="max-w-full!"
          rows={4}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setErrors({ ...errors, description: "" });
          }}
          placeholder="Décrivez ce que vous proposez, votre expérience, vos garanties..."
          error={errors.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            id="service-price"
            type="number"
            label="Prix (FCFA)"
            css="max-w-full!"
            Icon={Coins}
            value={price}
            error={errors.price}
            onChange={(e) => {
              setPrice(e.target.value);
              setErrors({ ...errors, price: "" });
            }}
          />
          <InputSelect
            id="service-price-unit"
            label="Type de tarif"
            title="Type de tarif"
            className="max-w-full!"
            value={priceUnit}
            onChange={(e) => setPriceUnit(e.target.value as PriceUnit)}
            items={Object.entries(PRICE_UNIT_LABELS).map(([value, name]) => ({
              name,
              value,
            }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputSelect
            id="service-region"
            label="Région"
            className="max-w-full!"
            title="Région"
            value={region}
            error={errors.region}
            onChange={(e) => {
              setRegion(e.target.value);
              setErrors({ ...errors, region: "" });
            }}
            items={cameroonRegions.map((r) => ({ name: r, value: r }))}
          />
          <Input
            id="service-city"
            css="max-w-full!"
            label="Ville"
            Icon={MapPin}
            value={city}
            error={errors.city}
            onChange={(e) => {
              setCity(e.target.value);
              setErrors({ ...errors, city: "" });
            }}
          />
        </div>

        <InputFilesUpload
          label="Photos illustrant ce service (recommandé)"
          allowedTypes={["image/jpeg", "image/png", "image/webp"]}
          maxFiles={5}
          onFilesChange={(files: File[] | File) => setImages(files as File[])}
        />

        {globalError && <p className="text-sm text-danger">{globalError}</p>}

        <Button
          type="submit"
          onClick={handleSubmit}
          loading={isSubmitting}
          backgroundColor="var(--color-primary-500)"
          className="justify-center text-white"
        >
          Publier le service
        </Button>
      </form>
    </div>
  );
}
