import { createFileRoute } from "@tanstack/react-router";

const CODINGFLEET_TOOLS = "https://www.codingfleet.com/api/tools";
const GITHUB_API = "https://api.github.com";
const MAX_TOOLS = 20;

type Tool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  endpoint?: string;
  slug?: string;
};

function nativeTools(): Tool[] {
  return [
    {
      name: "github_get_repo",
      description: "Read public GitHub repository metadata.",
      inputSchema: { type: "object", properties: { owner: { type: "string" }, repo: { type: "string" } }, required: ["owner", "repo"], additionalProperties: false },
    },
    {
      name: "github_get_file",
      description: "Read a file from a public GitHub repository.",
      inputSchema: { type: "object", properties: { owner: { type: "string" }, repo: { type: "string" }, path: { type: "string" }, ref: { type: "string" } }, required: ["owner", "repo", "path"], additionalProperties: false },
    },
    {
      name: "github_list_commits",
      description: "Read recent commits from a public GitHub repository.",
      inputSchema: { type: "object", properties: { owner: { type: "string" }, repo: { type: "string" }, per_page: { type: "integer", minimum: 1, maximum: 20 } }, required: ["owner", "repo"], additionalProperties: false },
    },
  ];
}

async function codingFleetTools(): Promise<Tool[]> {
  try {
    const response = await fetch(CODINGFLEET_TOOLS, { headers: { Accept: "application/json" } });
    if (!response.ok) return [];
    const data = await response.json() as unknown;
    const raw = Array.isArray(data) ? data : data && typeof data === "object" ? ((data as Record<string, unknown>).tools ?? (data as Record<string, unknown>).data ?? []) : [];
    if (!Array.isArray(raw)) return [];
    return raw.flatMap((value) => {
      if (!value || typeof value !== "object") return [];
      const item = value as Record<string, unknown>;
      const name = String(item.name ?? item.slug ?? item.id ?? "").trim();
      if (!name) return [];
      const schema = item.input_schema ?? item.inputSchema ?? item.parameters;
      const inputSchema = schema && typeof schema === "object" && !Array.isArray(schema) ? schema as Record<string, unknown> : { type: "object", properties: {} };
      const endpoint = typeof item.endpoint === "string" ? item.endpoint : typeof item.url === "string" ? item.url : undefined;
      return [{ name, description: String(item.description ?? `Tool: ${name}`), inputSchema, endpoint, slug: typeof item.slug === "string" ? item.slug : name }];
    });
  } catch {
    return [];
  }
}

async function githubCall(name: string, args: Record<string, unknown>): Promise<unknown> {
  const owner = String(args.owner ?? "").trim();
  const repo = String(args.repo ?? "").trim();
  if (!owner || !repo) throw new Error("GitHub requires owner and repo.");
  let path = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  if (name === "github_get_file") {
    const file = String(args.path ?? "").replace(/^\/+/, "");
    if (!file) throw new Error("GitHub file path is required.");
    path += `/contents/${file.split("/").map(encodeURIComponent).join("/")}`;
    if (args.ref) path += `?ref=${encodeURIComponent(String(args.ref))}`;
  } else if (name === "github_list_commits") {
    const perPage = Math.min(20, Math.max(1, Number(args.per_page ?? 10)));
    path += `/commits?per_page=${perPage}`;
  }
  const response = await fetch(`${GITHUB_API}${path}`, { headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2026-03-10" } });
  const text = await response.text();
  if (!response.ok) throw new Error(`GitHub HTTP ${response.status}: ${text.slice(0, 300)}`);
  try { return JSON.parse(text); } catch { return text; }
}

async function codingFleetCall(tool: Tool, args: Record<string, unknown>): Promise<unknown> {
  if (!tool.endpoint) throw new Error(`Tool ${tool.name} has no callable endpoint.`);
  const endpoint = new URL(tool.endpoint, CODINGFLEET_TOOLS).toString();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ tool: tool.slug ?? tool.name, arguments: args }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${tool.name} HTTP ${response.status}: ${text.slice(0, 300)}`);
  try { return JSON.parse(text); } catch { return text; }
}

async function handleMcp(request: Request): Promise<Response> {
  if (request.method === "GET") {
    return Response.json({ ok: true, name: "Bossnu-CodingFleet MCP", version: "1.0.0", protocol: "MCP", endpoint: "/api/mcp" });
  }
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; } catch { return Response.json({ jsonrpc: "2.0", error: { code: -32700, message: "Invalid JSON" } }, { status: 400 }); }
  const id = body.id ?? null;
  const method = String(body.method ?? "");

  try {
    if (method === "initialize") {
      return Response.json({ jsonrpc: "2.0", id, result: { protocolVersion: "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "Bossnu-CodingFleet", version: "1.0.0" } } });
    }
    if (method === "notifications/initialized") return new Response(null, { status: 202 });

    const tools = [...nativeTools(), ...(await codingFleetTools())].slice(0, MAX_TOOLS);
    if (method === "tools/list") {
      return Response.json({ jsonrpc: "2.0", id, result: { tools: tools.map((tool) => ({ name: tool.name, description: tool.description, inputSchema: tool.inputSchema })) } });
    }
    if (method === "tools/call") {
      const params = body.params && typeof body.params === "object" ? body.params as Record<string, unknown> : {};
      const name = String(params.name ?? "");
      const args = params.arguments && typeof params.arguments === "object" && !Array.isArray(params.arguments) ? params.arguments as Record<string, unknown> : {};
      const tool = tools.find((candidate) => candidate.name === name);
      if (!tool) return Response.json({ jsonrpc: "2.0", id, error: { code: -32602, message: `Unknown tool: ${name}` } }, { status: 400 });
      const result = name.startsWith("github_") ? await githubCall(name, args) : await codingFleetCall(tool, args);
      return Response.json({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: typeof result === "string" ? result : JSON.stringify(result) }], structuredContent: result } });
    }
    return Response.json({ jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } }, { status: 404 });
  } catch (error) {
    return Response.json({ jsonrpc: "2.0", id, error: { code: -32000, message: error instanceof Error ? error.message : String(error) } }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/mcp")({
  server: { handlers: { GET: ({ request }) => handleMcp(request), POST: ({ request }) => handleMcp(request) } },
});
