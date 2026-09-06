import { api } from './axios';
import { Session } from '../types/session';

export const sessionsApi = {
  create: async (title: string): Promise<Session> => {
    const response = await api.post('/sessions/', { title });
    return response.data;
  },

  getAll: async (): Promise<Session[]> => {
    const response = await api.get('/sessions/');
    return response.data;
  },

  getActive: async (): Promise<Session> => {
    const response = await api.get('/sessions/active');
    return response.data;
  },

  getById: async (id: string): Promise<Session> => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  join: async (id: string): Promise<void> => {
    await api.post(`/sessions/${id}/join`);
  },

  leave: async (id: string): Promise<void> => {
    await api.post(`/sessions/${id}/leave`);
  },

  end: async (id: string): Promise<Session> => {
    const response = await api.put(`/sessions/${id}/end`);
    return response.data;
  },
};
