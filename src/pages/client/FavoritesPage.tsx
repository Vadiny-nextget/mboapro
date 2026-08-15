import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceCard from '../../components/ui/ServiceCard';
import { favoriteService } from '../../services/favoriteService';
import type { Service } from '../../types/catalog.types';
import ServiceCardSkeleton from '../../components/ui/ServiceCardSkeleton';

export default function FavoritesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    favoriteService.list().then(setServices).finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-1 font-heading text-xl font-bold text-primary">Mes favoris</h1>
      <p className="mb-6 text-sm text-secondary">Les services que vous avez sauvegardés.</p>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
        </div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-subtle py-16 text-center">
          <Heart size={32} className="text-muted" />
          <p className="font-medium text-primary">Aucun favori pour l'instant</p>
          <Link to="/services" className="text-sm font-semibold text-primary-500 hover:underline">
            Explorer les services
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>
      )}
    </div>
  );
}