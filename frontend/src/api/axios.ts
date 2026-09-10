import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { API_BASE_URL } from '../lib/constants';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ─── Request Deduplication ───
// Prevents duplicate in-flight GET requests for the same URL
const pendingRequests = new Map<string, Promise<unknown>>();

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Deduplicate identical GET requests
  if (config.method === 'get') {
    const key = `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
    if (pendingRequests.has(key)) {
      const controller = new AbortController();
      config.signal = controller.signal;
      controller.abort('Duplicate request');
    } else {
      const key = `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
      pendingRequests.set(key, Promise.resolve());
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    // Clear pending request tracker
    if (response.config.method === 'get') {
      const key = `${response.config.method}:${response.config.url}:${JSON.stringify(response.config.params || {})}`;
      pendingRequests.delete(key);
    }

    // Store ETag for conditional requests
    const etag = response.headers['etag'];
    if (etag && response.config.method === 'get') {
      const etagKey = `etag:${response.config.url}`;
      sessionStorage.setItem(etagKey, etag);
    }

    return response;
  },
  async (error) => {
    // Clear pending request tracker on error
    if (error.config?.method === 'get') {
      const key = `${error.config.method}:${error.config.url}:${JSON.stringify(error.config.params || {})}`;
      pendingRequests.delete(key);
    }

    // Skip deduplication-aborted requests
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken },
            { withCredentials: true }
          );

          const { access_token, refresh_token, user } = response.data;
          useAuthStore.getState().setAuth(access_token, refresh_token, user);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch {
        useAuthStore.getState().logout();
        api.post('/auth/logout').catch(() => {});
      }
    }

    return Promise.reject(error);
  }
);
