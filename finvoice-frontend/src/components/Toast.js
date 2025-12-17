import React, { useEffect } from 'react';

function Toast({ 
  id,
  type = 'info', // success, error, warning, info
  title,
  message,
  duration = 5000,
  onClose
}) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      <div className="toast-content">
        {title && <div className="toast-title">{title}</div>}
        <div className="toast-message">{message}</div>
      </div>
      <button className="toast-close" onClick={() => onClose(id)}>
        ×
      </button>
    </div>
  );
}

// Toast Container Component
export function ToastContainer({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}

// Hook to manage toasts
export function useToast() {
  const [toasts, setToasts] = React.useState([]);

  const addToast = (toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message, title = 'Success') => {
    addToast({ type: 'success', title, message });
  };

  const showError = (message, title = 'Error') => {
    addToast({ type: 'error', title, message });
  };

  const showWarning = (message, title = 'Warning') => {
    addToast({ type: 'warning', title, message });
  };

  const showInfo = (message, title = 'Info') => {
    addToast({ type: 'info', title, message });
  };

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}

export default Toast;
