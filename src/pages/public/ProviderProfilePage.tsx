import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Globe, Calendar, Briefcase, Link2 } from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import { VerifiedBadge } from '../../components/ui/Badge';
import ServiceCard from '../../components/ui/ServiceCard';
import { catalogService } from '../../services/catalogService';
import type { ProviderProfile, Service } from '../../types/catalog.types';

const formatJoinDate = (iso: string) =>
  new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date(iso));

export default function ProviderProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    setNotFound(false);

    // Les deux appels ne dépendent pas l'un de l'autre : Promise.all() les
    // exécute réellement en parallèle (contrairement à l'ancienne cascade).
    Promise.all([catalogService.getProviderProfile(userId), catalogService.getServicesByProvider(userId)])
      .then(([profileData, servicesData]) => {
        setProfile(profileData);
        setServices(servicesData);
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [userId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="skeleton h-40 w-full rounded-lg" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="font-heading text-xl font-bold text-primary">Prestataire introuvable</h1>
        <Link to="/services" className="text-sm font-semibold text-primary-500 hover:underline">
          Retour aux services
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* En-tête profil */}
      <div className="mb-8 flex flex-col items-center gap-4 rounded-lg border border-subtle bg-surface p-6 text-center sm:flex-row sm:items-start sm:text-left">
        <Avatar src={profile.avatarUrl ?? undefined} name={profile.fullName} size="xl" />

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h1 className="font-heading text-xl font-bold text-primary">{profile.fullName}</h1>
            {profile.isVerified && <VerifiedBadge />}
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-secondary sm:justify-start">
            {profile.city && (
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {profile.city}, {profile.country}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Globe size={14} /> {profile.preferredLanguage === 'fr' ? 'Français' : 'English'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> Membre depuis {formatJoinDate(profile.joinedAt)}
            </span>
          </div>

          {profile.description && <p className="mt-3 text-sm text-secondary">{profile.description}</p>}

          <div className="mt-4 flex flex-wrap justify-center gap-6 sm:justify-start">
            <div className="text-center">
              <p className="font-heading text-lg font-bold text-primary">{profile.stats.serviceCount}</p>
              <p className="text-xs text-muted">services</p>
            </div>
            <div className="text-center">
              <p className="font-heading text-lg font-bold text-primary">{profile.stats.avgRating.toFixed(1)}</p>
              <p className="text-xs text-muted">note moyenne</p>
            </div>
            <div className="text-center">
              <p className="font-heading text-lg font-bold text-primary">{profile.stats.totalReviews}</p>
              <p className="text-xs text-muted">avis</p>
            </div>
            <div className="text-center">
              <p className="font-heading text-lg font-bold text-primary">{profile.yearsExperience}</p>
              <p className="text-xs text-muted">ans d'XP</p>
            </div>
          </div>

          {profile.portfolioUrl && (
            <a
              href={profile.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:underline"
            >
              <Link2 size={14} /> Voir le portfolio
            </a>
          )}
        </div>
      </div>

      {/* Services publiés */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-primary">
          <Briefcase size={18} /> Services proposés
        </h2>

        {services.length === 0 ? (
          <p className="text-sm text-secondary">Aucun service publié pour l'instant.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}