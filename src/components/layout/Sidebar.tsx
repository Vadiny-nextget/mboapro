import { Link, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { navigationByRole } from '../../config/navigation';
import type { UserRole } from '../../types/auth.types';
import BecomeProviderButton from '../ui/BecomeProviderButton';

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

const roleLabels: Record<UserRole, string> = {
  client: 'Espace client',
  prestataire: 'Espace prestataire',
  admin: 'Administration',
};

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const items = navigationByRole[role];

  const content = (
    <>
      <div className="flex h-16 items-center justify-between px-6">
        <Link to={`/`} className="font-heading text-xl font-bold text-primary-500!">
          Mboa<span className="text-accent-500">Pro</span>
        </Link>
        <button className="lg:hidden" onClick={onClose} aria-label="Fermer">
          <X size={20} />
        </button>
      </div>

      <p className="px-6 pb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        {roleLabels[role]}
      </p>

      <nav className="flex flex-col gap-1 px-3">
        {items.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent-500/80 text-primary-600'
                  : 'text-secondary hover:bg-accent-500/40 hover:text-primary-500'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        {role === 'client' && <div className="mt-4 px-3"><BecomeProviderButton /></div>}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop : sidebar fixe */}
      <aside className="fixed inset-y-0 left-0 z-1000 hidden w-64 flex-col border-r border-subtle bg-surface lg:flex">
        {content}
      </aside>

      {/* Mobile : drawer avec overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-1200 lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-gray-950/75"
            onClick={onClose}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 animate-slide-in-left flex-col bg-(--bg-page)">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}