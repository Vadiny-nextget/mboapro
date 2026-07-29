import { Link } from 'react-router-dom';
import { MapPin, Zap } from 'lucide-react';
import Avatar from './Avatar';
import { Badge, VerifiedBadge } from './Badge';
import Tag from './Tag';
import ReputationStars from './ReputationStars';
import { Img } from './Img';

export interface Provider {
  id: string;
  slug: string;
  fullName: string;
  avatarUrl?: string;
  isOnline?: boolean;
  isVerified: boolean;
  profession: string;
  city: string;
  rating: number;
  reviewCount: number;
  startingPrice: number; // en FCFA
  skills: string[];
  responseTime?: string; // ex: "répond en < 1h"
  coverImageUrl?: string;
}

interface ProviderCardProps {
  provider: Provider;
}

const formatFCFA = (amount: number) =>
  new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';

/**
 * Card prestataire — élément central du listing de services (style Envato "gig card").
 */
export default function ProviderCard({ provider }: ProviderCardProps) {
  const {
    slug,
    fullName,
    avatarUrl,
    isOnline,
    isVerified,
    profession,
    city,
    rating,
    reviewCount,
    startingPrice,
    skills,
    responseTime,
    coverImageUrl,
  } = provider;

  return (
    <Link
      to={`/prestataires/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-subtle bg-surface shadow-sm transition-all duration-250 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image de couverture / portfolio */}
      <div className="relative aspect-4/3 overflow-hidden bg-surface-alt">
        {coverImageUrl ? (
          <Img
            src={coverImageUrl}
            alt={`Réalisation de ${fullName}`}
            className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <Zap size={28} />
          </div>
        )}

        {responseTime && (
          <Badge variant="success" className="absolute left-3 top-3 bg-surface/90 backdrop-blur-sm">
            {responseTime}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* En-tête : avatar + nom + statut */}
        <div className="flex items-center gap-3">
          <Avatar src={avatarUrl} name={fullName} size="sm" isOnline={isOnline} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-semibold text-primary">{fullName}</p>
              {isVerified && <VerifiedBadge />}
            </div>
            <p className="truncate text-xs text-muted">{profession}</p>
          </div>
        </div>

        {/* Localisation */}
        <div className="flex items-center gap-1 text-xs text-muted">
          <MapPin size={13} />
          {city}, Cameroun
        </div>

        {/* Compétences (2 max + compteur) */}
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 2).map((skill) => (
            <Tag key={skill} className="px-2 py-1 text-xs">
              {skill}
            </Tag>
          ))}
          {skills.length > 2 && (
            <Tag className="px-2 py-1 text-xs">+{skills.length - 2}</Tag>
          )}
        </div>

        <hr className="border-subtle" />

        {/* Pied de card : note + prix */}
        <div className="flex items-center justify-between">
          <ReputationStars rating={rating} reviewCount={reviewCount} size={14} />
          <div className="text-right">
            <p className="text-[11px] text-muted">à partir de</p>
            <p className="text-sm font-bold text-primary-500">{formatFCFA(startingPrice)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}