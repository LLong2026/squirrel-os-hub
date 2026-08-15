import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClientInstance } from "@/lib/query-client";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import MissionLayout from "@/components/MissionLayout";
import { base44 } from "@/api/base44Client";

import Dashboard from "@/pages/Dashboard";
import Customers from "@/pages/Customers";
import ConnectedApps from "@/pages/ConnectedApps";
import HealingEvents from "@/pages/HealingEvents";
import Playbooks from "@/pages/Playbooks";
import Tiers from "@/pages/Tiers";
import Alerts from "@/pages/Alerts";
import NeuralMesh from "@/pages/NeuralMesh";
import SafetyStack from "@/pages/SafetyStack";
import Onboarding from "@/pages/Onboarding";
import WhyWeBuiltThis from "@/pages/WhyWeBuiltThis";
import HowItWorks from "@/pages/HowItWorks";

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
    } catch {
      /* no-op */
    }
    return <FullScreenLoader label="Redirecting to sign in..." />;
  }
  return (
    <Routes>
      <Route element={<MissionLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/connected-apps" element={<ConnectedApps />} />
        <Route path="/healing-events" element={<HealingEvents />} />
        <Route path="/playbooks" element={<Playbooks />} />
        <Route path="/tiers" element={<Tiers />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/neural-mesh" element={<NeuralMesh />} />
        <Route path="/safety-stack" element={<SafetyStack />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/why" element={<WhyWeBuiltThis />} />
        <Route path="/how" element={<HowItWorks />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
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