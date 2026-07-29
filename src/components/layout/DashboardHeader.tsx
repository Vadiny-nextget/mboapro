import { useState } from 'react';
import { Menu, Bell, Sun, Moon, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useTheme } from '../../hooks/useTheme';
import { Img } from '../ui/Img';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <header className="sticky top-0 z-1100 flex h-16 items-center justify-between border-b border-subtle bg-(--bg-surface)/80 px-4 backdrop-blur-md lg:px-8">
      <button className="lg:hidden" onClick={onMenuClick} aria-label="Ouvrir le menu">
        <Menu size={22} />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        <button
          aria-label="Changer de thème"
          onClick={toggleTheme}
          className="rounded-full p-2 text-secondary hover:bg-(--bg-surface-alt)"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          aria-label="Notifications"
          className="relative rounded-full p-2 text-secondary hover:bg-(--bg-surface-alt)"
        >
          <Bell size={18} />
          <span className="animate-ring-pulse absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-(--bg-surface-alt)"
          >
            <Img
              src={user?.avatarUrl || 'https://api.dicebear.com/9.x/initials/svg?seed=' + user?.fullName}
              alt={user?.fullName}
              className="h-8 w-8 rounded-full object-cover"
            />
            <ChevronDown size={16} className="text-muted" />
          </button>

          {isMenuOpen && (
            <div className="animate-scale-in absolute right-0 mt-2 w-52 origin-top-right rounded-md border border-subtle bg-(--bg-page) p-1.5 shadow-lg">
              <p className="truncate px-3 py-2 text-sm font-semibold">{user?.fullName}</p>
              <hr className="my-1 border-subtle" />
              <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-secondary hover:bg-(--bg-surface-alt)">
                <Settings size={16} /> Paramètres
              </button>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-danger hover:bg-(--bg-surface-alt)"
              >
                <LogOut size={16} /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}