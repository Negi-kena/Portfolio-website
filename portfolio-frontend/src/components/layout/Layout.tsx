import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useFetch } from "../../hooks/useFetch";
import { getSettings } from "../../api/endpoints";
import { ErrorBoundary } from "../ui/ErrorBoundary";

export function Layout() {
  const { data: settings } = useFetch(getSettings, []);

  return (
    <div className="blueprint-grid flex min-h-screen flex-col">
      {/* Keyboard/screen-reader users can jump straight past the nav */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-sm focus:text-paper focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        {/* Scoped boundary: a bad page/API response here won't take the nav or footer down with it. */}
        <ErrorBoundary label="This page">
          <Outlet context={{ settings }} />
        </ErrorBoundary>
      </main>
      <div className="site-separator" aria-hidden="true" />
      <Footer settings={settings} />
    </div>
  );
}
