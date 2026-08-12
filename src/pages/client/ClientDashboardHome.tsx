
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Search } from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import ContactRequestStatusBadge from '../../components/ui/ContactRequestStatusBadge';
import { dashboardService } from '../../services/dashboardService';
import { useAuthStore } from '../../store/useAuthStore';
import { getFullName } from '../../utils/user';
import type { ClientDashboardData } from '../../types/dashboard.types';

const formatRelativeDate = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffHours = Math.floor(diffMs / 3_600_000);
  if (diffHours < 1) return 'à l\u2019instant';
  if (diffHours < 24) return `il y a ${diffHours}h`;
  return `il y a ${Math.floor(diffHours / 24)}j`;
};

export default function ClientDashboardHome() {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<ClientDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardService.getClientDashboard().then(setData).finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-4">
        <div className="skeleton h-8 w-64 rounded-md" />
        <div className="skeleton h-28 w-full max-w-xs rounded-lg" />
      </div>
    );
  }

  const { stats, recentContactRequests } = data;

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-bold text-primary lg:text-2xl">
            Bonjour, {user && getFullName(user).split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-secondary">Retrouvez ici vos échanges avec les prestataires.</p>
        </div>
        <Link to="/services">
          <span className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-600">
            <Search size={16} /> Explorer les services
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:max-w-xs">
        <div className="rounded-lg border border-subtle bg-surface p-5">
          <div className="mb-2 inline-flex rounded-md bg-primary-50 p-2 text-primary-500">
            <MessageSquare size={18} />
          </div>
          <p className="font-heading text-2xl font-bold text-primary">{stats.contactRequestsSent}</p>
          <p className="text-sm text-secondary">Demandes envoyées</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-primary">Contacts récents</h2>
          {recentContactRequests.length > 0 && (
            <Link to="/client/messages" className="text-sm font-semibold text-primary-500 hover:underline">
              Voir tout →
            </Link>
          )}
        </div>

        {recentContactRequests.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-subtle py-12 text-center">
            <p className="font-medium text-primary">Vous n'avez contacté aucun prestataire pour l'instant</p>
            <Link to="/services" className="text-sm font-semibold text-primary-500 hover:underline">
              Découvrir les services
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentContactRequests.map((req) => (
              <Link
                key={req.id}
                to={`/services/${req.serviceSlug}`}
                className="flex items-center gap-4 rounded-lg border border-subtle bg-surface p-4 transition-colors hover:bg-surface-alt"
              >
                <Avatar src={req.personAvatarUrl ?? undefined} name={req.personName} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-primary">{req.personName}</p>
                  <p className="truncate text-xs text-muted">{req.serviceTitle}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <ContactRequestStatusBadge status={req.status} />
                  <span className="text-[11px] text-muted">{formatRelativeDate(req.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}