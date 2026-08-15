import { Wallet } from 'lucide-react';

export default function EarningsPage() {
  return (
    <div>
      <h1 className="mb-1 font-heading text-xl font-bold text-primary">Revenus</h1>
      <p className="mb-6 text-sm text-secondary">Suivi de vos paiements sur MboaPro.</p>

      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-subtle py-16 text-center">
        <div className="rounded-full bg-primary-50 p-4 text-primary-500">
          <Wallet size={28} />
        </div>
        <p className="font-medium text-primary">Le système de paiement arrive bientôt</p>
        <p className="max-w-sm text-sm text-secondary">
          Une fois activé, vous pourrez suivre ici vos revenus par mission, vos retraits et l'historique complet de
          vos transactions sur la plateforme.
        </p>
      </div>
    </div>
  );
}