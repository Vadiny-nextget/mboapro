import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import clsx from "clsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { catalogService } from "../../services/catalogService";
import { useAuthStore } from "../../store/useAuthStore";
import type { Service, ServiceAvailability } from "../../types/catalog.types";
import { formatFCFA } from "../../lib/text.func";

const AVAILABILITY_OPTIONS: { value: ServiceAvailability; label: string }[] = [
  { value: "available", label: "Disponible" },
  { value: "busy", label: "Occupé" },
  { value: "paused", label: "En pause" },
];

export default function MyServicesPage() {
  const user = useAuthStore((s) => s.user);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    catalogService
      .getServicesByProvider(user.id)
      .then(setServices)
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  const handleAvailabilityChange = async (
    serviceId: string,
    availability: ServiceAvailability,
  ) => {
    setUpdatingId(serviceId);
    try {
      await catalogService.toggleAvailability(serviceId, availability);
      setServices((prev) =>
        prev.map((s) => (s.id === serviceId ? { ...s, availability } : s)),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    await catalogService.deleteService(pendingDeleteId);
    setServices((prev) => prev.filter((s) => s.id !== pendingDeleteId));
    setPendingDeleteId(null);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-primary">
            Mes prestations
          </h1>
          <p className="mt-1 text-sm text-secondary">
            {services.length} service{services.length > 1 ? "s" : ""} publié
            {services.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/prestataire/prestations/nouveau"
          className="h-10 flex items-center justify-center px-4 text-sm gap-2 rounded-md bg-primary-500 text-on-primary hover:opacity-80 active:bg-primary-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-500 font-semibold transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          Nouvelle prestation
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-subtle py-16 text-center">
          <p className="font-medium text-primary">
            Vous n'avez pas encore publié de service
          </p>
          <Link
            to="/prestataire/prestations/nouveau"
            className="h-10 flex items-center justify-center px-4 text-sm gap-2 rounded-md bg-primary-500 text-on-primary hover:opacity-80 active:bg-primary-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-500 font-semibold transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            Publier mon premier service
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col gap-4 rounded-lg border border-subtle bg-surface p-4 sm:flex-row sm:items-center"
            >
              <div className="h-20 w-28 shrink-0 overflow-hidden rounded-md bg-surface-alt">
                {service.images[0] && (
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-primary">
                  {service.title}
                </p>
                <p className="text-sm text-muted">
                  {service.category.title} · {service.city}
                </p>
                <p className="mt-1 text-sm font-semibold text-primary-500">
                  {formatFCFA(service.price)}
                </p>
              </div>

              {service.isPendingCategory && (
  <span className="rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
    Catégorie en cours de validation
  </span>
)}

              <div className="flex flex-wrap items-center gap-2">
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    disabled={updatingId === service.id}
                    onClick={() =>
                      handleAvailabilityChange(service.id, opt.value)
                    }
                    className={clsx(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      service.availability === opt.value
                        ? "border-primary-500 bg-primary-500 text-on-primary"
                        : "border-subtle text-secondary hover:border-primary-300",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/services/${service.slug}`}
                  target="_blank"
                  className="rounded-md p-2 text-secondary hover:bg-surface-alt"
                  aria-label="Voir"
                >
                  <Eye size={17} />
                </Link>
                <Link
                  to={`/prestataire/prestations/${service.slug}/modifier`}
                  className="rounded-md p-2 text-secondary hover:bg-surface-alt"
                  aria-label="Modifier"
                >
                  <Pencil size={17} />
                </Link>
                <button
                  onClick={() => setPendingDeleteId(service.id)}
                  className="rounded-md p-2 text-danger hover:bg-danger/10"
                  aria-label="Supprimer"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingDeleteId && (
        <ConfirmDialog
          title="Supprimer ce service ?"
          description="Cette action est irréversible. Le service sera immédiatement retiré du catalogue public."
          confirmLabel="Supprimer"
          isDangerous
          onConfirm={handleDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
}
