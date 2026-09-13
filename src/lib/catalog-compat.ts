import { TOOLS, MODELS } from "@/lib/catalog";

export const STATS = {
  models: 500,
  tools: TOOLS.length,
  agents: 8,
};

export function toolBySlug(slug: string) {
  return TOOLS.find((t) => t.slug === slug);
}

export function modelById(id: string) {
  return MODELS.find((m) => m.id === id) ?? MODELS[0];
}

export type McpServer = { id: string; name: string; category: string; blurb: string };

export const MCP_SERVERS: McpServer[] = [
  { id: "context7", name: "Context7", category: "Docs", blurb: "Up-to-date library docs by version." },
  { id: "deepwiki", name: "DeepWiki", category: "Docs", blurb: "Repo wikis turned into queryable context." },
  { id: "github", name: "GitHub", category: "Source", blurb: "Issues, PRs, contents, checks." },
  { id: "supabase", name: "Supabase", category: "Data", blurb: "Postgres, auth, storage, edge functions." },
  { id: "aws", name: "AWS Knowledge", category: "Cloud", blurb: "Service docs, IAM patterns, quotas." },
  { id: "sentry", name: "Sentry", category: "Observability", blurb: "Issues, stack traces, release health." },
  { id: "stripe", name: "Stripe", category: "Payments", blurb: "API, webhooks, billing objects." },
  { id: "huggingface", name: "Hugging Face", category: "ML", blurb: "Models, datasets, inference." },
];

export type DocArticle = { slug: string; title: string; section: string; body: string[] };

export const DOCS: DocArticle[] = [
  { slug: "about", title: "About Bossnu SlieLo", section: "Start", body: ["Bossnu SlieLo is a coding workspace for chat, generation, conversion, review, agents, and code execution.", "ไม่มีอะไรที่ทำไม่ได้ · ไม่มีสิ่งใดที่แก้ไม่ได้"] },
  { slug: "puter", title: "Puter login & free models", section: "Start", body: ["Sign in with Puter to use the model picker and AI chat.", "If the login popup is blocked, allow popups for this site and try again."] },
  { slug: "models", title: "Choosing a model", section: "Start", body: ["Choose a fast model for short transforms, coding models for refactors, and deep models for harder reasoning."] },
  { slug: "code-execution", title: "Code execution", section: "Platform", body: ["The runner executes JavaScript and TypeScript in the browser sandbox."] },
  { slug: "parallel-agents", title: "Parallel agents", section: "Platform", body: ["The orchestrator can delegate bounded work to specialist agents and synthesize the result."] },
  { slug: "privacy", title: "Privacy", section: "Trust", body: ["Keep secrets server-side. GitHub App credentials must never be exposed to the browser."] },
];
