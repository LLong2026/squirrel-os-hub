import { useEffect, useState } from "react";
import { Boxes, ShieldCheck, Server, Bot, BookOpen, Activity, AlertTriangle, Cpu, Gauge, Network } from "lucide-react";
import { base44 } from "@/api/base44Client";
import StatTile from "@/components/dash/StatTile";
import Panel from "@/components/dash/Panel";
import StatusBadge from "@/components/dash/StatusBadge";

const val = (r) => (r && r.status === "fulfilled" ? r.value || [] : []);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const results = await Promise.allSettled([
        base44.entities.ConnectedApp.list(null, 200),
        base44.entities.HealingEventLog.list("-created_date", 300),
        base44.entities.PlaybookTemplate.list(null, 500),
        base44.entities.PlatformAdapter.list(null, 20),
        base44.entities.ComputeNode.list(null, 100),
        base44.entities.AIAgent.list(null, 200),
        base44.entities.PlatformAlert.list("-created_date", 50),
        base44.entities.CircuitBreaker.list(null, 20),
        base44.entities.MetaMonitor.list("-created_date", 8),
      ]);
      const failed = results.map((r, i) => (r.status === "rejected" ? i : -1)).filter((i) => i >= 0);
      if (!mounted) return;

      const [appsR, healingR, pbR, adR, nodesR, agentsR, alertsR, breakersR, metricsR] = results;
      const apps = val(appsR);
      const healing = val(healingR);
      const playbooks = val(pbR);
      const adapters = val(adR);
      const nodes = val(nodesR);
      const agents = val(agentsR);
      const alerts = val(alertsR);
      const breakers = val(breakersR);
      const metrics = val(metricsR);

      const successCount = healing.filter((e) => e.success).length;
      const successRate = healing.length ? Math.round((successCount / healing.length) * 100) : 100;
      const openAlerts = alerts.filter((a) => !a.resolved_at && !a.resolved).length;
      const openBreakers = breakers.filter((b) => b.state !== "closed").length;
      const pqcReady = apps.length
        ? Math.round((apps.filter((a) => a.pqc_config).length / apps.length) * 100)
        : 98;
      const health = Math.round(successRate * 0.5 + 49);

      setData({
        apps, healing, playbooks, adapters, nodes, agents, alerts, breakers, metrics,
        successRate, openAlerts, openBreakers, pqcReady, health,
      });
      setErrors(failed);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="font-mono text-xs text-muted-foreground">Loading fleet telemetry...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <p className="font-mono text-sm text-destructive">Failed to load dashboard data.</p>
      </div>
    );
  }

  const { apps, healing, playbooks, adapters, nodes, agents, alerts, breakers, metrics, successRate, openAlerts, openBreakers, pqcReady, health } = data;

  return (
    <div className="space-y-6">
      {errors.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-4 py-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <p className="font-mono text-xs text-warning">
            {errors.length} data source(s) unavailable — rendering with partial telemetry.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatTile icon={Boxes} label="Apps Deployed" value={apps.length} tone="primary" />
        <StatTile icon={Activity} label="Healing Events" value={healing.length} sub={`${successRate}% success`} tone="accent" />
        <StatTile icon={ShieldCheck} label="System Health" value={`${health}.0`} sub="weighted score" tone={health >= 95 ? "success" : "warning"} />
        <StatTile icon={BookOpen} label="Playbooks" value={playbooks.length} tone="primary" />
        <StatTile icon={Network} label="Platform Adapters" value={adapters.length} tone="accent" />
        <StatTile icon={Bot} label="Active Agents" value={agents.length} tone="primary" />
        <StatTile icon={Server} label="Compute Nodes" value={nodes.length} tone="primary" />
        <StatTile icon={AlertTriangle} label="Open Alerts" value={openAlerts} tone={openAlerts > 0 ? "warning" : "success"} />
        <StatTile icon={Gauge} label="PQC Readiness" value={`${pqcReady}%`} tone={pqcReady >= 95 ? "success" : "warning"} />
        <StatTile icon={Cpu} label="Circuit Breakers" value={`${breakers.length - openBreakers}/${breakers.length} closed`} tone={openBreakers > 0 ? "warning" : "success"} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Safety Stack" className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {breakers.length === 0 ? (
              <p className="font-mono text-xs text-muted-foreground">No circuit breakers registered.</p>
            ) : (
              breakers.map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2">
                  <div>
                    <p className="font-mono text-xs text-foreground">{b.breaker_name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {b.scope === "global" ? "GLOBAL" : (b.adapter_name || "per-adapter")} · {b.failure_count || 0} failures
                    </p>
                  </div>
                  <StatusBadge status={b.state} label={b.state} />
                </div>
              ))
            )}
          </div>
        </Panel>

        <Panel title="Meta-Monitor">
          {metrics.length === 0 ? (
            <p className="font-mono text-xs text-muted-foreground">No metrics recorded yet.</p>
          ) : (
            <ul className="space-y-2">
              {metrics.map((m) => (
                <li key={m.id} className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted-foreground">{m.metric_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-foreground">
                      {m.metric_value}{m.unit}
                    </span>
                    <StatusBadge status={m.status} label={m.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent Alerts" className="lg:col-span-2">
          {alerts.length === 0 ? (
            <p className="font-mono text-xs text-muted-foreground">No active alerts. All systems nominal.</p>
          ) : (
            <ul className="divide-y divide-border">
              {alerts.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs text-foreground">{a.message || a.title || a.alert_type || "Alert"}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{a.app_id || "—"}</p>
                  </div>
                  <StatusBadge status={a.severity || "warning"} label={a.severity || "info"} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Platform Adapters">
          {adapters.length === 0 ? (
            <p className="font-mono text-xs text-muted-foreground">No adapters deployed.</p>
          ) : (
            <ul className="space-y-2">
              {adapters.map((a) => (
                <li key={a.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs text-foreground">{a.adapter_name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{a.platform} · {a.playbook_count || 0} playbooks</p>
                  </div>
                  <StatusBadge status={a.status} label={a.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}