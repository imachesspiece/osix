import React from 'react';

type AlertType = 'error' | 'info' | 'success' | 'warning';

interface AlertMessageProps {
  message: string;
  type?: AlertType;
  className?: string;
}

const typeStyles: Record<AlertType, string> = {
  error: 'border-red-500/40 bg-red-500/10 text-red-200',
  info: 'border-sky-400/30 bg-sky-400/10 text-sky-100',
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-100',
};

const AlertMessage: React.FC<AlertMessageProps> = ({ message, type = 'info', className = '' }) => {
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm font-medium ${typeStyles[type]} ${className}`} role="alert">
      {message}
    </div>
  );
};

export default AlertMessage;
