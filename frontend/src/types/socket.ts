export interface ClientToServerEvents {
  join_room: (data: { room_id: string }) => void;
  leave_room: (data: { room_id: string }) => void;
  webrtc_offer: (data: { target_sid: string; offer: RTCSessionDescriptionInit; sender_name: string; sender_campus: string }) => void;
  webrtc_answer: (data: { target_sid: string; answer: RTCSessionDescriptionInit; sender_name: string }) => void;
  ice_candidate: (data: { target_sid: string; candidate: RTCIceCandidateInit }) => void;
  mute_audio: (data: { muted: boolean }) => void;
  mute_video: (data: { video_off: boolean }) => void;
  screen_share_start: () => void;
  screen_share_stop: () => void;
  emergency_trigger: (data: { message?: string }) => void;
  bulletin_update: (data: { title: string; content: string; type: string }) => void;
  chat_message: (data: { message: string; target?: string }) => void;
  talk_to: (data: { target: string }) => void;
  portal_mode_changed: (data: { active: boolean }) => void;
}

export interface ServerToClientEvents {
  room_users: (data: { users: Array<{ sid: string; user: string; campus: string; role: string }> }) => void;
  peer_joined: (data: { sid: string; user: string; campus: string; role: string }) => void;
  peer_left: (data: { sid: string; user: string }) => void;
  webrtc_offer: (data: { offer: RTCSessionDescriptionInit; sender_sid: string; sender_name: string; sender_campus: string }) => void;
  webrtc_answer: (data: { answer: RTCSessionDescriptionInit; sender_sid: string; sender_name: string }) => void;
  ice_candidate: (data: { candidate: RTCIceCandidateInit; sender_sid: string }) => void;
  peer_muted: (data: { sid: string; user: string; muted: boolean }) => void;
  peer_video_toggled: (data: { sid: string; user: string; video_off: boolean }) => void;
  screen_share_started: (data: { sid: string; user: string }) => void;
  screen_share_stopped: (data: { sid: string; user: string }) => void;
  emergency_alert: (data: { triggered_by: string; campus: string; message: string }) => void;
  bulletin_new: (data: { title: string; content: string; type: string; created_by: string }) => void;
  peer_talk_target: (data: { sender_sid: string; sender_campus: string; target: string }) => void;
  peer_portal_mode: (data: { sid: string; active: boolean }) => void;
  chat_message: (data: { sender: string; sender_campus: string; message: string; target?: string }) => void;
}

export type SocketEvents = ClientToServerEvents & ServerToClientEvents;
