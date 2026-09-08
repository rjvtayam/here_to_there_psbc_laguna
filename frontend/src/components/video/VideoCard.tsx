import { useRef, useEffect } from 'react';
import { Mic, MicOff, MonitorUp, Radio, VideoOff, User, Lock } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';

interface VideoCardProps {
  stream: MediaStream | null;
  name: string;
  campus: string;
  isMuted?: boolean;
  isScreenSharing?: boolean;
  isHighlighted?: boolean;
  highlightColor?: 'cyan' | 'purple';
  isLocal?: boolean;
  isSmall?: boolean;
  isPortalLive?: boolean;
  isVideoOff?: boolean;
  isScreenShare?: boolean;
  portalStatus?: 'portal' | 'meeting' | 'live' | null;
}

export function VideoCard({
  stream,
  name,
  campus,
  isMuted = false,
  isScreenSharing = false,
  isHighlighted = false,
  highlightColor = 'cyan',
  isLocal = false,
  isSmall = false,
  isPortalLive = false,
  isVideoOff = false,
  isScreenShare = false,
  portalStatus = null,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mirrorVideo = useSettingsStore((s) => s.mirrorVideo);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isVideoOff]);

  const campusColors: Record<string, { bg: string; text: string; dot: string }> = {
    paete: { bg: 'bg-cyan-500/10 border-cyan-500/20', text: 'text-cyan-400', dot: 'bg-cyan-400' },
    pagsanjan: { bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-400' },
    control_room: { bg: 'bg-primary-500/10 border-primary-500/20', text: 'text-primary-400', dot: 'bg-primary-400' },
  };

  const colors = campusColors[campus] || campusColors.control_room;

  const highlightClasses = isHighlighted
    ? highlightColor === 'cyan'
      ? 'campus-highlight-paete'
      : 'campus-highlight-pagsanjan'
    : '';

  return (
    <div className={`relative rounded-xl overflow-hidden bg-gray-900 border border-gray-800/60 group transition-all duration-300 ${highlightClasses} ${isSmall ? 'h-20 sm:h-24 md:h-32' : isScreenShare ? 'h-full' : 'h-full max-h-[500px]'}`}>
      {stream && !isVideoOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`w-full h-full object-cover ${isLocal && mirrorVideo ? 'scale-x-[-1]' : ''}`}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 relative overflow-hidden">
          {/* Animated background rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-gray-700/30 animate-ping" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border border-gray-700/20 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          </div>
          {/* Avatar */}
          <div className="relative z-10 w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-700/50 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <User size={18} className="text-gray-500" />
          </div>
          {/* Label */}
          <div className="relative z-10 flex items-center gap-1 text-[9px] text-gray-500 bg-gray-800/80 px-2 py-0.5 rounded-full border border-gray-700/40">
            <VideoOff size={9} />
            <span>Camera Off</span>
          </div>
        </div>
      )}

      <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${colors.bg} ${colors.text}`}>
              {campus === 'control_room' ? 'CTRL' : campus.toUpperCase().slice(0, 4)}
            </span>
            <span className="text-white text-[10px] sm:text-xs font-medium truncate max-w-[60px] sm:max-w-[100px]">
              {isLocal ? 'You' : name}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {isScreenSharing && (
              <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded">
                <MonitorUp size={10} /> SCREEN
              </span>
            )}
            {!isLocal && portalStatus === 'meeting' && (
              <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                <Lock size={10} /> IN MEETING
              </span>
            )}
            {!isLocal && portalStatus === 'portal' && isPortalLive && (
              <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 border border-green-500/30 px-1.5 py-0.5 rounded">
                <Radio size={10} /> PORTAL
              </span>
            )}
            {!isLocal && portalStatus === 'live' && isPortalLive && (
              <span className="flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 rounded animate-pulse">
                <Radio size={10} /> LIVE
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
            {isMuted ? <MicOff size={10} /> : <Mic size={10} />}
            {isMuted ? 'Muted' : 'Live'}
          </div>
        </div>
      </div>
    </div>
  );
}
