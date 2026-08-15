import { base44 } from "@/api/base44Client";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClientInstance } from "@/lib/query-client";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTop from "@/components/ScrollToTop";
import MissionLayout from "@/components/MissionLayout";
import Dashboard from "@/pages/Dashboard";
import ErrorBoundary from "@/components/ErrorBoundary";

function FullScreenLoader({ label = "Initializing Squirrel OS Hub..." }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="font-mono text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function AuthenticatedApp() {
  const { user, loading, notRegistered } = useAuth();

  if (loading) return <FullScreenLoader />;
  if (notRegistered) return <UserNotRegisteredError />;
  if (!user) {
    try {
      base44?.auth?.redirectToLogin?.(window.location.pathname);
    } catch (_) {
      /* no-op */
    }
    return <FullScreenLoader label="Redirecting to sign in..." />;
  }

  return (
    <Routes>
      <Route path="/" element={<MissionLayout><Dashboard /></MissionLayout>} />
      <Route path="*" element={<MissionLayout><Dashboard /></MissionLayout>} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <BrowserRouter>
            <ScrollToTop />
            <AuthenticatedApp />
          </BrowserRouter>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}