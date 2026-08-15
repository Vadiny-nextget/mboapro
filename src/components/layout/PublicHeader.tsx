import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Search, Sun, Moon } from "lucide-react";
import clsx from "clsx";
import { useAuthStore } from "../../store/useAuthStore";
import { useTheme } from "../../hooks/useTheme";

const publicNavLinks = [
  { label: "Explorer les services", to: "/services" },
  { label: "Devenir prestataire", to: "/devenir-prestataire" },
  { label: "Comment ça marche", to: "/comment-ca-marche" },
];

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <header className="sticky top-0 z-1100 border-b border-subtle bg-(--bg-surface)/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link
          to="/"
          className="font-heading text-xl font-bold text-primary-500"
        >
          Mboa<span className="text-accent-500">Pro</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {publicNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                clsx(
                  "text-sm font-medium transition-colors hover:text-primary-500",
                  isActive ? "text-primary-500" : "text-secondary",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            aria-label="Rechercher"
            className="rounded-full p-2 text-secondary transition-colors hover:bg-(--bg-surface-alt)"
          >
            <Search size={18} />
          </button>
          <button
            aria-label="Changer de thème"
            onClick={toggleTheme}
            className="rounded-full p-2 text-secondary transition-colors hover:bg-(--bg-surface-alt)"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated && user ? (
            <Link
              to={`/${user.role}`}
              className="rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-on-primary transition-transform hover:scale-[1.02]"
            >
              Mon espace
            </Link>
          ) : (
            <>
              <Link
                to="/connexion"
                className="text-sm font-medium text-secondary hover:text-primary-500"
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-on-primary transition-transform hover:scale-[1.02]"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>

        <button
          className="p-2 lg:hidden"
          aria-label="Ouvrir le menu"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Menu mobile plein écran */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-1300 animate-fade-in bg-surface! lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="font-heading text-xl font-bold text-primary-500">
              MboaPro
            </span>
            <button
              aria-label="Fermer le menu"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-4 py-4 bg-surface">
            {publicNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-secondary hover:bg-(--bg-surface-alt)"
              >
                {link.label}
              </NavLink>
            ))}
            <hr className="my-3 border-subtle" />
            <Link
              to="/connexion"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-3 text-base font-medium"
            >
              Connexion
            </Link>
            <Link
              to="/inscription"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 rounded-md bg-primary-500 px-3 py-3 text-center text-base font-semibold text-on-primary"
            >
              S'inscrire
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
