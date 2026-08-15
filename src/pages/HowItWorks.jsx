import { Activity, ShieldCheck, Cpu, Network, Gauge, ScrollText } from "lucide-react";

const LAYERS = [
  { icon: Activity, title: "Telemetry & Heartbeats", desc: "Each connected app emits heartbeats and health manifests that flow into the hub in real time." },
  { icon: Cpu, title: "Anomaly Detection", desc: "Jasper cross-app monitor and Aegis detectors compare signals against learned baselines." },
  { icon: ScrollText, title: "Playbook Dispatch", desc: "The task dispatcher routes the best-matching repair playbook by confidence and domain." },
  { icon: ShieldCheck, title: "Safety Stack", desc: "Circuit breakers, rate limiting, and SHA-256 event signing guard every action." },
  { icon: Network, title: "Neural Mesh", desc: "Outcomes feed the neural mesh; the recursive learning loop trains and validates new models." },
  { icon: Gauge, title: "Audit & Promote", desc: "Canary rollouts, safety checks, and a Merkle audit trail close the self-improvement loop." },
];

export default function HowItWorks() {
  return (
    <div className="space-y-6">
      <PageTitle title="How It Works" sub="From heartbeat to self-improvement" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {LAYERS.map((l, i) => (
          <div key={i} className="rounded-xl border border-border bg-card/50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <l.icon className="h-5 w-5" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-3 font-mono text-sm font-semibold text-foreground">{l.title}</h3>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">{l.desc}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card/50 p-5">
        <p className="font-mono text-xs leading-relaxed text-muted-foreground">
          The whole loop is governed by Constitution v1.0: safety, reversibility, transparency, minimal intervention,
          and human supremacy. A global kill switch ("SQUIRREL OS STOP") can halt all autonomous operations instantly,
          and a safe mode restricts the hub to read-only monitoring.
        </p>
      </div>
    </div>
  );
}

function PageTitle({ title, sub }) {
  return (
    <div>
      <h1 className="font-mono text-sm font-semibold tracking-wide text-foreground">{title}</h1>
      {sub && <p className="font-mono text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}