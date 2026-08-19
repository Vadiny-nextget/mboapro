import { apiClient, toApiError } from '../lib/apiClient';
import { normalizeConversation, normalizeMessage } from '../utils/normalize';
import type { ConversationSummary, Message } from '../types/message.types';

export const messageService = {
  startConversation: async (serviceId: string): Promise<{ id: string }> => {
    try {
      const { data } = await apiClient.post('/conversations', { serviceId });
      return data.data;
    } catch (err) {
      throw toApiError(err);
    }
  },

  getConversations: async (): Promise<ConversationSummary[]> => {
    try {
      const { data } = await apiClient.get('/conversations');
      return data.data.map(normalizeConversation);
    } catch (err) {
      throw toApiError(err);
    }
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    try {
      const { data } = await apiClient.get(`/conversations/${conversationId}/messages`);
      return data.data.map(normalizeMessage);
    } catch (err) {
      throw toApiError(err);
    }
  },

  sendMessage: async (conversationId: string, body: string): Promise<Message> => {
    try {
      const { data } = await apiClient.post(`/conversations/${conversationId}/messages`, { body });
      return normalizeMessage(data.data);
    } catch (err) {
      throw toApiError(err);
    }
  },
};