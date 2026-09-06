import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useSocket } from '../../hooks/useSocket';
import { Badge } from '../ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

export function Header() {
  const { user } = useAuthStore();
  const { isConnected } = useSocket();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  return (
    <header className="h-14 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 flex items-center justify-between px-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          {isConnected ? (
            <>
              <Wifi size={12} className="text-green-500" />
              <span className="text-xs text-green-400">Connected</span>
            </>
          ) : (
            <>
              <WifiOff size={12} className="text-red-500" />
              <span className="text-xs text-red-400">Disconnected</span>
            </>
          )}
        </div>
        <div className="h-4 w-px bg-gray-700" />
        <span className="text-xs text-gray-400">{formatDate(now)}</span>
        <span className="text-xs text-gray-500 font-mono">{formatTime(now)}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs text-gray-300 leading-tight">{user?.full_name}</p>
            <Badge variant={user?.role === 'principal' ? 'success' : 'default'} className="text-[10px] px-1.5 py-0">
              {user?.role?.toUpperCase()}
            </Badge>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
            {user?.full_name?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
