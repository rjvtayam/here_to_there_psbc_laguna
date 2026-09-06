import { VideoFeed } from './VideoFeed';
import { RoomUser } from '../../types/session';

interface VideoGridProps {
  localStream: MediaStream | null;
  users: RoomUser[];
  isMuted: boolean;
}

export function VideoGrid({ localStream, users, isMuted }: VideoGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="bg-gray-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold">You</h3>
          <span className="text-green-400 text-sm">LOCAL</span>
        </div>
        <VideoFeed stream={localStream} muted={true} className="h-[calc(100%-2rem)]" />
      </div>

      {users.map((user) => (
        <div key={user.sid} className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">{user.user}</h3>
            <span className="text-green-400 text-sm">{user.campus?.toUpperCase()}</span>
          </div>
          <VideoFeed stream={user.stream} muted={isMuted} className="h-[calc(100%-2rem)]" />
        </div>
      ))}
    </div>
  );
}
