import { Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

export function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: VolumeControlProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleMute}
        className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <input
        type="range"
        min="0"
        max="100"
        value={isMuted ? 0 : volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
      />
    </div>
  );
}
