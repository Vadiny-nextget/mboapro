
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Briefcase, MessageSquare, TrendingUp, Plus } from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import ContactRequestStatusBadge from '../../components/ui/ContactRequestStatusBadge';
import { dashboardService } from '../../services/dashboardService';
import { useAuthStore } from '../../store/useAuthStore';
import { getFullName } from '../../utils/user';
import type { ProviderDashboardData } from '../../types/dashboard.types';

const formatRelativeDate = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffHours = Math.floor(diffMs / 3_600_000);
  if (diffHours < 1) return 'à l\u2019instant';
  if (diffHours < 24) return `il y a ${diffHours}h`;
  return `il y a ${Math.floor(diffHours / 24)}j`;
};

export default function ProviderDashboardHome() {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<ProviderDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardService.getProviderDashboard().then(setData).finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-4">
        <div className="skeleton h-8 w-64 rounded-md" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-28 w-full rounded-lg" />)}
        </div>
      </div>
    );
  }

  const { stats, recentContactRequests } = data;

  const statCards = [
    { label: 'Services publiés', value: stats.serviceCount, icon: Briefcase },
    { label: 'Note moyenne', value: stats.totalReviews > 0 ? stats.avgRating.toFixed(1) : '—', icon: Star },
    { label: 'Demandes reçues', value: stats.contactRequestsTotal, icon: MessageSquare },
    { label: 'Nouvelles (7 jours)', value: stats.contactRequestsLast7Days, icon: TrendingUp },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-bold text-primary lg:text-2xl">
            Bonjour, {user && getFullName(user).split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-secondary">Voici un aperçu de votre activité sur MboaPro.</p>
        </div>
        <Link to="/prestataire/prestations/nouveau">
          <span className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-600">
            <Plus size={16} /> Nouvelle prestation
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-subtle bg-surface p-5">
            <div className="mb-2 inline-flex rounded-md bg-accent-50 p-2 text-accent-600">
              <Icon size={18} />
            </div>
            <p className="font-heading text-2xl font-bold text-primary">{value}</p>
            <p className="text-sm text-secondary">{label}</p>
          </div>
        ))}
      </div>

      {stats.totalReviews === 0 && (
        <p className="mt-3 text-xs text-muted">
          Votre note moyenne s'affichera dès que vous aurez reçu vos premiers avis clients.
        </p>
      )}

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-primary">Demandes récentes</h2>
          <Link to="/prestataire/commandes" className="text-sm font-semibold text-primary-500 hover:underline">
            Voir tout →
          </Link>
        </div>

        {stats.serviceCount === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-subtle py-12 text-center">
            <p className="font-medium text-primary">Publiez votre premier service pour commencer à recevoir des demandes</p>
            <Link to="/prestataire/prestations/nouveau" className="text-sm font-semibold text-primary-500 hover:underline">
              Publier un service
            </Link>
          </div>
        ) : recentContactRequests.length === 0 ? (
          <p className="rounded-lg border border-subtle bg-surface p-6 text-center text-sm text-secondary">
            Aucune demande de contact pour l'instant.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {recentContactRequests.map((req) => (
              <div key={req.id} className="flex items-center gap-4 rounded-lg border border-subtle bg-surface p-4">
                <Avatar src={req.personAvatarUrl ?? undefined} name={req.personName} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-primary">
                    {req.personName} · <span className="text-secondary">{req.serviceTitle}</span>
                  </p>
                  {req.message && <p className="truncate text-xs text-muted">{req.message}</p>}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <ContactRequestStatusBadge status={req.status} />
                  <span className="text-[11px] text-muted">{formatRelativeDate(req.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}