export type OrderStatus = 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  serviceTitle: string;
  serviceSlug: string;
  agreedPrice: number;
  status: OrderStatus;
  notes: string | null;
  cancellationReason: string | null;
  clientName: string;
  clientAvatarUrl: string | null;
  providerName: string;
  providerAvatarUrl: string | null;
  hasReview: boolean;
  createdAt: string;
  completedAt: string | null;
}

export interface EarningsSummary {
  totalEarned: number;
  thisMonthEarned: number;
  completedCount: number;
  activeCount: number;
  recentCompletedOrders: Order[];
}