import type { ReactNode } from 'react';
import clsx from 'clsx';

interface TagProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

/** Chip cliquable pour filtres de catégories (Plomberie, Électricité...) */
export default function Tag({ children, active = false, onClick, className }: TagProps) {
  const isInteractive = typeof onClick === 'function';

  return (
    <span
      onClick={onClick}
      className={clsx(
        'inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
        isInteractive && 'cursor-pointer select-none',
        active
          ? 'border-primary-500 bg-primary-500 text-on-primary'
          : 'border-subtle bg-surface text-secondary hover:border-primary-300 hover:text-primary-500',
        className
      )}
    >
      {children}
    </span>
  );
}