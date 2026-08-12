
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShieldCheck, Briefcase, Tags, Clock } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { adminService } from '../../services/adminService';
import type { AdminDashboardStats } from '../../types/admin.types';

export default function AdminDashboardHome() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard().then(setStats).finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-28 w-full rounded-lg" />)}
      </div>
    );
  }

  const statCards = [
    { label: 'Utilisateurs totaux', value: stats.totalUsers, icon: Users, variant: 'primary' as const },
    { label: 'Prestataires vérifiés', value: stats.providersByVerificationStatus.verified, icon: ShieldCheck, variant: 'success' as const },
    { label: 'Services publiés', value: stats.totalServices, icon: Briefcase, variant: 'accent' as const },
    { label: 'Catégories', value: stats.totalCategories, icon: Tags, variant: 'primary' as const },
  ];

  return (
    <div className="animate-fade-in-up">
      <h1 className="mb-6 font-heading text-xl font-bold text-primary lg:text-2xl">Vue d'ensemble</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, variant }) => (
          <div key={label} className="rounded-lg border border-subtle bg-surface p-5">
            <div className={`mb-2 inline-flex rounded-md p-2 ${variant === 'primary' ? 'bg-primary-50 text-primary-500' : variant === 'success' ? 'bg-success/10 text-success' : 'bg-accent-50 text-accent-600'}`}>
              <Icon size={18} />
            </div>
            <p className="font-heading text-2xl font-bold text-primary">{value}</p>
            <p className="text-sm text-secondary">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-subtle bg-surface p-5">
          <p className="text-sm text-secondary">Clients</p>
          <p className="font-heading text-xl font-bold text-primary">{stats.usersByRole.client}</p>
        </div>
        <div className="rounded-lg border border-subtle bg-surface p-5">
          <p className="text-sm text-secondary">Prestataires</p>
          <p className="font-heading text-xl font-bold text-primary">{stats.usersByRole.prestataire}</p>
        </div>
        <div className="rounded-lg border border-subtle bg-surface p-5">
          <p className="text-sm text-secondary">Admins</p>
          <p className="font-heading text-xl font-bold text-primary">{stats.usersByRole.admin}</p>
        </div>
      </div>

      {stats.providersByVerificationStatus.pending > 0 && (
        <Link
          to="/admin/prestataires"
          className="mt-6 flex items-center justify-between rounded-lg border border-accent-200 bg-accent-50 p-4 transition-colors hover:bg-accent-100"
        >
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-accent-600" />
            <p className="text-sm font-medium text-accent-700">
              {stats.providersByVerificationStatus.pending} prestataire{stats.providersByVerificationStatus.pending > 1 ? 's' : ''} en attente de vérification
            </p>
          </div>
          <Badge variant="accent">Voir</Badge>
        </Link>
      )}
    </div>
  );
}