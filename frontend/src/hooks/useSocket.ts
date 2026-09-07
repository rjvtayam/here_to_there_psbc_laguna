import { useEffect, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import { useSessionStore } from '../stores/sessionStore';
import { SOCKET_URL } from '../lib/constants';

let socket: Socket | null = null;
let pendingEvents: Array<{ event: string; data?: any }> = [];

export function getSocket(): Socket | null {
  return socket;
}

function initSocket(token: string, setRoomUsers: any, setEmergency: any) {
  if (socket) return socket;

  console.log('[Socket] Creating new socket connection...');
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected, sid:', socket?.id);
    while (pendingEvents.length > 0) {
      const pending = pendingEvents.shift()!;
      console.log('[Socket] Flushing pending event:', pending.event);
      socket?.emit(pending.event, pending.data);
    }
  });

  socket.on('room_users', (data) => {
    console.log('[Socket] room_users received:', data.users.length, 'users', data.users);
    const existingUsers = useSessionStore.getState().roomUsers;
    const existingStreamMap = new Map(existingUsers.map(u => [u.sid, u.stream]));
    const users = data.users.map((u: any) => ({
      ...u,
      stream: existingStreamMap.get(u.sid) || undefined,
    }));
    console.log('[Socket] room_users merged streams:', users.map((u: any) => ({ sid: u.sid, user: u.user, hasStream: !!u.stream })));
    setRoomUsers(users);

    if (data.portal_states) {
      const state = useSessionStore.getState();
      for (const [sid, ps] of Object.entries(data.portal_states) as [string, { active: boolean; meeting: boolean }][]) {
        state.setRemotePortalMode(sid, ps.active);
        state.setRemoteMeetingMode(sid, ps.meeting);
      }
    }

    const currentSharer = useSessionStore.getState().screenSharerSid;
    if (currentSharer && !users.find((u: any) => u.sid === currentSharer)) {
      useSessionStore.getState().setScreenSharer(null);
    }

    const currentSids = new Set(users.map((u: any) => u.sid));
    existingUsers.forEach((u) => {
      if (!currentSids.has(u.sid)) {
        console.log(`[Socket] Cleaning up stale peer: ${u.user} (${u.sid})`);
      }
    });
  });

  socket.on('peer_left', ({ sid, user }: { sid: string; user: string }) => {
    console.log(`[Socket] peer_left: ${user} (${sid})`);
    const state = useSessionStore.getState();
    state.setRoomUsers(state.roomUsers.filter((u) => u.sid !== sid));
    if (state.screenSharerSid === sid) {
      state.setScreenSharer(null);
    }
  });

  socket.on('peer_joined', ({ sid, user, campus, role }: { sid: string; user: string; campus: string; role: string }) => {
    console.log(`[Socket] peer_joined: ${user} (${sid}) from ${campus}`);
    const state = useSessionStore.getState();
    const exists = state.roomUsers.find((u) => u.sid === sid);
    if (!exists) {
      state.addRoomUser({ sid, user, campus, role, stream: undefined });
    }
  });

  socket.on('peer_portal_mode', ({ sid, active, meeting }: { sid: string; active: boolean; meeting?: boolean }) => {
    console.log(`[Socket] peer_portal_mode: ${sid} -> active=${active}, meeting=${meeting}`);
    useSessionStore.getState().setRemotePortalMode(sid, active);
    useSessionStore.getState().setRemoteMeetingMode(sid, meeting ?? false);
  });

  socket.on('screen_share_started', ({ sid, user }: { sid: string; user: string }) => {
    console.log(`[Socket] screen_share_started: ${user} (${sid})`);
    useSessionStore.getState().setScreenSharer(sid);
  });

  socket.on('screen_share_stopped', ({ sid }: { sid: string }) => {
    console.log(`[Socket] screen_share_stopped: ${sid}`);
    const current = useSessionStore.getState().screenSharerSid;
    if (current === sid) {
      useSessionStore.getState().setScreenSharer(null);
    }
  });

  socket.on('emergency_alert', (data) => {
    console.log('[Socket] emergency_alert:', data);
    setEmergency(true, data.message, data.triggered_by, data.triggered_by_role, data.campus_label, data.campus_only);
  });

  socket.on('emergency_dismissed', () => {
    console.log('[Socket] emergency_dismissed');
    setEmergency(false);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('[Socket] Connection error:', err.message);
  });

  return socket;
}

export function useSocket() {
  const token = useAuthStore((state) => state.token);
  const { setRoomUsers, setEmergency } = useSessionStore();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
        pendingEvents = [];
      }
      return;
    }

    const s = initSocket(token, setRoomUsers, setEmergency);

    const onConnect = () => forceUpdate((n) => n + 1);
    const onDisconnect = () => forceUpdate((n) => n + 1);

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);

    if (s.connected) forceUpdate((n) => n + 1);

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
    };
  }, [token, setRoomUsers, setEmergency]);

  const emit = useCallback((event: string, data?: any) => {
    if (socket?.connected) {
      console.log('[Socket] Emitting:', event, data);
      socket.emit(event, data);
    } else {
      console.log('[Socket] Queuing (not connected):', event, data);
      pendingEvents.push({ event, data });
    }
  }, []);

  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    socket?.on(event, callback);
    return () => {
      socket?.off(event, callback);
    };
  }, []);

  return { socket, emit, on, isConnected: socket?.connected || false };
}
