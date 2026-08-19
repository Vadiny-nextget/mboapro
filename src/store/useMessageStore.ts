import { create } from 'zustand';
import type { Message } from '../types/message.types';

interface MessageState {
  latestIncoming: Message | null;
  pushIncoming: (message: Message) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  latestIncoming: null,
  pushIncoming: (message) => set({ latestIncoming: message }),
}));