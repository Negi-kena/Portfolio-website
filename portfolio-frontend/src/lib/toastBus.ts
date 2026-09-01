export type ToastVariant = "success" | "error" | "info";

export interface ToastPayload {
  id: number;
  variant: ToastVariant;
  message: string;
}

type Listener = (toast: ToastPayload) => void;

let idCounter = 0;
const listeners = new Set<Listener>();

// Avoid spamming identical error toasts (e.g. several requests timing out
// at once) — collapse repeats of the same message within this window.
const recentMessages = new Map<string, number>();
const DEDUPE_WINDOW_MS = 4000;

function publish(variant: ToastVariant, message: string) {
  const now = Date.now();
  const lastShown = recentMessages.get(message);
  if (lastShown && now - lastShown < DEDUPE_WINDOW_MS) return;
  recentMessages.set(message, now);

  const toast: ToastPayload = { id: ++idCounter, variant, message };
  listeners.forEach((listener) => listener(toast));
}

export const toastBus = {
  success: (message: string) => publish("success", message),
  error: (message: string) => publish("error", message),
  info: (message: string) => publish("info", message),
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
