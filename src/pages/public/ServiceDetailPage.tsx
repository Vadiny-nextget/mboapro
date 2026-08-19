import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapPin, Globe, MessageCircle, ChevronRight, MessageSquare } from "lucide-react";
import Avatar from "../../components/ui/Avatar";
import { VerifiedBadge } from "../../components/ui/Badge";
import ReputationStars from "../../components/ui/ReputationStars";
import ServiceGallery from "../../components/ui/ServiceGallery";
import AvailabilityBadge from "../../components/ui/AvailabilityBadge";
import ServiceCard from "../../components/ui/ServiceCard";
import { catalogService } from "../../services/catalogService";
import { ApiError } from "../../types/api.types";
import type { Service } from "../../types/catalog.types";
import { Button } from "../../components/ui/Input";
import { useAuthStore } from "../../store/useAuthStore";
import ContactProviderModal from "../../components/ui/ContactProviderModal";
import FavoriteButton from "../../components/ui/FavoriteButton";
import { formatFCFA } from "../../lib/text.func";
import { messageService } from "../../services/messageService";

const priceUnitSuffix: Record<Service["priceUnit"], string> = {
  fixed: "",
  hourly: " / heure",
  starting_from: "",
};

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const currentUser = useAuthStore((s) => s.user);
  const [showContactModal, setShowContactModal] = useState(false);
const [reviews, setReviews] = useState<Array<{ id: string; rating: number; comment: string | null; first_name: string; last_name: string; created_at: string }>>([]);

  const isOwnService = currentUser?.id === service?.provider.userId;

  const handleContactClick = () => {
    if (!currentUser) {
      navigate("/connexion", { state: { from: window.location.pathname } });
      return;
    }
    setShowContactModal(true);
  };
  
const handleStartConversation = async () => {
  if (!currentUser) {
    navigate('/connexion', { state: { from: window.location.pathname } });
    return;
  }
  const conversation = await messageService.startConversation(service?.id);
  navigate('/client/discussions', { state: { openConversationId: conversation.id } });
};

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setNotFound(false);

    catalogService
      .getServiceBySlug(slug)
      .then((data) => {
        setService(data);
        
catalogService.getServiceReviews(data.id).then(setReviews);
        return catalogService.getServicesByProvider(data.provider.userId);
      })
      // .then((all) => setOtherServices(all.filter((s) => s.slug !== slug).slice(0, 3)))
      // .then(setService)
      .catch((err) => {
        if ((err as ApiError).status === 404) setNotFound(true);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <div className="skeleton aspect-video w-full rounded-lg" />
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="font-heading text-xl font-bold text-primary">
          Service introuvable
        </h1>
        <p className="text-sm text-secondary">
          Ce service n'existe pas ou a été retiré.
        </p>
        <Link
          to="/services"
          className="text-sm font-semibold text-primary-500 hover:underline"
        >
          Retour aux services
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      {/* Fil d'Ariane */}
      <div className="mb-6 flex items-center gap-1.5 text-sm text-muted">
        <Link to="/" className="hover:text-primary-500">
          Accueil
        </Link>
        <ChevronRight size={14} />
        <Link
          to={`/services?category=${service.category.slug}`}
          className="hover:text-primary-500"
        >
          {service.category.title}
        </Link>
        <ChevronRight size={14} />
        <span className="truncate text-secondary">{service.title}</span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Colonne principale */}
        <div className="flex flex-col gap-6">
          <ServiceGallery images={service.images} title={service.title} />

          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <AvailabilityBadge availability={service.availability} />
              <span className="text-xs text-muted">
                {service.category.title}
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-primary lg:text-3xl">
              {service.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4">
              <ReputationStars
                rating={service.rating}
                reviewCount={service.reviewCount}
              />
              <div className="flex items-center gap-1 text-sm text-secondary">
                <MapPin size={15} /> {service.city}, Cameroun
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-heading text-lg font-bold text-primary">
              Description
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-secondary">
              {service.description}
            </p>
          </div>

          {service.skills.length > 0 && (
            <div>
              <h2 className="mb-2 font-heading text-lg font-bold text-primary">
                Compétences
              </h2>
              <div className="flex flex-wrap gap-2">
                {service.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full border border-subtle px-3 py-1.5 text-sm text-secondary"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Avis — en attente du module Reviews */}
          
<div>
  <h2 className="mb-2 font-heading text-lg font-bold text-primary">Avis clients ({reviews.length})</h2>
  {reviews.length === 0 ? (
    <p className="text-sm text-muted">Aucun avis pour l'instant.</p>
  ) : (
    <div className="flex flex-col gap-3">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-lg border border-subtle bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-primary">{r.first_name} {r.last_name}</p>
            <ReputationStars rating={r.rating} size={13} showValue={false} />
          </div>
          {r.comment && <p className="mt-1 text-sm text-secondary">{r.comment}</p>}
        </div>
      ))}
    </div>
  )}
</div>
        </div>

        {/* Colonne latérale sticky */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="flex flex-col gap-5 rounded-lg border border-subtle bg-surface p-5 shadow-md">
            <div>
              {service.priceUnit === "starting_from" && (
                <p className="text-xs text-muted">à partir de</p>
              )}
              <p className="font-heading text-2xl font-bold text-primary-500">
                {formatFCFA(service.price)}
                <span className="text-sm font-normal text-muted">
                  {priceUnitSuffix[service.priceUnit]}
                </span>
              </p>
            </div>

            {/* <Button leftIcon={<MessageCircle size={16} />} disabled={service.availability !== 'available'}>
              {service.availability === 'available' ? 'Contacter le prestataire' : 'Indisponible pour le moment'}
            </Button> */}
            {!isOwnService && (
              <Button
                leftIcon={<MessageCircle size={16} />}
                disabled={service.availability === "paused"}
                onClick={handleContactClick}
              >
                {service.availability === "paused"
                  ? "Indisponible pour le moment"
                  : "Contacter le prestataire"}
              </Button>
            )}
            {!isOwnService && currentUser?.role === 'client' && (
  <Button leftIcon={<MessageSquare size={16} />} onClick={handleStartConversation}>
    Envoyer un message
  </Button>
)}
            {currentUser?.role === 'client' && <FavoriteButton serviceId={service.id} />}

            <hr className="border-subtle" />

            <Link
              to={`/prestataires/${service.provider.userId}`}
              className="flex items-center gap-3"
            >
              <Avatar
                src={service.provider.avatarUrl ?? undefined}
                name={service.provider.fullName}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate font-semibold text-primary">
                    {service.provider.fullName}
                  </p>
                  {service.provider.isVerified && <VerifiedBadge />}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <Globe size={12} />{" "}
                  {service.provider.preferredLanguage === "fr"
                    ? "Français"
                    : "English"}
                </div>
              </div>
            </Link>
          </div>
        </aside>
      </div>

      {/* Autres services du même prestataire */}
      {service?.otherServices && service.otherServices?.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 font-heading text-lg font-bold text-primary">
            Autres services de {service.provider.fullName}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.otherServices.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      )}
      {showContactModal && (
        <ContactProviderModal
          serviceId={service.id}
          serviceTitle={service.title}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
}
