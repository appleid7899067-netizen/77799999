import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Bot,
  Globe,
  Play,
  Shield,
  Terminal,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToolLink } from "@/components/tool-link";
import { AGENTS, MOTTO_EN, MOTTO_TH, STATS, TOOLS } from "@/lib/catalog";
import { usePuter } from "@/lib/puter-context";
import { toast } from "sonner";

export const Route = createFileRoute("/")({ component: Home });

const DEMOS = [
  {
    id: "convert",
    label: "Python → Go",
    from: "def top_k(words, k):\n    from collections import Counter\n    return [w for w,_ in Counter(words).most_common(k)]",
    to: "func TopK(words []string, k int) []string {\n    counts := map[string]int{}\n    for _, w := range words {\n        counts[w]++\n    }\n    return ranked[:k]\n}",
  },
  {
    id: "explain",
    label: "Explain code",
    from: "xs.reduce((a,b)=>a^b,0)",
    to: "XOR-fold. Pairs cancel. The unique (or odd-count) value remains. O(n) time, O(1) space.",
  },
  {
    id: "tests",
    label: "Unit tests",
    from: "export function clamp(n, lo, hi) {\n  return Math.min(hi, Math.max(lo, n))\n}",
    to: "it('pins to lo', () => expect(clamp(-2, 0, 5)).toBe(0))\nit('pins to hi', () => expect(clamp(9, 0, 5)).toBe(5))",
  },
  {
    id: "fix",
    label: "Fix a bug",
    from: "if (user.role = 'admin') allow()",
    to: "if (user.role === 'admin') allow()\n// assignment was always truthy — now a comparison",
  },
];

function Home() {
  const [demo, setDemo] = useState(DEMOS[0].id);
  const current = DEMOS.find((d) => d.id === demo) ?? DEMOS[0];
  const { signedIn, signIn } = usePuter();

  return (
    <AppShell marketing>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(800px 400px at 80% -10%, color-mix(in oklab, var(--color-primary) 12%, transparent), transparent 70%)",
          }}
        />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-elevated px-3 py-1 text-xs text-muted shadow-[var(--shadow-border)]">
              <span className="size-1.5 rounded-full bg-ok" />
              Puter login · 500+ free models
            </div>
            <h1 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl">
              Copilot Chat.
              <span className="mt-2 block text-primary">{MOTTO_TH}</span>
            </h1>
            <p className="mt-5 max-w-prose text-base text-muted">
              {MOTTO_EN} Sign in with Puter. Generate, review, convert, and ship — GPT, Claude, Gemini, Qwen,
              DeepSeek — no API keys.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => {
                  if (signedIn) return;
                  void signIn().catch((err: unknown) => {
                    toast.error(err instanceof Error ? err.message : "Allow popups, then sign in with Puter.");
                  });
                }}
                asChild={signedIn}
              >
                {signedIn ? (
                  <Link to="/chat">
                    Open chat <ArrowRight className="size-4" />
                  </Link>
                ) : (
                  <>
                    Sign in with Puter <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/chat">Try a chat</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              <Stat n={`${STATS.models}+`} l="Free models" />
              <Stat n={`${STATS.tools}`} l="Coding tools" />
              <Stat n={`${STATS.agents}`} l="Agents" />
            </dl>
          </div>

          <div className="min-w-0 rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]">
            <div className="flex flex-wrap gap-1">
              {DEMOS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDemo(d.id)}
                  className={`h-8 rounded-md px-3 text-xs ${
                    demo === d.id ? "bg-elevated text-fg shadow-[var(--shadow-border)]" : "text-muted hover:text-fg"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <div className="mt-3 grid gap-2">
              <CodePane title="Input" body={current.from} />
              <CodePane title="Copilot" body={current.to} accent />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-xs font-medium uppercase tracking-wider text-subtle">Tools</p>
          <h2 className="mt-2 text-2xl font-medium tracking-tight">A suite around real coding work.</h2>
          <p className="mt-2 max-w-prose text-sm text-muted">
            Each tool is a focused workflow. Chat is there when you need it. Every call is a free Puter model.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <ToolLink
                key={t.slug}
                tool={t}
                className="group rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
              >
                <t.icon className="size-5 text-primary" />
                <h3 className="mt-3 font-medium tracking-tight">{t.name}</h3>
                <p className="mt-1 text-sm text-muted">{t.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-primary">
                  {t.cta} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </ToolLink>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-subtle">Agent platform</p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight">One chat. A crew that cooperates.</h2>
            <p className="mt-3 text-sm text-muted">
              Mention @shipper, @security, @reviewer. The orchestrator frames bounded sub-tasks and brings one
              synthesis back.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-muted">
              <Feature icon={Bot} text="Custom profiles — posture and instructions per agent." />
              <Feature icon={Shield} text="Read-only, allow-edits, or full-auto — per agent." />
              <Feature icon={Workflow} text="Observable runs. Sequenced journals." />
              <Feature icon={Globe} text="MCP connectors and web access, per chat." />
              <Feature icon={Terminal} text="Sandboxed JavaScript runner in the browser." />
            </ul>
            <Button className="mt-6" asChild>
              <Link to="/agents">Launch parallel agents</Link>
            </Button>
          </div>
          <div className="grid gap-2">
            {AGENTS.slice(0, 6).map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 rounded-lg bg-bg px-4 py-3 shadow-[var(--shadow-border)]"
              >
                <span className="mt-0.5 font-mono text-xs text-primary">@{a.handle}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{a.name}</p>
                  <p className="text-xs text-muted">{a.role}</p>
                </div>
                <Badge className="ml-auto shrink-0">{a.posture}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-xs font-medium uppercase tracking-wider text-subtle">How it works</p>
          <h2 className="mt-2 text-2xl font-medium tracking-tight">Four steps. No credit card.</h2>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "01", t: "Sign in with Puter", d: "A popup. Allow it. Temporary accounts work." },
              { n: "02", t: "Pick a model", d: "Luna for speed. Codex or Sonnet for refactors. Opus when it is hard." },
              { n: "03", t: "Run it", d: "Chat, tools, agents, or the JS runner." },
              { n: "04", t: "Ship", d: "Copy, download, or hand the patch to @shipper." },
            ].map((s) => (
              <li key={s.n} className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
                <p className="font-mono text-xs text-primary">{s.n}</p>
                <h3 className="mt-2 font-medium">{s.t}</h3>
                <p className="mt-1 text-sm text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-medium tracking-tight">{MOTTO_TH}</h2>
            <p className="mt-2 text-sm text-muted">{MOTTO_EN}</p>
          </div>
          <div className="flex gap-3">
            <Button size="lg" asChild>
              <Link to="/chat">Start a chat</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/tools/$slug" params={{ slug: "generator" }}>
                <Play className="size-4" /> Try generator
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <dt className="text-xs text-subtle">{l}</dt>
      <dd className="font-mono text-lg tabular-nums">{n}</dd>
    </div>
  );
}

function CodePane({ title, body, accent }: { title: string; body: string; accent?: boolean }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg bg-bg shadow-[var(--shadow-border)]">
      <p className="border-b border-border px-3 py-1.5 text-xs uppercase tracking-wider text-subtle">{title}</p>
      <pre className={`overflow-x-auto p-3 font-mono text-xs leading-relaxed ${accent ? "text-primary" : "text-muted"}`}>
        {body}
      </pre>
    </div>
  );
}

function Feature({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <li className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 text-primary" />
      <span>{text}</span>
    </li>
  );
}
