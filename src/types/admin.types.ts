import type { AuthUser } from './auth.types';

export interface PendingProvider {
  id: string; // provider_profile.id
  userId: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  description: string | null;
  city: string | null;
  region: string | null;
  yearsExperience: number;
  registeredAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  usersByRole: { client: number; prestataire: number; admin: number };
  providersByVerificationStatus: { pending: number; verified: number; rejected: number };
  totalServices: number;
  totalCategories: number;
}

export interface PaginatedUsers {
  items: AuthUser[];
  pagination: { page: number; perPage: number; total: number; totalPages: number };
}