import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import clsx from 'clsx';
import { favoriteService } from '../../services/favoriteService';
import { useAuthStore } from '../../store/useAuthStore';

export default function FavoriteButton({ serviceId }: { serviceId: string }) {
  const user = useAuthStore((s) => s.user);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== 'client') return;
    favoriteService.check(serviceId).then(setIsFavorited);
  }, [serviceId, user?.role]);

  if (user?.role !== 'client') return null; // seuls les clients ont des favoris

  const toggle = async () => {
    setIsLoading(true);
    try {
      if (isFavorited) {
        await favoriteService.remove(serviceId);
        setIsFavorited(false);
      } else {
        await favoriteService.add(serviceId);
        setIsFavorited(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={isLoading}
      aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className={clsx(
        'flex items-center justify-center gap-2 rounded-md border py-2.5 text-sm font-medium transition-colors',
        isFavorited ? 'border-danger bg-danger/10 text-danger' : 'border-subtle text-secondary hover:border-danger/40 hover:text-danger'
      )}
    >
      <Heart size={16} className={isFavorited ? 'fill-danger' : ''} />
      {isFavorited ? 'Retiré des favoris' : 'Ajouter aux favoris'}
    </button>
  );
}