import { useEffect, useState, useRef } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { VideoCard } from '../../components/video/VideoCard';
import { VideoControls } from '../../components/video/VideoControls';
import { TalkButton } from '../../components/controls/TalkButton';
import { EmergencyButton } from '../../components/controls/EmergencyButton';
import { BulletinBoard } from '../../components/announcements/BulletinBoard';
import { ChatPanel } from '../../components/chat/ChatPanel';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useSocket } from '../../hooks/useSocket';
import { usePeerStore } from '../../stores/peerStore';
import { useSessionStore } from '../../stores/sessionStore';
import { useAuthStore } from '../../stores/authStore';
import { ROOMS } from '../../lib/constants';
import { Users, Wifi, MessageSquare, MonitorUp, AlertTriangle } from 'lucide-react';
import { PortalToggle } from '../../components/controls/PortalToggle';
import { PortalStatusIndicator } from '../../components/indicators/PortalStatusIndicator';
import { MicTalkingIndicator } from '../../components/indicators/MicTalkingIndicator';
import { WelcomeToast } from '../../components/demo/WelcomeToast';
import { LiveDemo } from '../../components/demo/LiveDemo';

export function ControlRoom() {
  const roomId = ROOMS.MAIN;
  const { startLocalStream, toggleVideo, shareScreen } = useWebRTC(roomId);
  const { emit } = useSocket();
  const { localStream, isVideoOff, isScreenSharing, localMicActive } = usePeerStore();
  const { roomUsers, isEmergency, emergencyTriggeredBy, remotePortalModes, remoteMeetingModes, screenSharerSid, portalMode, meetingMode } = useSessionStore();
  const { user } = useAuthStore();
  const [activeTalkTarget, setActiveTalkTarget] = useState<'paete' | 'pagsanjan' | 'both' | null>(null);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showOnlinePanel, setShowOnlinePanel] = useState(false);
  const onlinePanelRef = useRef<HTMLDivElement>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showLiveDemo, setShowLiveDemo] = useState(false);
  const [demoData, setDemoData] = useState<{ userId: string; name: string; campus: string; role: string } | null>(null);

  const myCampus = user?.campus;
  const mySid = useSocket().socket?.id;
  const isAdmin = user?.role === 'admin';
  const { setTalkTarget, setLocalMicActive } = usePeerStore();

  useEffect(() => {
    const pending = localStorage.getItem('pending_live_demo');
    if (pending) {
      const data = JSON.parse(pending);
      if (data?.name && data?.campus && data?.role) {
        setDemoData(data);
        setShowWelcome(true);
      }
    }
  }, []);

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
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2';
    if (count <= 4) return 'grid-cols-1 sm:grid-cols-2';
    if (count <= 6) return 'grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  const campusColors: Record<string, string> = {
    paete: 'bg-cyan-500',
    pagsanjan: 'bg-purple-500',
    control_room: 'bg-primary-500',
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col p-2 sm:p-3 md:p-4">
        {/* Header */}
        <header className="flex items-center justify-between gap-2 mb-2 sm:mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-wrap">
            <h1 className="font-orbitron text-lg sm:text-xl md:text-2xl font-bold text-white truncate">Control Room</h1>
            <span className="flex items-center gap-1 text-green-400 font-medium text-xs">
              <Wifi size={12} /> <span className="hidden sm:inline">SYSTEM ONLINE</span>
            </span>
            {isAdmin && (
              <span className="text-[10px] text-primary-400 bg-primary-500/10 border border-primary-500/20 px-1.5 py-0.5 rounded-md font-semibold" data-demo="campus-badge">
                ADMIN
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div className="relative" ref={onlinePanelRef}>
              <button
                onClick={() => setShowOnlinePanel(!showOnlinePanel)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors px-1.5 sm:px-2 py-1.5 rounded-lg hover:bg-gray-700"
                data-demo="online-count"
              >
                <Users size={14} /> <span className="hidden xs:inline">{roomUsers.length}</span>
              </button>

              {showOnlinePanel && (
                <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-700 flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Online ({roomUsers.length})</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] text-green-400 font-medium">LIVE</span>
                    </div>
                  </div>
                  {isEmergency && (
                    <div className="px-3 py-2 bg-red-500/15 border-b border-red-500/30 flex items-center gap-2">
                      <AlertTriangle size={12} className="text-red-400 flex-shrink-0" />
                      <span className="text-[11px] text-red-300 font-medium">
                        Emergency — {emergencyTriggeredBy}
                      </span>
                    </div>
                  )}
                  <div className="max-h-64 overflow-y-auto">
                    {roomUsers.map((u) => {
                      const isMe = u.sid === mySid;
                      return (
                        <div
                          key={u.sid}
                          className={`flex items-center gap-2 sm:gap-3 px-3 py-2 transition-colors ${
                            isMe ? 'bg-primary-500/10 border-l-2 border-primary-500' : 'hover:bg-gray-700/50'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-full ${campusColors[u.campus] || 'bg-gray-600'} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                            {u.user?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-white truncate">
                              {u.user}
                              {isMe && <span className="ml-1 text-[10px] text-primary-400 font-semibold">(You)</span>}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase truncate">{u.campus?.replace('_', ' ')} · {u.role}</p>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex"><PortalStatusIndicator /></div>
            <div className="hidden md:flex"><MicTalkingIndicator /></div>
            <button
              onClick={() => setShowChat(true)}
              className="p-1.5 sm:p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              data-demo="btn-chat"
            >
              <MessageSquare size={16} />
            </button>
            <div data-demo="btn-bell"><BulletinBoard /></div>
          </div>
        </header>

        {/* Video Grid */}
        <div className="flex-1 mb-2 sm:mb-3 md:mb-4 min-h-0" data-demo="remote-area">
          {screenSharerSid ? (
            <div className="h-full flex flex-col gap-2 sm:gap-3">
              {(() => {
                const isLocalSharer = screenSharerSid === mySid;
                const sharer = isLocalSharer
                  ? { sid: mySid, user: user?.full_name || 'You', campus: myCampus || 'control_room', stream: localStream }
                  : remoteUsers.find((u) => u.sid === screenSharerSid);
                if (sharer) {
                  return (
                    <div className="flex-1 relative min-h-0">
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
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 text-[10px] sm:text-[11px] text-green-400 bg-green-500/15 border border-green-500/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg font-semibold backdrop-blur-sm">
                        <MonitorUp size={10} className="sm:hidden md:block md:w-3 md:h-3" />
                        {isLocalSharer ? 'Presenting' : `${sharer.user}`}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              {remoteUsers.filter((u) => u.sid !== screenSharerSid).length > 0 && (
                <div className="flex gap-2 h-20 sm:h-24 md:h-28 flex-shrink-0 overflow-x-auto">
                  {remoteUsers.filter((u) => u.sid !== screenSharerSid).map((u) => (
                    <div key={u.sid} className="w-28 sm:w-32 md:w-40 flex-shrink-0">
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
            <div className={`grid ${getGridClass(remoteUsers.length)} gap-2 sm:gap-3 h-full`}>
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
              <Users size={28} className="text-gray-600 mb-2" />
              <p className="text-gray-500 font-medium text-sm">Waiting for connections...</p>
              <p className="text-gray-600 text-xs mt-1 hidden sm:block">Other users will appear here when they join</p>
            </div>
          )}
        </div>

        {/* Your Feed + Controls */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Local Feed */}
          <div className="w-20 sm:w-28 md:w-36 lg:w-48 flex-shrink-0" data-demo="local-video">
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
          <div className="flex-1 bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-800/60 p-2 sm:p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {myCampus && myCampus !== 'control_room' && (
                <>
                  <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-700/50" data-demo="campus-badge">
                    <span className="text-white font-semibold">{myCampus.toUpperCase()}</span>
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
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-end">
              <div data-demo="portal-toggle"><PortalToggle compact /></div>
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
              <EmergencyButton onClick={() => setShowEmergencyConfirm(true)} disabled={portalMode && !meetingMode} />
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showEmergencyConfirm}
        title="Emergency Broadcast?"
        message="This will immediately override all campus screens with an emergency alert. This action cannot be undone."
        confirmLabel="Emergency"
        cancelLabel="Cancel"
        variant="danger"
        icon="radio"
        onConfirm={() => {
          console.log('%c[ControlRoom] EMERGENCY CONFIRMED — emitting emergency_trigger', 'color: red; font-weight: bold;');
          const socketConnected = (window as any).__socketConnected;
          console.log('[ControlRoom] Socket connected:', socketConnected);
          emit('emergency_trigger', { message: 'Emergency from Control Room', mode: 'live' });
          console.log('%c[ControlRoom] emergency_trigger emitted', 'color: orange; font-weight: bold;');
          setShowEmergencyConfirm(false);
        }}
        onCancel={() => setShowEmergencyConfirm(false)}
      />

      <ChatPanel isOpen={showChat} onClose={() => setShowChat(false)} />

      {!isEmergency && showWelcome && demoData && (
        <WelcomeToast
          name={demoData.name}
          campus={demoData.campus}
          role={demoData.role}
          onComplete={() => {
            setShowWelcome(false);
            setShowLiveDemo(true);
          }}
        />
      )}

      {!isEmergency && showLiveDemo && demoData && (
        <LiveDemo
          isOpen={showLiveDemo}
          onClose={() => {
            setShowLiveDemo(false);
            localStorage.removeItem('pending_live_demo');
            localStorage.setItem(`demo_completed_${demoData.userId}`, 'true');
          }}
          userRole={demoData.role}
        />
      )}
    </DashboardLayout>
  );
}
