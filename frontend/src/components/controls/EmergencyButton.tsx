import { AlertTriangle, X } from 'lucide-react';
import { useSessionStore } from '../../stores/sessionStore';
import { useAuthStore } from '../../stores/authStore';

interface EmergencyButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function EmergencyButton({ onClick, disabled }: EmergencyButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 font-bold py-1.5 px-3 rounded-lg text-xs transition-colors duration-200 ${
        disabled
          ? 'bg-gray-800 text-gray-600 border border-gray-700/30 cursor-not-allowed opacity-50'
          : 'bg-red-600 hover:bg-red-700 text-white'
      }`}
      title={disabled ? 'Disabled during Live Portal' : undefined}
    >
      <AlertTriangle size={13} />
      Emergency
    </button>
  );
}

export function EmergencyAlert() {
  const { emergencyMessage, emergencyTriggeredBy, setEmergency } = useSessionStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const handleDismiss = () => {
    setEmergency(false);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center z-50">
      <div className="text-center max-w-2xl px-6">
        <AlertTriangle size={96} className="mx-auto text-white mb-6 animate-pulse" />
        <h1 className="font-orbitron text-5xl font-bold text-white mb-4 animate-pulse">EMERGENCY BROADCAST</h1>
        {emergencyTriggeredBy && (
          <p className="text-lg text-red-200 mb-2">Triggered by: <span className="font-bold text-white">{emergencyTriggeredBy}</span></p>
        )}
        <p className="text-2xl text-red-100 mb-8">
          {emergencyMessage || "Please pay attention to the principal's announcement"}
        </p>
        {isAdmin && (
          <button
            onClick={handleDismiss}
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 backdrop-blur-sm border border-white/30"
          >
            <X size={18} />
            Dismiss Emergency
          </button>
        )}
      </div>
    </div>
  );
}
