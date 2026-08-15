import { useEffect, useState } from "react";
import { safeList, safeUpdate } from "@/lib/safeFetch";
import StatusBadge from "@/components/dash/StatusBadge";

export default function Alerts() {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () => {
    setLoading(true);
    safeList("PlatformAlert", "-created_date", 200).then((r) => {
      setRows(Array.isArray(r) ? r : []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const resolve = async (id) => {
    await safeUpdate("PlatformAlert", id, { resolved_at: new Date().toISOString() });
    load();
  };

  if (loading) return <Loader />;
  const list = rows || [];
  const active = list.filter((a) => !a.resolved_at);
  const filtered = filter === "active" ? active : filter === "resolved" ? list.filter((a) => a.resolved_at) : list;

  return (
    <div className="space-y-4">
      <PageTitle title="Alerts" sub={`${active.length} active · ${list.length} total`} />
      <div className="flex gap-2">
        {["all", "active", "resolved", "critical", "warning", "info"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md border px-3 py-1 font-mono text-[11px] uppercase tracking-wider ${
              filter === f ? "border-primary bg-primary/15 text-primary" : "border-border bg-card/40 text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="space-y-2">
          {filtered.map((a) => {
            const sev = a.severity || "info";
            const visible = sev === filter || ["all", "active", "resolved"].includes(filter);
            if (!visible) return null;
            return (
              <div key={a.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card/50 p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={sev} label={sev} />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{a.alert_type || "alert"}</span>
                    {a.escalated_to_gabriel && <span className="font-mono text-[10px] text-warning">ESCALATED</span>}
                  </div>
                  <p className="mt-2 font-mono text-xs text-foreground">{a.message || "—"}</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">{a.app_id || "—"}</p>
                </div>
                {!a.resolved_at && (
                  <button
                    onClick={() => resolve(a.id)}
                    className="shrink-0 rounded-md border border-success/30 bg-success/10 px-3 py-1 font-mono text-[11px] text-success hover:bg-success/20"
                  >
                    Resolve
                  </button>
                )}
                {a.resolved_at && <span className="shrink-0 font-mono text-[10px] text-muted-foreground">RESOLVED</span>}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="font-mono text-xs text-muted-foreground">No alerts match this filter.</p>
      )}
    </div>
  );
}

function Loader() {
  return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
}
function PageTitle({ title, sub }) {
  return (
    <div>
      <h1 className="font-mono text-sm font-semibold tracking-wide text-foreground">{title}</h1>
      {sub && <p className="font-mono text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}