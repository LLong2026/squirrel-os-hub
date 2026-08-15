import { useEffect, useState } from "react";
import { safeList } from "@/lib/safeFetch";
import Panel from "@/components/dash/Panel";

export default function NeuralMesh() {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    safeList("NeuralNodeTemplate", null, 500).then((r) => {
      if (!mounted) return;
      setRows(Array.isArray(r) ? r : []);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  if (loading) return <Loader />;
  const list = rows || [];
  const layers = {};
  list.forEach((n) => {
    const l = n.layer ?? 0;
    (layers[l] = layers[l] || []).push(n);
  });
  const layerKeys = Object.keys(layers).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="space-y-4">
      <PageTitle title="Neural Mesh" sub={`${list.length} node templates`} />
      {layerKeys.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {layerKeys.map((l) => (
            <Panel key={l} title={`Layer ${l}`}>
              <ul className="space-y-2">
                {layers[l].map((n) => (
                  <li key={n.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs text-foreground">{n.node_type || "node"}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        idx {n.node_index ?? "—"} · w {(Number(n.weight) || 0).toFixed(3)} · lr {(Number(n.learning_rate) || 0).toFixed(3)}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">{(n.connections || []).length} links</span>
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      ) : (
        <p className="font-mono text-xs text-muted-foreground">No neural node templates registered.</p>
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