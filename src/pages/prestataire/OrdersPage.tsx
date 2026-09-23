import { useEffect, useState } from 'react';
import OrderStatusBadge from '../../components/ui/OrderStatusBadge';
import { orderService } from '../../services/orderService';
import type { Order, OrderStatus } from '../../types/order.types';
import { formatFCFA } from '../../lib/text.func';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import OrderDetailModal from '../../components/ui/OrderDetailModal';

// const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
//   confirmed: 'in_progress',
//   in_progress: 'completed',
// };

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    orderService.getProviderOrders().then(setOrders).finally(() => setIsLoading(false));
  }, []);

  // const advance = async (order: Order) => {
  //   const next = NEXT_STATUS[order.status];
  //   if (!next) return;
  //   await orderService.updateStatus(order.id, next);
  //   setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: next } : o)));
  // };

  const setStatus = async (order: Order, status: OrderStatus) => {
    setUpdatingId(order.id);
    try {
      await orderService.updateStatus(order.id, status);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmCancel = async () => {
    if (!cancellingId || !cancelReason.trim()) return;
    await orderService.updateStatus(cancellingId, 'cancelled', cancelReason.trim());
    setOrders((prev) => prev.map((o) => (o.id === cancellingId ? { ...o, status: 'cancelled', cancellationReason: cancelReason } : o)));
    setCancellingId(null);
    setCancelReason('');
  };

  return (
    <div>
      <h1 className="mb-1 font-heading text-xl font-bold text-primary">Mes commandes</h1>
      <p className="mb-6 text-sm text-secondary">Missions confirmées avec vos clients.</p>

      {isLoading ? (
        <div className="flex flex-col gap-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-20 w-full rounded-lg" />)}</div>
      ) : orders.length === 0 ? (
        <p className="rounded-lg border border-dashed border-subtle p-10 text-center text-sm text-secondary">
          Aucune commande pour l'instant. Convertissez une demande de contact aboutie depuis <Link to="/prestataire/demandes" className="font-semibold text-primary-500 hover:underline">Demandes reçues</Link>.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-col gap-2 rounded-lg border border-subtle bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-primary">{order.serviceTitle}</p>
                <p className="text-sm text-secondary">{order.clientName} · {formatFCFA(order.agreedPrice)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <OrderStatusBadge status={order.status} />

                <button onClick={() => setViewingOrder(order)} className="rounded-md border border-subtle p-1.5 text-secondary hover:bg-surface-alt" aria-label="Voir les détails">
                  <Eye size={15} />
                </button>

                {order.status === 'confirmed' && (
                  <>
                    <button
                      disabled={updatingId === order.id}
                      onClick={() => setStatus(order, 'in_progress')}
                      className="rounded-md border border-subtle px-3 py-1.5 text-xs font-semibold text-primary hover:bg-surface-alt disabled:opacity-50"
                    >
                      Démarrer
                    </button>
                    <button
                      disabled={updatingId === order.id}
                      onClick={() => setStatus(order, 'completed')}
                      className="rounded-md bg-success px-3 py-1.5 text-xs font-semibold text-white hover:brightness-95 disabled:opacity-50"
                    >
                      Marquer terminée
                    </button>
                  </>
                )}

                {order.status === 'in_progress' && (
                  <button
                    disabled={updatingId === order.id}
                    onClick={() => setStatus(order, 'completed')}
                    className="rounded-md bg-success px-3 py-1.5 text-xs font-semibold text-white hover:brightness-95 disabled:opacity-50"
                  >
                    Marquer terminée
                  </button>
                )}

                {(order.status === 'confirmed' || order.status === 'in_progress') && (
                  <button onClick={() => setCancellingId(order.id)} className="rounded-md border border-danger px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/10">
                    Annuler
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>
      )}

      {cancellingId && (
        <div className="fixed inset-0 z-1300 flex items-center justify-center bg-gray-950/50 p-4" onClick={() => setCancellingId(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-lg">
            <h2 className="mb-3 font-heading text-lg font-bold text-primary">Motif d'annulation</h2>
            <textarea rows={3} value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} className="w-full rounded-md border border-subtle bg-surface p-3 text-sm text-primary outline-none focus:border-primary-500" />
            <button onClick={confirmCancel} className="mt-3 w-full rounded-md bg-danger py-2.5 text-sm font-semibold text-white">Confirmer l'annulation</button>
          </div>
        </div>
      )}


      {viewingOrder && <OrderDetailModal order={viewingOrder} onClose={() => setViewingOrder(null)} />}
    </div>
  );
}