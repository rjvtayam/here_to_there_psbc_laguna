import { Mic } from 'lucide-react';
import { usePeerStore } from '../../stores/peerStore';

export function MicTalkingIndicator() {
  const { localMicActive, talkTarget } = usePeerStore();
  const isTalking = localMicActive || talkTarget !== null;

  if (!isTalking) return null;

  const label = localMicActive && talkTarget ? 'TALKING — ALL' : localMicActive ? 'MIC ACTIVE' : `TALKING — ${(talkTarget || '').toUpperCase()}`;

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-green-500/15 border border-green-500/40 text-green-400 shadow-lg shadow-green-500/10 animate-pulse">
      <Mic size={12} />
      <span>{label}</span>
      <span className="flex gap-0.5">
        <span className="w-0.5 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-0.5 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-0.5 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </span>
    </div>
  );
}
