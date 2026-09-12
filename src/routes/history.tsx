import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { MarkdownOutput } from "@/components/markdown-output";
import { useFleet } from "@/lib/store";
import { useState } from "react";

export const Route = createFileRoute("/history")({ component: HistoryPage });

function HistoryPage() {
  const generations = useFleet((s) => s.generations);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-xs font-medium uppercase tracking-wider text-subtle">Activity</p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">History</h1>
        <p className="mt-2 text-sm text-muted">Stored in this browser only.</p>
        {generations.length === 0 ? (
          <p className="mt-10 text-sm text-subtle">
            Nothing yet.{" "}
            <Link to="/tools/$slug" params={{ slug: "generator" }} className="text-primary">
              Generate something
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-6 space-y-2">
            {generations.map((g) => (
              <li key={g.id} className="rounded-xl bg-surface shadow-[var(--shadow-border)]">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left"
                  onClick={() => setOpen(open === g.id ? null : g.id)}
                >
                  <span>
                    <span className="block font-medium">{g.title}</span>
                    <span className="block text-xs text-subtle">
                      {g.tool} · {g.language} · {g.model} · {new Date(g.createdAt).toLocaleString()}
                    </span>
                  </span>
                  <Badge variant="ok">Free</Badge>
                </button>
                {open === g.id ? (
                  <div className="border-t border-border px-4 py-3">
                    <p className="mb-2 text-xs text-subtle">{g.prompt}</p>
                    <MarkdownOutput text={g.output} />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
