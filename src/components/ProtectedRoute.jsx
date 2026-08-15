import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

function FullScreenLoader({ label = "Initializing Squirrel OS Hub..." }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="font-mono text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;
    base44.auth
      .isAuthenticated()
      .then((ok) => mounted && setStatus(ok ? "authed" : "guest"))
      .catch(() => mounted && setStatus("guest"));
    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") return <FullScreenLoader />;

  if (status === "guest") {
    try {
      base44.auth.redirectToLogin?.(window.location.pathname);
    } catch (_) {
      /* no-op */
    }
    return <FullScreenLoader label="Redirecting to sign in..." />;
  }

  return children;
}