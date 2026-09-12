import { useState, useEffect, useCallback } from 'react';
import { UserPlus, UserMinus, Mic } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';

export interface ActivityEvent {
  id: number;
  type: 'join' | 'leave' | 'talk';
  user: string;
  campus: string;
  role: string;
}

let globalId = 0;
let listeners: Array<(e: ActivityEvent) => void> = [];

export function pushActivity(event: Omit<ActivityEvent, 'id'>) {
  if (!useSettingsStore.getState().notifications) return;
  const e = { ...event, id: ++globalId };
  listeners.forEach((fn) => fn(e));
}

function capitalize(s: string) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function campusLabel(c: string) {
  if (!c) return '';
  return capitalize(c.replace('_', ' '));
}

function formatLabel(role: string, campus: string) {
  const r = capitalize(role);
  const c = campusLabel(campus);
  if (r && c) return `${r} : ${c}`;
  if (r) return r;
  if (c) return c;
  return 'Participant';
}

export function ActivityToast() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  const addEvent = useCallback((e: ActivityEvent) => {
    setEvents((prev) => [...prev.slice(-4), e]);
    setTimeout(() => {
      setEvents((prev) => prev.filter((x) => x.id !== e.id));
    }, 4000);
  }, []);

  useEffect(() => {
    listeners.push(addEvent);
    return () => {
      listeners = listeners.filter((fn) => fn !== addEvent);
    };
  }, [addEvent]);

  if (events.length === 0) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] flex flex-col gap-1.5 pointer-events-none">
      {events.map((e) => {
        const isJoin = e.type === 'join';
        const isLeave = e.type === 'leave';
        const bg = isJoin ? 'bg-green-500/15 border-green-500/30 text-green-400'
          : isLeave ? 'bg-red-500/15 border-red-500/30 text-red-400'
          : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400';
        const icon = isJoin ? <UserPlus size={11} />
          : isLeave ? <UserMinus size={11} />
          : <Mic size={11} />;
        const label = isJoin ? 'joined' : isLeave ? 'left' : 'is talking';
        const participant = formatLabel(e.role, e.campus);
        return (
          <div
            key={e.id}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium backdrop-blur-sm ${bg} animate-fade-in`}
          >
            {icon}
            <span className="text-white font-semibold">{participant}</span>
            <span className="opacity-70">{label} the Room</span>
          </div>
        );
      })}
    </div>
  );
}
