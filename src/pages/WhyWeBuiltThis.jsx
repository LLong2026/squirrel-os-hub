import { ShieldCheck, Heart, Lock, Network } from "lucide-react";

export default function WhyWeBuiltThis() {
  return (
    <div className="max-w-3xl space-y-6">
      <PageTitle title="Why We Built This" sub="The Squirrel OS mission" />
      <div className="rounded-xl border border-border bg-card/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="font-mono text-sm font-semibold text-foreground">Self-healing infrastructure for everyone</h2>
        </div>
        <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
          Squirrel OS Hub was built to make autonomous, self-healing infrastructure accessible across every platform —
          Base44, Microsoft, iOS, Windows, and macOS. Instead of brittle, manual remediation, the hub continuously
          monitors connected apps, detects anomalies, and applies vetted repair playbooks automatically.
        </p>
        <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground">
          The mission is simple: keep apps healthy without human babysitting, while staying provably safe. Every
          healing action is reversible, auditable, and bound by the Squirrel OS Constitution v1.0.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card icon={Heart} title="Always-on health" desc="Continuous telemetry and predictive scaling keep fleets green." />
        <Card icon={Lock} title="PQC-secured" desc="Post-quantum cryptography (Dilithium3, Kyber-1024) by default." />
        <Card icon={Network} title="Platform-agnostic" desc="One control plane across five platforms and 400+ playbooks." />
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-5">
      <Icon className="h-5 w-5 text-accent" />
      <h3 className="mt-3 font-mono text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 font-mono text-[11px] text-muted-foreground">{desc}</p>
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