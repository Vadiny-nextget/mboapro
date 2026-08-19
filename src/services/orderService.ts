import { apiClient, toApiError } from '../lib/apiClient';
import { normalizeOrder } from '../utils/normalize';
import type { EarningsSummary, Order, OrderStatus } from '../types/order.types';

export const orderService = {
  createOrder: async (payload: { contactRequestId: string; serviceId: string; agreedPrice: number; notes?: string }): Promise<Order> => {
    try {
      const { data } = await apiClient.post('/prestataire/orders', payload);
      return normalizeOrder(data.data);
    } catch (err) {
      throw toApiError(err);
    }
  },

  getProviderOrders: async (): Promise<Order[]> => {
    try {
      const { data } = await apiClient.get('/prestataire/orders');
      return data.data.map(normalizeOrder);
    } catch (err) {
      throw toApiError(err);
    }
  },

  getClientOrders: async (): Promise<Order[]> => {
    try {
      const { data } = await apiClient.get('/client/orders');
      return data.data.map(normalizeOrder);
    } catch (err) {
      throw toApiError(err);
    }
  },

  updateStatus: async (orderId: string, status: OrderStatus, cancellationReason?: string): Promise<void> => {
    try {
      await apiClient.patch(`/prestataire/orders/${orderId}/status`, { status, cancellationReason });
    } catch (err) {
      throw toApiError(err);
    }
  },

  getEarnings: async (): Promise<EarningsSummary> => {
    try {
      const { data } = await apiClient.get('/prestataire/earnings');
      return {
        ...data.data,
        recentCompletedOrders: data.data.recentCompletedOrders.map(normalizeOrder),
      };
    } catch (err) {
      throw toApiError(err);
    }
  },

  submitReview: async (orderId: string, rating: number, comment?: string): Promise<void> => {
    try {
      await apiClient.post(`/client/orders/${orderId}/review`, { rating, comment });
    } catch (err) {
      throw toApiError(err);
    }
  },
};