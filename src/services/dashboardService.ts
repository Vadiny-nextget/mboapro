import { apiClient, toApiError } from '../lib/apiClient';
import { normalizeContactRequest } from '../utils/normalize';
import type { ClientDashboardData, ContactRequestSummary, ProviderDashboardData } from '../types/dashboard.types';

export const dashboardService = {
  getProviderDashboard: async (): Promise<ProviderDashboardData> => {
    try {
      const { data } = await apiClient.get('/prestataire/dashboard');
      return {
        stats: data.data.stats,
        recentContactRequests: data.data.recentContactRequests.map(normalizeContactRequest),
      };
    } catch (err) {
      throw toApiError(err);
    }
  },

  getProviderContactRequests: async (): Promise<ContactRequestSummary[]> => {
    try {
      const { data } = await apiClient.get('/prestataire/contact-requests');
      return data.data.map(normalizeContactRequest);
    } catch (err) {
      throw toApiError(err);
    }
  },

  getClientDashboard: async (): Promise<ClientDashboardData> => {
    try {
      const { data } = await apiClient.get('/client/dashboard');
      return {
        stats: data.data.stats,
        recentContactRequests: data.data.recentContactRequests.map(normalizeContactRequest),
      };
    } catch (err) {
      throw toApiError(err);
    }
  },

  getClientContactRequests: async (): Promise<ContactRequestSummary[]> => {
    try {
      const { data } = await apiClient.get('/client/contact-requests');
      return data.data.map(normalizeContactRequest);
    } catch (err) {
      throw toApiError(err);
    }
  },
  updateContactRequestStatus: (id: string, status: 'replied' | 'closed') =>
  apiClient.patch(`/prestataire/contact-requests/${id}/status`, { status }),
};