import { createFileRoute } from "@tanstack/react-router";
import { Play, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ROUTINE_TEMPLATES } from "@/lib/catalog";
import { useFleet } from "@/lib/store";

export const Route = createFileRoute("/routines")({ component: RoutinesPage });

function RoutinesPage() {
  const routines = useFleet((s) => s.routines);
  const addRoutine = useFleet((s) => s.addRoutine);
  const toggleRoutine = useFleet((s) => s.toggleRoutine);
  const markRoutineRun = useFleet((s) => s.markRoutineRun);
  const [name, setName] = useState("");
  const [cadence, setCadence] = useState("Daily 09:00");
  const [prompt, setPrompt] = useState("");

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-xs font-medium uppercase tracking-wider text-subtle">Automation</p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">Routines</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Saved prompts on a cadence. Run now from this browser.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {ROUTINE_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              className="rounded-full bg-elevated px-3 py-1 text-xs text-muted shadow-[var(--shadow-border)] hover:text-fg"
              onClick={() => {
                setName(t.name);
                setCadence(t.cadence);
                setPrompt(t.prompt);
              }}
            >
              {t.name}
            </button>
          ))}
        </div>

        <form
          className="mt-5 grid gap-3 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !prompt.trim()) return;
            addRoutine({ name, cadence, prompt, enabled: true });
            toast.success("Routine saved.");
            setName("");
            setPrompt("");
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="rt-name">Name</Label>
              <Input id="rt-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rt-cad">Cadence</Label>
              <Input id="rt-cad" value={cadence} onChange={(e) => setCadence(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rt-p">Prompt</Label>
            <Textarea id="rt-p" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>
          <Button type="submit" className="w-fit">
            <Plus className="size-4" /> Save routine
          </Button>
        </form>

        <ul className="mt-6 space-y-2">
          {routines.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center gap-3 rounded-xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-subtle">
                  {r.cadence}
                  {r.lastRun ? ` · last ${new Date(r.lastRun).toLocaleString()}` : ""}
                </p>
                <p className="mt-1 text-sm text-muted">{r.prompt}</p>
              </div>
              <Badge variant={r.enabled ? "ok" : "default"}>{r.enabled ? "on" : "off"}</Badge>
              <Switch checked={r.enabled} onCheckedChange={() => toggleRoutine(r.id)} />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  markRoutineRun(r.id);
                  toast.success("Marked as run.");
                }}
              >
                <Play className="size-4" /> Run
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
