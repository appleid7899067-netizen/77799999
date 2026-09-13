import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ToolWorkspace } from "@/components/tool-workspace";
import { UnitTestGenerator } from "@/components/unit-test-generator";
import { Button } from "@/components/ui/button";
import { toolBySlug } from "@/lib/catalog";

export const Route = createFileRoute("/tools/$slug")({
  component: ToolPage,
});

function ToolPage() {
  const { slug } = Route.useParams();
  const tool = toolBySlug(slug);
  if (!tool || tool.kind === "runner") {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="text-xl font-medium">Tool not found</h1>
          <p className="mt-2 text-sm text-muted">That slug is not in the workspace.</p>
          <Button className="mt-6" asChild>
            <Link to="/">Back home</Link>
          </Button>
        </div>
      </AppShell>
    );
  }
  if (slug === "tests") return <UnitTestGenerator />;
  return <ToolWorkspace tool={tool} />;
}
