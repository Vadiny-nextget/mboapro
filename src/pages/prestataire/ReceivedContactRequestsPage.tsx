import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../components/ui/Avatar";
import ContactRequestStatusBadge from "../../components/ui/ContactRequestStatusBadge";
import { dashboardService } from "../../services/dashboardService";
import type { ContactRequestSummary } from "../../types/dashboard.types";
import CreateOrderModal from "../../components/prestataire/CreateOrderModal";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

export default function ReceivedContactRequestsPage() {
  const [requests, setRequests] = useState<ContactRequestSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [convertingRequest, setConvertingRequest] =
    useState<ContactRequestSummary | null>(null);

  useEffect(() => {
    dashboardService
      .getProviderContactRequests()
      .then(setRequests)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-1 font-heading text-xl font-bold text-primary">
        Demandes reçues
      </h1>
      <p className="mb-6 text-sm text-secondary">
        Toutes les personnes vous ayant contacté au sujet de vos services.
      </p>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <p className="rounded-lg border border-dashed border-subtle p-10 text-center text-sm text-secondary">
          Aucune demande de contact pour l'instant.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex flex-col gap-3 rounded-lg border border-subtle bg-surface p-4 sm:flex-row sm:items-center"
            >
              <Avatar
                src={req.personAvatarUrl ?? undefined}
                name={req.personName}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-primary">{req.personName}</p>
                  <ContactRequestStatusBadge status={req.status} />
                </div>
                <Link
                  to={`/services/${req.serviceSlug}`}
                  className="text-sm text-primary-500 hover:underline"
                >
                  {req.serviceTitle}
                </Link>
                {req.message && (
                  <p className="mt-1 text-sm text-secondary">{req.message}</p>
                )}
              </div>
              <span className="shrink-0 text-xs text-muted">
                {formatDate(req.createdAt)}
              </span>
              <button
                onClick={() => setConvertingRequest(req)}
                className="text-sm font-semibold text-primary-500 hover:underline"
              >
                Convertir en commande
              </button>
              {req.status === 'pending' && (
  <button
    onClick={async () => {
      await dashboardService.updateContactRequestStatus(req.id, 'replied');
      setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, status: 'replied' } : r)));
    }}
    className="text-xs font-medium text-primary-500 hover:underline"
  >
    Marquer comme répondu
  </button>
)}
            </div>
          ))}
        </div>
      )}

      {convertingRequest && (
        <CreateOrderModal
          contactRequest={convertingRequest}
          serviceId={convertingRequest.serviceId}
          onClose={() => setConvertingRequest(null)}
          onCreated={() => setConvertingRequest(null)}
        />
      )}
    </div>
  );
}
