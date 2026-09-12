import { createFileRoute } from "@tanstack/react-router";
import { Camera, Plus, Power, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFleet } from "@/lib/store";

export const Route = createFileRoute("/sandbox")({ component: SandboxPage });

function SandboxPage() {
  const sandboxes = useFleet((s) => s.sandboxes);
  const addSandbox = useFleet((s) => s.addSandbox);
  const setSandboxStatus = useFleet((s) => s.setSandboxStatus);
  const snapshotSandbox = useFleet((s) => s.snapshotSandbox);
  const removeSandbox = useFleet((s) => s.removeSandbox);
  const [name, setName] = useState("python-ml");
  const [runtime, setRuntime] = useState("Python 3.12");
  const [packages, setPackages] = useState("numpy, scikit-learn, httpx");

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-xs font-medium uppercase tracking-wider text-subtle">Platform</p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">Sandboxes</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Isolated runtimes reused across chats. Stored in this browser. JavaScript execution happens in the runner.
        </p>

        <form
          className="mt-6 grid gap-3 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            addSandbox({ name, runtime, packages });
            toast.success("Sandbox ready.");
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="sb-name">Name</Label>
            <Input id="sb-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sb-rt">Runtime</Label>
            <Input id="sb-rt" value={runtime} onChange={(e) => setRuntime(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="sb-pkg">Packages</Label>
            <div className="flex gap-2">
              <Input id="sb-pkg" value={packages} onChange={(e) => setPackages(e.target.value)} />
              <Button type="submit">
                <Plus className="size-4" /> New
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {sandboxes.map((s) => (
            <article key={s.id} className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium">{s.name}</h2>
                  <p className="font-mono text-xs text-muted">{s.runtime}</p>
                </div>
                <Badge variant={s.status === "ready" ? "ok" : s.status === "building" ? "warn" : "default"}>
                  {s.status}
                </Badge>
              </div>
              <p className="mt-3 text-sm text-muted">{s.packages}</p>
              <p className="mt-1 text-xs text-subtle">
                {s.snapshots} snapshot{s.snapshots === 1 ? "" : "s"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    const next = s.status === "ready" ? "stopped" : "ready";
                    setSandboxStatus(s.id, next);
                  }}
                >
                  <Power className="size-4" />
                  {s.status === "ready" ? "Stop" : "Start"}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    snapshotSandbox(s.id);
                    toast.success("Snapshot saved.");
                  }}
                >
                  <Camera className="size-4" />
                  Snapshot
                </Button>
                <Button size="sm" variant="ghost" onClick={() => removeSandbox(s.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
