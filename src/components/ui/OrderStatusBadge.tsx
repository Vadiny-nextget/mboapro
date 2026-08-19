import { Badge } from './Badge';
import type { OrderStatus } from '../../types/order.types';

const config: Record<OrderStatus, { label: string; variant: 'primary' | 'success' | 'danger' | 'accent' }> = {
  confirmed: { label: 'Confirmée', variant: 'primary' },
  in_progress: { label: 'En cours', variant: 'accent' },
  completed: { label: 'Terminée', variant: 'success' },
  cancelled: { label: 'Annulée', variant: 'danger' },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}