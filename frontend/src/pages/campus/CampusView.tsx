import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { VideoCard } from '../../components/video/VideoCard';
import { VideoControls } from '../../components/video/VideoControls';
import { PortalToggle } from '../../components/controls/PortalToggle';
import { TalkButton } from '../../components/controls/TalkButton';
import { EmergencyButton } from '../../components/controls/EmergencyButton';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { BulletinBoard } from '../../components/announcements/BulletinBoard';
import { ChatPanel } from '../../components/chat/ChatPanel';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useSocket } from '../../hooks/useSocket';
import { usePeerStore } from '../../stores/peerStore';
import { useSessionStore } from '../../stores/sessionStore';
import { useAuthStore } from '../../stores/authStore';
import { ROOMS } from '../../lib/constants';
import { Users, Wifi, Radio, MessageSquare, MonitorUp, AlertTriangle } from 'lucide-react';
import { PortalStatusIndicator } from '../../components/indicators/PortalStatusIndicator';
import { MicTalkingIndicator } from '../../components/indicators/MicTalkingIndicator';
import { WelcomeToast } from '../../components/demo/WelcomeToast';
import { LiveDemo } from '../../components/demo/LiveDemo';

export function CampusView() {
  const { campusName } = useParams<{ campusName: string }>();
  const roomId = ROOMS.MAIN;
  const { startLocalStream, toggleVideo, shareScreen } = useWebRTC(roomId);
  const { emit } = useSocket();
  const { localStream, isVideoOff, localMicActive } = usePeerStore();
  const { roomUsers, isEmergency, emergencyMessage, emergencyTriggeredBy, emergencyTriggeredByRole, emergencyCampus, emergencyCampusOnly, remotePortalModes, remoteMeetingModes, screenSharerSid, portalMode, meetingMode } = useSessionStore();
  const { user } = useAuthStore();
  const [showChat, setShowChat] = useState(false);
  const [activeTalkTarget, setActiveTalkTarget] = useState<'paete' | 'pagsanjan' | 'both' | null>(null);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [showOnlinePanel, setShowOnlinePanel] = useState(false);
  const onlinePanelRef = useRef<HTMLDivElement>(null);
  const mySid = useSocket().socket?.id;
  const { setTalkTarget, setLocalMicActive } = usePeerStore();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showLiveDemo, setShowLiveDemo] = useState(false);
  const [demoData, setDemoData] = useState<{ userId: string; name: string; campus: string; role: string } | null>(null);

  useEffect(() => {
    const pending = localStorage.getItem('pending_live_demo');
    if (pending) {
      const data = JSON.parse(pending);
      setDemoData(data);
      setShowWelcome(true);
      localStorage.removeItem('pending_live_demo');
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await startLocalStream();
        emit('join_room', { room_id: roomId });
        emit('portal_mode_changed', { active: portalMode, meeting: meetingMode });
      } catch (err) {
        console.error('[CampusView] Error in init:', err);
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
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center z-50">
        <div className="text-center animate-pulse max-w-2xl px-4 sm:px-6">
          <Radio size={48} className="text-white mx-auto mb-3 sm:mb-4 md:hidden" />
          <Radio size={64} className="text-white mx-auto mb-4 hidden md:block" />
          <h1 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">EMERGENCY BROADCAST</h1>
          {emergencyCampusOnly && emergencyCampus && (
            <p className="text-xs sm:text-sm text-red-300 mb-2 sm:mb-3 font-semibold bg-white/10 border border-white/20 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full inline-block">
              {emergencyCampus} Campus Only
            </p>
          )}
          {emergencyTriggeredBy && (
            <div className="mb-2 sm:mb-3">
              <p className="text-sm sm:text-lg text-red-200 mb-1">Triggered by: <span className="font-bold text-white">{emergencyTriggeredBy}</span></p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {emergencyTriggeredByRole && (
                  <span className="text-xs font-semibold bg-white/10 border border-white/20 px-2.5 py-1 rounded-full text-white">
                    {emergencyTriggeredByRole}
                  </span>
                )}
                {emergencyCampus && (
                  <span className="text-xs font-semibold bg-white/10 border border-white/20 px-2.5 py-1 rounded-full text-white">
                    {emergencyCampus}
                  </span>
                )}
              </div>
            </div>
          )}
          <p className="text-base sm:text-xl text-red-100">{emergencyMessage || 'Please pay attention to the principal\'s announcement'}</p>
        </div>
      </div>
    );
  }

  const visibleUsers = roomUsers.filter((u) => {
    if (u.sid === mySid) return false;
    if (u.role === 'admin') return false;
    return true;
  });

  const getGridClass = (count: number) => {
    if (count <= 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2';
    if (count <= 4) return 'grid-cols-1 sm:grid-cols-2';
    if (count <= 6) return 'grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  const campusLabel = campusName?.toUpperCase() || 'CAMPUS';
  const oppositeCampus = campusName === 'paete' ? 'pagsanjan' : 'paete';

  const handleTalkToggle = () => {
    setActiveTalkTarget((prev) => {
      const next = prev === oppositeCampus ? null : oppositeCampus;
      setTalkTarget(next);
      return next;
    });
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col p-2 sm:p-3 md:p-4">
        <header className="flex items-center justify-between gap-2 mb-2 sm:mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-wrap">
            <h1 className="font-orbitron text-lg sm:text-xl md:text-2xl font-bold text-white truncate">Control Room</h1>
            <span className="flex items-center gap-1 text-green-400 font-medium text-xs">
              <Wifi size={12} /> <span className="hidden sm:inline">SYSTEM ONLINE</span>
            </span>
            <span className="text-[10px] text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded-md border border-gray-700/50 truncate">
              {campusLabel} <span className="text-primary-400 font-semibold">{user?.role === 'principal' ? 'Principal' : user?.role === 'teacher' ? 'Teacher' : 'Staff'}</span>
            </span>
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
                      const campusColor = u.campus === 'paete' ? 'bg-cyan-500' : u.campus === 'pagsanjan' ? 'bg-purple-500' : 'bg-primary-500';
                      return (
                        <div
                          key={u.sid}
                          className={`flex items-center gap-2 sm:gap-3 px-3 py-2 transition-colors ${
                            isMe ? 'bg-primary-500/10 border-l-2 border-primary-500' : 'hover:bg-gray-700/50'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-full ${campusColor} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
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

        <div className="flex-1 mb-2 sm:mb-3 md:mb-4 min-h-0" data-demo="remote-area">
          {screenSharerSid ? (
            <div className="h-full flex flex-col gap-2 sm:gap-3">
              {(() => {
                const isLocalSharer = screenSharerSid === mySid;
                const sharer = isLocalSharer
                  ? { sid: mySid, user: user?.full_name || 'You', campus: campusName || 'paete', stream: localStream }
                  : visibleUsers.find((u) => u.sid === screenSharerSid);
                if (sharer) {
                  return (
                    <div className="flex-1 relative min-h-0">
                      <VideoCard
                        stream={sharer.stream || null}
                        name={sharer.user}
                        campus={sharer.campus}
                        isLocal={isLocalSharer}
                        isPortalLive={!isLocalSharer && (remotePortalModes[sharer.sid] ?? false)}
                        portalStatus={!isLocalSharer ? (remoteMeetingModes[sharer.sid] ? 'meeting' : (remotePortalModes[sharer.sid] ? 'portal' : 'live')) : null}
                        isScreenShare={true}
                      />
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 text-[10px] sm:text-[11px] text-green-400 bg-green-500/15 border border-green-500/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg font-semibold backdrop-blur-sm">
                        <MonitorUp size={10} />
                        {isLocalSharer ? 'Presenting' : `${sharer.user}`}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              {visibleUsers.filter((u) => u.sid !== screenSharerSid).length > 0 && (
                <div className="flex gap-2 h-20 sm:h-24 md:h-28 flex-shrink-0 overflow-x-auto">
                  {visibleUsers.filter((u) => u.sid !== screenSharerSid).map((u) => (
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
          ) : visibleUsers.length > 0 ? (
            <div className={`grid ${getGridClass(visibleUsers.length)} gap-2 sm:gap-3 h-full`}>
              {visibleUsers.map((u) => (
                <VideoCard
                  key={u.sid}
                  stream={u.stream || null}
                  name={u.user}
                  campus={u.campus}
                  isPortalLive={remotePortalModes[u.sid] ?? false}
                  portalStatus={remoteMeetingModes[u.sid] ? 'meeting' : (remotePortalModes[u.sid] ? 'portal' : 'live')}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-gray-900/50 rounded-xl border border-gray-800/40">
              <Users size={28} className="text-gray-600 mb-2" />
              <p className="text-gray-500 font-medium text-sm">Waiting for connections...</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="w-20 sm:w-28 md:w-36 lg:w-48 flex-shrink-0" data-demo="local-video">
            <VideoCard
              stream={localStream}
              name={user?.full_name || 'You'}
              campus={campusName || 'paete'}
              isLocal={true}
              isSmall={true}
              isVideoOff={isVideoOff}
            />
          </div>

          <div className="flex-1 bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-800/60 p-2 sm:p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-700/50" data-demo="campus-badge">
                <span className="text-white font-semibold">{campusLabel}</span>
              </span>
              <div data-demo="portal-toggle"><PortalToggle compact /></div>
              <TalkButton
                target={oppositeCampus}
                isActive={activeTalkTarget === oppositeCampus}
                onClick={handleTalkToggle}
                disabled={portalMode}
              />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-end">
              <VideoControls
                isAudioMuted={!localMicActive}
                isVideoOff={isVideoOff}
                isScreenSharing={false}
                onToggleAudio={() => !(portalMode && !meetingMode) && setLocalMicActive(!localMicActive)}
                onToggleVideo={toggleVideo}
                onToggleScreenShare={() => !(portalMode && !meetingMode) && shareScreen().catch(() => {})}
                audioDisabled={portalMode && !meetingMode}
                screenShareDisabled={portalMode && !meetingMode}
              />
              {user?.role === 'principal' && (
                <EmergencyButton onClick={() => !(portalMode && !meetingMode) && setShowEmergencyConfirm(true)} disabled={portalMode && !meetingMode} />
              )}
            </div>
          </div>
        </div>
      </div>

      <ChatPanel isOpen={showChat} onClose={() => setShowChat(false)} />

      <ConfirmModal
        isOpen={showEmergencyConfirm}
        title="Emergency Broadcast?"
        message="This will immediately override all campus screens with an emergency alert. This action cannot be undone."
        confirmLabel="Emergency"
        cancelLabel="Cancel"
        variant="danger"
        icon="radio"
        onConfirm={() => {
          const campusLabel = campusName?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Campus';
          const mode = portalMode ? (meetingMode ? 'meeting' : 'portal') : 'live';
          emit('emergency_trigger', { message: `Emergency from ${campusLabel}`, mode });
          setShowEmergencyConfirm(false);
        }}
        onCancel={() => setShowEmergencyConfirm(false)}
      />

      {showWelcome && demoData && (
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

      {showLiveDemo && demoData && (
        <LiveDemo
          isOpen={showLiveDemo}
          onClose={() => {
            setShowLiveDemo(false);
            localStorage.setItem(`demo_completed_${demoData.userId}`, 'true');
          }}
          userRole={demoData.role}
        />
      )}
    </DashboardLayout>
  );
}
