import { cn } from "@/lib/utils";

export default function Panel({ title, action, children, className }) {
  return (
    <section className={cn("rounded-xl border border-border bg-card/50", className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}