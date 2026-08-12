import { useEffect, useState } from 'react';
import { MapPin, Briefcase, Check, X } from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import { adminService } from '../../services/adminService';
import type { PendingProvider } from '../../types/admin.types';

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<PendingProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    adminService.getPendingProviders().then(setProviders).finally(() => setIsLoading(false));
  }, []);

  const handleDecision = async (profileId: string, status: 'verified' | 'rejected') => {
    setProcessingId(profileId);
    try {
      await adminService.verifyProvider(profileId, status);
      setProviders((prev) => prev.filter((p) => p.id !== profileId));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      <h1 className="mb-1 font-heading text-xl font-bold text-primary">Vérification des prestataires</h1>
      <p className="mb-6 text-sm text-secondary">{providers.length} profil{providers.length > 1 ? 's' : ''} en attente de revue.</p>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-32 w-full rounded-lg" />)}
        </div>
      ) : providers.length === 0 ? (
        <p className="rounded-lg border border-dashed border-subtle p-10 text-center text-sm text-secondary">
          Aucun profil en attente de vérification pour l'instant.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {providers.map((provider) => (
            <div key={provider.id} className="flex flex-col gap-4 rounded-lg border border-subtle bg-surface p-5 sm:flex-row sm:items-start">
              <Avatar src={provider.avatarUrl ?? undefined} name={provider.fullName} size="lg" />

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-primary">{provider.fullName}</p>
                <div className="mt-1 flex flex-wrap gap-3 text-sm text-secondary">
                  {provider.city && (
                    <span className="flex items-center gap-1"><MapPin size={14} /> {provider.city}, {provider.region}</span>
                  )}
                  <span className="flex items-center gap-1"><Briefcase size={14} /> {provider.yearsExperience} ans d'XP</span>
                </div>
                {provider.description && <p className="mt-2 text-sm text-secondary">{provider.description}</p>}
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                  {provider.email && <span>{provider.email}</span>}
                  {provider.phone && <span>{provider.phone}</span>}
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  disabled={processingId === provider.id}
                  onClick={() => handleDecision(provider.id, 'rejected')}
                  className="flex items-center gap-1.5 rounded-md border border-subtle px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10 disabled:opacity-50"
                >
                  <X size={15} /> Rejeter
                </button>
                <button
                  disabled={processingId === provider.id}
                  onClick={() => handleDecision(provider.id, 'verified')}
                  className="flex items-center gap-1.5 rounded-md bg-success px-3 py-2 text-sm font-medium text-white hover:brightness-95 disabled:opacity-50"
                >
                  <Check size={15} /> Vérifier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}