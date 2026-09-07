import { create } from 'zustand';
import { RoomUser } from '../types/session';

interface SessionState {
  currentRoom: string | null;
  roomUsers: RoomUser[];
  isEmergency: boolean;
  emergencyMessage: string | null;
  emergencyTriggeredBy: string | null;
  emergencyTriggeredByRole: string | null;
  emergencyCampus: string | null;
  emergencyCampusOnly: boolean;
  portalMode: boolean;
  meetingMode: boolean;
  remotePortalModes: Record<string, boolean>;
  remoteMeetingModes: Record<string, boolean>;
  screenSharerSid: string | null;
  setCurrentRoom: (roomId: string | null) => void;
  setRoomUsers: (users: RoomUser[]) => void;
  addRoomUser: (user: RoomUser) => void;
  removeRoomUser: (sid: string) => void;
  updateUserStream: (sid: string, stream: MediaStream) => void;
  setEmergency: (active: boolean, message?: string, triggeredBy?: string, triggeredByRole?: string, campus?: string, campusOnly?: boolean) => void;
  togglePortalMode: () => void;
  setPortalMode: (active: boolean) => void;
  setMeetingMode: (active: boolean) => void;
  setRemotePortalMode: (sid: string, active: boolean) => void;
  setRemoteMeetingMode: (sid: string, active: boolean) => void;
  setScreenSharer: (sid: string | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  currentRoom: null,
  roomUsers: [],
  isEmergency: false,
  emergencyMessage: null,
  emergencyTriggeredBy: null,
  emergencyTriggeredByRole: null,
  emergencyCampus: null,
  emergencyCampusOnly: false,
  portalMode: true,
  meetingMode: false,
  remotePortalModes: {},
  remoteMeetingModes: {},
  screenSharerSid: null,

  setCurrentRoom: (roomId) => set({ currentRoom: roomId }),

  setRoomUsers: (users) => set({ roomUsers: users }),

  addRoomUser: (user) =>
    set((state) => ({
      roomUsers: [...state.roomUsers.filter((u) => u.sid !== user.sid), user],
    })),

  removeRoomUser: (sid) =>
    set((state) => ({
      roomUsers: state.roomUsers.filter((u) => u.sid !== sid),
    })),

  updateUserStream: (sid, stream) =>
    set((state) => ({
      roomUsers: state.roomUsers.map((u) =>
        u.sid === sid ? { ...u, stream } : u
      ),
    })),

  setEmergency: (active, message, triggeredBy, triggeredByRole, campus, campusOnly) =>
    set({ isEmergency: active, emergencyMessage: message || null, emergencyTriggeredBy: triggeredBy || null, emergencyTriggeredByRole: triggeredByRole || null, emergencyCampus: campus || null, emergencyCampusOnly: campusOnly ?? false }),

  togglePortalMode: () =>
    set((state) => ({ portalMode: !state.portalMode })),

  setPortalMode: (active) => set({ portalMode: active }),

  setMeetingMode: (active) => set({ meetingMode: active }),

  setRemotePortalMode: (sid, active) =>
    set((state) => ({
      remotePortalModes: { ...state.remotePortalModes, [sid]: active },
    })),

  setRemoteMeetingMode: (sid, active) =>
    set((state) => ({
      remoteMeetingModes: { ...state.remoteMeetingModes, [sid]: active },
    })),

  setScreenSharer: (sid) => set({ screenSharerSid: sid }),
}));
