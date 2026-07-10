import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }

  const { toasts, addToast, removeToast } = context;

  return {
    toasts,
    showToast: (message: string, type: 'success' | 'error' | 'info' = 'info') =>
      addToast(type, message),
    showSuccess: (message: string) => addToast('success', message),
    showError: (message: string) => addToast('error', message),
    showInfo: (message: string) => addToast('info', message),
    removeToast,
  };
}
