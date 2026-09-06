import { api } from './axios';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await api.get('/notifications');
    return data;
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await api.get('/notifications/unread-count');
    return data.count;
  },

  markRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },

  markAllRead: async (): Promise<void> => {
    await api.put('/notifications/read-all');
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};
