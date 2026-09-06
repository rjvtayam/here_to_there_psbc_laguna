import { Mic, MicOff } from 'lucide-react';

interface TalkButtonProps {
  target: 'paete' | 'pagsanjan' | 'both';
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function TalkButton({ target, isActive, onClick, disabled }: TalkButtonProps) {
  const labels = {
    paete: 'Paete',
    pagsanjan: 'Pagsanjan',
    both: 'Both',
  };

  const activeStyles = {
    paete: 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/10',
    pagsanjan: 'bg-purple-500/20 border border-purple-500/40 text-purple-400 shadow-lg shadow-purple-500/10',
    both: 'bg-primary-500/20 border border-primary-500/40 text-primary-400 shadow-lg shadow-primary-500/10',
  };

  const activeIconColor = {
    paete: 'text-cyan-400',
    pagsanjan: 'text-purple-400',
    both: 'text-primary-400',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
        disabled
          ? 'bg-gray-800 text-gray-600 border border-gray-700/30 cursor-not-allowed opacity-50'
          : isActive
            ? activeStyles[target]
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-transparent'
      }`}
      title={disabled ? 'Disabled during Live Portal' : undefined}
    >
      {isActive ? (
        <Mic size={13} className={activeIconColor[target]} />
      ) : (
        <MicOff size={13} className={disabled ? 'text-gray-600' : 'text-gray-500'} />
      )}
      {labels[target]}
    </button>
  );
}
