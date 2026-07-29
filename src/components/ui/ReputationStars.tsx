import { Star, StarHalf } from 'lucide-react';
import clsx from 'clsx';

interface ReputationStarsProps {
  rating: number; // 0 à 5, décimales acceptées (ex: 4.5)
  reviewCount?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}

/**
 * Affichage étoiles de réputation, cœur du système de confiance MboaPro.
 * Usage : <ReputationStars rating={4.7} reviewCount={132} />
 */
export default function ReputationStars({
  rating,
  reviewCount,
  size = 16,
  showValue = true,
  className,
}: ReputationStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const roundedUp = rating - fullStars >= 0.75;
  const totalFull = roundedUp ? fullStars + 1 : fullStars;
  const emptyStars = 5 - totalFull - (hasHalfStar ? 1 : 0);

  return (
    <div className={clsx('inline-flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5 text-accent-500">
        {Array.from({ length: totalFull }).map((_, i) => (
          <Star key={`full-${i}`} size={size} fill="currentColor" strokeWidth={0} />
        ))}
        {hasHalfStar && <StarHalf size={size} fill="currentColor" strokeWidth={0} />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-gray-300" />
        ))}
      </div>

      {showValue && (
        <span className="text-sm font-semibold text-primary">{rating.toFixed(1)}</span>
      )}
      {typeof reviewCount === 'number' && (
        <span className="text-sm text-muted">({reviewCount})</span>
      )}
    </div>
  );
}