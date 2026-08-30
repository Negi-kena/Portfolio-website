export function Loading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-paper-faint">
      <svg width="120" height="24" viewBox="0 0 120 24" className="text-magenta-500">
        <polyline
          points="0,12 20,12 28,4 36,20 44,4 52,20 60,12 120,12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="1200"
          className="animate-signal"
        />
      </svg>
      <span className="font-mono text-xs uppercase tracking-widest">{label}…</span>
    </div>
  );
}
