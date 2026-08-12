import { useCallback, useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import ServiceCard from "../../components/ui/ServiceCard";
import ServiceCardSkeleton from "../../components/ui/ServiceCardSkeleton";
import type {
  Category,
  Service,
  ServiceSearchFilters,
} from "../../types/catalog.types";
import { catalogService } from "../../services/catalogService";
import { cameroonRegions } from "../../data/cameroonRegions";
import SkillAutocomplete from "../../components/ui/SkillAutocomplete";
import { useSearchParams } from "react-router-dom";

const RATING_OPTIONS = [4.5, 4, 3, 0];

export default function ServicesListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

const [searchParams] = useSearchParams();
const [filters, setFilters] = useState<ServiceSearchFilters>({
  sort: 'recent',
  page: 1,
  category: searchParams.get('category') ?? undefined,
  q: searchParams.get('q') ?? undefined,
});

  const [skillNames, setSkillNames] = useState<string[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    catalogService.getCategories().then(setCategories);
  }, []);

  const fetchServices = useCallback(() => {
    setIsLoading(true);
    catalogService
      .searchServices({ ...filters, skills: skillNames })
      .then((result) => {
        setServices(result.items);
        setTotal(result.pagination.total);
      })
      .finally(() => setIsLoading(false));
  }, [filters, skillNames]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const updateFilter = <K extends keyof ServiceSearchFilters>(
    key: K,
    value: ServiceSearchFilters[K],
  ) => {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({ sort: "recent", page: 1 });
    setSkillNames([]);
    setSelectedCategoryId(null);
  };
  
useEffect(() => {
  if (filters.category && categories.length > 0) {
    const cat = categories.find((c) => c.slug === filters.category);
    setSelectedCategoryId(cat?.id ?? null);
  }
}, [filters.category, categories]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            Explorer les services
          </h1>
          <p className="mt-1 text-sm text-secondary">
            {total} service{total > 1 ? "s" : ""} disponible
            {total > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-2 rounded-md border border-subtle px-4 py-2 text-sm font-medium text-primary lg:hidden"
        >
          <SlidersHorizontal size={16} /> Filtres
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar filtres */}
        <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="sticky top-20 flex flex-col gap-6 rounded-lg border border-subtle bg-surface p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-primary">Filtres</h2>
              <button
                onClick={resetFilters}
                className="text-xs font-medium text-primary-500 hover:underline"
              >
                Réinitialiser
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-primary">
                Catégorie
              </label>
              <select
                value={filters.category ?? ""}
                onChange={(e) => {
                  const cat = categories.find((c) => c.slug === e.target.value);
                  updateFilter("category", e.target.value || undefined);
                  setSelectedCategoryId(cat?.id ?? null);
                  setSkillNames([]);
                }}
                className="w-full rounded-md border border-subtle bg-surface px-3 py-2 text-sm text-primary outline-none focus:border-primary-500"
              >
                <option value="">Toutes</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-primary">
                Ville
              </label>
              <select
                value={filters.city ?? ""}
                onChange={(e) =>
                  updateFilter("city", e.target.value || undefined)
                }
                className="w-full rounded-md border border-subtle bg-surface px-3 py-2 text-sm text-primary outline-none focus:border-primary-500"
              >
                <option value="">Toutes</option>
                {cameroonRegions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-primary">
                Langue du prestataire
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["fr", "en"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() =>
                      updateFilter(
                        "language",
                        filters.language === lang ? undefined : lang,
                      )
                    }
                    className={`rounded-md border py-2 text-sm font-medium ${
                      filters.language === lang
                        ? "border-primary-500 bg-primary-50 text-primary-600"
                        : "border-subtle text-secondary"
                    }`}
                  >
                    {lang === "fr" ? "Français" : "English"}
                  </button>
                ))}
              </div>
            </div>

            {selectedCategoryId && (
              <div>
                <label className="mb-2 block text-sm font-medium text-primary">
                  Compétences
                </label>
                <SkillAutocomplete
                  categoryId={selectedCategoryId}
                  selected={skillNames}
                  onChange={setSkillNames}
                  maxSkills={5}
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-primary">
                Note minimum
              </label>
              <div className="flex flex-col gap-1.5">
                {RATING_OPTIONS.map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-2 text-sm text-secondary"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.minRating === rating}
                      onChange={() =>
                        updateFilter("minRating", rating || undefined)
                      }
                    />
                    {rating > 0 ? `${rating}+ étoiles` : "Toutes les notes"}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-primary">
                Prix (FCFA)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice ?? ""}
                  onChange={(e) =>
                    updateFilter(
                      "minPrice",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className="w-1/2 rounded-md border border-subtle bg-surface px-3 py-2 text-sm text-primary outline-none focus:border-primary-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice ?? ""}
                  onChange={(e) =>
                    updateFilter(
                      "maxPrice",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className="w-1/2 rounded-md border border-subtle bg-surface px-3 py-2 text-sm text-primary outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </aside>
        <div>
          <div className="mb-4 flex justify-end">
            <select
              value={filters.sort}
              onChange={(e) =>
                updateFilter(
                  "sort",
                  e.target.value as ServiceSearchFilters["sort"],
                )
              }
              className="rounded-md border border-subtle bg-surface px-3 py-2 text-sm text-primary outline-none focus:border-primary-500"
            >
              <option value="recent">Plus récents</option>
              <option value="rating">Mieux notés</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <ServiceCardSkeleton key={i} />
                ))
              : services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
          </div>

          {!isLoading && services.length === 0 && (
            <div className="animate-fade-in flex flex-col items-center gap-2 py-16 text-center">
              <p className="font-semibold text-primary">Aucun service trouvé</p>
              <p className="text-sm text-secondary">
                Essayez d'élargir vos filtres.
              </p>
            </div>
          )}
        </div>
      </div>
      {/* 

      {/* Filtres catégories 
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-secondary">
          <SlidersHorizontal size={15} /> Filtrer :
        </span>
        {categories.map((cat) => (
          <Tag key={cat} active={activeCategory === cat} onClick={() => handleCategoryClick(cat)}>
            {cat}
          </Tag>
        ))}
      </div> */}
    </div>
  );
}
