import { useEffect, useState } from "react";
import { safeList } from "@/lib/safeFetch";
import StatusBadge from "@/components/dash/StatusBadge";

const tierColor = (t) =>
  t === "saas" ? "border-accent/30 bg-accent/10 text-accent" :
  t === "licensed" ? "border-primary/30 bg-primary/10 text-primary" :
  "border-border bg-muted/40 text-muted-foreground";

export default function Customers() {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    safeList("Customer", null, 200).then((r) => {
      if (!mounted) return;
      setRows(Array.isArray(r) ? r : []);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  if (loading) return <Loader />;
  if (!rows.length) return <Empty label="No customers registered." />;

  return (
    <div>
      <PageTitle title="Customers" sub={`${rows.length} accounts`} />
      <div className="overflow-x-auto rounded-xl border border-border bg-card/50">
        <table className="w-full text-left">
          <thead className="border-b border-border">
            <tr className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Billing</th>
              <th className="px-4 py-3">Apps</th>
              <th className="px-4 py-3">Credits (used / allotment)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((c) => (
              <tr key={c.id} className="font-mono text-xs">
                <td className="px-4 py-3">
                  <p className="text-foreground">{c.company_name || "—"}</p>
                  <p className="text-[10px] text-muted-foreground">{c.admin_email || ""}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${tierColor(c.tier)}`}>
                    {c.tier || "free"}
                  </span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={c.billing_status} label={c.billing_status} /></td>
                <td className="px-4 py-3 text-foreground">{c.connected_app_count ?? 0}</td>
                <td className="px-4 py-3 text-foreground">
                  {c.credit_used ?? 0} / {c.credit_allotment ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Loader() {
  return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
}
function Empty({ label }) {
  return <div><PageTitle title="Customers" /><p className="font-mono text-xs text-muted-foreground">{label}</p></div>;
}
function PageTitle({ title, sub }) {
  return (
    <div className="mb-4">
      <h1 className="font-mono text-sm font-semibold tracking-wide text-foreground">{title}</h1>
      {sub && <p className="font-mono text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}