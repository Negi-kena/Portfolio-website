import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useFetch } from "../../hooks/useFetch";
import { getSettings } from "../../api/endpoints";

export function Layout() {
  const { data: settings } = useFetch(getSettings, []);

  return (
    <div className="blueprint-grid flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet context={{ settings }} />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
