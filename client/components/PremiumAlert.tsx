import { AlertCircle } from 'lucide-react'; // optional: lucide icon

const PremiumAlert = ({ title, message, type = 'info', onClose }) => {
  const colorMap = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const iconMap = {
    info: <AlertCircle className="h-5 w-5 text-blue-500" />,
    success: <AlertCircle className="h-5 w-5 text-green-500" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
  };

  return (
    <div
      className={`max-w-md mx-auto flex items-start gap-3 p-4 border rounded-xl shadow-md ${colorMap[type]}`}
    >
      <div className="pt-1">{iconMap[type]}</div>
      <div className="flex-1">
        <p className="font-semibold text-base">{title}</p>
        <p className="text-sm opacity-90">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto text-xl font-semibold text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default PremiumAlert;
