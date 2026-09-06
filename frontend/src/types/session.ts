export interface Session {
  id: string;
  title: string;
  initiated_by: string;
  status: 'active' | 'ended';
  started_at: string;
  ended_at: string | null;
}

export interface RoomUser {
  sid: string;
  user: string;
  campus: string;
  role: string;
  stream?: MediaStream;
}
