import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "../ui/Button";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="mx-auto my-8 max-w-xl rounded-xl border border-red-500/30 bg-navy-900/80 p-6 sm:p-8 backdrop-blur"
        >
          <div className="flex items-center gap-3 text-red-400">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10">
              <AlertTriangle size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-paper">
                {this.props.fallbackTitle || "Something went wrong"}
              </h2>
              <p className="font-mono text-xs text-paper-faint">
                Component failed to render safely
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-paper-dim">
            {this.props.fallbackDescription ||
              "An unexpected error occurred while rendering this section. You can try refreshing or returning to the home page."}
          </p>

          {import.meta.env.DEV && this.state.error && (
            <div className="mt-4 overflow-x-auto rounded-md border border-navy-700 bg-navy-950 p-3 font-mono text-xs text-red-300">
              <p className="font-bold">{this.state.error.toString()}</p>
              {this.state.errorInfo?.componentStack && (
                <pre className="mt-2 whitespace-pre-wrap text-[11px] text-paper-faint">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={this.handleReset} variant="primary">
              <RotateCcw size={14} aria-hidden="true" /> Try again
            </Button>
            <a href="/">
              <Button variant="ghost">
                <Home size={14} aria-hidden="true" /> Return home
              </Button>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
