import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Terminal } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";

export function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname: string } } };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blueprint-grid flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-lg border border-navy-700 bg-navy-900/70 p-8">
        <div className="mb-6 flex items-center gap-2 font-display text-lg font-semibold text-paper">
          <Terminal size={18} className="text-magenta-500" />
          admin login
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block font-mono text-xs text-paper-faint">email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-navy-600 bg-navy-800/60 px-3 py-2.5 text-paper focus:border-sea-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-paper-faint">password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-navy-600 bg-navy-800/60 px-3 py-2.5 text-paper focus:border-sea-400 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
