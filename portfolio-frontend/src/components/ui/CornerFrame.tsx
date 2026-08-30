import type { ReactNode } from "react";

interface CornerFrameProps {
  children: ReactNode;
  className?: string;
  accent?: "magenta" | "sea";
}

// Explicit corner <span> elements (not CSS pseudo-elements) — carried over from an
// earlier revision where the CSS-only approach proved incomplete on hover states.
export function CornerFrame({ children, className = "", accent = "magenta" }: CornerFrameProps) {
  const color = accent === "magenta" ? "border-magenta-400" : "border-sea-400";

  return (
    <div className={`relative group ${className}`}>
      <span className={`absolute -top-px -left-px w-3 h-3 border-t border-l ${color} opacity-60 group-hover:opacity-100 transition-opacity`} />
      <span className={`absolute -top-px -right-px w-3 h-3 border-t border-r ${color} opacity-60 group-hover:opacity-100 transition-opacity`} />
      <span className={`absolute -bottom-px -left-px w-3 h-3 border-b border-l ${color} opacity-60 group-hover:opacity-100 transition-opacity`} />
      <span className={`absolute -bottom-px -right-px w-3 h-3 border-b border-r ${color} opacity-60 group-hover:opacity-100 transition-opacity`} />
      {children}
    </div>
  );
}
