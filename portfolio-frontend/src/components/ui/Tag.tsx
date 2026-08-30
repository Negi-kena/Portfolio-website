export function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-navy-600 bg-navy-800/60 px-2.5 py-0.5 text-xs font-mono text-paper-dim">
      {label}
    </span>
  );
}
