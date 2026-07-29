import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '../types/auth.types';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

/** Bloque l'accès si le rôle de l'utilisateur ne correspond pas. */
export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/connexion" replace />;
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/non-autorise" replace />;
  }

  return <Outlet />;
}