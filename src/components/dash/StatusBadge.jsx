import { cn } from "@/lib/utils";

const MAP = {
  healthy: "border-success/30 bg-success/10 text-success",
  operational: "border-success/30 bg-success/10 text-success",
  active: "border-success/30 bg-success/10 text-success",
  closed: "border-success/30 bg-success/10 text-success",
  pass: "border-success/30 bg-success/10 text-success",
  deployed: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  open: "border-warning/30 bg-warning/10 text-warning",
  half_open: "border-warning/30 bg-warning/10 text-warning",
  critical: "border-destructive/30 bg-destructive/10 text-destructive",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  offline: "border-destructive/30 bg-destructive/10 text-destructive",
};

export default function StatusBadge({ status, label }) {
  const cls = MAP[String(status || "").toLowerCase()] || "border-border bg-muted/40 text-muted-foreground";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider", cls)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label || status}
    </span>
  );
}