import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { MOTTO_TH } from "@/lib/catalog";
import { usePuter } from "@/lib/puter-context";
import { toast } from "sonner";

export const Route = createFileRoute("/pricing")({ component: PricingPage });

function PricingPage() {
  const { signedIn, signIn } = usePuter();
  return (
    <AppShell marketing>
      <div className="mx-auto max-w-3xl px-4 py-14">
        <p className="text-xs font-medium uppercase tracking-wider text-subtle">Free</p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">No credits. Sign in with Puter.</h1>
        <p className="mt-3 text-sm text-muted">
          Copilot Chat uses Puter’s user-pays model. You log in. Puter routes GPT, Claude, Gemini, Qwen, and
          DeepSeek. This app never holds an API key and never sells seats.
        </p>
        <p className="mt-4 text-sm text-primary">{MOTTO_TH}</p>
        <ul className="mt-8 space-y-3 text-sm text-muted">
          <li className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            Sign in with Puter — a popup. Temporary accounts work.
          </li>
          <li className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            Every model in the picker is free at the app layer. Usage counts against your Puter account.
          </li>
          <li className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            Threads stay in this browser. Nothing is billed by Copilot Chat.
          </li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          {signedIn ? (
            <Button asChild>
              <Link to="/chat">Open chat</Link>
            </Button>
          ) : (
            <Button
              onClick={() => {
                void signIn().catch((err: unknown) => {
                  toast.error(err instanceof Error ? err.message : "Allow popups, then retry.");
                });
              }}
            >
              Sign in with Puter
            </Button>
          )}
          <Button variant="secondary" asChild>
            <Link to="/docs/$slug" params={{ slug: "puter" }}>
              How Puter works
            </Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
