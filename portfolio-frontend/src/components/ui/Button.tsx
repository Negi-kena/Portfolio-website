import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";

  const variants: Record<string, string> = {
    primary:
      "bg-magenta-500 text-navy-950 hover:bg-magenta-400 font-semibold hover:-translate-y-px",

    ghost:
      "border border-navy-600 bg-transparent text-paper hover:border-sea-400 hover:bg-sea-400/5 hover:text-sea-400",

    danger:
      "border border-red-500/40 bg-transparent text-red-400 hover:border-red-500/70 hover:bg-red-500/10",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}