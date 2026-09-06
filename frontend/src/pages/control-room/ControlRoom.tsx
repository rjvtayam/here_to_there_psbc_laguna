import { useEffect, useState, useRef } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { VideoCard } from '../../components/video/VideoCard';
import { VideoControls } from '../../components/video/VideoControls';
import { TalkButton } from '../../components/controls/TalkButton';
import { EmergencyButton, EmergencyAlert } from '../../components/controls/EmergencyButton';
import { BulletinBoard } from '../../components/announcements/BulletinBoard';
import { ChatPanel } from '../../components/chat/ChatPanel';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useSocket } from '../../hooks/useSocket';
import { usePeerStore } from '../../stores/peerStore';
import { useSessionStore } from '../../stores/sessionStore';
import { useAuthStore } from '../../stores/authStore';
import { ROOMS } from '../../lib/constants';
import { Users, Wifi, MessageSquare, MonitorUp } from 'lucide-react';
import { PortalToggle } from '../../components/controls/PortalToggle';
import { PortalStatusIndicator } from '../../components/indicators/PortalStatusIndicator';
import { MicTalkingIndicator } from '../../components/indicators/MicTalkingIndicator';

export function ControlRoom() {
  const roomId = ROOMS.MAIN;
  const { startLocalStream, toggleVideo, shareScreen } = useWebRTC(roomId);
  const { emit } = useSocket();
  const { localStream, isVideoOff, isScreenSharing, localMicActive } = usePeerStore();
  const { roomUsers, isEmergency, remotePortalModes, remoteMeetingModes, screenSharerSid, portalMode, meetingMode } = useSessionStore();
  const { user } = useAuthStore();
  const [activeTalkTarget, setActiveTalkTarget] = useState<'paete' | 'pagsanjan' | 'both' | null>(null);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showOnlinePanel, setShowOnlinePanel] = useState(false);
  const onlinePanelRef = useRef<HTMLDivElement>(null);

  const myCampus = user?.campus;
  const mySid = useSocket().socket?.id;
  const isAdmin = user?.role === 'admin';
  const { setTalkTarget, setLocalMicActive } = usePeerStore();

  useEffect(() => {
    const init = async () => {
      try {
        await startLocalStream();
        emit('join_room', { room_id: roomId });
        emit('portal_mode_changed', { active: portalMode, meeting: meetingMode });
      } catch (err) {
        console.error('[ControlRoom] Error in init:', err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (onlinePanelRef.current && !onlinePanelRef.current.contains(e.target as Node)) {
        setShowOnlinePanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isEmergency) {
    return <EmergencyAlert />;
  }

  const remoteUsers = roomUsers.filter((u) => {
    if (u.sid === mySid) return false;
    if (isAdmin) return true;
    return u.role !== 'admin';
  });

  const handleTalkTo = (target: 'paete' | 'pagsanjan' | 'both') => {
    setActiveTalkTarget((prev) => {
      const next = prev === target ? null : target;
      if (next === 'both') {
        setTalkTarget('paete');
        setLocalMicActive(true);
      } else {
        setTalkTarget(next);
        setLocalMicActive(false);
      }
      return next;
    });
  };

  const getHighlight = (campus: string) => {
    if (isAdmin) {
      return { isHighlighted: true, highlightColor: campus === 'paete' ? 'cyan' as const : 'purple' as const };
    }
    return { isHighlighted: false, highlightColor: 'cyan' as const };
  };

  const getGridClass = (count: number) => {
    if (count <= 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 6) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  const campusColors: Record<string, string> = {
    paete: 'bg-cyan-500',
    pagsanjan: 'bg-purple-500',
    control_room: 'bg-primary-500',
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="font-orbitron text-2xl font-bold text-white">Control Room</h1>
            <span className="flex items-center gap-1.5 text-green-400 font-medium text-sm">
              <Wifi size={14} /> SYSTEM ONLINE
            </span>
            {isAdmin && (
              <span className="text-[10px] text-primary-400 bg-primary-500/10 border border-primary-500/20 px-2 py-1 rounded-md font-semibold">
                ADMIN VIEW
              </span>
            )}
            {myCampus && myCampus !== 'control_room' && (
              <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-1 rounded-md border border-gray-700/50">
                Viewing as: <span className="text-primary-400 font-semibold">{myCampus.toUpperCase()}</span> Principal
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Clickable Online Count */}
            <div className="relative" ref={onlinePanelRef}>
              <button
                onClick={() => setShowOnlinePanel(!showOnlinePanel)}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-700"
              >
                <Users size={14} /> {roomUsers.length} online
              </button>

              {showOnlinePanel && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-700">
                    <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Online Users ({roomUsers.length})</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {roomUsers.map((u) => {
                      const isMe = u.sid === mySid;
                      return (
                        <div
                          key={u.sid}
                          className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
                            isMe ? 'bg-primary-500/10 border-l-2 border-primary-500' : 'hover:bg-gray-700/50'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full ${campusColors[u.campus] || 'bg-gray-600'} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                            {u.user?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">
                              {u.user}
                              {isMe && <span className="ml-1.5 text-[10px] text-primary-400 font-semibold">(You)</span>}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase">{u.campus?.replace('_', ' ')} &middot; {u.role}</p>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <PortalStatusIndicator />
            <MicTalkingIndicator />
            <button
              onClick={() => setShowChat(true)}
              className="relative p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              <MessageSquare size={18} />
            </button>
            <BulletinBoard />
          </div>
        </header>

        {/* Video Grid */}
        <div className="flex-1 mb-4">
          {screenSharerSid ? (
            /* Screen Sharing Mode - Google Meet style */
            <div className="h-full flex flex-col gap-3">
              {/* Main shared screen */}
              {(() => {
                const isLocalSharer = screenSharerSid === mySid;
                const sharer = isLocalSharer
                  ? { sid: mySid, user: user?.full_name || 'You', campus: myCampus || 'control_room', stream: localStream }
                  : remoteUsers.find((u) => u.sid === screenSharerSid);
                if (sharer) {
                  return (
                    <div className="flex-1 relative">
                      <VideoCard
                        stream={sharer.stream || null}
                        name={sharer.user}
                        campus={sharer.campus}
                        isLocal={isLocalSharer}
                        {...(!isLocalSharer ? getHighlight(sharer.campus) : {})}
                        isPortalLive={!isLocalSharer && (remotePortalModes[sharer.sid] ?? false)}
                        portalStatus={!isLocalSharer ? (remoteMeetingModes[sharer.sid] ? 'meeting' : (remotePortalModes[sharer.sid] ? 'portal' : 'live')) : null}
                        isScreenShare={true}
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] text-green-400 bg-green-500/15 border border-green-500/30 px-2 py-1 rounded-lg font-semibold backdrop-blur-sm">
                        <MonitorUp size={12} />
                        {isLocalSharer ? 'You are presenting' : `${sharer.user} is presenting`}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              {/* Participant thumbnails */}
              {remoteUsers.filter((u) => u.sid !== screenSharerSid).length > 0 && (
                <div className="flex gap-2 h-28 flex-shrink-0 overflow-x-auto">
                  {remoteUsers.filter((u) => u.sid !== screenSharerSid).map((u) => (
                    <div key={u.sid} className="w-40 flex-shrink-0">
                      <VideoCard
                        stream={u.stream || null}
                        name={u.user}
                        campus={u.campus}
                        isSmall={true}
                        isPortalLive={remotePortalModes[u.sid] ?? false}
                        portalStatus={remoteMeetingModes[u.sid] ? 'meeting' : (remotePortalModes[u.sid] ? 'portal' : 'live')}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : remoteUsers.length > 0 ? (
            /* Normal Grid Mode */
            <div className={`grid ${getGridClass(remoteUsers.length)} gap-3 h-full`}>
              {remoteUsers.map((u) => (
                <VideoCard
                  key={u.sid}
                  stream={u.stream || null}
                  name={u.user}
                  campus={u.campus}
                  {...getHighlight(u.campus)}
                  isPortalLive={remotePortalModes[u.sid] ?? false}
                  portalStatus={remoteMeetingModes[u.sid] ? 'meeting' : (remotePortalModes[u.sid] ? 'portal' : 'live')}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-gray-900/50 rounded-xl border border-gray-800/40">
              <Users size={32} className="text-gray-600 mb-2" />
              <p className="text-gray-500 font-medium">Waiting for connections...</p>
              <p className="text-gray-600 text-xs mt-1">Other users will appear here when they join</p>
            </div>
          )}
        </div>

        {/* Your Feed + Controls */}
        <div className="flex items-center gap-4">
          {/* Local Feed */}
          <div className="w-48 flex-shrink-0">
            <VideoCard
              stream={localStream}
              name={user?.full_name || 'You'}
              campus={myCampus || 'control_room'}
              isLocal={true}
              isSmall={true}
              isVideoOff={isVideoOff}
            />
          </div>

          {/* Controls */}
          <div className="flex-1 bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-800/60 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {myCampus && myCampus !== 'control_room' && (
                <>
                  <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700/50">
                    Campus: <span className="text-white font-semibold">{myCampus.toUpperCase()}</span>
                  </span>
                  <TalkButton
                    target={myCampus === 'paete' ? 'pagsanjan' : 'paete'}
                    isActive={activeTalkTarget !== null}
                    onClick={() => handleTalkTo(myCampus === 'paete' ? 'pagsanjan' : 'paete')}
                    disabled={portalMode}
                  />
                </>
              )}
              {!myCampus || myCampus === 'control_room' ? (
                <>
                  <TalkButton target="paete" isActive={activeTalkTarget === 'paete'} onClick={() => handleTalkTo('paete')} disabled={portalMode && !meetingMode} />
                  <TalkButton target="pagsanjan" isActive={activeTalkTarget === 'pagsanjan'} onClick={() => handleTalkTo('pagsanjan')} disabled={portalMode && !meetingMode} />
                  <TalkButton target="both" isActive={activeTalkTarget === 'both'} onClick={() => handleTalkTo('both')} disabled={portalMode && !meetingMode} />
                </>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <PortalToggle />
              <VideoControls
                isAudioMuted={!localMicActive}
                isVideoOff={isVideoOff}
                isScreenSharing={isScreenSharing}
                onToggleAudio={() => !(portalMode && !meetingMode) && setLocalMicActive(!localMicActive)}
                onToggleVideo={toggleVideo}
                onToggleScreenShare={() => !(portalMode && !meetingMode) && shareScreen().catch(() => {})}
                audioDisabled={portalMode && !meetingMode}
                screenShareDisabled={portalMode && !meetingMode}
              />
              <EmergencyButton onClick={() => !(portalMode && !meetingMode) && setShowEmergencyConfirm(true)} disabled={portalMode && !meetingMode} />
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showEmergencyConfirm}
        title="Trigger Emergency Broadcast?"
        message="This will immediately override all campus screens with an emergency alert. This action cannot be undone."
        confirmLabel="Trigger Emergency"
        cancelLabel="Cancel"
        variant="danger"
        icon="radio"
        onConfirm={() => {
          emit('emergency_trigger', { message: 'Emergency from Control Room' });
          setShowEmergencyConfirm(false);
        }}
        onCancel={() => setShowEmergencyConfirm(false)}
      />

      <ChatPanel isOpen={showChat} onClose={() => setShowChat(false)} />
    </DashboardLayout>
  );
}
