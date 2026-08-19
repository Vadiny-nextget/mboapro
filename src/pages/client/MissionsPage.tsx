import { Link } from "react-router-dom";
import { Briefcase, Eye, MessageSquare, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { Order } from "../../types/order.types";
import { orderService } from "../../services/orderService";
import OrderStatusBadge from "../../components/ui/OrderStatusBadge";
import ReviewFormModal from "../../components/ui/ReviewFormModal";
import { formatFCFA } from "../../lib/text.func";
import OrderDetailModal from "../../components/ui/OrderDetailModal";

export default function MissionsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  useEffect(() => {
    orderService
      .getClientOrders()
      .then(setOrders)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-1 font-heading text-xl font-bold text-primary">
        Mes missions
      </h1>
      <p className="mb-6 text-sm text-secondary">
        Suivi de vos réservations sur MboaPro.
      </p>

      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-subtle py-16 text-center">
        <div className="rounded-full bg-primary-50 p-4 text-primary-500">
          <Briefcase size={28} />
        </div>
        <p className="font-medium text-primary">
          Le suivi de missions arrive bientôt
        </p>
        <p className="max-w-sm text-sm text-secondary">
          En attendant, retrouvez les prestataires que vous avez déjà contactés
          dans vos messages.
        </p>
        <Link
          to="/client/messages"
          className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:underline"
        >
          <MessageSquare size={14} /> Voir mes messages
        </Link>
      </div>

      <h1 className="mb-1 font-heading text-xl font-bold text-primary">
        Mes missions
      </h1>
      <p className="mb-6 text-sm text-secondary">
        Suivi de vos commandes confirmées avec des prestataires.
      </p>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="rounded-lg border border-dashed border-subtle p-10 text-center text-sm text-secondary">
          Aucune mission confirmée pour l'instant. Contactez un prestataire pour
          démarrer.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-2 rounded-lg border border-subtle bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-primary">{order.serviceTitle}</p>
                <p className="text-sm text-secondary">
                  {order.providerName} · {formatFCFA(order.agreedPrice)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewingOrder(order)}
                  className="rounded-md border border-subtle p-1.5 text-secondary hover:bg-surface-alt"
                  aria-label="Voir les détails"
                >
                  <Eye size={15} />
                </button>
                <OrderStatusBadge status={order.status} />
                {order.status === "completed" && !order.hasReview && (
                  <button
                    onClick={() => setReviewingOrder(order)}
                    className="flex items-center gap-1 rounded-md bg-accent-500 px-3 py-1.5 text-xs font-semibold text-gray-900"
                  >
                    <Star size={13} /> Laisser un avis
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {reviewingOrder && (
        <ReviewFormModal
          orderId={reviewingOrder.id}
          serviceTitle={reviewingOrder.serviceTitle}
          onClose={() => setReviewingOrder(null)}
          onSubmitted={() => {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === reviewingOrder.id ? { ...o, hasReview: true } : o,
              ),
            );
            setReviewingOrder(null);
          }}
        />
      )}
      {viewingOrder && (
        <OrderDetailModal
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
          viewAsClient
        />
      )}
    </div>
  );
}
