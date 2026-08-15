import { apiClient, toApiError } from '../lib/apiClient';
import type { AuthUser } from '../types/auth.types';

interface ProviderProfileFields {
  whatsapp: string | null;
  portfolio_url: string | null;
  years_experience: number;
  region: string;
  city: string;
  address: string;
  street: string | null;
  postal_code: string | null;
}

export interface FullProfile extends AuthUser {
  providerProfile?: ProviderProfileFields;
}

export const profileService = {
  getMe: async (): Promise<FullProfile> => {
    try {
      const { data } = await apiClient.get('/users/me');
      return data.data;
    } catch (err) {
      throw toApiError(err);
    }
  },

  updateMe: async (formData: FormData): Promise<FullProfile> => {
    try {
      const { data } = await apiClient.post('/users/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return data.data;
    } catch (err) {
      throw toApiError(err);
    }
  },

  changePassword: async (payload: { currentPassword?: string; newPassword: string; confirmPassword: string }): Promise<void> => {
    try {
      await apiClient.post('/users/me/password', payload);
    } catch (err) {
      throw toApiError(err);
    }
  },
};