import { useState, useEffect } from 'react';
import { Announcement } from '../../types/announcement';
import { announcementsApi } from '../../api/announcements.api';
import { notificationsApi, Notification } from '../../api/notifications.api';
import { useAuthStore } from '../../stores/authStore';
import { getSocket } from '../../hooks/useSocket';
import { X, Bell, CheckCheck, Trash2, AlertTriangle, Info, Megaphone } from 'lucide-react';

export function BulletinBoard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'bulletins'>('notifications');
  const { user } = useAuthStore();

  useEffect(() => {
    loadAnnouncements();
    loadNotifications();
  }, []);

  useEffect(() => {
    const s = getSocket();
    if (!s) return;

    const handleBulletin = (data: any) => {
      const newAnn: Announcement = {
        id: Date.now().toString(),
        title: data.title,
        content: data.content,
        type: data.type,
        target_campus: 'both',
        created_by: data.created_by,
        is_active: true,
        display_until: null,
        created_at: data.timestamp || new Date().toISOString(),
      };
      setAnnouncements((prev) => [newAnn, ...prev]);
      loadNotifications();
    };

    const handleEmergency = () => {
      loadNotifications();
    };

    s.on('bulletin_new', handleBulletin);
    s.on('emergency_alert', handleEmergency);
    return () => {
      s.off('bulletin_new', handleBulletin);
      s.off('emergency_alert', handleEmergency);
    };
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await announcementsApi.getActive(user?.campus);
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await notificationsApi.getAll();
      setNotifications(data);
    } catch (error) {
      // silent
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkRead = async (id: string) => {
    await notificationsApi.markRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const handleMarkAllRead = async () => {
    await notificationsApi.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const handleDeleteNotif = async (id: string) => {
    await notificationsApi.delete(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle size={14} className="text-red-400" />;
      case 'bulletin':
        return <Megaphone size={14} className="text-blue-400" />;
      default:
        return <Info size={14} className="text-gray-400" />;
    }
  };

  const typeBg = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-500/10 border-red-500/20';
      case 'bulletin':
        return 'bg-blue-500/10 border-blue-500/20';
      default:
        return 'bg-gray-700/50 border-gray-600';
    }
  };

  const announcementColors: Record<string, string> = {
    bulletin: 'border-l-blue-500',
    emergency: 'border-l-red-500',
    info: 'border-l-green-500',
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-700 shadow-2xl z-50 flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-primary-400" />
                <h2 className="text-sm font-bold text-white">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {activeTab === 'notifications' && unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-green-400 transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck size={14} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded hover:bg-gray-700 text-gray-400"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === 'notifications'
                    ? 'text-white border-b-2 border-primary-500 bg-gray-800/50'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Bell size={13} />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-red-500/20 text-red-400">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('bulletins')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === 'bulletins'
                    ? 'text-white border-b-2 border-primary-500 bg-gray-800/50'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Megaphone size={13} />
                Bulletins
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'notifications' ? (
                notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell size={24} className="text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-xs">No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`relative p-3 rounded-lg border transition-colors ${
                          notif.is_read
                            ? 'bg-gray-800/50 border-gray-700/50'
                            : `${typeBg(notif.type)} border-l-2`
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">{typeIcon(notif.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h3 className={`text-xs font-semibold ${notif.is_read ? 'text-gray-400' : 'text-white'}`}>
                                {notif.title}
                              </h3>
                              {!notif.is_read && (
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                              )}
                            </div>
                            {notif.message && (
                              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                            )}
                            <p className="text-[10px] text-gray-600 mt-1">
                              {new Date(notif.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {!notif.is_read && (
                              <button
                                onClick={() => handleMarkRead(notif.id)}
                                className="p-1 rounded hover:bg-gray-700 text-gray-500 hover:text-green-400 transition-colors"
                                title="Mark as read"
                              >
                                <CheckCheck size={12} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotif(notif.id)}
                              className="p-1 rounded hover:bg-gray-700 text-gray-500 hover:text-red-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                announcements.length === 0 ? (
                  <div className="text-center py-8">
                    <Megaphone size={24} className="text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-xs">No bulletins</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {announcements.map((ann) => (
                      <div
                        key={ann.id}
                        className={`bg-gray-800 rounded-lg p-3 border-l-4 ${announcementColors[ann.type] || 'border-l-gray-500'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-white text-sm">{ann.title}</h3>
                            <p className="text-gray-400 text-xs mt-1">{ann.content}</p>
                          </div>
                          <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                            {new Date(ann.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
