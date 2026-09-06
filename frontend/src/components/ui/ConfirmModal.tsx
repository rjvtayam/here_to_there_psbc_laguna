import { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, Radio, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  icon?: 'warning' | 'trash' | 'radio';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  icon = 'warning',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: 'bg-red-500/15 border border-red-500/30',
      iconColor: 'text-red-400',
      confirmBtn: 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30',
      glow: 'shadow-red-500/10',
    },
    warning: {
      iconBg: 'bg-amber-500/15 border border-amber-500/30',
      iconColor: 'text-amber-400',
      confirmBtn: 'bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30',
      glow: 'shadow-amber-500/10',
    },
    primary: {
      iconBg: 'bg-primary-500/15 border border-primary-500/30',
      iconColor: 'text-primary-400',
      confirmBtn: 'bg-primary-500/20 border border-primary-500/40 text-primary-400 hover:bg-primary-500/30',
      glow: 'shadow-primary-500/10',
    },
  };

  const icons = {
    warning: <AlertTriangle size={22} className={variantStyles[variant].iconColor} />,
    trash: <Trash2 size={22} className={variantStyles[variant].iconColor} />,
    radio: <Radio size={22} className={variantStyles[variant].iconColor} />,
  };

  const styles = variantStyles[variant];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onCancel(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      {/* Modal */}
      <div className="relative w-full max-w-sm animate-fade-in-up">
        {/* Glow */}
        <div className={`absolute -inset-px rounded-2xl bg-gradient-to-b from-gray-700/50 to-transparent opacity-50 ${styles.glow}`} />
        <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800/60 p-6 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-3 right-3 p-1 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X size={16} />
          </button>
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${styles.iconBg} mb-4`}>
            {icons[icon]}
          </div>
          {/* Content */}
          <h3 className="font-orbitron text-base font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">{message}</p>
          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 text-sm font-medium"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 rounded-xl ${styles.confirmBtn} transition-all duration-200 text-sm font-medium`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
