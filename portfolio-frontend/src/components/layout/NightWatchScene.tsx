import { useTheme } from "../../context/ThemeContext";
import { resolveAssetUrl } from "../../api/client";

interface NightWatchSceneProps {
  avatarUrl?: string | null;
}

// Triggered by the theme bulb: a playful full-screen takeover, not a real
// color-scheme swap. Deep-navy/magenta/cyan ambient "dim house" lighting,
// with the portrait patrolling a rectangular loop like a security guard.
// Dismissed by clicking the bulb again (Navbar stays above this, z-50 vs z-40).
export function NightWatchScene({ avatarUrl }: NightWatchSceneProps) {
  const { theme } = useTheme();

  if (theme !== "light") return null;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-navy-950">
      {/* Ambient dim-lit glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[15%] h-72 w-72 rounded-full bg-magenta-500/25 blur-[90px] animate-glow-a" />
        <div className="absolute right-[15%] top-[35%] h-96 w-96 rounded-full bg-sea-400/20 blur-[110px] animate-glow-b" />
        <div className="absolute bottom-[10%] left-[30%] h-80 w-80 rounded-full bg-magenta-400/15 blur-[100px] animate-glow-c" />
        <div className="absolute inset-0 bg-navy-950/40" />
      </div>

      {/* Patrolling portrait */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-patrol">
          <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-sea-400/70 shadow-[0_0_50px_10px_rgba(45,212,191,0.35)]">
            {avatarUrl ? (
              <img
                src={resolveAssetUrl(avatarUrl)}
                alt="Negaso Kena on night patrol"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div className="h-full w-full bg-navy-800" />
            )}
          </div>
        </div>
      </div>

      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.3em] text-paper-faint">
        on patrol — tap the bulb to return
      </p>
    </div>
  );
}