import { Monitor, MonitorOff } from 'lucide-react';

interface ShareScreenButtonProps {
  isSharing: boolean;
  onClick: () => void;
}

export function ShareScreenButton({ isSharing, onClick }: ShareScreenButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        isSharing
          ? 'bg-primary-600 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-transparent'
      }`}
    >
      {isSharing ? <MonitorOff size={13} /> : <Monitor size={13} />}
      {isSharing ? 'Stop' : 'Share'}
    </button>
  );
}
