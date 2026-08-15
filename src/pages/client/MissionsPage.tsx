import { Link } from 'react-router-dom';
import { Briefcase, MessageSquare } from 'lucide-react';

export default function MissionsPage() {
  return (
    <div>
      <h1 className="mb-1 font-heading text-xl font-bold text-primary">Mes missions</h1>
      <p className="mb-6 text-sm text-secondary">Suivi de vos réservations sur MboaPro.</p>

      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-subtle py-16 text-center">
        <div className="rounded-full bg-primary-50 p-4 text-primary-500">
          <Briefcase size={28} />
        </div>
        <p className="font-medium text-primary">Le suivi de missions arrive bientôt</p>
        <p className="max-w-sm text-sm text-secondary">
          En attendant, retrouvez les prestataires que vous avez déjà contactés dans vos messages.
        </p>
        <Link to="/client/messages" className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:underline">
          <MessageSquare size={14} /> Voir mes messages
        </Link>
      </div>
    </div>
  );
}