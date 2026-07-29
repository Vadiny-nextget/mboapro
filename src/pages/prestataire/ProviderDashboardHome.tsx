import { Wallet, Star, Briefcase, TrendingUp } from 'lucide-react';
import ReputationStars from '../../components/ui/ReputationStars';
import { Badge } from '../../components/ui/Badge';
import { useAuthStore } from '../../store/useAuthStore';

const statCards = [
  { label: 'Revenus ce mois', value: '145 000 FCFA', icon: Wallet },
  { label: 'Commandes actives', value: 4, icon: Briefcase },
  { label: 'Note moyenne', value: '4.8 / 5', icon: Star },
];

const recentOrders = [
  { client: 'Josiane Kamdem', service: 'Dépannage plomberie', amount: '5 000 FCFA', status: 'Nouvelle' as const },
  { client: 'Robert Essomba', service: 'Installation chauffe-eau', amount: '18 000 FCFA', status: 'En cours' as const },
];

export default function ProviderDashboardHome() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h1 className="font-heading text-xl font-bold text-primary lg:text-2xl">
          Bonjour, {user?.fullName?.split(' ')[0]} 👋
        </h1>
        <div className="mt-1 flex items-center gap-2">
          <ReputationStars rating={4.8} reviewCount={214} size={14} />
          <span className="flex items-center gap-1 text-sm text-success">
            <TrendingUp size={14} /> +12% ce mois
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-subtle bg-surface p-5">
            <div className="mb-2 inline-flex rounded-md bg-accent-50 p-2 text-accent-600">
              <Icon size={18} />
            </div>
            <p className="font-heading text-2xl font-bold text-primary">{value}</p>
            <p className="text-sm text-secondary">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-heading text-lg font-bold text-primary">Commandes récentes</h2>
        <div className="flex flex-col gap-3">
          {recentOrders.map((order) => (
            <div
              key={order.client}
              className="flex items-center justify-between rounded-lg border border-subtle bg-surface p-4"
            >
              <div>
                <p className="font-medium text-primary">{order.service}</p>
                <p className="text-sm text-secondary">{order.client} · {order.amount}</p>
              </div>
              <Badge variant={order.status === 'Nouvelle' ? 'accent' : 'primary'}>
                {order.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}