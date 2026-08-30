import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Newspaper,
  Mail,
  Settings,
  LogOut,
  Terminal,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const links = [
  {
    to: "/admin",
    label: "Overview",
    description: "Site activity",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/admin/projects",
    label: "Projects",
    description: "Your work",
    icon: FolderKanban,
  },
  {
    to: "/admin/blog",
    label: "Blog posts",
    description: "Articles & writing",
    icon: Newspaper,
  },
  {
    to: "/admin/messages",
    label: "Messages",
    description: "Contact inbox",
    icon: Mail,
  },
  {
    to: "/admin/settings",
    label: "Site settings",
    description: "Profile & site",
    icon: Settings,
  },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-navy-950 text-paper">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-navy-700 bg-navy-950/90 px-5 py-4 backdrop-blur md:hidden">
        <Link
          to="/admin"
          className="flex items-center gap-2 font-display font-semibold"
        >
          <Terminal size={18} className="text-magenta-500" />
          admin<span className="text-sea-400">.console</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          className="rounded-md border border-navy-700 p-2 text-paper-dim transition hover:border-sea-400 hover:text-sea-400"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-navy-700 bg-navy-900/40 md:flex">
          {/* Brand */}
          <div className="border-b border-navy-700 px-5 py-6">
            <Link
              to="/admin"
              className="flex items-center gap-2 font-display text-lg font-semibold text-paper"
            >
              <Terminal size={18} className="text-magenta-500" />
              admin<span className="text-sea-400">.console</span>
            </Link>

            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">
              content control
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-5">
            <p className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">
              workspace
            </p>

            <div className="space-y-1">
              {links.map(
                ({
                  to,
                  label,
                  description,
                  icon: Icon,
                  end,
                }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${
                        isActive
                          ? "bg-navy-800 text-paper shadow-sm"
                          : "text-paper-dim hover:bg-navy-800/60 hover:text-paper"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${
                            isActive
                              ? "border-magenta-500/40 bg-magenta-500/10 text-magenta-400"
                              : "border-navy-700 bg-navy-800/40 text-paper-faint group-hover:border-navy-600 group-hover:text-sea-400"
                          }`}
                        >
                          <Icon size={15} />
                        </span>

                        <span className="min-w-0">
                          <span className="block text-sm font-medium">
                            {label}
                          </span>
                          <span className="block truncate font-mono text-[10px] text-paper-faint">
                            {description}
                          </span>
                        </span>
                      </>
                    )}
                  </NavLink>
                ),
              )}
            </div>
          </nav>

          {/* Sidebar footer */}
          <div className="border-t border-navy-700 p-4">
            <div className="mb-3 rounded-lg border border-navy-700 bg-navy-800/30 p-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                signed in as
              </p>
              <p className="mt-1 truncate text-sm text-paper">
                {user?.name || "Administrator"}
              </p>
              <p className="mt-0.5 truncate font-mono text-[10px] text-paper-faint">
                {user?.email}
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                to="/"
                target="_blank"
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-navy-700 px-3 py-2 text-xs text-paper-dim transition hover:border-sea-400 hover:text-sea-400"
              >
                <ExternalLink size={13} />
                View site
              </Link>

              <button
                onClick={logout}
                title="Log out"
                className="flex items-center justify-center rounded-md border border-navy-700 px-3 py-2 text-paper-faint transition hover:border-red-500/50 hover:text-red-400"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile navigation */}
        {mobileOpen && (
          <div className="fixed inset-x-0 top-[65px] z-30 border-b border-navy-700 bg-navy-950 p-4 shadow-2xl md:hidden">
            <nav className="space-y-1">
              {links.map(
                ({
                  to,
                  label,
                  description,
                  icon: Icon,
                  end,
                }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-3 ${
                        isActive
                          ? "bg-navy-800 text-paper"
                          : "text-paper-dim"
                      }`
                    }
                  >
                    <Icon size={16} />
                    <span>
                      <span className="block text-sm">
                        {label}
                      </span>
                      <span className="font-mono text-[10px] text-paper-faint">
                        {description}
                      </span>
                    </span>
                  </NavLink>
                ),
              )}

              <div className="mt-3 border-t border-navy-700 pt-3">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-paper-dim"
                >
                  <ExternalLink size={14} />
                  View public site
                </Link>

                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-paper-dim"
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <main className="mx-auto max-w-6xl px-5 py-7 sm:px-7 md:px-10 md:py-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}