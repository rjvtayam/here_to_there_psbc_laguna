import { useState, useEffect, useRef } from 'react';
import { Announcement } from '../../types/announcement';
import { announcementsApi } from '../../api/announcements.api';
import { notificationsApi, Notification } from '../../api/notifications.api';
import { reactionsApi, ReactionSummary } from '../../api/reactions.api';
import { useAuthStore } from '../../stores/authStore';
import { useSessionStore } from '../../stores/sessionStore';
import { getSocket } from '../../hooks/useSocket';
import {
  X,
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Info,
  Megaphone,
  Plus,
  Send,
  ChevronDown,
  ExternalLink,
  Image as ImageIcon,
  Link as LinkIcon,
} from 'lucide-react';

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export function BulletinBoard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'bulletins'>('notifications');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const { user } = useAuthStore();
  const unreadNotificationCount = useSessionStore((s) => s.unreadNotificationCount);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [reactionsMap, setReactionsMap] = useState<Record<string, ReactionSummary[]>>({});
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
  const [formType, setFormType] = useState<'bulletin' | 'info' | 'emergency'>('bulletin');
  const [formTarget, setFormTarget] = useState<'both' | 'paete' | 'pagsanjan'>('both');
  const formRef = useRef<HTMLFormElement>(null);

  const canCreate = user?.role === 'admin' || user?.role === 'principal';

  useEffect(() => {
    loadAnnouncements();
    loadNotifications();
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      loadAnnouncements();
    }
  }, [isOpen]);

  useEffect(() => {
    if (announcements.length > 0) {
      announcements.forEach((ann) => loadReactions(ann.id));
    }
  }, [announcements]);

  useEffect(() => {
    const s = getSocket();
    if (!s) return;

    const handleBulletin = (data: any) => {
      const newAnn: Announcement = {
        id: Date.now().toString(),
        title: data.title,
        content: data.content,
        link: data.link || null,
        image_url: data.image_url || null,
        type: data.type,
        target_campus: data.target_campus || 'both',
        created_by: data.created_by,
        is_active: true,
        display_until: null,
        created_at: data.timestamp || new Date().toISOString(),
      };
      setAnnouncements((prev) => [newAnn, ...prev]);
      loadNotifications();
    };

    const handleReaction = (data: { announcement_id: string; emoji: string; action: string; user: string }) => {
      setReactionsMap((prev) => {
        const existing = prev[data.announcement_id] || [];
        const updated = existing.map((r) => {
          if (r.emoji === data.emoji) {
            if (data.action === 'added') {
              return { ...r, count: r.count + 1, users: [...r.users, data.user], user_reacted: r.user_reacted || data.user === user?.full_name };
            } else {
              const newUsers = r.users.filter((u) => u !== data.user);
              return { ...r, count: Math.max(0, r.count - 1), users: newUsers, user_reacted: data.user !== user?.full_name ? r.user_reacted : false };
            }
          }
          return r;
        });

        const exists = updated.find((r) => r.emoji === data.emoji);
        if (!exists && data.action === 'added') {
          updated.push({ emoji: data.emoji, count: 1, users: [data.user], user_reacted: data.user === user?.full_name });
        }

        return { ...prev, [data.announcement_id]: updated.filter((r) => r.count > 0) };
      });
    };

    s.on('bulletin_new', handleBulletin);
    s.on('reaction_update', handleReaction);
    return () => {
      s.off('bulletin_new', handleBulletin);
      s.off('reaction_update', handleReaction);
    };
  }, [user?.full_name]);

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

  const loadReactions = async (announcementId: string) => {
    try {
      const data = await reactionsApi.get(announcementId);
      setReactionsMap((prev) => ({ ...prev, [announcementId]: data }));
    } catch (error) {
      // silent
    }
  };

  const handleMarkRead = async (id: string) => {
    await notificationsApi.markRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    if (unreadNotificationCount > 0) {
      useSessionStore.getState().setNotificationCount(Math.max(0, unreadNotificationCount - 1));
    }
  };

  const handleMarkAllRead = async () => {
    await notificationsApi.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    useSessionStore.getState().clearNotificationCount();
  };

  const handleDeleteNotif = async (id: string) => {
    await notificationsApi.delete(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleToggleReaction = async (announcementId: string, emoji: string) => {
    setShowReactionPicker(null);
    try {
      const result = await reactionsApi.toggle(announcementId, emoji);
      const s = getSocket();
      if (s) {
        s.emit('reaction_update', { announcement_id: announcementId, emoji, action: result.action });
      }
      loadReactions(announcementId);
    } catch (error) {
      console.error('Failed to toggle reaction:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleCreateBulletin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    setCreating(true);
    try {
      const payload: any = {
        title: formTitle.trim(),
        content: formContent.trim() || undefined,
        link: formLink.trim() || undefined,
        image_url: formImagePreview || undefined,
        type: formType,
        target_campus: formTarget,
      };
      await announcementsApi.create(payload);
      const s = getSocket();
      if (s) {
        s.emit('bulletin_update', payload);
      }
      setFormTitle('');
      setFormContent('');
      setFormLink('');
      setFormImagePreview(null);
      setFormType('bulletin');
      setFormTarget('both');
      setShowCreateForm(false);
      loadAnnouncements();
    } catch (error) {
      console.error('Failed to create bulletin:', error);
    } finally {
      setCreating(false);
    }
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
        return 'bg-red-500/10 border-red-500/20 border-l-2 border-l-red-500';
      case 'bulletin':
        return 'bg-blue-500/10 border-blue-500/20 border-l-2 border-l-blue-500';
      default:
        return 'bg-gray-700/50 border-gray-600 border-l-2 border-l-gray-500';
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
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center px-1 animate-badge-pulse">
            {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-gray-900 border-l border-gray-700/60 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out translate-x-0">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/60 bg-gray-900/80 backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                  <Bell size={15} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white leading-tight">Notifications</h2>
                  <p className="text-[10px] text-gray-500">
                    {unreadNotificationCount > 0 ? `${unreadNotificationCount} unread` : 'All caught up'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {activeTab === 'notifications' && unreadNotificationCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="p-1.5 rounded-lg hover:bg-gray-700/60 text-gray-400 hover:text-green-400 transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck size={14} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-700/60 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700/60 bg-gray-900/50 flex-shrink-0">
              <button
                onClick={() => setActiveTab('notifications')}
                className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === 'notifications'
                    ? 'text-white border-b-2 border-primary-500 bg-gray-800/40'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Bell size={13} />
                Notifications
                {activeTab !== 'notifications' && unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-4 min-w-[14px] h-3.5 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center px-1 animate-badge-pulse">
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('bulletins')}
                className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === 'bulletins'
                    ? 'text-white border-b-2 border-primary-500 bg-gray-800/40'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Megaphone size={13} />
                Bulletins
                {activeTab !== 'bulletins' && announcements.length > 0 && (
                  <span className="absolute top-1.5 right-4 min-w-[14px] h-3.5 bg-blue-500 rounded-full text-[9px] font-bold flex items-center justify-center px-1 animate-badge-pulse">
                    {announcements.length > 9 ? '9+' : announcements.length}
                  </span>
                )}
              </button>
            </div>

            {/* Create Form (admin/principal only) */}
            {showCreateForm && canCreate && (
              <form ref={formRef} onSubmit={handleCreateBulletin} className="p-4 border-b border-gray-700/60 space-y-3 bg-gray-800/50 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">New Bulletin</h3>
                  <button type="button" onClick={() => setShowCreateForm(false)} className="p-1 rounded-lg hover:bg-gray-700/60 text-gray-400">
                    <X size={12} />
                  </button>
                </div>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Title"
                  required
                  maxLength={200}
                  className="w-full bg-gray-700/60 border border-gray-600/60 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Content (optional)"
                  maxLength={2000}
                  rows={3}
                  className="w-full bg-gray-700/60 border border-gray-600/60 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                />
                <div className="relative">
                  <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="url"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    placeholder="https://example.com (optional)"
                    className="w-full bg-gray-700/60 border border-gray-600/60 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  {formImagePreview ? (
                    <div className="relative rounded-lg overflow-hidden border border-gray-600/60">
                      <img src={formImagePreview} alt="Preview" className="w-full h-32 object-cover" />
                      <button type="button" onClick={removeImage} className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-red-500/80 transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-gray-600 text-gray-500 hover:border-primary-500 hover:text-primary-400 transition-colors text-[11px]"
                    >
                      <ImageIcon size={13} />
                      Add image (optional)
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <select value={formType} onChange={(e) => setFormType(e.target.value as any)} className="w-full appearance-none bg-gray-700/60 border border-gray-600/60 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500 pr-7">
                      <option value="bulletin">Bulletin</option>
                      <option value="info">Info</option>
                      <option value="emergency">Emergency</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select value={formTarget} onChange={(e) => setFormTarget(e.target.value as any)} className="w-full appearance-none bg-gray-700/60 border border-gray-600/60 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500 pr-7">
                      <option value="both">Both Campuses</option>
                      <option value="paete">Paete</option>
                      <option value="pagsanjan">Pagsanjan</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowCreateForm(false)} className="px-3 py-1.5 text-[11px] rounded-lg bg-gray-700 text-gray-400 hover:bg-gray-600 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={creating || !formTitle.trim()} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors disabled:opacity-50">
                    <Send size={11} />
                    {creating ? 'Sending...' : 'Publish'}
                  </button>
                </div>
              </form>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'notifications' ? (
                notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
                      <Bell size={20} className="text-gray-600" />
                    </div>
                    <p className="text-gray-500 text-xs font-medium">No notifications yet</p>
                    <p className="text-gray-600 text-[10px] mt-1">Bulletins and alerts will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`relative p-3 rounded-lg border transition-all ${
                          notif.is_read
                            ? 'bg-gray-800/30 border-gray-700/50 opacity-60'
                            : `${typeBg(notif.type)}`
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
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 animate-badge-pulse" />
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
                <div>
                  {canCreate && !showCreateForm && (
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 mb-3 rounded-lg border border-dashed border-gray-600 text-gray-400 hover:border-primary-500 hover:text-primary-400 transition-colors text-xs"
                    >
                      <Plus size={14} />
                      New Bulletin
                    </button>
                  )}

                  {announcements.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
                        <Megaphone size={20} className="text-gray-600" />
                      </div>
                      <p className="text-gray-500 text-xs font-medium">No bulletins</p>
                      <p className="text-gray-600 text-[10px] mt-1">Announcements from admins will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {announcements.map((ann) => {
                        const annReactions = reactionsMap[ann.id] || [];
                        return (
                          <div
                            key={ann.id}
                            className={`bg-gray-800 rounded-lg overflow-hidden border-l-4 ${announcementColors[ann.type] || 'border-l-gray-500'} hover:bg-gray-800/80 transition-colors`}
                          >
                            {ann.image_url && (
                              <img src={ann.image_url} alt={ann.title} className="w-full h-32 object-cover" />
                            )}
                            <div className="p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                  ann.type === 'emergency' ? 'text-red-400' : ann.type === 'bulletin' ? 'text-blue-400' : 'text-green-400'
                                }`}>
                                  {ann.type}
                                </span>
                                <span className="text-[10px] text-gray-600">
                                  {new Date(ann.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <h3 className="font-semibold text-white text-sm">{ann.title}</h3>
                              {ann.content && (
                                <p className="text-gray-400 text-xs mt-1 line-clamp-3">{ann.content}</p>
                              )}
                              {ann.link && (
                                <a
                                  href={ann.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 mt-2 text-[11px] text-primary-400 hover:text-primary-300 transition-colors"
                                >
                                  <ExternalLink size={11} />
                                  {ann.link.length > 35 ? ann.link.slice(0, 35) + '...' : ann.link}
                                </a>
                              )}

                              {/* Reactions */}
                              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                                {annReactions.map((r) => (
                                  <button
                                    key={r.emoji}
                                    onClick={() => handleToggleReaction(ann.id, r.emoji)}
                                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border transition-all ${
                                      r.user_reacted
                                        ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
                                        : 'bg-gray-700/50 border-gray-600/50 text-gray-400 hover:bg-gray-700'
                                    }`}
                                    title={r.users.join(', ')}
                                  >
                                    <span>{r.emoji}</span>
                                    <span className="font-medium">{r.count}</span>
                                  </button>
                                ))}
                                <div className="relative">
                                  <button
                                    onClick={() => setShowReactionPicker(showReactionPicker === ann.id ? null : ann.id)}
                                    className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-700/50 border border-gray-600/50 text-gray-500 hover:text-gray-300 hover:bg-gray-700 transition-colors text-[11px]"
                                  >
                                    +
                                  </button>
                                  {showReactionPicker === ann.id && (
                                    <div className="absolute bottom-full left-0 mb-1 flex gap-0.5 bg-gray-800 border border-gray-600/60 rounded-lg p-1 shadow-xl z-10">
                                      {REACTION_EMOJIS.map((emoji) => (
                                        <button
                                          key={emoji}
                                          onClick={() => handleToggleReaction(ann.id, emoji)}
                                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-700 transition-colors text-sm"
                                        >
                                          {emoji}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <p className="text-[10px] text-gray-600 mt-2">by {ann.created_by}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
