import { UserPlus, Link2, ShieldCheck, Activity, BookOpen, Rocket } from "lucide-react";

const STEPS = [
  { icon: UserPlus, title: "Create your account", desc: "Sign up and register as a workspace admin for Squirrel OS Hub." },
  { icon: Link2, title: "Connect your first app", desc: "Add a Base44 app to the hub to begin monitoring." },
  { icon: ShieldCheck, title: "Configure PQC", desc: "Assign a post-quantum cryptography config (Dilithium3 / Kyber-1024)." },
  { icon: Activity, title: "Enable healing", desc: "Deploy repair playbooks and turn on autonomous healing." },
  { icon: BookOpen, title: "Review playbooks", desc: "Browse the master playbook library and tune confidence thresholds." },
  { icon: Rocket, title: "Scale your fleet", desc: "Connect more apps, upgrade tier, and let the neural mesh learn." },
];

export default function Onboarding() {
  return (
    <div className="space-y-6">
      <PageTitle title="Onboarding" sub="Get a new workspace operational in 6 steps" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s, i) => (
          <div key={i} className="rounded-xl border border-border bg-card/50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Step {i + 1}</span>
            </div>
            <h3 className="mt-3 font-mono text-sm font-semibold text-foreground">{s.title}</h3>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">{s.desc}</p>
          </div>
        ))}
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