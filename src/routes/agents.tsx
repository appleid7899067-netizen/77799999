import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { MarkdownOutput } from "@/components/markdown-output";
import { ModelPicker } from "@/components/pickers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { runFleet } from "@/lib/ai";
import { AGENTS } from "@/lib/catalog";
import { usePuter } from "@/lib/puter-context";
import { useFleet } from "@/lib/store";

export const Route = createFileRoute("/agents")({ component: AgentsPage });

function AgentsPage() {
  const [task, setTask] = useState(
    "Design and implement a token-bucket rate limiter for a Node API. Cover concurrency, Redis vs in-memory, and tests.",
  );
  const [selected, setSelected] = useState<string[]>(
    AGENTS.filter((a) => a.id !== "orchestrator").map((a) => a.id),
  );
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<string[]>([]);
  const [output, setOutput] = useState("");
  const addGeneration = useFleet((s) => s.addGeneration);
  const modelId = useFleet((s) => s.modelId);
  const { signedIn, signIn } = usePuter();

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function run() {
    if (!signedIn) {
      try {
        await signIn();
      } catch {
        toast.error("Sign in with Puter first. Allow popups if blocked.");
        return;
      }
    }
    setBusy(true);
    setOutput("");
    const crew = AGENTS.filter((a) => selected.includes(a.id) || a.id === "orchestrator");
    setPhase(["Orchestrator scoping the work"]);
    for (const a of crew.slice(1)) {
      await new Promise((r) => setTimeout(r, 180));
      setPhase((p) => [...p, `@${a.handle} ${a.posture === "read-only" ? "reading" : "running"}`]);
    }
    try {
      const extras = `Enabled agents: ${crew.map((a) => `@${a.handle} (${a.posture}) — ${a.instructions}`).join("\n")}`;
      const res = await runFleet(
        { mode: "agents", prompt: task, extras, modelId },
        (full) => setOutput(full),
      );
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setOutput(res.text);
      addGeneration({
        tool: "agents",
        title: task.slice(0, 72),
        prompt: task,
        output: res.text,
        language: "multi",
        model: res.model,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Agents failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-xs font-medium uppercase tracking-wider text-subtle">Agents</p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">Parallel agents</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          One task. A crew. One synthesis. Powered by the Puter model you pick.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted">Model</p>
              <ModelPicker />
            </div>
            <div className="mt-4 space-y-2">
              {AGENTS.map((a) => {
                const on = a.id === "orchestrator" || selected.includes(a.id);
                return (
                  <label
                    key={a.id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg bg-surface px-3 py-3 shadow-[var(--shadow-border)]"
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={on}
                      disabled={a.id === "orchestrator"}
                      onChange={() => toggle(a.id)}
                    />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-primary">@{a.handle}</span>
                        <Badge>{a.posture}</Badge>
                      </span>
                      <span className="mt-1 block text-sm font-medium">{a.name}</span>
                      <span className="block text-xs text-muted">{a.role}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            <Textarea className="mt-4 min-h-28" value={task} onChange={(e) => setTask(e.target.value)} />
            <Button className="mt-3" onClick={() => void run()} disabled={busy || !task.trim()}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
              {busy ? "Running" : "Run crew"}
            </Button>
            {phase.length > 0 && (
              <ul className="mt-4 space-y-1 text-xs text-muted">
                {phase.map((p) => (
                  <li key={p} className="font-mono">
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="min-h-80 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            {busy && <div className="fleet-shimmer mb-3 h-1 rounded-full" />}
            {output ? (
              <MarkdownOutput text={output} />
            ) : (
              <p className="text-sm text-subtle">Synthesis lands here.</p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
