import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { navigationByRole } from '../../config/navigation';
import type { UserRole } from '../../types/auth.types';

interface MobileBottomNavProps {
  role: UserRole;
}

/** Navigation basse, visible uniquement sur mobile dans les dashboards. */
export default function MobileBottomNav({ role }: MobileBottomNavProps) {
  const items = navigationByRole[role].slice(0, 4); // 4 items max pour rester lisible

  return (
    <nav className="fixed inset-x-0 bottom-0 z-1100 flex border-t border-subtle bg-(--bg-surface)/95 backdrop-blur-md lg:hidden">
      {items.map(({ label, to, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            clsx(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
              isActive ? 'text-primary-500' : 'text-muted'
            )
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}