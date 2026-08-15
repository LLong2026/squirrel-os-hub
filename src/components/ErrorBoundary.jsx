import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || String(error) };
  }

  componentDidCatch() {
    // Swallow to avoid leaking internals; the fallback UI surfaces the message.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10">
            <span className="font-mono text-xl text-destructive">!</span>
          </div>
          <h1 className="font-mono text-lg font-semibold text-foreground">Render error</h1>
          <p className="max-w-md font-mono text-sm text-muted-foreground">
            The dashboard hit an unexpected error. Reloading usually clears it.
          </p>
          {this.state.message && (
            <pre className="max-w-lg overflow-auto rounded-lg border border-border bg-card/60 p-3 text-left font-mono text-[11px] text-warning">
              {this.state.message}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className="rounded-md border border-border bg-card px-4 py-2 font-mono text-xs text-foreground hover:bg-muted"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}