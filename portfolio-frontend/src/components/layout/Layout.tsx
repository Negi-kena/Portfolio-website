import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { useFetch } from "../../hooks/useFetch";
import { getSettings } from "../../api/endpoints";

export function Layout() {
  const { data: settings } = useFetch(getSettings, []);

  return (
    <div className="blueprint-grid flex min-h-screen flex-col">
      {/* Accessible skip to main content link for keyboard/screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-magenta-500 focus:px-4 focus:py-2 focus:text-navy-950 focus:font-semibold focus:shadow-lg focus:outline-2 focus:outline-sea-400"
      >
        Skip to main content
      </a>

      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <ErrorBoundary fallbackTitle="Page Error" fallbackDescription="An unexpected error occurred while loading this page.">
          <Outlet context={{ settings }} />
        </ErrorBoundary>
      </main>
      <Footer settings={settings} />
    </div>
  );
}