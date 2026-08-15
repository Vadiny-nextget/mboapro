import { apiClient, toApiError } from '../lib/apiClient';

const SESSION_KEY = import.meta.env.VITE_API_SESSION_KEY??'mboapro-chat-session';

function getOrCreateSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export const chatService = {
  getSessionId: getOrCreateSessionId,

  sendMessage: async (message: string): Promise<{ reply: string; suggestedServices: any[] }> => {
    try {
      const { data } = await apiClient.post('/chat/message', {
        sessionId: getOrCreateSessionId(),
        message,
      });
      return data.data;
    } catch (err) {
      throw toApiError(err);
    }
  },

  resetSession: async (): Promise<void> => {
    const id = getOrCreateSessionId();
    try {
      await apiClient.delete(`/chat/session/${id}`);
    } finally {
      localStorage.removeItem(SESSION_KEY);
    }
  },
};