import { ensurePuter, extractText } from "@/lib/puter";

type CodingFleetTool = {
  name?: string;
  id?: string;
  slug?: string;
  description?: string;
  input_schema?: unknown;
  inputSchema?: unknown;
  parameters?: unknown;
  endpoint?: unknown;
  url?: unknown;
  [key: string]: unknown;
};

type ToolCall = { id?: string; name: string; arguments: Record<string, unknown> };

type PuterFunctionTool = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};

const TOOLS_URL = "https://www.codingfleet.com/api/tools";
// Expose up to 20 real CodingFleet tools to the model in one tool-calling turn.
const TOOL_LIMIT = 20;
const DEFAULT_MODELS = ["gpt-5.6-luna", "claude-sonnet-4-6", "gemini-3.1-flash-lite"] as const;
const CODINGFLEET_BASE = "https://www.codingfleet.com/api";
let cachedTools: CodingFleetTool[] | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

function normalizeTools(value: unknown): CodingFleetTool[] {
  const raw = Array.isArray(value)
    ? value
    : value && typeof value === "object"
      ? ((value as Record<string, unknown>).tools ?? (value as Record<string, unknown>).data ?? [])
      : [];
  return Array.isArray(raw)
    ? raw.filter((tool): tool is CodingFleetTool => !!tool && typeof tool === "object").slice(0, TOOL_LIMIT)
    : [];
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

function toolName(tool: CodingFleetTool) {
  return String(tool.name ?? tool.slug ?? tool.id ?? "").trim();
}

function toolParameters(tool: CodingFleetTool): Record<string, unknown> {
  const value = tool.input_schema ?? tool.inputSchema ?? tool.parameters;
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  return { type: "object", properties: {} };
}

function toPuterTools(tools: CodingFleetTool[]): PuterFunctionTool[] {
  return tools
    .map((tool) => {
      const name = toolName(tool);
      if (!name) return null;
      return {
        type: "function" as const,
        function: {
          name,
          description: String(tool.description ?? `CodingFleet tool: ${name}`),
          parameters: toolParameters(tool),
        },
      };
    })
    .filter((tool): tool is PuterFunctionTool => tool !== null);
}

function toolSummary(tools: CodingFleetTool[]): string {
  return tools
    .map((tool) => JSON.stringify({ name: toolName(tool), description: tool.description, input_schema: toolParameters(tool) }))
    .join("\n");
}

function parseArguments(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
    } catch {}
  }
  return {};
}

function extractToolCalls(value: unknown): ToolCall[] {
  const response = value as Record<string, unknown> | null;
  const message = response?.message as Record<string, unknown> | undefined;
  const raw = message?.tool_calls ?? response?.tool_calls ?? response?.toolCalls;
  if (Array.isArray(raw)) {
    return raw.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const call = item as Record<string, unknown>;
      const fn = call.function as Record<string, unknown> | undefined;
      const name = String(fn?.name ?? call.name ?? "").trim();
      if (!name) return [];
      return [{ id: typeof call.id === "string" ? call.id : undefined, name, arguments: parseArguments(fn?.arguments ?? call.arguments ?? call.input) }];
    });
  }
  return [];
}

function assistantToolMessage(response: unknown): Record<string, unknown> | null {
  const message = (response as Record<string, unknown> | null)?.message;
  return message && typeof message === "object" ? message as Record<string, unknown> : null;
}

function resolveEndpoint(tool: CodingFleetTool): string | null {
  const candidate = tool.endpoint ?? tool.url;
  if (typeof candidate !== "string" || !candidate.trim()) return null;
  try {
    return new URL(candidate, `${CODINGFLEET_BASE}/`).toString();
  } catch {
    return null;
  }
}

