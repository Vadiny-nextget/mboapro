import { apiClient, toApiError } from '../lib/apiClient';
import { normalizeNotification } from '../utils/normalize';
import type { AppNotification } from '../types/notification.types';

export const notificationService = {
  list: async (): Promise<AppNotification[]> => {
    try {
      const { data } = await apiClient.get('/notifications');
      return data.data.map(normalizeNotification);
    } catch (err) {
      throw toApiError(err);
    }
  },

  unreadCount: async (): Promise<number> => {
    try {
      const { data } = await apiClient.get('/notifications/unread-count');
      return data.data.count;
    } catch (err) {
      throw toApiError(err);
    }
  },

  markRead: async (id: string): Promise<void> => {
    try {
      await apiClient.post(`/notifications/${id}/read`);
    } catch (err) {
      throw toApiError(err);
    }
  },

  markAllRead: async (): Promise<void> => {
    try {
      await apiClient.post('/notifications/read-all');
    } catch (err) {
      throw toApiError(err);
    }
  },
};