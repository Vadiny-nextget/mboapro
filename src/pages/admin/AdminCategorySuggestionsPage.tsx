import { useEffect, useState } from 'react';
import { Check, X, GitMerge } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { catalogService } from '../../services/catalogService';
import type { Category } from '../../types/catalog.types';
import type { PendingCategorySuggestionAdmin } from '../../types/admin.types';

export default function AdminCategorySuggestionsPage() {
  const [suggestions, setSuggestions] = useState<PendingCategorySuggestionAdmin[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [mergingId, setMergingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([adminService.getPendingCategorySuggestions(), catalogService.getCategories()])
      .then(([s, c]) => {
        setSuggestions(s);
        setCategories(c);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await adminService.approveCategorySuggestion(id);
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setProcessingId(null);
    }
  };

  const handleMerge = async (id: string, categoryId: string) => {
    setProcessingId(id);
    try {
      await adminService.mergeCategorySuggestion(id, categoryId);
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setProcessingId(null);
      setMergingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await adminService.rejectCategorySuggestion(id);
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      <h1 className="mb-1 font-heading text-xl font-bold text-primary">Suggestions de catégories</h1>
      <p className="mb-6 text-sm text-secondary">{suggestions.length} proposition{suggestions.length > 1 ? 's' : ''} de prestataires en attente.</p>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-32 w-full rounded-lg" />)}
        </div>
      ) : suggestions.length === 0 ? (
        <p className="rounded-lg border border-dashed border-subtle p-10 text-center text-sm text-secondary">
          Aucune suggestion en attente.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {suggestions.map((s) => (
            <div key={s.id} className="rounded-lg border border-subtle bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-lg font-bold text-primary">{s.proposedTitle}</p>
                  <p className="text-xs text-muted">
                    Proposé par {s.providerName} · {s.waitingServicesCount} service{s.waitingServicesCount > 1 ? 's' : ''} en attente
                  </p>
                </div>
              </div>

              {s.proposedDescription && <p className="mt-2 text-sm text-secondary">{s.proposedDescription}</p>}
              {s.justification && (
                <p className="mt-1 text-sm italic text-muted">"{s.justification}"</p>
              )}

              {mergingId === s.id ? (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <select
                    onChange={(e) => e.target.value && handleMerge(s.id, e.target.value)}
                    defaultValue=""
                    className="rounded-md border border-subtle bg-surface px-3 py-2 text-sm text-primary outline-none"
                  >
                    <option value="" disabled>Choisir une catégorie existante...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                  <button onClick={() => setMergingId(null)} className="text-sm text-muted hover:underline">Annuler</button>
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    disabled={processingId === s.id}
                    onClick={() => handleApprove(s.id)}
                    className="flex items-center gap-1.5 rounded-md bg-success px-3 py-2 text-sm font-medium text-white hover:brightness-95 disabled:opacity-50"
                  >
                    <Check size={15} /> Créer cette catégorie
                  </button>
                  <button
                    disabled={processingId === s.id}
                    onClick={() => setMergingId(s.id)}
                    className="flex items-center gap-1.5 rounded-md border border-subtle px-3 py-2 text-sm font-medium text-primary hover:bg-surface-alt disabled:opacity-50"
                  >
                    <GitMerge size={15} /> Fusionner avec une existante
                  </button>
                  <button
                    disabled={processingId === s.id}
                    onClick={() => handleReject(s.id)}
                    className="flex items-center gap-1.5 rounded-md border border-subtle px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10 disabled:opacity-50"
                  >
                    <X size={15} /> Rejeter
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}