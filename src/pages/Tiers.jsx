import { useEffect, useState } from "react";
import { safeList } from "@/lib/safeFetch";
import { Check, X } from "lucide-react";

const DEFAULT_TIERS = [
  { tier_name: "free", price: "$0", credit_allotment: 100, features: ["1 connected app", "Basic healing", "Community support"], neural_mesh_enabled: false, pqc_enabled: false, cross_app_monitor_enabled: false },
  { tier_name: "licensed", price: "$499/mo", credit_allotment: 5000, features: ["Up to 25 apps", "Neural Mesh", "PQC encryption", "Cross-app monitor"], neural_mesh_enabled: true, pqc_enabled: true, cross_app_monitor_enabled: true },
  { tier_name: "saas", price: "Custom", credit_allotment: 50000, features: ["Unlimited apps", "Full neural mesh", "Dedicated support", "Custom playbooks"], neural_mesh_enabled: true, pqc_enabled: true, cross_app_monitor_enabled: true },
];

const tone = (t) =>
  t === "saas" ? "border-accent/40 bg-accent/5" : t === "licensed" ? "border-primary/40 bg-primary/5" : "border-border bg-card/50";

export default function Tiers() {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    safeList("TierConfiguration", null, 10).then((r) => {
      if (!mounted) return;
      setRows(Array.isArray(r) ? r : []);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  if (loading) return <Loader />;
  const tiers = (rows && rows.length ? rows : DEFAULT_TIERS);

  return (
    <div className="space-y-4">
      <PageTitle title="Tier Management" sub="Free · Licensed · SaaS" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {tiers.map((t) => (
          <div key={t.tier_name} className={`rounded-xl border p-5 ${tone(t.tier_name)}`}>
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-sm font-semibold uppercase tracking-wide text-foreground">{t.tier_name}</h2>
              <span className="font-mono text-xs text-muted-foreground">{t.price || "—"}</span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">{t.credit_allotment ?? 0} credits / period</p>
            <ul className="mt-4 space-y-2">
              {(t.features || []).map((f, i) => (
                <li key={i} className="flex items-center gap-2 font-mono text-[11px] text-foreground/90">
                  <Check className="h-3 w-3 text-success" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-border pt-3 font-mono text-[10px] text-muted-foreground">
              <Feat label="Neural Mesh" on={t.neural_mesh_enabled} />
              <Feat label="PQC Encryption" on={t.pqc_enabled} />
              <Feat label="Cross-App Monitor" on={t.cross_app_monitor_enabled} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Feat({ label, on }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      {on ? <Check className="h-3 w-3 text-success" /> : <X className="h-3 w-3 text-destructive" />}
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