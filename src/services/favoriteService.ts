import { apiClient, toApiError } from '../lib/apiClient';
import { normalizeService } from '../utils/normalize';
import type { Service } from '../types/catalog.types';

export const favoriteService = {
  list: async (): Promise<Service[]> => {
    try {
      const { data } = await apiClient.get('/favorites');
      return data.data.map(normalizeService);
    } catch (err) {
      throw toApiError(err);
    }
  },

  add: async (serviceId: string): Promise<void> => {
    try {
      await apiClient.post('/favorites', { serviceId });
    } catch (err) {
      throw toApiError(err);
    }
  },

  remove: async (serviceId: string): Promise<void> => {
    try {
      await apiClient.delete(`/favorites/${serviceId}`);
    } catch (err) {
      throw toApiError(err);
    }
  },

  check: async (serviceId: string): Promise<boolean> => {
    try {
      const { data } = await apiClient.get(`/favorites/${serviceId}/check`);
      return data.data.isFavorited;
    } catch (err) {
      throw toApiError(err);
    }
  },
};