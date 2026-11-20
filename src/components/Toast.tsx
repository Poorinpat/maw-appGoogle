import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import type { ToastItem } from '../types';

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] sm:w-auto pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium bg-white ${
              isError
                ? 'border-red-200 text-red-800'
                : isInfo
                  ? 'border-blue-200 text-blue-900'
                  : 'border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isError ? (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
              ) : isInfo ? (
                <Info className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              )}
              <span className="truncate">{toast.message}</span>
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="ปิดการแจ้งเตือน"
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
