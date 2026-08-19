import { X } from 'lucide-react';
import Avatar from './Avatar';
import OrderStatusBadge from './OrderStatusBadge';
import type { Order } from '../../types/order.types';
import { formatFCFA } from '../../lib/text.func';

const formatDate = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso)) : '—';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  /** Si fourni, affiche l'avatar/nom du prestataire plutôt que du client (vue côté client). */
  viewAsClient?: boolean;
}

export default function OrderDetailModal({ order, onClose, viewAsClient = false }: OrderDetailModalProps) {
  const personName = viewAsClient ? order.providerName : order.clientName;
  const personAvatar = viewAsClient ? order.providerAvatarUrl : order.clientAvatarUrl;

  return (
    <div className="fixed inset-0 z-1300 flex items-center justify-center bg-gray-950/50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="animate-scale-in w-full max-w-md rounded-lg bg-surface p-6 shadow-lg">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="font-heading text-lg font-bold text-primary">Détails de la commande</h2>
          <button onClick={onClose} aria-label="Fermer" className="text-muted hover:text-primary"><X size={20} /></button>
        </div>

        <div className="flex items-center gap-3">
          <Avatar src={personAvatar ?? undefined} name={personName} size="md" />
          <div>
            <p className="font-medium text-primary">{personName}</p>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        <hr className="my-4 border-subtle" />

        <dl className="flex flex-col gap-2.5 text-sm">
          <div className="flex justify-between"><dt className="text-secondary">Service</dt><dd className="font-medium text-primary">{order.serviceTitle}</dd></div>
          <div className="flex justify-between"><dt className="text-secondary">Prix convenu</dt><dd className="font-medium text-primary">{formatFCFA(order.agreedPrice)}</dd></div>
          <div className="flex justify-between"><dt className="text-secondary">Créée le</dt><dd className="text-primary">{formatDate(order.createdAt)}</dd></div>
          {order.completedAt && (
            <div className="flex justify-between"><dt className="text-secondary">Terminée le</dt><dd className="text-primary">{formatDate(order.completedAt)}</dd></div>
          )}
          {order.notes && (
            <div>
              <dt className="mb-1 text-secondary">Notes</dt>
              <dd className="rounded-md bg-surface-alt p-2.5 text-primary">{order.notes}</dd>
            </div>
          )}
          {order.cancellationReason && (
            <div>
              <dt className="mb-1 text-danger">Motif d'annulation</dt>
              <dd className="rounded-md bg-danger/10 p-2.5 text-danger">{order.cancellationReason}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}