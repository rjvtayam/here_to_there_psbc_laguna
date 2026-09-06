export interface PeerConnection {
  sid: string;
  user: string;
  campus: string;
  role: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

export interface RTCConfig {
  iceServers: RTCIceServer[];
}

export const defaultRTCConfig: RTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};
