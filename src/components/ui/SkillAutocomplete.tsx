import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { catalogService } from '../../services/catalogService';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import type { Skill } from '../../types/catalog.types';

interface SkillAutocompleteProps {
  categoryId: string | null;
  selected: string[]; // noms des compétences déjà choisies
  onChange: (skills: string[]) => void;
  maxSkills?: number;
}

/**
 * Autocomplétion des compétences existantes en base — n'empêche pas de
 * saisir un nom inédit (l'API fait le dédoublonnage à la création du service).
 */
export default function SkillAutocomplete({ categoryId, selected, onChange, maxSkills = 5 }: SkillAutocompleteProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const [results, setResults] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!categoryId || debouncedQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    catalogService
      .searchSkills(categoryId, debouncedQuery)
      .then(setResults)
      .finally(() => setIsLoading(false));
  }, [categoryId, debouncedQuery]);

  const addSkill = (name: string) => {
    if (selected.length >= maxSkills || selected.includes(name)) return;
    onChange([...selected, name]);
    setQuery('');
    setIsOpen(false);
  };

  const removeSkill = (name: string) => onChange(selected.filter((s) => s !== name));

  const canAddCustom = query.trim().length >= 2 && !results.some((r) => r.name.toLowerCase() === query.trim().toLowerCase());

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {selected.map((name) => (
          <span
            key={name}
            className="flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-600"
          >
            {name}
            <button type="button" onClick={() => removeSkill(name)} aria-label={`Retirer ${name}`}>
              <X size={13} />
            </button>
          </span>
        ))}
      </div>

      {selected.length < maxSkills && (
        <div className="relative">
          <input
            type="text"
            value={query}
            disabled={!categoryId}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={categoryId ? 'Rechercher une compétence...' : 'Choisissez d\u2019abord une catégorie'}
            className="w-full rounded-md border border-subtle bg-surface px-3 py-2.5 text-sm text-primary outline-none focus:border-primary-500 disabled:opacity-50"
          />
          {isLoading && <Loader2 size={16} className="absolute right-3 top-3 animate-spin text-muted" />}

          {isOpen && query.trim().length >= 2 && (
            <div className="animate-fade-in absolute z-1000 mt-1 w-full rounded-md border border-subtle bg-surface p-1 shadow-lg">
              {results.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => addSkill(skill.name)}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-primary hover:bg-surface-alt"
                >
                  {skill.name}
                </button>
              ))}
              {canAddCustom && (
                <button
                  type="button"
                  onClick={() => addSkill(query.trim())}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-primary-500 hover:bg-surface-alt"
                >
                  + Ajouter "{query.trim()}"
                </button>
              )}
              {!isLoading && results.length === 0 && !canAddCustom && (
                <p className="px-3 py-2 text-sm text-muted">Aucun résultat.</p>
              )}
            </div>
          )}
        </div>
      )}
      <span className="text-xs text-muted">{selected.length}/{maxSkills} compétences</span>
    </div>
  );
}