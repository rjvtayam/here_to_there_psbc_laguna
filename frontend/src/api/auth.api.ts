import { api } from './axios';
import { AuthResponse, LoginResponse, User } from '../types/user';

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  verify2FA: async (tempToken: string, code: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/2fa-login', { temp_token: tempToken, code });
    return response.data;
  },

  register: async (data: {
    email: string;
    password: string;
    full_name: string;
    role: string;
    campus: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
