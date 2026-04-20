import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const variants = {
  success: { icon: CheckCircle, className: 'bg-green-50 text-green-800 border-green-200' },
  error: { icon: XCircle, className: 'bg-red-50 text-red-800 border-red-200' },
  warning: { icon: AlertCircle, className: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
  info: { icon: Info, className: 'bg-blue-50 text-blue-800 border-blue-200' },
};

const Alert = ({ variant = 'info', title, message, onClose }) => {
  const Icon = variants[variant].icon;

  return (
    <div className={`rounded-lg border p-4 ${variants[variant].className}`}>
      <div className="flex items-start">
        <Icon className="w-5 h-5 mr-3 mt-0.5" />
        <div className="flex-1">
          {title && <h4 className="font-medium mb-1">{title}</h4>}
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-4">
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;