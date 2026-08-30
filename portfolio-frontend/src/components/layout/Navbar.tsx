import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Terminal } from "lucide-react";
import { ThemeBulb } from "../ui/ThemeBulb";

const links = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-navy-700 bg-navy-950/85 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <NavLink
          to="/"
          className="flex items-center gap-2 font-display text-lg font-semibold text-paper"
        >
          <Terminal
            size={18}
            className="text-magenta-500"
          />

          Negaso<span className="text-sea-400">.dev</span>
        </NavLink>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-4 md:flex">
          <ul className="flex items-center gap-1 font-mono text-sm">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `rounded px-3 py-1.5 transition-colors ${
                      isActive
                        ? "bg-navy-800 text-sea-400"
                        : "text-paper-dim hover:text-paper"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Branded theme control */}
          <ThemeBulb />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeBulb />

          <button
            className="text-paper"
            onClick={() => setOpen((o) => !o)}
            aria-label={
              open ? "Close menu" : "Open menu"
            }
          >
            {open ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {open && (
        <ul className="flex flex-col gap-1 border-t border-navy-700 px-6 py-4 font-mono text-sm md:hidden">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded px-3 py-2 ${
                    isActive
                      ? "bg-navy-800 text-sea-400"
                      : "text-paper-dim"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}