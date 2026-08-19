import { useState } from 'react';
import { X } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { ApiError } from '../../types/api.types';
import type { Category } from '../../types/catalog.types';
import { Button } from '../ui/Input';

interface CategoryFormModalProps {
  category?: Category | null;
  onClose: () => void;
  onSaved: (category: Category) => void;
}

export default function CategoryFormModal({ category, onClose, onSaved }: CategoryFormModalProps) {
  const [title, setTitle] = useState(category?.title ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [icon, setIcon] = useState(category?.icon ?? '');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Le titre est requis.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', title.trim());
      fd.append('description', description);
      fd.append('icon', icon);
      if (image) fd.append('image', image);

      console.log("FormData :: ", fd)

      const saved = isEditing
        ? await adminService.updateCategory(category!.id, fd)
        : await adminService.createCategory(fd);

      onSaved(saved);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-1300 flex items-center justify-center bg-gray-950/50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="animate-scale-in w-full max-w-md rounded-lg bg-surface p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-primary">
            {isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </h2>
          <button onClick={onClose} aria-label="Fermer" className="text-muted hover:text-primary">
            <X size={20} />
          </button>
        </div>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm">Titre</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Plomberie"
              className="rounded-md border border-subtle bg-surface px-3 py-2.5 text-sm text-primary outline-none focus:border-primary-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-md border border-subtle bg-surface p-3 text-sm text-primary outline-none focus:border-primary-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm">Icône (nom lucide-react, optionnel)</label>
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Ex: Wrench"
              className="rounded-md border border-subtle bg-surface px-3 py-2.5 text-sm text-primary outline-none focus:border-primary-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm">Image {isEditing && '(laisser vide pour conserver l\u2019actuelle)'}</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="text-sm text-secondary"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" onClick={handleSubmit} loading={isSubmitting} backgroundColor="var(--color-primary-500)" className="justify-center text-white">
            {isEditing ? 'Enregistrer' : 'Créer la catégorie'}
          </Button>
        </form>
      </div>
    </div>
  );
}