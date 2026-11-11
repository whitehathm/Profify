import { Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Toaster() {
  const { toasts } = useApp();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:end-6 sm:items-end"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 rounded-xl bg-primary-950 px-4 py-3 text-sm font-medium text-white shadow-xl animate-toast-in"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-500">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
