import type { PendingProvider } from '../types/admin.types';
import type { Service, Category, ProviderProfile } from '../types/catalog.types';
import type { ContactRequestSummary } from '../types/dashboard.types';
import type { ConversationSummary, Message } from '../types/message.types';
import type { AppNotification } from '../types/notification.types';
import type { Order } from '../types/order.types';

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
    isPendingCategory: Boolean(raw.is_pending_category),
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
    serviceId: raw.service_id,
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

export function normalizeOrder(raw: any): Order {
  return {
    id: raw.id,
    serviceTitle: raw.service_title,
    serviceSlug: raw.service_slug,
    agreedPrice: Number(raw.agreed_price),
    status: raw.status,
    notes: raw.notes,
    cancellationReason: raw.cancellation_reason,
    clientName: `${raw.client_first_name} ${raw.client_last_name}`.trim(),
    clientAvatarUrl: raw.client_avatar_url,
    providerName: `${raw.provider_first_name} ${raw.provider_last_name}`.trim(),
    providerAvatarUrl: raw.provider_avatar_url,
    hasReview: Boolean(raw.has_review),
    createdAt: raw.created_at,
    completedAt: raw.completed_at,
  };
}

export function normalizeConversation(raw: any): ConversationSummary {
  return {
    id: raw.id,
    otherUserId: raw.other_user_id,
    otherUserName: `${raw.other_first_name} ${raw.other_last_name}`.trim(),
    otherUserAvatarUrl: raw.other_avatar_url,
    contextServiceTitle: raw.context_service_title,
    lastMessagePreview: raw.last_message_preview,
    lastMessageAt: raw.last_message_at,
    unreadCount: Number(raw.unread_count),
  };
}

export function normalizeMessage(raw: any): Message {
  return {
    id: raw.id,
    conversationId: raw.conversation_id,
    senderId: raw.sender_id,
    body: raw.body,
    createdAt: raw.created_at,
    readAt: raw.read_at,
  };
}

export function normalizeNotification(raw: any): AppNotification {
  return {
    id: raw.id,
    type: raw.type,
    title: raw.title,
    body: raw.body,
    data: raw.data ?? {},
    isRead: raw.is_read,
    createdAt: raw.created_at,
  };
}

