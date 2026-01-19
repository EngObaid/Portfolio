import { useToast } from '../../context/ToastContext';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm animate-fade-in',
            {
              'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400': toast.variant === 'success',
              'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400': toast.variant === 'error',
              'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400': toast.variant === 'info',
              'bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400': toast.variant === 'warning',
            }
          )}
        >
          {toast.variant === 'success' && <CheckCircle2 className="h-5 w-5 flex-shrink-0" />}
          {toast.variant === 'error' && <AlertCircle className="h-5 w-5 flex-shrink-0" />}
          {toast.variant === 'info' && <Info className="h-5 w-5 flex-shrink-0" />}
          {toast.variant === 'warning' && <AlertTriangle className="h-5 w-5 flex-shrink-0" />}
          
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 rounded-md p-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
