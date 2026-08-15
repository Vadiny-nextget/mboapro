import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import ReputationStars from '../../components/ui/ReputationStars';
import { dashboardService } from '../../services/dashboardService';
import { catalogService } from '../../services/catalogService';
import { useAuthStore } from '../../store/useAuthStore';
import type { ProviderDashboardData } from '../../types/dashboard.types';
import type { Service } from '../../types/catalog.types';

export default function ReviewsPage() {
  const user = useAuthStore((s) => s.user);
  const [dashboard, setDashboard] = useState<ProviderDashboardData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([dashboardService.getProviderDashboard(), catalogService.getServicesByProvider(user.id)])
      .then(([d, s]) => {
        setDashboard(d);
        setServices(s);
      })
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  if (isLoading || !dashboard) return <div className="skeleton h-64 w-full rounded-lg" />;

  return (
    <div>
      <h1 className="mb-1 font-heading text-xl font-bold text-primary">Avis & réputation</h1>
      <p className="mb-6 text-sm text-secondary">La confiance que vous construisez au fil des missions.</p>

      <div className="mb-6 flex items-center gap-6 rounded-lg border border-subtle bg-surface p-6">
        <div className="text-center">
          <p className="font-heading text-3xl font-bold text-primary">
            {dashboard.stats.totalReviews > 0 ? dashboard.stats.avgRating.toFixed(1) : '—'}
          </p>
          <ReputationStars rating={dashboard.stats.avgRating} size={16} showValue={false} className="mt-1 justify-center" />
        </div>
        <div className="h-12 w-px bg-subtle" />
        <div>
          <p className="text-sm text-secondary">{dashboard.stats.totalReviews} avis reçu{dashboard.stats.totalReviews > 1 ? 's' : ''}</p>
          <p className="text-sm text-secondary">sur {dashboard.stats.serviceCount} service{dashboard.stats.serviceCount > 1 ? 's' : ''} publié{dashboard.stats.serviceCount > 1 ? 's' : ''}</p>
        </div>
      </div>

      {dashboard.stats.totalReviews === 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-dashed border-subtle p-5">
          <Star size={20} className="mt-0.5 shrink-0 text-muted" />
          <p className="text-sm text-secondary">
            Vous n'avez pas encore d'avis. Le système de collecte d'avis vérifiés (après mission réalisée) arrive
            bientôt sur MboaPro — vos notes s'afficheront ici automatiquement une fois disponible.
          </p>
        </div>
      )}

      <h2 className="mb-3 font-heading text-lg font-bold text-primary">Détail par service</h2>
      <div className="flex flex-col gap-2">
        {services.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-lg border border-subtle bg-surface p-4">
            <p className="text-sm font-medium text-primary">{s.title}</p>
            <ReputationStars rating={s.rating} reviewCount={s.reviewCount} size={14} />
          </div>
        ))}
      </div>
    </div>
  );
}