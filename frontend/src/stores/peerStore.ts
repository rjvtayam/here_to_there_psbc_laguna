import { create } from 'zustand';
import { PeerConnection } from '../types/webrtc';

interface PeerState {
  peers: Map<string, PeerConnection>;
  localStream: MediaStream | null;
  screenStream: MediaStream | null;
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  talkTarget: 'paete' | 'pagsanjan' | null;
  localMicActive: boolean;
  addPeer: (sid: string, peer: PeerConnection) => void;
  removePeer: (sid: string) => void;
  updatePeerStream: (sid: string, stream: MediaStream) => void;
  setLocalStream: (stream: MediaStream | null) => void;
  setScreenStream: (stream: MediaStream | null) => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  setTalkTarget: (target: 'paete' | 'pagsanjan' | null) => void;
  setLocalMicActive: (active: boolean) => void;
  getCombinedTarget: () => 'paete' | 'pagsanjan' | 'both' | 'local' | null;
}

export const usePeerStore = create<PeerState>((set, get) => ({
  peers: new Map(),
  localStream: null,
  screenStream: null,
  isAudioMuted: true,
  isVideoOff: false,
  isScreenSharing: false,
  talkTarget: null,
  localMicActive: false,

  addPeer: (sid, peer) =>
    set((state) => {
      const newPeers = new Map(state.peers);
      newPeers.set(sid, peer);
      return { peers: newPeers };
    }),

  removePeer: (sid) =>
    set((state) => {
      const newPeers = new Map(state.peers);
      newPeers.delete(sid);
      return { peers: newPeers };
    }),

  updatePeerStream: (sid, stream) =>
    set((state) => {
      const newPeers = new Map(state.peers);
      const peer = newPeers.get(sid);
      if (peer) {
        newPeers.set(sid, { ...peer, stream });
      }
      return { peers: newPeers };
    }),

  setLocalStream: (stream) => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => { track.enabled = false; });
    }
    set({ localStream: stream });
  },

  setScreenStream: (stream) => set({ screenStream: stream }),

  toggleAudio: () => {
    const { localStream, isAudioMuted } = get();
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isAudioMuted;
      });
    }
    set({ isAudioMuted: !isAudioMuted });
  },

  toggleVideo: () => {
    const { localStream, isVideoOff } = get();
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff;
      });
    }
    set({ isVideoOff: !isVideoOff });
  },

  toggleScreenShare: () =>
    set((state) => ({ isScreenSharing: !state.isScreenSharing })),

  setTalkTarget: (target) => {
    set({ talkTarget: target });
    const { localStream, localMicActive } = get();
    if (localStream) {
      const shouldEnable = target !== null || localMicActive;
      localStream.getAudioTracks().forEach((track) => { track.enabled = shouldEnable; });
      set({ isAudioMuted: !shouldEnable });
    }
  },

  setLocalMicActive: (active) => {
    set({ localMicActive: active });
    const { localStream, talkTarget } = get();
    if (localStream) {
      const shouldEnable = active || talkTarget !== null;
      localStream.getAudioTracks().forEach((track) => { track.enabled = shouldEnable; });
      set({ isAudioMuted: !shouldEnable });
    }
  },

  getCombinedTarget: () => {
    const { talkTarget, localMicActive } = get();
    if (talkTarget && localMicActive) return 'both';
    if (talkTarget) return talkTarget;
    if (localMicActive) return 'local';
    return null;
  },
}));
