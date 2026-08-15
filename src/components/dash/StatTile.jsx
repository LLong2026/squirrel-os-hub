import { cn } from "@/lib/utils";

const TONES = {
  primary: "text-primary",
  accent: "text-accent",
  warning: "text-warning",
  success: "text-success",
  destructive: "text-destructive",
  foreground: "text-foreground",
};

export default function StatTile({ icon: Icon, label, value, sub, tone = "primary" }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
        {Icon && <Icon className={cn("h-4 w-4", TONES[tone] || TONES.primary)} />}
      </div>
      <p className={cn("mt-2 font-mono text-2xl font-semibold", TONES[tone] || TONES.foreground)}>
        {value ?? "—"}
      </p>
      {sub && <p className="mt-1 font-mono text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}