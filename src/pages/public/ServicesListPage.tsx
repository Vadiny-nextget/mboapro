import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import Tag from '../../components/ui/Tag';
import ProviderCard from '../../components/ui/ProviderCard';
import ProviderCardSkeleton from '../../components/ui/ProviderCardSkeleton';
import { mockProviders, categories } from '../../data/mockProviders';

export default function ServicesListPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Démo : re-déclenche le shimmer skeleton quand on change de filtre
  const handleCategoryClick = (cat: string) => {
    setIsLoading(true);
    setActiveCategory((prev) => (prev === cat ? null : cat));
    setTimeout(() => setIsLoading(false), 600);
  };

  const filteredProviders = useMemo(() => {
    if (!activeCategory) return mockProviders;
    return mockProviders.filter((p) =>
      p.skills.some((s) => s.toLowerCase().includes(activeCategory.toLowerCase())) ||
      p.profession.toLowerCase().includes(activeCategory.toLowerCase())
    );
  }, [activeCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-primary">
          Explorer les services
        </h1>
        <p className="mt-1 text-sm text-secondary">
          {filteredProviders.length} prestataire{filteredProviders.length > 1 ? 's' : ''} disponible
          {filteredProviders.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Filtres catégories */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-secondary">
          <SlidersHorizontal size={15} /> Filtrer :
        </span>
        {categories.map((cat) => (
          <Tag key={cat} active={activeCategory === cat} onClick={() => handleCategoryClick(cat)}>
            {cat}
          </Tag>
        ))}
      </div>

      {/* Grille de résultats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProviderCardSkeleton key={i} />)
          : filteredProviders.map((p) => <ProviderCard key={p.id} provider={p} />)}
      </div>

      {!isLoading && filteredProviders.length === 0 && (
        <div className="animate-fade-in flex flex-col items-center gap-2 py-16 text-center">
          <p className="font-semibold text-primary">Aucun prestataire trouvé</p>
          <p className="text-sm text-secondary">Essayez une autre catégorie.</p>
        </div>
      )}
    </div>
  );
}