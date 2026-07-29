import { Briefcase, MessageSquare, Heart, Plus } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/Input';

const statCards = [
  { label: 'Missions en cours', value: 2, icon: Briefcase },
  { label: 'Messages non lus', value: 5, icon: MessageSquare },
  { label: 'Prestataires favoris', value: 8, icon: Heart },
];

const recentMissions = [
  { title: 'Réparation fuite salle de bain', provider: 'Ekwalla Nguema', status: 'En cours' as const },
  { title: 'Installation prise électrique', provider: 'Paul Mbarga', status: 'Terminée' as const },
];

export default function ClientDashboardHome() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-bold text-primary lg:text-2xl">
            Bonjour, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-secondary">Voici un résumé de votre activité.</p>
        </div>
        <Button><Plus size={16} />Publier une mission</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-subtle bg-surface p-5">
            <div className="mb-2 inline-flex rounded-md bg-primary-50 p-2 text-primary-500">
              <Icon size={18} />
            </div>
            <p className="font-heading text-2xl font-bold text-primary">{value}</p>
            <p className="text-sm text-secondary">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-heading text-lg font-bold text-primary">Missions récentes</h2>
        <div className="flex flex-col gap-3">
          {recentMissions.map((mission) => (
            <div
              key={mission.title}
              className="flex items-center justify-between rounded-lg border border-subtle bg-surface p-4"
            >
              <div>
                <p className="font-medium text-primary">{mission.title}</p>
                <p className="text-sm text-secondary">avec {mission.provider}</p>
              </div>
              <Badge variant={mission.status === 'Terminée' ? 'success' : 'primary'}>
                {mission.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}