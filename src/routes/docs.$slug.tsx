import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { DOCS } from "@/lib/catalog";

export const Route = createFileRoute("/docs/$slug")({ component: DocPage });

function DocPage() {
  const { slug } = Route.useParams();
  const doc = DOCS.find((d) => d.slug === slug);
  if (!doc) {
    return (
      <AppShell marketing>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="text-xl font-medium">Missing article</h1>
          <Button className="mt-6" asChild>
            <Link to="/docs">All docs</Link>
          </Button>
        </div>
      </AppShell>
    );
  }
  return (
    <AppShell marketing>
      <article className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-xs font-medium uppercase tracking-wider text-subtle">{doc.section}</p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">{doc.title}</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
          {doc.body.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </div>
        <Button className="mt-10" variant="secondary" asChild>
          <Link to="/docs">All docs</Link>
        </Button>
      </article>
    </AppShell>
  );
}
