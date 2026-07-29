import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Sidebar from '../components/layout/Sidebar';
import DashboardHeader from '../components/layout/DashboardHeader';
import MobileBottomNav from '../components/layout/MobileBottomNav';

/**
 * Layout commun aux 3 espaces (client / prestataire / admin).
 * La navigation affichée dépend du rôle de l'utilisateur connecté.
 */
export default function DashboardLayout() {
  const user = useAuthStore((s) => s.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) return <Navigate to="/connexion" replace />;

  return (
    <div className="flex min-h-dvh bg-(--bg-page)">
      <Sidebar
        role={user.role}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col lg:pl-64">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 pb-20 lg:p-8 lg:pb-8">
          <Outlet />
        </main>

        <MobileBottomNav role={user.role} />
      </div>
    </div>
  );
}