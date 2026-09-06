import { VideoFeed } from '../../components/video/VideoFeed';
import { RoomUser } from '../../types/session';

interface SplitScreenProps {
  paeteUser: RoomUser | undefined;
  pagsanjanUser: RoomUser | undefined;
}

export function SplitScreen({ paeteUser, pagsanjanUser }: SplitScreenProps) {
  return (
    <div className="flex-1 grid grid-cols-2 gap-4">
      <div className="bg-gray-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-semibold">PSBC PAETE</h2>
          <span className={`text-sm font-medium ${paeteUser ? 'text-green-400' : 'text-gray-500'}`}>
            {paeteUser ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
        <VideoFeed
          stream={paeteUser?.stream}
          label="Paete Campus"
          className="h-[calc(100%-2rem)]"
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-semibold">PSBC PAGSANJAN</h2>
          <span className={`text-sm font-medium ${pagsanjanUser ? 'text-green-400' : 'text-gray-500'}`}>
            {pagsanjanUser ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
        <VideoFeed
          stream={pagsanjanUser?.stream}
          label="Pagsanjan Campus"
          className="h-[calc(100%-2rem)]"
        />
      </div>
    </div>
  );
}
