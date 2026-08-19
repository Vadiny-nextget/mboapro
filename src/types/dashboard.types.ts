export type ContactRequestStatus = 'pending' | 'replied' | 'closed';

export interface ContactRequestSummary {
  id: string;
  message: string | null;
  status: ContactRequestStatus;
  createdAt: string;
  serviceTitle: string;
  serviceSlug: string;
  serviceId: string;
  serviceImage: string | null;
  personName: string;
  personAvatarUrl: string | null;
}

export interface ProviderDashboardData {
  stats: {
    serviceCount: number;
    avgRating: number;
    totalReviews: number;
    contactRequestsTotal: number;
    contactRequestsLast7Days: number;
  };
  recentContactRequests: ContactRequestSummary[];
}

export interface ClientDashboardData {
  stats: {
    contactRequestsSent: number;
  };
  recentContactRequests: ContactRequestSummary[];
}