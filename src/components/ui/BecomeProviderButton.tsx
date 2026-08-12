import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

/** Affiché uniquement pour les comptes client — invisible pour prestataire/admin. */
export default function BecomeProviderButton() {
  const user = useAuthStore((s) => s.user);
  if (user?.role !== 'client') return null;

  return (
    <Link
      to="/devenir-prestataire"
      className="flex items-center gap-2 rounded-md bg-accent-500 px-3 py-2 text-sm font-semibold text-gray-900 transition-transform hover:scale-[1.02]"
    >
      <Briefcase size={16} />
      J'ai des services à proposer
    </Link>
  );
}