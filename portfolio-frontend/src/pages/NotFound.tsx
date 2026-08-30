import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function NotFound() {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-32 text-center">
      <p className="font-mono text-6xl font-bold text-gradient-signal">404</p>
      <h1 className="font-display text-2xl font-bold text-paper">Page not found</h1>
      <p className="text-paper-dim">The route you're looking for doesn't exist.</p>
      <Link to="/">
        <Button variant="ghost">Back to home</Button>
      </Link>
    </section>
  );
}
