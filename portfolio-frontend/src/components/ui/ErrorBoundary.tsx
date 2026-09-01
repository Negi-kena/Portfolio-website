import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional label used in the fallback heading, e.g. "This section" */
  label?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Swap this for a real error-reporting service (Sentry, etc.) when one is wired up.
    console.error("Rendering error caught by boundary:", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-24 text-center"
        >
          <AlertTriangle size={32} className="text-red-400" />
          <h2 className="font-display text-xl font-semibold text-paper">
            {this.props.label ? `${this.props.label} couldn't load` : "Something went wrong"}
          </h2>
          <p className="text-sm text-paper-dim">
            An unexpected error occurred while rendering this page. You can try again, or head
            back home.
          </p>
          <div className="mt-2 flex gap-3">
            <Button variant="ghost" onClick={this.handleRetry}>
              Try again
            </Button>
            <a href="/">
              <Button variant="primary">Go home</Button>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
