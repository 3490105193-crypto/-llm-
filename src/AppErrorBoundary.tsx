import { Component, type ErrorInfo, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Market Lens render failure", { error, componentStack: info.componentStack });
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="grid min-h-screen place-items-center bg-paper px-4 text-ink">
        <section
          aria-labelledby="app-error-title"
          className="w-full max-w-xl rounded-lg border border-line bg-white p-6 shadow-dashboard"
        >
          <p className="text-sm font-semibold text-coral">System status</p>
          <h1 id="app-error-title" className="mt-2 text-2xl font-semibold">
            Market workspace unavailable
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            The dashboard failed during rendering. Validation and runtime logs should be checked
            before relying on the analysis.
          </p>
          <button
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white"
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            <RotateCcw aria-hidden="true" size={18} />
            Retry
          </button>
        </section>
      </main>
    );
  }
}
