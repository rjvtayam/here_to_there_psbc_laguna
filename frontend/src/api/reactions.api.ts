import { api } from './axios';

export interface ReactionSummary {
  emoji: string;
  count: number;
  users: string[];
  user_reacted: boolean;
}

export const reactionsApi = {
  toggle: async (announcementId: string, emoji: string): Promise<{ action: string; emoji: string }> => {
    const { data } = await api.post(`/announcements/${announcementId}/reactions`, { emoji });
    return data;
  },

  get: async (announcementId: string): Promise<ReactionSummary[]> => {
    const { data } = await api.get(`/announcements/${announcementId}/reactions`);
    return data;
  },
};
