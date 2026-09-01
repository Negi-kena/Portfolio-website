import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { toastBus, type ToastPayload } from "../../lib/toastBus";

const AUTO_DISMISS_MS = 6000;

const variantStyles: Record<ToastPayload["variant"], string> = {
  success: "border-sea-400/40 bg-navy-900 text-paper",
  error: "border-red-500/40 bg-navy-900 text-paper",
  info: "border-navy-600 bg-navy-900 text-paper",
};

const variantIcon: Record<ToastPayload["variant"], React.ReactNode> = {
  success: <CheckCircle2 size={18} className="text-sea-400 flex-shrink-0" />,
  error: <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />,
  info: <Info size={18} className="text-paper-dim flex-shrink-0" />,
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastPayload[]>([]);

  useEffect(() => {
    const unsubscribe = toastBus.subscribe((toast) => {
      setToasts((prev) => [...prev, toast]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, AUTO_DISMISS_MS);
    });
    return unsubscribe;
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:right-4 sm:left-auto"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.variant === "error" ? "alert" : "status"}
          className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm ${variantStyles[toast.variant]}`}
        >
          {variantIcon[toast.variant]}
          <p className="flex-1 text-sm">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            aria-label="Dismiss notification"
            className="flex-shrink-0 text-paper-faint hover:text-paper focus-visible:outline-none"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
