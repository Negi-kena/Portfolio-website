import { Code2, Link2, Mail, Phone, Send } from "lucide-react";
import type { SiteSettings } from "../../types";

export function Footer({ settings }: { settings?: SiteSettings | null }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-500/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-12 text-center lg:px-8">
        {/* Direct Contact Info (Phone & Telegram) */}
        <div className="flex flex-wrap justify-center gap-6 font-mono text-sm text-paper-dim">
          <a
            href="tel:+251917843883"
            className="flex items-center gap-2 hover:text-sea-400 transition-colors"
          >
            <Phone size={16} className="text-sea-400" />
            <span>+251 917 843 883</span>
          </a>

          <a
            href="https://t.me/nagaaofficial"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-sea-400 transition-colors"
          >
            <Send size={16} className="text-magenta-400" />
            Telegram:<span>@nagaaofficial</span>
          </a>
        </div>

        {/* Links with text labels/descriptions */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {settings?.github && (
            <a
              href={settings.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-paper-dim hover:text-magenta-400 transition-colors font-mono text-sm"
            >
              <Code2 size={18} />
              <span>GitHub</span>
            </a>
          )}

          {settings?.linkedin && (
            <a
              href={settings.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-paper-dim hover:text-magenta-500 transition-colors font-mono text-sm"
            >
              <Link2 size={18} />
              <span>LinkedIn</span>
            </a>
          )}

          {settings?.email && (
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-2 text-paper-dim hover:text-magenta-500 transition-colors font-mono text-sm"
            >
              <Mail size={18} />
              <span>Email</span>
            </a>
          )}
        </div>

        {/* Copyright notice */}
        <p className="w-full border-t border-navy-800 pt-6 font-mono text-xs text-paper-faint">
          © {year}{" "}
          {settings?.heroTitle?.replace(/^I'?m\s+/i, "") || "Negaso Kena"} —
          built with React, React Router, Vite, TypeScript, Tailwind CSS, Node,
          &amp; MySQL
        </p>
      </div>
    </footer>
  );
}
