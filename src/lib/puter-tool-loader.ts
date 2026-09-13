import { ensurePuter, extractText } from "@/lib/puter";

type CodingFleetTool = {
  name?: string;
  id?: string;
  description?: string;
  input_schema?: unknown;
  parameters?: unknown;
  [key: string]: unknown;
};

type ToolCall = { name: string; arguments: Record<string, unknown> };

const TOOLS_URL = "https://www.codingfleet.com/api/tools";
const TOOL_LIMIT = 10;
const DEFAULT_MODELS = ["claude-3-5-sonnet", "gpt-4o", "gemini-2.5-pro"] as const;
let cachedTools: CodingFleetTool[] | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

function normalizeTools(value: unknown): CodingFleetTool[] {
  const raw = Array.isArray(value) ? value : value && typeof value === "object" ? ((value as Record<string, unknown>).tools ?? (value as Record<string, unknown>).data ?? []) : [];
  return Array.isArray(raw) ? raw.filter((tool): tool is CodingFleetTool => !!tool && typeof tool === "object").slice(0, TOOL_LIMIT) : [];
}

export async function loadCodingFleetTools(forceRefresh = false): Promise<CodingFleetTool[]> {
  if (!forceRefresh && cachedTools && Date.now() - cachedAt < CACHE_TTL_MS) return cachedTools;
  try {
    const response = await fetch(TOOLS_URL, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`CodingFleet tools returned HTTP ${response.status}.`);
    const tools = normalizeTools(await response.json());
    cachedTools = tools;
    cachedAt = Date.now();
    return tools;
  } catch (error) {
    if (cachedTools) return cachedTools;
    throw new Error(`Unable to load CodingFleet tools: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function toolSummary(tools: CodingFleetTool[]): string {
  return tools.map((tool) => JSON.stringify({ name: tool.name ?? tool.id ?? "unknown", description: tool.description, input_schema: tool.input_schema ?? tool.parameters })).join("\n");
}

function extractToolCalls(text: string): ToolCall[] {
  const calls: ToolCall[] = [];
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? text;
  try {
    const parsed = JSON.parse(fenced);
    const items = Array.isArray(parsed) ? parsed : parsed?.tool_calls;
    if (Array.isArray(items)) for (const item of items) if (item && typeof item.name === "string") calls.push({ name: item.name, arguments: item.arguments ?? item.input ?? {} });
  } catch {}
  return calls;
}

function toolName(tool: CodingFleetTool) { return tool.name ?? tool.id ?? ""; }

async function executeTool(tool: CodingFleetTool, args: Record<string, unknown>): Promise<unknown> {
  const candidate = tool.url ?? tool.endpoint;
  if (typeof candidate !== "string" || !/^https:\/\//i.test(candidate)) {
    return { ok: false, error: `Tool ${toolName(tool)} has no callable HTTPS endpoint exposed by CodingFleet.` };
  }
  const response = await fetch(candidate, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Tool ${toolName(tool)} returned HTTP ${response.status}: ${text.slice(0, 240)}`);
  try { return JSON.parse(text); } catch { return text; }
}

async function chatModel(prompt: string, tools: CodingFleetTool[], model: string): Promise<string> {
  const puter = await ensurePuter();
  if (!puter.auth.isSignedIn()) await puter.auth.signIn();
  const system = [
    "You are Bossnu SlieLo Agentic AI.",
    "Use supplied CodingFleet tools when relevant. If you need to execute a tool, return JSON only: {\"tool_calls\":[{\"name\":\"...\",\"arguments\":{}}]}.",
    "Never invent tool names, endpoints, or credentials.",
    "If a private credential is missing, identify the exact service and secret/env-var name; never ask the user to paste the secret into ordinary chat.",
    "Available tools:", toolSummary(tools),
  ].join("\n");
  const response = await puter.ai.chat([{ role: "system", content: system }, { role: "user", content: prompt }], { model, stream: false });
  return extractText(response);
}

export async function callWithFallback(prompt: string, tools: CodingFleetTool[], models: readonly string[] = DEFAULT_MODELS): Promise<{ ok: true; text: string; model: string; toolCalls: ToolCall[] } | { ok: false; error: string }> {
  let lastError = "No model succeeded.";
  for (const model of models) {
    try {
      const text = await chatModel(prompt, tools, model);
      if (!text.trim()) throw new Error("Empty model response.");
      const toolCalls = extractToolCalls(text);
      const results: string[] = [];
      for (const call of toolCalls) {
        const tool = tools.find((candidate) => toolName(candidate) === call.name);
        if (!tool) { results.push(JSON.stringify({ name: call.name, ok: false, error: "Unknown tool" })); continue; }
        try { results.push(JSON.stringify({ name: call.name, ok: true, result: await executeTool(tool, call.arguments) })); }
        catch (error) { results.push(JSON.stringify({ name: call.name, ok: false, error: error instanceof Error ? error.message : String(error) })); }
      }
      return { ok: true, text: results.length ? `${text}\n\nTool results:\n${results.join("\n")}` : text, model, toolCalls };
    } catch (error) { lastError = error instanceof Error ? error.message : String(error); }
  }
  return { ok: false, error: lastError };
}

export async function runAgentsParallel(prompt: string, tools: CodingFleetTool[], agents: readonly string[] = ["reviewer", "security", "tester"]): Promise<Array<{ agent: string; ok: boolean; text: string }>> {
  return Promise.all(agents.map(async (agent) => {
    try {
      const result = await callWithFallback(`${prompt}\n\nYou are the @${agent} specialist. Focus only on ${agent} review and actionable output.`, tools);
      return { agent, ok: result.ok, text: result.ok ? result.text : result.error };
    } catch (error) { return { agent, ok: false, text: error instanceof Error ? error.message : String(error) }; }
  }));
}

export type { CodingFleetTool, ToolCall };
