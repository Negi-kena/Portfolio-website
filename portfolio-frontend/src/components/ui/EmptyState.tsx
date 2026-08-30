import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-navy-600 py-16 px-6 text-center">
      <p className="font-display text-lg text-paper">{title}</p>
      {description && <p className="max-w-sm text-sm text-paper-faint">{description}</p>}
      {action}
    </div>
  );
}
