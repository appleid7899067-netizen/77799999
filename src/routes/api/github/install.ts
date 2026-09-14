import { createFileRoute } from "@tanstack/react-router";
import { githubAppInstallUrl } from "@/lib/github-app.server";

export const Route = createFileRoute("/api/github/install")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const url = await githubAppInstallUrl();
          return Response.redirect(url, 302);
        } catch (error) {
          return Response.json(
            { error: error instanceof Error ? error.message : "GitHub App installation is unavailable" },
            { status: 503 },
          );
        }
      },
    },
  },
});
