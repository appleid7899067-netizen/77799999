import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Play, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { MarkdownOutput } from "@/components/markdown-output";
import { LanguagePicker, ModelPicker } from "@/components/pickers";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { runFleet } from "@/lib/ai";
import { usePuter } from "@/lib/puter-context";
import { useFleet } from "@/lib/store";

export const Route = createFileRoute("/runner")({ component: RunnerPage });

const SAMPLE = `const nums = [3, 1, 4, 1, 5, 9];
console.log("sum", nums.reduce((a, b) => a + b, 0));
console.log("sorted", [...nums].sort((a, b) => a - b));`;

function isJs(lang: string) {
  return /javascript|typescript|node|\bjs\b|\bts\b|html/i.test(lang);
}

function RunnerPage() {
  const [language, setLanguage] = useState("JavaScript");
  const modelId = useFleet((s) => s.modelId);
  const [code, setCode] = useState(SAMPLE);
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [aiHelp, setAiHelp] = useState("");
  const [busy, setBusy] = useState(false);
  const [running, setRunning] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { signedIn, signIn } = usePuter();

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.source !== "fleet-runner") return;
      if (e.data.type === "log" || e.data.type === "done") setStdout(String(e.data.payload || ""));
      if (e.data.type === "err") setStderr(String(e.data.payload || ""));
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  function runLocal() {
    setRunning(true);
    setStdout("");
    setStderr("");
    const iframe = iframeRef.current;
    if (!iframe) return;
    const src = `<!doctype html><html><body><script>
      const send = (type, payload) => parent.postMessage({ source: 'fleet-runner', type, payload }, '*');
      const log = [];
      console.log = (...a) => {
        log.push(a.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' '));
        send('log', log.join('\\n'));
      };
      console.error = (...a) => send('err', a.join(' '));
      window.onerror = (m) => send('err', String(m));
      try {
        ${code.replace(/<\/script/gi, "<\\\\/script")}
        send('done', log.join('\\n') || '(no output)');
      } catch (e) {
        send('err', e && e.stack ? e.stack : String(e));
      }
    </script></body></html>`;
    iframe.srcdoc = src;
    setTimeout(() => setRunning(false), 900);
  }

  async function run() {
    if (isJs(language)) {
      runLocal();
      return;
    }
    if (!signedIn) {
      try {
        await signIn();
      } catch {
        toast.error("Sign in with Puter to trace non-JS languages.");
        return;
      }
    }
    setRunning(true);
    setStdout("");
    setStderr("");
    try {
      const res = await runFleet({
        mode: "runner",
        prompt: "Execute this program and report stdout, stderr, exit code. Be literal.",
        code,
        language,
        modelId,
      });
      if (!res.ok) {
        setStderr(res.error);
        return;
      }
      setStdout(res.text);
    } finally {
      setRunning(false);
    }
  }

  async function askAi() {
    if (!signedIn) {
      try {
        await signIn();
      } catch {
        toast.error("Sign in with Puter first.");
        return;
      }
    }
    setBusy(true);
    try {
      const res = await runFleet(
        {
          mode: "runner",
          prompt: `Help with this ${language} snippet. ${stderr ? "It failed:\n" + stderr : "Optimize or explain the output."}\n\nOutput so far:\n${stdout}`,
          code,
          language,
          modelId,
        },
        (full) => setAiHelp(full),
      );
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setAiHelp(res.text);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-2">
        <section>
          <p className="text-xs font-medium uppercase tracking-wider text-subtle">Runner</p>
          <h1 className="mt-1 text-2xl font-medium tracking-tight">Code runner</h1>
          <p className="mt-2 text-sm text-muted">
            JavaScript runs in this browser. Other languages are traced by the Puter model you pick.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <LanguagePicker
              value={language}
              onChange={setLanguage}
              label="Language"
            />
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted">Model</p>
              <ModelPicker />
            </div>
          </div>
          <Textarea
            className="mt-4 min-h-64 font-mono text-sm"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={() => void run()} disabled={running}>
              {running ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
              Run
            </Button>
            <Button variant="secondary" onClick={() => void askAi()} disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Ask Copilot
            </Button>
          </div>
          <iframe ref={iframeRef} title="sandbox" className="hidden" sandbox="allow-scripts" />
        </section>
        <section className="space-y-3">
          <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <p className="text-xs uppercase tracking-wider text-subtle">stdout</p>
            <pre className="mt-2 min-h-24 overflow-x-auto font-mono text-sm text-ok whitespace-pre-wrap">
              {stdout || "—"}
            </pre>
          </div>
          <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <p className="text-xs uppercase tracking-wider text-subtle">stderr</p>
            <pre className="mt-2 min-h-16 overflow-x-auto font-mono text-sm text-danger whitespace-pre-wrap">
              {stderr || "—"}
            </pre>
          </div>
          <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <p className="text-xs uppercase tracking-wider text-subtle">Copilot</p>
            {aiHelp ? (
              <MarkdownOutput text={aiHelp} className="mt-2" />
            ) : (
              <p className="mt-2 text-sm text-subtle">Ask Copilot after a run.</p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
