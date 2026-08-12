import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../components/ui/Avatar';
import ContactRequestStatusBadge from '../../components/ui/ContactRequestStatusBadge';
import { dashboardService } from '../../services/dashboardService';
import type { ContactRequestSummary } from '../../types/dashboard.types';

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

export default function MyContactRequestsPage() {
  const [requests, setRequests] = useState<ContactRequestSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardService.getClientContactRequests().then(setRequests).finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-1 font-heading text-xl font-bold text-primary">Mes demandes</h1>
      <p className="mb-6 text-sm text-secondary">L'historique des prestataires que vous avez contactés.</p>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-20 w-full rounded-lg" />)}
        </div>
      ) : requests.length === 0 ? (
        <p className="rounded-lg border border-dashed border-subtle p-10 text-center text-sm text-secondary">
          Vous n'avez contacté aucun prestataire pour l'instant.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((req) => (
            <Link
              key={req.id}
              to={`/services/${req.serviceSlug}`}
              className="flex flex-col gap-3 rounded-lg border border-subtle bg-surface p-4 transition-colors hover:bg-surface-alt sm:flex-row sm:items-center"
            >
              <Avatar src={req.personAvatarUrl ?? undefined} name={req.personName} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-primary">{req.personName}</p>
                  <ContactRequestStatusBadge status={req.status} />
                </div>
                <p className="text-sm text-secondary">{req.serviceTitle}</p>
              </div>
              <span className="shrink-0 text-xs text-muted">{formatDate(req.createdAt)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}