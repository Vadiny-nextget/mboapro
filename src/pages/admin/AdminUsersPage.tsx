import { useEffect, useState } from 'react';
import { Search, ShieldPlus, Ban, CheckCircle2 } from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { adminService } from '../../services/adminService';
import { getFullName } from '../../utils/user';
import { useAuthStore } from '../../store/useAuthStore';
import type { AuthUser, UserRole } from '../../types/auth.types';

type PendingAction = { type: 'promote' | 'suspend' | 'reactivate'; user: AuthUser } | null;

export default function AdminUsersPage() {
  const currentUser = useAuthStore((s) => s.user);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    setIsLoading(true);
    adminService
      .getUsers({ role: roleFilter || undefined, search: debouncedSearch || undefined })
      .then((result) => {
        setUsers(result.items);
        setTotal(result.pagination.total);
      })
      .finally(() => setIsLoading(false));
  }, [roleFilter, debouncedSearch]);

  const handleConfirm = async () => {
    if (!pendingAction) return;
    const { type, user } = pendingAction;

    if (type === 'promote') {
      await adminService.promoteToAdmin(user.id);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: 'admin' } : u)));
    } else {
      const newStatus = type === 'suspend' ? 'suspended' : 'active';
      await adminService.updateUserStatus(user.id, newStatus);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
    }
    setPendingAction(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-xl font-bold text-primary">Utilisateurs</h1>
        <p className="mt-1 text-sm text-secondary">{total} compte{total > 1 ? 's' : ''}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email, téléphone..."
            className="w-full rounded-md border border-subtle bg-surface py-2.5 pl-9 pr-3 text-sm text-primary outline-none focus:border-primary-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | '')}
          className="rounded-md border border-subtle bg-surface px-3 py-2.5 text-sm text-primary outline-none focus:border-primary-500"
        >
          <option value="">Tous les rôles</option>
          <option value="client">Clients</option>
          <option value="prestataire">Prestataires</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-16 w-full rounded-lg" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-3 rounded-lg border border-subtle bg-surface p-3">
              <Avatar src={user.avatarUrl ?? undefined} name={getFullName(user)} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-primary">{getFullName(user)}</p>
                <p className="truncate text-xs text-muted">{user.email || user.phone}</p>
              </div>

              <Badge variant={user.role === 'admin' ? 'primary' : user.role === 'prestataire' ? 'accent' : 'neutral'}>
                {user.role}
              </Badge>
              {user.status === 'suspended' && <Badge variant="danger">Suspendu</Badge>}

              <div className="flex shrink-0 gap-1">
                {user.role === 'client' && (
                  <button
                    onClick={() => setPendingAction({ type: 'promote', user })}
                    className="rounded-md p-2 text-primary-500 hover:bg-primary-50"
                    aria-label="Promouvoir admin"
                    title="Promouvoir en administrateur"
                  >
                    <ShieldPlus size={16} />
                  </button>
                )}
                {user.id !== currentUser?.id && (
                  user.status === 'suspended' ? (
                    <button
                      onClick={() => setPendingAction({ type: 'reactivate', user })}
                      className="rounded-md p-2 text-success hover:bg-success/10"
                      aria-label="Réactiver"
                      title="Réactiver le compte"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setPendingAction({ type: 'suspend', user })}
                      className="rounded-md p-2 text-danger hover:bg-danger/10"
                      aria-label="Suspendre"
                      title="Suspendre le compte"
                    >
                      <Ban size={16} />
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingAction && (
        <ConfirmDialog
          title={
            pendingAction.type === 'promote'
              ? 'Promouvoir en administrateur ?'
              : pendingAction.type === 'suspend'
              ? 'Suspendre ce compte ?'
              : 'Réactiver ce compte ?'
          }
          description={
            pendingAction.type === 'promote'
              ? `${getFullName(pendingAction.user)} aura un accès complet à l'administration de la plateforme.`
              : pendingAction.type === 'suspend'
              ? `${getFullName(pendingAction.user)} ne pourra plus se connecter jusqu'à réactivation.`
              : `${getFullName(pendingAction.user)} pourra à nouveau se connecter normalement.`
          }
          confirmLabel={pendingAction.type === 'promote' ? 'Promouvoir' : pendingAction.type === 'suspend' ? 'Suspendre' : 'Réactiver'}
          isDangerous={pendingAction.type === 'suspend'}
          onConfirm={handleConfirm}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </div>
  );
}