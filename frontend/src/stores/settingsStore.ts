import { create } from 'zustand';

export interface SettingsState {
  hdVideo: boolean;
  mirrorVideo: boolean;
  hdAudio: boolean;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  autoReconnect: boolean;
  lowLatency: boolean;
  notifications: boolean;
  darkMode: boolean;
  setHdVideo: (v: boolean) => void;
  setMirrorVideo: (v: boolean) => void;
  setHdAudio: (v: boolean) => void;
  setEchoCancellation: (v: boolean) => void;
  setNoiseSuppression: (v: boolean) => void;
  setAutoGainControl: (v: boolean) => void;
  setAutoReconnect: (v: boolean) => void;
  setLowLatency: (v: boolean) => void;
  setNotifications: (v: boolean) => void;
  setDarkMode: (v: boolean) => void;
  loadSettings: () => void;
  saveSettings: () => void;
  getVideoConstraints: () => MediaTrackConstraints;
  getAudioConstraints: () => MediaTrackConstraints;
}

function loadFromStorage(): Partial<SettingsState> {
  try {
    const raw = localStorage.getItem('ht-settings');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(state: SettingsState) {
  const { loadSettings, saveSettings, getVideoConstraints, getAudioConstraints, ...data } = state;
  localStorage.setItem('ht-settings', JSON.stringify(data));
}

const defaults = {
  hdVideo: true,
  mirrorVideo: false,
  hdAudio: true,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: false,
  autoReconnect: true,
  lowLatency: true,
  notifications: true,
  darkMode: true,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaults,

  setHdVideo: (v) => set({ hdVideo: v }),
  setMirrorVideo: (v) => set({ mirrorVideo: v }),
  setHdAudio: (v) => set({ hdAudio: v }),
  setEchoCancellation: (v) => set({ echoCancellation: v }),
  setNoiseSuppression: (v) => set({ noiseSuppression: v }),
  setAutoGainControl: (v) => set({ autoGainControl: v }),
  setAutoReconnect: (v) => set({ autoReconnect: v }),
  setLowLatency: (v) => set({ lowLatency: v }),
  setNotifications: (v) => set({ notifications: v }),
  setDarkMode: (v) => set({ darkMode: v }),

  loadSettings: () => {
    const saved = loadFromStorage();
    set({ ...defaults, ...saved });
  },

  saveSettings: () => {
    saveToStorage(get());
  },

  getVideoConstraints: () => {
    const { hdVideo } = get();
    if (hdVideo) {
      return {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 },
      };
    }
    return {
      width: { ideal: 640 },
      height: { ideal: 480 },
      frameRate: { ideal: 24 },
    };
  },

  getAudioConstraints: () => {
    const { hdAudio, echoCancellation, noiseSuppression, autoGainControl } = get();
    return {
      sampleRate: hdAudio ? { ideal: 48000 } : { ideal: 16000 },
      echoCancellation,
      noiseSuppression,
      autoGainControl,
    };
  },
}));
