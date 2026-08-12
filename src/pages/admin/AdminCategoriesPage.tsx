import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import CategoryFormModal from '../../components/admin/CategoryFormModal';
import { adminService } from '../../services/adminService';
import { ApiError } from '../../types/api.types';
import type { Category } from '../../types/catalog.types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    adminService.getAllCategories().then(setCategories).finally(() => setIsLoading(false));
  }, []);

  const handleSaved = (saved: Category) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === saved.id);
      return exists ? prev.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...prev];
    });
    setShowCreateModal(false);
    setEditingCategory(null);
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    setDeleteError('');
    try {
      await adminService.deleteCategory(pendingDeleteId);
      setCategories((prev) => prev.filter((c) => c.id !== pendingDeleteId));
      setPendingDeleteId(null);
    } catch (err) {
      // Le backend refuse la suppression si des services y sont rattachés (409)
      setDeleteError((err as ApiError).message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-primary">Catégories</h1>
          <p className="mt-1 text-sm text-secondary">{categories.length} catégorie{categories.length > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-600"
        >
          <Plus size={16} /> Nouvelle catégorie
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-24 w-full rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-3 rounded-lg border border-subtle bg-surface p-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-surface-alt">
                {cat.imageUrl && <img src={cat.imageUrl} alt={cat.title} className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-primary">{cat.title}</p>
                  {!cat.isActive && <Badge variant="neutral">Inactive</Badge>}
                </div>
                <p className="truncate text-xs text-muted">{cat.description || 'Aucune description'}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => setEditingCategory(cat)} className="rounded-md p-2 text-secondary hover:bg-surface-alt" aria-label="Modifier">
                  <Pencil size={16} />
                </button>
                <button onClick={() => setPendingDeleteId(cat.id)} className="rounded-md p-2 text-danger hover:bg-danger/10" aria-label="Supprimer">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showCreateModal || editingCategory) && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => {
            setShowCreateModal(false);
            setEditingCategory(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {pendingDeleteId && (
        <ConfirmDialog
          title="Supprimer cette catégorie ?"
          description={deleteError || 'Impossible si des services y sont rattachés. Cette action est irréversible.'}
          confirmLabel="Supprimer"
          isDangerous
          onConfirm={handleDelete}
          onCancel={() => {
            setPendingDeleteId(null);
            setDeleteError('');
          }}
        />
      )}
    </div>
  );
}