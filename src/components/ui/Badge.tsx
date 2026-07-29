import type { ReactNode } from 'react';
import clsx from 'clsx';
import { BadgeCheck } from 'lucide-react';

type BadgeVariant = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary-50 text-primary-600',
  accent: 'bg-accent-50 text-accent-700',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  neutral: 'bg-surface-alt text-secondary',
};

/** Badge générique (statut mission, catégorie, etc.) */
export function Badge({ children, variant = 'neutral', icon, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        variantStyles[variant],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

/** Badge spécifique "réputation vérifiée" — identité visuelle forte de MboaPro. */
export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-600',
        className
      )}
      title="Réputation vérifiée par MboaPro"
    >
      <BadgeCheck size={13} className="fill-primary-500 text-white" />
      Vérifié
    </span>
  );
}