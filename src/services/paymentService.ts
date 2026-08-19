import { apiClient, toApiError } from '../lib/apiClient';

export const paymentService = {
  initiateActivation: async (gateway: 'cinetpay' | 'intouch'|'paypal'): Promise<{ paymentUrl: string; reference: string }> => {
    try {
      const { data } = await apiClient.post('/prestataire/activation/initiate', { gateway });
      return data.data;
    } catch (err) {
      throw toApiError(err);
    }
  },

  getActivationStatus: async (): Promise<{ activationStatus: 'pending_payment' | 'active'; activatedAt: string | null }> => {
    try {
      const { data } = await apiClient.get('/prestataire/activation/status');
      return data.data;
    } catch (err) {
      throw toApiError(err);
    }
  },
};