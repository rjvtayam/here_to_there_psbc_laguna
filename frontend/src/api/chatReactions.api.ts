import { api } from './axios';

export interface ChatReactionSummary {
  emoji: string;
  count: number;
  users: string[];
  user_reacted: boolean;
}

export const chatReactionsApi = {
  toggle: async (messageId: string, emoji: string): Promise<{ action: string; emoji: string }> => {
    const { data } = await api.post(`/chat-messages/${messageId}/reactions`, { emoji });
    return data;
  },

  get: async (messageId: string): Promise<ChatReactionSummary[]> => {
    const { data } = await api.get(`/chat-messages/${messageId}/reactions`);
    return data;
  },

  getBatch: async (messageIds: string[]): Promise<Record<string, ChatReactionSummary[]>> => {
    const { data } = await api.post('/chat-messages/reactions/batch', messageIds);
    return data;
  },
};
