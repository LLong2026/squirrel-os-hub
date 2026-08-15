import { ShieldAlert } from "lucide-react";

export default function UserNotRegisteredError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-warning/30 bg-warning/10">
        <ShieldAlert className="h-6 w-6 text-warning" />
      </div>
      <h1 className="font-mono text-lg font-semibold text-foreground">Account not registered</h1>
      <p className="max-w-md font-mono text-sm text-muted-foreground">
        Your account exists but is not registered in this Squirrel OS Hub instance.
        Contact the workspace admin to be invited.
      </p>
    </div>
  );
}