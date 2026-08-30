import { Code2, Link2, AtSign, Mail } from "lucide-react";
import type { SiteSettings } from "../../types";

export function Footer({ settings }: { settings?: SiteSettings | null }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-navy-700 bg-navy-900/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 text-center">
        <div className="flex gap-4">
          {settings?.github && (
            <a href={settings.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-paper-dim hover:text-magenta-400 transition-colors">
              <Code2 size={18} />
            </a>
          )}
          {settings?.linkedin && (
            <a href={settings.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-paper-dim hover:text-magenta-400 transition-colors">
              <Link2 size={18} />
            </a>
          )}
          {settings?.twitter && (
            <a href={settings.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="text-paper-dim hover:text-magenta-400 transition-colors">
              <AtSign size={18} />
            </a>
          )}
          {settings?.email && (
            <a href={`mailto:${settings.email}`} aria-label="Email" className="text-paper-dim hover:text-magenta-400 transition-colors">
              <Mail size={18} />
            </a>
          )}
        </div>
        <p className="font-mono text-xs text-paper-faint">
          © {year} {settings?.heroTitle?.replace(/^I'?m\s+/i, "") || "Negaso Kena"} — built with React, Node &amp; MySQL
        </p>
      </div>
    </footer>
  );
}
