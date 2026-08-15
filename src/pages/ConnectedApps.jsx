import { useEffect, useState } from "react";
import { safeList, healthColor, healthBar } from "@/lib/safeFetch";
import StatusBadge from "@/components/dash/StatusBadge";

export default function ConnectedApps() {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    safeList("ConnectedApp", null, 300).then((r) => {
      if (!mounted) return;
      setRows(Array.isArray(r) ? r : []);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  if (loading) return <Loader />;
  if (!rows.length) return <Empty />;

  return (
    <div>
      <PageTitle title="Connected Apps" sub={`${rows.length} apps`} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rows.map((a) => {
          const score = Number(a.health_score) || 0;
          return (
            <div key={a.id} className="rounded-xl border border-border bg-card/50 p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm text-foreground">{a.app_name || "Unnamed"}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{a.app_id || "—"}</p>
                </div>
                <StatusBadge status={a.status} label={a.status} />
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Health</span>
                  <span className={`font-mono text-xs ${healthColor(score)}`}>{score}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full ${healthBar(score)}`} style={{ width: `${Math.min(score, 100)}%` }} />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                <span>Deploy: {a.deployment_status || "—"}</span>
                <span>PQC: {a.pqc_config || "—"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Loader() {
  return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
}
function Empty() {
  return <div><PageTitle title="Connected Apps" /><p className="font-mono text-xs text-muted-foreground">No connected apps registered.</p></div>;
}
function PageTitle({ title, sub }) {
  return (
    <div className="mb-4">
      <h1 className="font-mono text-sm font-semibold tracking-wide text-foreground">{title}</h1>
      {sub && <p className="font-mono text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}