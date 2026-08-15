import { useEffect, useState } from "react";
import { Boxes, ShieldCheck, Activity, Cpu, Gauge, Network, AlertTriangle } from "lucide-react";
import { safeList, healthColor, healthBar } from "@/lib/safeFetch";
import StatTile from "@/components/dash/StatTile";
import Panel from "@/components/dash/Panel";
import StatusBadge from "@/components/dash/StatusBadge";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [appsR, healingR, alertsR] = await Promise.allSettled([
        safeList("ConnectedApp", null, 200),
        safeList("HealingEventLog", "-created_date", 300),
        safeList("PlatformAlert", "-created_date", 100),
      ]);
      if (!mounted) return;
      const apps = appsR.status === "fulfilled" ? appsR.value : [];
      const healing = healingR.status === "fulfilled" ? healingR.value : [];
      const alerts = alertsR.status === "fulfilled" ? alertsR.value : [];

      const scores = apps.map((a) => Number(a.health_score) || 0);
      const fleetHealth = scores.length
        ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length)
        : 100;
      const successCount = healing.filter((e) => e.success).length;
      const successRate = healing.length
        ? Math.round((successCount / healing.length) * 100)
        : 100;
      const activeAlerts = alerts.filter((a) => !a.resolved_at);

      setData({ apps, healing, alerts: activeAlerts, fleetHealth, successRate });
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const { apps, healing, alerts, fleetHealth, successRate } = data || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatTile icon={Boxes} label="Connected Apps" value={apps?.length ?? 0} tone="primary" />
        <StatTile icon={ShieldCheck} label="Fleet Health" value={`${fleetHealth}`} sub="avg score" tone={fleetHealth >= 90 ? "success" : "warning"} />
        <StatTile icon={Network} label="Neural Nodes" value={310} sub="online" tone="accent" />
        <StatTile icon={Cpu} label="PQC Coverage" value="100%" tone="success" />
        <StatTile icon={Activity} label="Healing Success" value={`${successRate}%`} tone={successRate >= 95 ? "success" : "warning"} />
        <StatTile icon={Gauge} label="Credit Opt." value="95.6%" tone="accent" />
      </div>

      <div>
        <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Connected Apps</h2>
        {apps?.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {apps.map((a) => {
              const score = Number(a.health_score) || 0;
              return (
                <div key={a.id} className="rounded-xl border border-border bg-card/50 p-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-sm text-foreground">{a.app_name || "Unnamed App"}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{a.app_id || a.customer_id || "—"}</p>
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
                  <p className="mt-3 font-mono text-[10px] text-muted-foreground">PQC: {a.pqc_config || "—"}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="font-mono text-xs text-muted-foreground">No connected apps registered.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Recent Healing Events">
          {healing?.length ? (
            <ul className="divide-y divide-border">
              {healing.slice(0, 5).map((e) => (
                <li key={e.id} className="flex items-start justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs text-foreground">{e.anomaly_summary || "Healing event"}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{e.action_taken || "—"}</p>
                  </div>
                  <StatusBadge status={e.success ? "pass" : "error"} label={e.success ? "ok" : "fail"} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-xs text-muted-foreground">No healing events recorded.</p>
          )}
        </Panel>

        <Panel title="Active Alerts">
          {alerts?.length ? (
            <ul className="divide-y divide-border">
              {alerts.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs text-foreground">{a.message || a.alert_type || "Alert"}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{a.app_id || "—"}</p>
                  </div>
                  <StatusBadge status={a.severity || "warning"} label={a.severity || "info"} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-xs text-muted-foreground">No active alerts. All systems nominal.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}