async function executeTool(tool: CodingFleetTool, args: Record<string, unknown>): Promise<unknown> {
  const endpoint = resolveEndpoint(tool);
  if (!endpoint) return { ok: false, error: `Tool ${toolName(tool)} has no callable HTTPS endpoint exposed by CodingFleet.` };
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ tool: tool.slug ?? toolName(tool), arguments: args }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Tool ${toolName(tool)} returned HTTP ${response.status}: ${text.slice(0, 240)}`);
  try { return JSON.parse(text); } catch { return text; }
}

async function chatModel(prompt: string, tools: CodingFleetTool[], model: string): Promise<{ text: string; response: unknown; toolCalls: ToolCall[] }> {
  const puter = await ensurePuter();
  if (!puter.auth.isSignedIn()) await puter.auth.signIn();
  const puterTools = toPuterTools(tools);
  const system = [
    "You are Bossnu SlieLo Agentic AI.",
    "Use supplied CodingFleet tools when relevant. Tool calls are real function calls; never invent a tool name or endpoint.",
    "Never invent credentials. If a private credential is missing, identify the exact service and secret/env-var name; never ask the user to paste the secret into ordinary chat.",
    "Available tools:", toolSummary(tools),
  ].join("\n");
  const response = await puter.ai.chat(
    [{ role: "system", content: system }, { role: "user", content: prompt }],
    { model, tools: puterTools, normalize: true, stream: false },
  );
  return { text: extractText(response), response, toolCalls: extractToolCalls(response) };
}

export async function callWithFallback(
  prompt: string,
  tools: CodingFleetTool[],
  models: readonly string[] = DEFAULT_MODELS,
): Promise<{ ok: true; text: string; model: string; toolCalls: ToolCall[] } | { ok: false; error: string }> {
  let lastError = "No model succeeded.";
  for (const model of models) {
    try {
      let current = await chatModel(prompt, tools, model);
      const executed: ToolCall[] = [];
      if (current.toolCalls.length > 0) {
        const assistantMessage = assistantToolMessage(current.response);
        if (!assistantMessage) throw new Error("Puter returned tool calls without an assistant message.");
        const toolMessages = [] as Array<Record<string, unknown>>;
        for (const call of current.toolCalls) {
          const tool = tools.find((candidate) => toolName(candidate) === call.name);
          if (!tool) {
            toolMessages.push({ role: "tool", tool_call_id: call.id ?? call.name, content: JSON.stringify({ ok: false, error: "Unknown tool" }) });
            continue;
          }
          try {
            const result = await executeTool(tool, call.arguments);
            executed.push(call);
            toolMessages.push({ role: "tool", tool_call_id: call.id ?? call.name, content: JSON.stringify(result) });
          } catch (error) {
            toolMessages.push({ role: "tool", tool_call_id: call.id ?? call.name, content: JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }) });
          }
        }
        const puter = await ensurePuter();
        const finalResponse = await puter.ai.chat(
          [
            { role: "user", content: prompt },
            assistantMessage,
            ...toolMessages,
          ],
          { model, normalize: true, stream: false },
        );
        current = { text: extractText(finalResponse), response: finalResponse, toolCalls: extractToolCalls(finalResponse) };
      }
      if (!current.text.trim()) throw new Error("Empty model response.");
      return { ok: true, text: current.text, model, toolCalls: executed.length ? executed : current.toolCalls };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  return { ok: false, error: lastError };
}

export async function runAgentsParallel(
  prompt: string,
  tools: CodingFleetTool[],
  agents: readonly string[] = ["reviewer", "security", "tester"],
): Promise<Array<{ agent: string; ok: boolean; text: string }>> {
  return Promise.all(agents.map(async (agent) => {
    try {
      const result = await callWithFallback(`${prompt}\n\nYou are the @${agent} specialist. Focus only on ${agent} review and actionable output.`, tools);
      return { agent, ok: result.ok, text: result.ok ? result.text : result.error };
    } catch (error) {
      return { agent, ok: false, text: error instanceof Error ? error.message : String(error) };
    }
  }));
}

export type { CodingFleetTool, ToolCall };
