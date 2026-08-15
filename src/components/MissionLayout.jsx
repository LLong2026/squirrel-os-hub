import { ShieldCheck, Activity, Server, Bot, BookOpen, AlertTriangle, Boxes, ScrollText, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Mission Control", icon: Activity, active: true },
  { label: "Agent Fleet", icon: Bot },
  { label: "Compute Nodes", icon: Server },
  { label: "Knowledge Base", icon: BookOpen },
  { label: "Playbooks", icon: Boxes },
  { label: "Audit Trail", icon: ScrollText },
  { label: "Alerts", icon: AlertTriangle },
  { label: "Safety Stack", icon: ShieldCheck },
  { label: "Model Registry", icon: Gauge },
];

export default function MissionLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/40 md:flex">
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="font-mono text-sm font-semibold tracking-wide text-foreground">SQUIRREL OS</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Hub · Mission Control</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                item.active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="border-t border-border px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Constitution</p>
          <p className="font-mono text-xs text-foreground/80">v1.0 · BINDING</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/30 px-6">
          <div>
            <h1 className="font-mono text-sm font-semibold tracking-wide text-foreground">MISSION CONTROL</h1>
            <p className="font-mono text-[11px] text-muted-foreground">Squirrel OS Hub · Acorn</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="font-mono text-xs text-success">OPERATIONAL</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}