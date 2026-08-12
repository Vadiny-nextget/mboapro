export interface Category {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  icon: string | null;
  isActive: boolean;
}

export interface Skill {
  id: string;
  name: string;
}

export type ServiceAvailability = 'available' | 'busy' | 'paused';
export type PriceUnit = 'fixed' | 'hourly' | 'starting_from';

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  priceUnit: PriceUnit;
  region: string;
  city: string;
  images: string[];
  availability: ServiceAvailability;
  rating: number;
  reviewCount: number;
  category: { title: string; slug: string };
  skills: Skill[];
  provider: {
    userId: string;
    fullName: string;
    avatarUrl: string | null;
    isVerified: boolean;
    preferredLanguage: 'fr' | 'en';
  };
  otherServices?: Service[];
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: { page: number; perPage: number; total: number; totalPages: number };
}

export interface ServiceSearchFilters {
  category?: string;
  city?: string;
  language?: 'fr' | 'en';
  skills?: string[];
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  sort?: 'recent' | 'price_asc' | 'price_desc' | 'rating';
  page?: number;
  perPage?: number;
}

export interface ProviderProfile {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  description: string | null;
  preferredLanguage: 'fr' | 'en';
  joinedAt: string;
  country: string;
  region: string | null;
  city: string | null;
  yearsExperience: number;
  portfolioUrl: string | null;
  isVerified: boolean;
  stats: {
    serviceCount: number;
    avgRating: number;
    totalReviews: number;
  };
}
export interface ProviderContactInfo {
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
}