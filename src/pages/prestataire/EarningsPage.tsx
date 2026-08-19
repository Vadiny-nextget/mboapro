import { CheckCircle2, Clock, TrendingUp, Wallet } from 'lucide-react';
import type { EarningsSummary } from '../../types/order.types';
import { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { formatFCFA } from '../../lib/text.func';

export default function EarningsPage() {
    const [data, setData] = useState<EarningsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderService.getEarnings().then(setData).finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !data) return <div className="skeleton h-64 w-full rounded-lg" />;

  const cards = [
    { label: 'Total gagné', value: formatFCFA(data.totalEarned), icon: Wallet },
    { label: 'Ce mois-ci', value: formatFCFA(data.thisMonthEarned), icon: TrendingUp },
    { label: 'Missions terminées', value: data.completedCount, icon: CheckCircle2 },
    { label: 'Missions en cours', value: data.activeCount, icon: Clock },
  ];

  return (
    <div>
      <h1 className="mb-1 font-heading text-xl font-bold text-primary">Revenus</h1>
      {/* <p className="mb-6 text-sm text-secondary">Suivi de vos paiements sur MboaPro.</p> */}
<p className="mb-6 text-sm text-secondary">
        Montants auto-déclarés à partir de vos commandes confirmées. Le règlement se fait directement entre vous et
        le client (Mobile Money, espèces) — MboaPro ne traite pas encore ces paiements.
      </p>
      {/* <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-subtle py-16 text-center">
        <div className="rounded-full bg-primary-50 p-4 text-primary-500">
          <Wallet size={28} />
        </div>
        <p className="font-medium text-primary">Le système de paiement arrive bientôt</p>
        <p className="max-w-sm text-sm text-secondary">
          Une fois activé, vous pourrez suivre ici vos revenus par mission, vos retraits et l'historique complet de
          vos transactions sur la plateforme.
        </p>
      </div> */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-subtle bg-surface p-5">
            <div className="mb-2 inline-flex rounded-md bg-primary-50 p-2 text-primary-500"><Icon size={18} /></div>
            <p className="font-heading text-xl font-bold text-primary">{value}</p>
            <p className="text-sm text-secondary">{label}</p>
          </div>
        ))}
      </div>

      {data.recentCompletedOrders.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 font-heading text-lg font-bold text-primary">Dernières missions terminées</h2>
          <div className="flex flex-col gap-2">
            {data.recentCompletedOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-lg border border-subtle bg-surface p-3">
                <p className="text-sm text-primary">{o.serviceTitle} · {o.clientName}</p>
                <p className="text-sm font-semibold text-primary-500">{formatFCFA(o.agreedPrice)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}