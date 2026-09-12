import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { DOCS } from "@/lib/catalog";

export const Route = createFileRoute("/docs")({ component: DocsIndex });

function DocsIndex() {
  const sections = [...new Set(DOCS.map((d) => d.section))];
  return (
    <AppShell marketing>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-xs font-medium uppercase tracking-wider text-subtle">Documentation</p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">How Copilot Chat works</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Start with About, then Puter login, then models.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {sections.map((section) => (
            <div key={section}>
              <p className="text-xs font-medium uppercase tracking-wider text-subtle">{section}</p>
              <ul className="mt-3 space-y-2">
                {DOCS.filter((d) => d.section === section).map((d) => (
                  <li key={d.slug}>
                    <Link to="/docs/$slug" params={{ slug: d.slug }} className="text-sm text-fg hover:text-primary">
                      {d.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
