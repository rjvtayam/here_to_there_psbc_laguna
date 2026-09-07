import { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

interface WelcomeToastProps {
  name: string;
  campus: string;
  role: string;
  onComplete: () => void;
}

export function WelcomeToast({ name, campus, role, onComplete }: WelcomeToastProps) {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setHiding(true);
    setTimeout(onComplete, 400);
  };

  useEffect(() => {
    const t = setTimeout(dismiss, 5000);
    return () => clearTimeout(t);
  }, []);

  const campusLabel = campus === 'control_room' ? 'Control Room' : campus === 'paete' ? 'PSBC Paete' : 'PSBC Pagsanjan';
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div
      className={`fixed top-6 right-6 z-[200] transition-all duration-400 ${
        hiding ? 'opacity-0 translate-x-8 scale-95' : visible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'
      }`}
    >
      <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800/60 shadow-2xl shadow-primary-500/10 overflow-hidden max-w-sm">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-cyan-500 to-purple-500" />

        <div className="p-5 flex items-start gap-4">
          {/* Animated icon */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/30 animate-bounce-in">
            <Sparkles size={22} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-orbitron text-sm font-bold text-white mb-0.5">
              Welcome, {name}!
            </h3>
            <p className="text-xs text-gray-400 mb-2">
              Logged in as <span className="text-primary-400 font-medium">{roleLabel}</span> at <span className="text-cyan-400 font-medium">{campusLabel}</span>
            </p>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              A live demo will start shortly to guide you through the features.
            </p>
          </div>

          <button onClick={dismiss} className="p-1 text-gray-600 hover:text-gray-400 transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Auto-dismiss progress bar */}
        <div className="h-0.5 bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 animate-progress-shrink"
            style={{ animationDuration: '5s' }}
          />
        </div>
      </div>
    </div>
  );
}
