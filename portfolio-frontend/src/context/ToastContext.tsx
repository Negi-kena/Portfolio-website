import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { ToastContainer, type ToastItem, type ToastType } from "../components/ui/Toast";

interface ToastContextValue {
  showToast: (options: { message: string; type?: ToastType; title?: string; duration?: number }) => string;
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  info: (message: string, title?: string) => string;
  warning: (message: string, title?: string) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastCount = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      message,
      type = "info",
      title,
      duration = 5000,
    }: {
      message: string;
      type?: ToastType;
      title?: string;
      duration?: number;
    }) => {
      const id = `toast-${Date.now()}-${++toastCount}`;
      const item: ToastItem = { id, message, type, title, duration };
      setToasts((current) => [...current, item]);
      return id;
    },
    [],
  );

  const success = useCallback(
    (message: string, title?: string) => showToast({ message, title, type: "success" }),
    [showToast],
  );
  const error = useCallback(
    (message: string, title?: string) => showToast({ message, title, type: "error" }),
    [showToast],
  );
  const info = useCallback(
    (message: string, title?: string) => showToast({ message, title, type: "info" }),
    [showToast],
  );
  const warning = useCallback(
    (message: string, title?: string) => showToast({ message, title, type: "warning" }),
    [showToast],
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
        success,
        error,
        info,
        warning,
        dismissToast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
