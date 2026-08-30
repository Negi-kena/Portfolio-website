import { useTheme } from "../../context/ThemeContext";

export function ThemeBulb() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isLight
          ? "Switch to dark mode"
          : "Switch to light mode"
      }
      title={
        isLight
          ? "Switch to dark mode"
          : "Switch to light mode"
      }
      className={`theme-bulb ${
        isLight ? "theme-bulb-lit" : "theme-bulb-dim"
      }`}
    >
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="h-5 w-5"
      >
        {/* Light rays */}
        <g className="bulb-rays">
          <path d="M24 3v5" />
          <path d="M8.5 9.5l3.5 3.5" />
          <path d="M39.5 9.5L36 13" />
          <path d="M3 24h5" />
          <path d="M40 24h5" />
        </g>

        {/* Bulb */}
        <path
          className="bulb-glass"
          d="M24 10.5a11.5 11.5 0 0 0-6.8 20.8c1.5 1.1 2.3 2.7 2.3 4.5h9c0-1.8.8-3.4 2.3-4.5A11.5 11.5 0 0 0 24 10.5Z"
        />

        {/* Bulb base */}
        <path
          className="bulb-base"
          d="M19.5 36h9M20.5 39.5h7M22 43h4"
        />

        {/* Filament */}
        <path
          className="bulb-filament"
          d="M21 21.5c1.2 1.2 1.8 2.8 1.8 4.5M27 21.5c-1.2 1.2-1.8 2.8-1.8 4.5M22.8 26h2.4"
        />
      </svg>

      <span className="sr-only">
        {isLight ? "Light mode" : "Dark mode"}
      </span>
    </button>
  );
}