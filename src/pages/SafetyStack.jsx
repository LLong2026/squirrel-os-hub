import { useEffect, useState } from "react";
import { safeList } from "@/lib/safeFetch";
import Panel from "@/components/dash/Panel";
import StatusBadge from "@/components/dash/StatusBadge";
import StatTile from "@/components/dash/StatTile";
import { ShieldCheck, Activity, AlertOctagon, Gauge } from "lucide-react";

export default function SafetyStack() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [bR, mR, rR] = await Promise.allSettled([
        safeList("CircuitBreaker", null, 50),
        safeList("MetaMonitor", "-created_date", 20),
        safeList("RateLimitLog", "-created_date", 20),
      ]);
      if (!mounted) return;
      setData({
        breakers: bR.status === "fulfilled" ? bR.value : [],
        metrics: mR.status === "fulfilled" ? mR.value : [],
        rateLogs: rR.status === "fulfilled" ? rR.value : [],
      });
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <Loader />;
  const { breakers, metrics, rateLogs } = data || {};
  const openBreakers = (breakers || []).filter((b) => b.state !== "closed").length;

  return (
    <div className="space-y-6">
      <PageTitle title="Safety Stack" sub="Circuit breakers · Rate limiting · Meta-monitor" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile icon={ShieldCheck} label="Breakers" value={`${(breakers || []).length - openBreakers}/${breakers?.length ?? 0}`} tone={openBreakers ? "warning" : "success"} />
        <StatTile icon={AlertOctagon} label="Open Breakers" value={openBreakers} tone={openBreakers ? "destructive" : "success"} />
        <StatTile icon={Activity} label="Rate Logs" value={rateLogs?.length ?? 0} tone="primary" />
        <StatTile icon={Gauge} label="Meta Metrics" value={metrics?.length ?? 0} tone="accent" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Circuit Breakers">
          {breakers?.length ? (
            <ul className="space-y-2">
              {breakers.map((b) => (
                <li key={b.id} className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2">
                  <div>
                    <p className="font-mono text-xs text-foreground">{b.breaker_name || "breaker"}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {b.scope === "global" ? "GLOBAL" : b.adapter_name || "per-adapter"} · {b.failure_count ?? 0} failures
                    </p>
                  </div>
                  <StatusBadge status={b.state} label={b.state} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-xs text-muted-foreground">No circuit breakers registered.</p>
          )}
        </Panel>

        <Panel title="Meta-Monitor">
          {metrics?.length ? (
            <ul className="space-y-2">
              {metrics.map((m) => (
                <li key={m.id} className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted-foreground">{m.metric_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-foreground">{m.metric_value}{m.unit}</span>
                    <StatusBadge status={m.status} label={m.status} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-xs text-muted-foreground">No meta-monitor metrics recorded.</p>
          )}
        </Panel>
      </div>
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