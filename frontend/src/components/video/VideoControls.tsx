import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff } from 'lucide-react';

interface VideoControlsProps {
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  audioDisabled?: boolean;
  screenShareDisabled?: boolean;
}

export function VideoControls({
  isAudioMuted,
  isVideoOff,
  isScreenSharing,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  audioDisabled,
  screenShareDisabled,
}: VideoControlsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onToggleAudio}
        disabled={audioDisabled}
        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
          audioDisabled
            ? 'bg-gray-800 text-gray-600 border border-gray-700/30 cursor-not-allowed opacity-50'
            : isAudioMuted
              ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-transparent'
        }`}
        title={audioDisabled ? 'Disabled during Live Portal' : isAudioMuted ? 'Unmute' : 'Mute'}
      >
        {isAudioMuted ? <MicOff size={14} /> : <Mic size={14} />}
      </button>

      <button
        onClick={onToggleVideo}
        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
          isVideoOff
            ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-transparent'
        }`}
        title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
      >
        {isVideoOff ? <VideoOff size={14} /> : <Video size={14} />}
      </button>

      <button
        onClick={onToggleScreenShare}
        disabled={screenShareDisabled}
        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
          screenShareDisabled
            ? 'bg-gray-800 text-gray-600 border border-gray-700/30 cursor-not-allowed opacity-50'
            : isScreenSharing
              ? 'bg-primary-500/20 border border-primary-500/40 text-primary-400 hover:bg-primary-500/30'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-transparent'
        }`}
        title={screenShareDisabled ? 'Disabled during Live Portal' : isScreenSharing ? 'Stop sharing' : 'Share screen'}
      >
        {isScreenSharing ? <MonitorOff size={14} /> : <Monitor size={14} />}
      </button>
    </div>
  );
}
