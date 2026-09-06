import { useCallback } from 'react';
import { useSocket } from './useSocket';
import { useSessionStore } from '../stores/sessionStore';
import { dashboardApi } from '../api/dashboard.api';

export function useEmergency() {
  const { emit } = useSocket();
  const { setEmergency } = useSessionStore();

  const triggerEmergency = useCallback(async (message?: string) => {
    try {
      await dashboardApi.triggerEmergency(message);
      emit('emergency_trigger', { message });
      setEmergency(true, message);
    } catch (error) {
      console.error('Failed to trigger emergency:', error);
      throw error;
    }
  }, [emit, setEmergency]);

  const resolveEmergency = useCallback(() => {
    setEmergency(false);
  }, [setEmergency]);

  return { triggerEmergency, resolveEmergency };
}
