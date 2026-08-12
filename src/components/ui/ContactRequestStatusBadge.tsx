import { Badge } from './Badge';
import type { ContactRequestStatus } from '../../types/dashboard.types';

const config: Record<ContactRequestStatus, { label: string; variant: 'primary' | 'success' | 'neutral' }> = {
  pending: { label: 'En attente', variant: 'primary' },
  replied: { label: 'Répondu', variant: 'success' },
  closed: { label: 'Clôturé', variant: 'neutral' },
};

export default function ContactRequestStatusBadge({ status }: { status: ContactRequestStatus }) {
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}