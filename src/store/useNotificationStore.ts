import { create } from 'zustand';
import type { AppNotification } from '../types/notification.types';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  setInitial: (notifications: AppNotification[], unreadCount: number) => void;
  prepend: (notification: AppNotification) => void;
  markAllReadLocally: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setInitial: (notifications, unreadCount) => set({ notifications, unreadCount }),
  prepend: (notification) =>
    set((s) => ({ notifications: [notification, ...s.notifications].slice(0, 20), unreadCount: s.unreadCount + 1 })),
  markAllReadLocally: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, isRead: true })), unreadCount: 0 })),
}));