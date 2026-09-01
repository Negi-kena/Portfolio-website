import { useEffect, useId, useRef } from "react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Move focus into the dialog when it opens, lock background scroll,
  // close on Escape, and restore focus to whatever opened it on close —
  // standard expectations for a modal dialog under keyboard navigation.
  useEffect(() => {
    if (!open) return;

    triggerRef.current = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-lg border border-navy-700 bg-navy-900 p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="font-display text-lg font-semibold text-paper">
          {title}
        </h2>
        {description && (
          <p id={descId} className="mt-2 text-sm text-paper-dim">
            {description}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <Button ref={cancelRef} variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
