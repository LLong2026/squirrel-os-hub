import { useEffect, useState } from "react";
import { safeList } from "@/lib/safeFetch";

export default function Playbooks() {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    safeList("PlaybookTemplate", null, 500).then((r) => {
      if (!mounted) return;
      setRows(Array.isArray(r) ? r : []);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  if (loading) return <Loader />;
  const list = rows || [];

  return (
    <div className="space-y-4">
      <PageTitle title="Playbooks" sub={`${list.length} templates`} />
      {list.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {list.map((p) => {
            const conf = Math.round((Number(p.confidence_threshold) || 0) * 100);
            return (
              <div key={p.id} className="rounded-xl border border-border bg-card/50 p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm text-foreground">{p.name || "Unnamed"}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{p.code || "—"} · v{p.version || "1.0"}</p>
                  </div>
                  <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {p.anomaly_type || "general"}
                  </span>
                </div>
                {p.trigger_condition && (
                  <p className="mt-2 font-mono text-[11px] text-muted-foreground">{p.trigger_condition}</p>
                )}
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Confidence</span>
                    <span className="font-mono text-xs text-foreground">{conf}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(conf, 100)}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="font-mono text-xs text-muted-foreground">No playbooks registered.</p>
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