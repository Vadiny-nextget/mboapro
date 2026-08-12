import { Badge } from './Badge';
import type { ServiceAvailability } from '../../types/catalog.types';

const config: Record<ServiceAvailability, { label: string; variant: 'success' | 'warning' | 'neutral' }> = {
  available: { label: 'Disponible', variant: 'success' },
  busy: { label: 'Occupé actuellement', variant: 'warning' },
  paused: { label: 'En pause', variant: 'neutral' },
};

export default function AvailabilityBadge({ availability }: { availability: ServiceAvailability }) {
  const { label, variant } = config[availability];
  return <Badge variant={variant}>{label}</Badge>;
}