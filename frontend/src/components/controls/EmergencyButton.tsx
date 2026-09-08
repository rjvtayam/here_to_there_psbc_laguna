import { AlertTriangle, X } from 'lucide-react';
import { useSessionStore } from '../../stores/sessionStore';
import { useAuthStore } from '../../stores/authStore';
import { useSocket } from '../../hooks/useSocket';

interface EmergencyButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function EmergencyButton({ onClick, disabled }: EmergencyButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-demo="btn-emergency"
      className={`flex items-center gap-1.5 font-bold py-1.5 px-2.5 sm:px-3 rounded-lg text-xs transition-colors duration-200 ${
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
  const { emergencyMessage, emergencyTriggeredBy, emergencyTriggeredByRole, emergencyCampus, emergencyCampusOnly, setEmergency } = useSessionStore();
  const { user } = useAuthStore();
  const { emit } = useSocket();
  const canDismiss = user?.role === 'admin' || user?.role === 'principal';

  const handleDismiss = () => {
    emit('emergency_dismiss');
    setEmergency(false);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center z-50">
      <div className="text-center max-w-2xl px-4 sm:px-6">
        <AlertTriangle size={64} className="mx-auto text-white mb-4 sm:mb-6 animate-pulse md:hidden" />
        <AlertTriangle size={96} className="mx-auto text-white mb-6 animate-pulse hidden md:block" />
        <h1 className="font-orbitron text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 sm:mb-4 animate-pulse">EMERGENCY BROADCAST</h1>
        {emergencyCampusOnly && emergencyCampus && (
          <p className="text-sm text-red-300 mb-3 font-semibold bg-white/10 border border-white/20 px-3 py-1.5 rounded-full inline-block">
            {emergencyCampus} Campus Only
          </p>
        )}
        {emergencyTriggeredBy && (
          <div className="mb-4">
            <p className="text-lg text-red-200 mb-1">Triggered by: <span className="font-bold text-white">{emergencyTriggeredBy}</span></p>
            <div className="flex items-center justify-center gap-2">
              {emergencyTriggeredByRole && (
                <span className="text-xs font-semibold bg-white/10 border border-white/20 px-2.5 py-1 rounded-full text-white">
                  {emergencyTriggeredByRole}
                </span>
              )}
              {emergencyCampus && (
                <span className="text-xs font-semibold bg-white/10 border border-white/20 px-2.5 py-1 rounded-full text-white">
                  {emergencyCampus}
                </span>
              )}
            </div>
          </div>
        )}
        <p className="text-lg sm:text-xl md:text-2xl text-red-100 mb-6 sm:mb-8">
          {emergencyMessage || "Please pay attention to the principal's announcement"}
        </p>
        {canDismiss && (
          <button
            onClick={handleDismiss}
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl transition-colors duration-200 backdrop-blur-sm border border-white/30 text-sm sm:text-base"
          >
            <X size={18} />
            Dismiss Emergency
          </button>
        )}
      </div>
    </div>
  );
}
