
import { useEffect, useState } from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';
import { catalogService } from '../../services/catalogService';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import type { CategoryMatch } from '../../types/catalog.types';

interface CategorySuggestionFlowProps {
  title: string;
  description: string;
  justification: string;
  onChange: (fields: { title: string; description: string; justification: string }) => void;
}

/**
 * Sous-formulaire affiché quand le prestataire clique "Ma catégorie n'existe pas".
 * Fait remonter des correspondances proches (typos/variantes) AVANT de laisser
 * soumettre — réduit les doublons évidents sans prétendre détecter les vrais synonymes.
 */
export default function CategorySuggestionFlow({ title, description, justification, onChange }: CategorySuggestionFlowProps) {
  const [matches, setMatches] = useState<CategoryMatch[]>([]);
  const debouncedTitle = useDebouncedValue(title, 400);

  useEffect(() => {
    if (debouncedTitle.trim().length < 2) {
      setMatches([]);
      return;
    }

    let isCancelled = false; // évite d'écraser l'état avec une réponse obsolète (race condition sur frappe rapide)

    catalogService.checkCategoryMatch(debouncedTitle).then((result) => {
      if (!isCancelled) setMatches(result);
    });

    return () => {
      isCancelled = true;
    };
  }, [debouncedTitle]);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-accent-200 bg-accent-50 p-4">
      <div className="flex items-start gap-2">
        <Sparkles size={16} className="mt-0.5 shrink-0 text-accent-600" />
        <p className="text-sm text-accent-700">
          Votre service sera enregistré en brouillon et publié automatiquement dès que notre équipe aura validé
          cette nouvelle catégorie (généralement sous 24-48h).
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-primary">Nom de la catégorie souhaitée</label>
        <input
          value={title}
          onChange={(e) => onChange({ title: e.target.value, description, justification })}
          placeholder="Ex: Réparation électroménager"
          className="rounded-md border border-subtle bg-surface px-3 py-2.5 text-sm text-primary outline-none focus:border-primary-500"
        />
      </div>

      {matches.length > 0 && (
        <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-surface p-3">
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-warning" />
          <div className="text-sm text-secondary">
            Catégories proches déjà existantes — vérifiez qu'aucune ne correspond avant de continuer :
            <ul className="mt-1 list-disc pl-4">
              {matches.map((m) => (
                <li key={m.slug} className="font-medium text-primary">{m.title}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-primary">Pourquoi cette catégorie manque-t-elle ? (optionnel)</label>
        <textarea
          rows={2}
          value={justification}
          onChange={(e) => onChange({ title, description, justification: e.target.value })}
          placeholder="Aide l'équipe à comprendre votre besoin..."
          className="rounded-md border border-subtle bg-surface p-3 text-sm text-primary outline-none focus:border-primary-500"
        />
      </div>
    </div>
  );
}