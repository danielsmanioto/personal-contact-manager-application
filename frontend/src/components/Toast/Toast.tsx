import { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps extends ToastMessage {
  onClose: (id: string) => void;
  duration?: number;
}

function ToastItem({
  id: _id,
  type,
  message,
  onClose,
  duration = 3000,
}: ToastProps) {
  const id = _id;
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, onClose, duration]);

  const bgColorClass = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const iconColorClass = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  };

  const textColorClass = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border p-4 ${bgColorClass[type]}`}
      role="alert"
    >
      <span className={`text-lg font-bold ${iconColorClass[type]}`}>
        {icons[type]}
      </span>
      <p className={`flex-1 text-sm ${textColorClass[type]}`}>{message}</p>
      <button
        onClick={() => onClose(id)}
        className={`text-lg font-bold ${iconColorClass[type]} hover:opacity-70`}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export default function ToastContainer({
  toasts,
  onClose,
}: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
