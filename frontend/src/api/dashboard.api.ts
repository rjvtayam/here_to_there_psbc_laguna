import { api } from './axios';

export const dashboardApi = {
  getStatus: async () => {
    const response = await api.get('/dashboard/status');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  triggerEmergency: async (message?: string) => {
    const response = await api.post('/dashboard/emergency', { message });
    return response.data;
  },
};
