import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export function ToastCard({ toast, onDismiss }: ToastCardProps) {
  useEffect(() => {
    const duration = toast.duration ?? 5000;
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const icons = {
    success: <CheckCircle2 size={18} className="text-sea-400 shrink-0" aria-hidden="true" />,
    error: <AlertCircle size={18} className="text-red-400 shrink-0" aria-hidden="true" />,
    warning: <AlertTriangle size={18} className="text-magenta-400 shrink-0" aria-hidden="true" />,
    info: <Info size={18} className="text-cyan-400 shrink-0" aria-hidden="true" />,
  };

  const borders = {
    success: "border-sea-400/40 bg-navy-900/95 text-paper",
    error: "border-red-500/40 bg-navy-900/95 text-paper",
    warning: "border-magenta-500/40 bg-navy-900/95 text-paper",
    info: "border-cyan-500/40 bg-navy-900/95 text-paper",
  };

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      aria-live={toast.type === "error" ? "assertive" : "polite"}
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-2xl backdrop-blur transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${borders[toast.type]}`}
    >
      {icons[toast.type]}
      <div className="min-w-0 flex-1">
        {toast.title && (
          <p className="font-display text-sm font-semibold leading-tight text-paper mb-0.5">
            {toast.title}
          </p>
        )}
        <p className="text-xs leading-relaxed text-paper-dim">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="shrink-0 rounded p-1 text-paper-faint transition hover:bg-white/10 hover:text-paper focus-visible:outline-2 focus-visible:outline-sea-400"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-[calc(100vw-2.5rem)]"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
