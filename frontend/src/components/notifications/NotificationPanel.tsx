import { useState, useEffect } from 'react';
import { X, Bell, CheckCheck, Trash2, AlertTriangle, Info, Megaphone } from 'lucide-react';
import { notificationsApi, Notification } from '../../api/notifications.api';
import { getSocket } from '../../hooks/useSocket';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCountChange?: (count: number) => void;
}

export function NotificationPanel({ isOpen, onClose, onCountChange }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const s = getSocket();
    if (!s) return;

    const handleBulletin = () => {
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

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationsApi.getAll();
      setNotifications(data);
      const unread = data.filter((n) => !n.is_read).length;
      onCountChange?.(unread);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    await notificationsApi.markRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    onCountChange?.(notifications.filter((n) => !n.is_read && n.id !== id).length);
  };

  const handleMarkAllRead = async () => {
    await notificationsApi.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    onCountChange?.(0);
  };

  const handleDelete = async (id: string) => {
    await notificationsApi.delete(id);
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    onCountChange?.(updated.filter((n) => !n.is_read).length);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

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

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-gray-900 border-l border-gray-700 shadow-2xl z-50 flex flex-col transition-transform duration-250 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
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
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-green-400 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck size={14} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-gray-700 text-gray-400"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : notifications.length === 0 ? (
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
                        onClick={() => handleDelete(notif.id)}
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
          )}
        </div>
      </div>
    </>
  );
}
