import { Users, ShieldCheck, CreditCard, Gavel } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

const statCards = [
  { label: 'Utilisateurs totaux', value: '3 214', icon: Users, variant: 'primary' as const },
  { label: 'Prestataires vérifiés', value: '842', icon: ShieldCheck, variant: 'success' as const },
  { label: 'Volume paiements (mois)', value: '4,2M FCFA', icon: CreditCard, variant: 'accent' as const },
  { label: 'Litiges ouverts', value: 3, icon: Gavel, variant: 'danger' as const },
];

const pendingVerifications = [
  { name: 'Ahmadou Bello', profession: 'Électricien', city: 'Douala' },
  { name: 'Christelle Nomo', profession: 'Coach', city: 'Yaoundé' },
];

export default function AdminDashboardHome() {
  return (
    <div className="animate-fade-in-up">
      <h1 className="mb-6 font-heading text-xl font-bold text-primary lg:text-2xl">
        Vue d'ensemble
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, variant }) => (
          <div key={label} className="rounded-lg border border-subtle bg-surface p-5">
            <div
              className={`mb-2 inline-flex rounded-md p-2 ${
                variant === 'primary'
                  ? 'bg-primary-50 text-primary-500'
                  : variant === 'success'
                  ? 'bg-success/10 text-success'
                  : variant === 'accent'
                  ? 'bg-accent-50 text-accent-600'
                  : 'bg-danger/10 text-danger'
              }`}
            >
              <Icon size={18} />
            </div>
            <p className="font-heading text-2xl font-bold text-primary">{value}</p>
            <p className="text-sm text-secondary">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-heading text-lg font-bold text-primary">
          Vérifications en attente
        </h2>
        <div className="flex flex-col gap-3">
          {pendingVerifications.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between rounded-lg border border-subtle bg-surface p-4"
            >
              <div>
                <p className="font-medium text-primary">{p.name}</p>
                <p className="text-sm text-secondary">{p.profession} · {p.city}</p>
              </div>
              <Badge variant="warning">En attente</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}