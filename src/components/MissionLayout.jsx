import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Users, Boxes, Activity, BookOpen, Layers,
  AlertTriangle, Network, ShieldCheck, UserPlus, HelpCircle, Info,
  Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/connected-apps", label: "Connected Apps", icon: Boxes },
  { to: "/healing-events", label: "Healing Events", icon: Activity },
  { to: "/playbooks", label: "Playbooks", icon: BookOpen },
  { to: "/tiers", label: "Tier Management", icon: Layers },
  { to: "/alerts", label: "Alerts", icon: AlertTriangle },
  { to: "/neural-mesh", label: "Neural Mesh", icon: Network },
  { to: "/safety-stack", label: "Safety Stack", icon: ShieldCheck },
  { to: "/onboarding", label: "Onboarding", icon: UserPlus },
  { to: "/why", label: "Why We Built This", icon: HelpCircle },
  { to: "/how", label: "How It Works", icon: Info },
];

export default function MissionLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-card transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="font-mono text-sm font-semibold tracking-wide">SQUIRREL OS</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Hub · Mission Control</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Constitution</p>
          <p className="font-mono text-xs text-foreground/80">v1.0 · BINDING</p>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/30 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setOpen((v) => !v)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="font-mono text-sm font-semibold tracking-wide">Squirrel OS Hub</h1>
              <p className="font-mono text-[11px] text-muted-foreground">Mission Control · Acorn</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="font-mono text-xs text-success">OPERATIONAL</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}