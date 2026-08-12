import type { PendingProvider } from '../types/admin.types';
import type { Service, Category, ProviderProfile } from '../types/catalog.types';
import type { ContactRequestSummary } from '../types/dashboard.types';

export function normalizeCategory(raw: any): Category {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    description: raw.description,
    imageUrl: raw.image_url,
    icon: raw.icon,
    isActive: raw.is_active,
  };
}
export function normalizeService(raw: any): Service {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    description: raw.description,
    price: Number(raw.price),
    priceUnit: raw.price_unit,
    region: raw.region,
    city: raw.city,
    images: raw.images ?? [],
    availability: raw.availability,
    rating: Number(raw.rating),
    reviewCount: raw.review_count,
    category: { title: raw.category_title, slug: raw.category_slug },
    skills: (raw.skill_list ?? []).map((s: any) => ({ id: s.id, name: s.name })),
    provider: {
      userId: raw.provider_user_id,
      fullName: `${raw.first_name} ${raw.last_name}`.trim(),
      avatarUrl: raw.avatar_url,
      isVerified: raw.verification_status === 'verified',
      preferredLanguage: raw.preferred_language,
    },
    // Présent uniquement sur la réponse de détail (GET /services/:slug)
    otherServices: raw.other_services ? raw.other_services.map(normalizeService) : undefined,
  };
}

export function normalizeProviderProfile(raw: any): ProviderProfile {
  return {
    userId: raw.user_id,
    fullName: `${raw.first_name} ${raw.last_name}`.trim(),
    avatarUrl: raw.avatar_url,
    description: raw.description,
    preferredLanguage: raw.preferred_language,
    joinedAt: raw.joined_at,
    country: raw.country,
    region: raw.region,
    city: raw.city,
    yearsExperience: Number(raw.years_experience),
    portfolioUrl: raw.portfolio_url,
    isVerified: raw.verification_status === 'verified',
    stats: {
      serviceCount: Number(raw.stats.service_count),
      avgRating: Number(raw.stats.avg_rating),
      totalReviews: Number(raw.stats.total_reviews),
    },
  };
}

export function normalizeContactRequest(raw: any): ContactRequestSummary {
  return {
    id: raw.id,
    message: raw.message,
    status: raw.status,
    createdAt: raw.created_at,
    serviceTitle: raw.service_title,
    serviceSlug: raw.service_slug,
    serviceImage: Array.isArray(raw.images) ? raw.images[0] ?? null : null,
    personName: `${raw.first_name} ${raw.last_name}`.trim(),
    personAvatarUrl: raw.avatar_url,
  };
}

export function normalizePendingProvider(raw: any): PendingProvider {
  return {
    id: raw.id,
    userId: raw.user_id,
    fullName: `${raw.first_name} ${raw.last_name}`.trim(),
    email: raw.email,
    phone: raw.phone,
    avatarUrl: raw.avatar_url,
    description: raw.description,
    city: raw.city,
    region: raw.region,
    yearsExperience: Number(raw.years_experience),
    registeredAt: raw.registered_at,
  };
}

