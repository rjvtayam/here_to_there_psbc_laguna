import { useState, useEffect, useRef } from 'react';
import { X, MessageSquare, Send, Users, School } from 'lucide-react';
import { getSocket } from '../../hooks/useSocket';
import { useAuthStore } from '../../stores/authStore';

interface ChatMessage {
  sid: string;
  user: string;
  campus: string;
  role: string;
  message: string;
  target: string;
  timestamp: string;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'campus'>('all');
  const [campusTarget, setCampusTarget] = useState<'paete' | 'pagsanjan'>('paete');
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mySid = getSocket()?.id;

  const isAdmin = user?.role === 'admin';
  const myCampus = user?.campus;
  const isControlRoom = myCampus === 'control_room';

  const effectiveCampus = isControlRoom ? campusTarget : (myCampus as 'paete' | 'pagsanjan');

  useEffect(() => {
    if (!isOpen) return;

    const s = getSocket();
    if (!s) return;

    const handler = (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    };

    s.on('chat_message', handler);
    return () => {
      s.off('chat_message', handler);
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  const filteredMessages = messages.filter((msg) => {
    if (activeTab === 'all') return true;
    return msg.campus === effectiveCampus;
  });

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const s = getSocket();
    if (s?.connected) {
      s.emit('chat_message', {
        message: trimmed,
        target: activeTab === 'campus' ? 'campus' : 'all',
      });
    }
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const campusColor = (campus: string) => {
    if (campus === 'paete') return 'text-cyan-400';
    if (campus === 'pagsanjan') return 'text-purple-400';
    return 'text-primary-400';
  };

  const campusBg = (campus: string) => {
    if (campus === 'paete') return 'bg-cyan-500/10 border-cyan-500/20';
    if (campus === 'pagsanjan') return 'bg-purple-500/10 border-purple-500/20';
    return 'bg-primary-500/10 border-primary-500/20';
  };

  const campusLabel = (campus: string) => {
    if (campus === 'paete') return 'PAETE';
    if (campus === 'pagsanjan') return 'PAGSANJAN';
    return 'CTRL';
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-700 shadow-2xl z-50 flex flex-col transition-transform duration-250 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-primary-400" />
            <h2 className="text-sm font-bold text-white">In-Call Chat</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-700 text-gray-400">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-white border-b-2 border-primary-500 bg-gray-800/50'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Users size={13} />
            All
          </button>
          <button
            onClick={() => setActiveTab('campus')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              activeTab === 'campus'
                ? 'text-white border-b-2 border-primary-500 bg-gray-800/50'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <School size={13} />
            {effectiveCampus === 'paete' ? 'Paete' : 'Pagsanjan'}
          </button>
        </div>

        {/* Campus Selector for Admin */}
        {isAdmin && activeTab === 'campus' && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700 bg-gray-800/50">
            <span className="text-[10px] text-gray-500">Send to:</span>
            <button
              onClick={() => setCampusTarget('paete')}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                campusTarget === 'paete'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600 border border-transparent'
              }`}
            >
              Paete
            </button>
            <button
              onClick={() => setCampusTarget('pagsanjan')}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                campusTarget === 'pagsanjan'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600 border border-transparent'
              }`}
            >
              Pagsanjan
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredMessages.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare size={24} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-xs">
                {activeTab === 'all' ? 'No messages yet' : `No ${effectiveCampus} messages yet`}
              </p>
            </div>
          )}
          {filteredMessages.map((msg, i) => {
            const isMe = msg.sid === mySid;
            const isCampusMsg = msg.target === 'campus';
            return (
              <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`text-[10px] font-semibold ${campusColor(msg.campus)}`}>
                    {msg.user}
                  </span>
                  <span className={`text-[10px] px-1 py-0.5 rounded border ${campusBg(msg.campus)}`}>
                    {campusLabel(msg.campus)}
                  </span>
                  {isCampusMsg && (
                    <span className="text-[10px] text-yellow-500/80 px-1 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20">
                      CAMPUS
                    </span>
                  )}
                  <span className="text-[10px] text-gray-600">{formatTime(msg.timestamp)}</span>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-lg text-xs max-w-[85%] ${
                    isMe
                      ? 'bg-primary-600/20 border border-primary-500/30 text-gray-200'
                      : isCampusMsg
                        ? 'bg-yellow-500/5 border border-yellow-500/20 text-gray-300'
                        : 'bg-gray-800 border border-gray-700 text-gray-300'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
              activeTab === 'campus'
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                : 'bg-gray-700 border-gray-600 text-gray-400'
            }`}>
              {activeTab === 'campus' ? `Sending to ${effectiveCampus === 'paete' ? 'Paete' : 'Pagsanjan'}` : 'Sending to All'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={activeTab === 'campus' ? `Message ${effectiveCampus}...` : 'Message everyone...'}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:bg-gray-700 disabled:text-gray-500 text-white transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
