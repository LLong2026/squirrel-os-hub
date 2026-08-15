import { useEffect, useState } from "react";
import { safeList } from "@/lib/safeFetch";
import StatTile from "@/components/dash/StatTile";
import StatusBadge from "@/components/dash/StatusBadge";
import { Activity, CheckCircle2, Coins } from "lucide-react";

export default function HealingEvents() {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    safeList("HealingEventLog", "-created_date", 500).then((r) => {
      if (!mounted) return;
      setRows(Array.isArray(r) ? r : []);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  if (loading) return <Loader />;

  const list = rows || [];
  const successCount = list.filter((e) => e.success).length;
  const creditsUsed = list.reduce((s, e) => s + (Number(e.credits_used) || 0), 0);
  const filtered = filter === "success" ? list.filter((e) => e.success) : filter === "failed" ? list.filter((e) => !e.success) : list;

  return (
    <div className="space-y-6">
      <PageTitle title="Healing Events" sub={`${list.length} total`} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatTile icon={Activity} label="Total Events" value={list.length} tone="primary" />
        <StatTile icon={CheckCircle2} label="Successful" value={successCount} tone="success" />
        <StatTile icon={Coins} label="Credits Used" value={creditsUsed} tone="accent" />
      </div>

      <div className="flex gap-2">
        {["all", "success", "failed"].map((f) => (
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
        <div className="overflow-x-auto rounded-xl border border-border bg-card/50">
          <table className="w-full text-left">
            <thead className="border-b border-border">
              <tr className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Anomaly</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">App</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((e) => (
                <tr key={e.id} className="font-mono text-xs">
                  <td className="px-4 py-3 text-foreground">{e.anomaly_summary || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.action_taken || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.app_id || "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={e.success ? "pass" : "error"} label={e.success ? "ok" : "fail"} /></td>
                  <td className="px-4 py-3 text-foreground">{e.credits_used ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="font-mono text-xs text-muted-foreground">No healing events match this filter.</p>
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