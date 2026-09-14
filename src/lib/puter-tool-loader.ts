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
  method?: unknown;
  mcpServer?: string;
  mcpToolName?: string;
  pluginSource?: string;
  pluginName?: string;
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
const PLUGINS_URL = "https://boss69-l8e13v82g-canthrsngsaengphanuphanth95-1467.vercel.app/plugins";
const PUBLIC_MCP_SERVERS = ["https://api.keenable.ai/mcp"] as const;
const TOOL_LIMIT = 20;
const MAX_TOOL_ROUNDS = 12;
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

function toolName(tool: CodingFleetTool) {
  return String(tool.name ?? tool.slug ?? tool.id ?? "").trim();
}

function toolParameters(tool: CodingFleetTool): Record<string, unknown> {
  const value = tool.input_schema ?? tool.inputSchema ?? tool.parameters;
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  return { type: "object", properties: {} };
}

function normalizePluginEntries(value: unknown): CodingFleetTool[] {
  const raw = Array.isArray(value)
    ? value
    : value && typeof value === "object"
      ? ((value as Record<string, unknown>).plugins ?? (value as Record<string, unknown>).data ?? [])
      : [];
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const plugin = entry as Record<string, unknown>;
    const name = String(plugin.name ?? plugin.slug ?? plugin.id ?? "").trim();
    if (!name) return [];
    const endpoint = plugin.endpoint ?? plugin.api ?? plugin.invokeUrl ?? plugin.url;
    const callable = typeof endpoint === "string" && endpoint.trim().length > 0;
    if (!callable) return [];

    const safeName = name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 48);
    return [{
      name: `plugin_${safeName}`,
      description: String(plugin.description ?? `Plugin: ${name}`),
      inputSchema: plugin.input_schema ?? plugin.inputSchema ?? plugin.parameters ?? { type: "object", properties: {} },
      endpoint,
      method: plugin.method,
      pluginSource: PLUGINS_URL,
      pluginName: name,
    }];
  });
}

async function loadPluginTools(): Promise<CodingFleetTool[]> {
  const response = await fetch(PLUGINS_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Plugin catalog returned HTTP ${response.status}.`);
  return normalizePluginEntries(await response.json());
}

async function loadPluginCatalogTool(): Promise<CodingFleetTool> {
  return {
    name: "plugin_catalog",
    description: "Check the live Bossnu plugin catalog and connection availability. Use this before claiming a plugin is unavailable.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    endpoint: PLUGINS_URL,
    method: "GET",
    pluginSource: PLUGINS_URL,
    pluginName: "plugin_catalog",
  };
}

async function loadPublicMcpTools(): Promise<CodingFleetTool[]> {
  const loaded: CodingFleetTool[] = [];
  for (const server of PUBLIC_MCP_SERVERS) {
    try {
      const init = await fetch(server, {
        method: "POST",
        headers: { Accept: "application/json, text/event-stream", "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: {
            protocolVersion: "2025-06-18",
            capabilities: {},
            clientInfo: { name: "Bossnu-CodingFleet", version: "1.0.0" },
          },
        }),
      });
      if (!init.ok) continue;
      const sessionId = init.headers.get("mcp-session-id");
      const list = await fetch(server, {
        method: "POST",
        headers: {
          Accept: "application/json, text/event-stream",
          "Content-Type": "application/json",
          ...(sessionId ? { "Mcp-Session-Id": sessionId } : {}),
        },
        body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }),
      });
      if (!list.ok) continue;
      const payload = await readJsonRpcResponse(list);
      const tools = (payload?.result as Record<string, unknown> | undefined)?.tools;
      if (!Array.isArray(tools)) continue;
      for (const raw of tools) {
        if (!raw || typeof raw !== "object") continue;
        const tool = raw as Record<string, unknown>;
        const name = String(tool.name ?? "").trim();
        if (!name) continue;
        loaded.push({
          name: `mcp_${name}`,
          description: String(tool.description ?? `Public MCP tool: ${name}`),
          inputSchema: tool.inputSchema ?? { type: "object", properties: {} },
          mcpServer: server,
          mcpToolName: name,
        });
      }
    } catch {
      // Optional source.
    }
  }
  return loaded;
}

async function readJsonRpcResponse(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();
  const trimmed = text.trim();
  if (!trimmed) return {};
  if (trimmed.startsWith("data:")) {
    const data = trimmed.split(/\r?\n/).find((line) => line.startsWith("data:"));
    if (data) return JSON.parse(data.slice(5).trim()) as Record<string, unknown>;
  }
  return JSON.parse(trimmed) as Record<string, unknown>;
}

async function callPublicMcpTool(tool: CodingFleetTool, args: Record<string, unknown>): Promise<unknown> {
  const server = String(tool.mcpServer ?? "");
  const name = String(tool.mcpToolName ?? "");
  if (!server || !name) return { ok: false, error: `Invalid MCP tool configuration for ${toolName(tool)}.` };
  const init = await fetch(server, {
    method: "POST",
    headers: { Accept: "application/json, text/event-stream", "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "Bossnu-CodingFleet", version: "1.0.0" } } }),
  });
  if (!init.ok) throw new Error(`MCP initialize failed: HTTP ${init.status}`);
  const sessionId = init.headers.get("mcp-session-id");
  const response = await fetch(server, {
    method: "POST",
    headers: { Accept: "application/json, text/event-stream", "Content-Type": "application/json", ...(sessionId ? { "Mcp-Session-Id": sessionId } : {}) },
    body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name, arguments: args } }),
  });
  if (!response.ok) throw new Error(`MCP tool ${name} failed: HTTP ${response.status}`);
  const payload = await readJsonRpcResponse(response);
  if (payload.error) throw new Error(JSON.stringify(payload.error));
  return (payload.result as unknown) ?? payload;
}

export async function loadCodingFleetTools(forceRefresh = false): Promise<CodingFleetTool[]> {
  if (!forceRefresh && cachedTools && Date.now() - cachedAt < CACHE_TTL_MS) return cachedTools;

  const sources = await Promise.allSettled([
    fetch(TOOLS_URL, { headers: { Accept: "application/json" } }).then(async (response) => {
      if (!response.ok) throw new Error(`CodingFleet tools returned HTTP ${response.status}.`);
      return normalizeTools(await response.json());
    }),
    loadPluginTools(),
    loadPublicMcpTools(),
    loadPluginCatalogTool(),
  ]);

  const codingFleet = sources[0].status === "fulfilled" ? sources[0].value : [];
  const pluginTools = sources[1].status === "fulfilled" ? sources[1].value : [];
  const mcpTools = sources[2].status === "fulfilled" ? sources[2].value : [];
  const catalogTool = sources[3].status === "fulfilled" ? [sources[3].value] : [];
  const tools = [...codingFleet, ...pluginTools, ...mcpTools, ...catalogTool].slice(0, TOOL_LIMIT);

  if (tools.length > 0) {
    cachedTools = tools;
    cachedAt = Date.now();
    return tools;
  }
  if (cachedTools) return cachedTools;
  throw new Error("No tools are available: CodingFleet, Plugins and public MCP discovery all failed.");
}

function toPuterTools(tools: CodingFleetTool[]): PuterFunctionTool[] {
  return tools.slice(0, TOOL_LIMIT).map((tool) => {
    const name = toolName(tool);
    if (!name) return null;
    return { type: "function" as const, function: { name, description: String(tool.description ?? `Tool: ${name}`), parameters: toolParameters(tool) } };
  }).filter((tool): tool is PuterFunctionTool => tool !== null);
}

function toolSummary(tools: CodingFleetTool[]): string {
  return tools.slice(0, TOOL_LIMIT).map((tool) => JSON.stringify({ name: toolName(tool), description: tool.description, input_schema: toolParameters(tool) })).join("\n");
}

function parseArguments(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value === "string") {
    try { const parsed = JSON.parse(value); if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>; } catch {}
  }
  return {};
}

function extractToolCalls(value: unknown): ToolCall[] {
  const response = value as Record<string, unknown> | null;
  const message = response?.message as Record<string, unknown> | undefined;
  const raw = message?.tool_calls ?? response?.tool_calls ?? response?.toolCalls;
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const call = item as Record<string, unknown>;
    const fn = call.function as Record<string, unknown> | undefined;
    const name = String(fn?.name ?? call.name ?? "").trim();
    if (!name) return [];
    return [{ id: typeof call.id === "string" ? call.id : undefined, name, arguments: parseArguments(fn?.arguments ?? call.arguments ?? call.input) }];
  });
}

function assistantToolMessage(response: unknown): Record<string, unknown> | null {
  const message = (response as Record<string, unknown> | null)?.message;
  return message && typeof message === "object" ? message as Record<string, unknown> : null;
}

function resolveEndpoint(tool: CodingFleetTool): string | null {
  const candidate = tool.endpoint ?? tool.url;
  if (typeof candidate !== "string" || !candidate.trim()) return null;
  try { return new URL(candidate, `${CODINGFLEET_BASE}/`).toString(); } catch { return null; }
}

async function executePluginTool(tool: CodingFleetTool, args: Record<string, unknown>): Promise<unknown> {
  const endpoint = resolveEndpoint(tool);
  if (!endpoint) return { ok: false, error: `Plugin ${toolName(tool)} is not callable: no endpoint was advertised.` };
  const method = String(tool.method ?? "POST").toUpperCase();
  const response = await fetch(endpoint, {
    method,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    ...(method === "GET" || method === "HEAD" ? {} : { body: JSON.stringify({ arguments: args }) }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Plugin ${String(tool.pluginName ?? toolName(tool))} returned HTTP ${response.status}: ${text.slice(0, 240)}`);
  try { return JSON.parse(text); } catch { return text; }
}

async function executeTool(tool: CodingFleetTool, args: Record<string, unknown>): Promise<unknown> {
  if (tool.mcpServer) return callPublicMcpTool(tool, args);
  if (tool.pluginSource) return executePluginTool(tool, args);
  const endpoint = resolveEndpoint(tool);
  if (!endpoint) return { ok: false, error: `Tool ${toolName(tool)} has no callable HTTPS endpoint exposed by CodingFleet.` };
  const response = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ tool: tool.slug ?? toolName(tool), arguments: args }) });
  const text = await response.text();
  if (!response.ok) throw new Error(`Tool ${toolName(tool)} returned HTTP ${response.status}: ${text.slice(0, 240)}`);
  try { return JSON.parse(text); } catch { return text; }
}

async function chatModel(messages: Array<Record<string, unknown>>, tools: CodingFleetTool[], model: string): Promise<{ text: string; response: unknown; toolCalls: ToolCall[] }> {
  const puter = await ensurePuter();
  if (!puter.auth.isSignedIn()) await puter.auth.signIn();
  const response = await puter.ai.chat(messages, { model, tools: toPuterTools(tools), normalize: true, stream: false });
  return { text: extractText(response), response, toolCalls: extractToolCalls(response) };
}

export async function callWithFallback(prompt: string, tools: CodingFleetTool[], models: readonly string[] = DEFAULT_MODELS): Promise<{ ok: true; text: string; model: string; toolCalls: ToolCall[] } | { ok: false; error: string }> {
  let lastError = "No model succeeded.";
  for (const model of models) {
    try {
      const availableTools = tools.slice(0, TOOL_LIMIT);
      const system = [
        "You are Bossnu SlieLo Agentic AI.",
        "Use supplied CodingFleet, live Plugins, and public MCP tools when relevant. Tool calls are real function calls; never invent a tool name or endpoint.",
        "For plugin requests, use plugin_catalog when availability is uncertain. Only invoke a plugin when its catalog entry advertises a callable endpoint.",
        "Never invent credentials. If a private credential is missing, identify the exact service and secret/env-var name; never ask the user to paste the secret into ordinary chat.",
        "Available tools:", toolSummary(availableTools),
      ].join("\n");
      const messages: Array<Record<string, unknown>> = [{ role: "system", content: system }, { role: "user", content: prompt }];
      const executed: ToolCall[] = [];
      for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
        const current = await chatModel(messages, availableTools, model);
        if (current.toolCalls.length === 0) {
          if (!current.text.trim()) throw new Error("Empty model response.");
          return { ok: true, text: current.text, model, toolCalls: executed };
        }
        const assistantMessage = assistantToolMessage(current.response);
        if (!assistantMessage) throw new Error("Puter returned tool calls without an assistant message.");
        messages.push(assistantMessage);
        for (const call of current.toolCalls) {
          const tool = availableTools.find((candidate) => toolName(candidate) === call.name);
          const toolCallId = call.id ?? call.name;
          if (!tool) {
            messages.push({ role: "tool", tool_call_id: toolCallId, content: JSON.stringify({ ok: false, error: `Unknown tool: ${call.name}` }) });
            continue;
          }
          try {
            const result = await executeTool(tool, call.arguments);
            executed.push(call);
            messages.push({ role: "tool", tool_call_id: toolCallId, content: JSON.stringify(result) });
          } catch (error) {
            messages.push({ role: "tool", tool_call_id: toolCallId, content: JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }) });
          }
        }
      }
      throw new Error(`Tool loop exceeded ${MAX_TOOL_ROUNDS} rounds.`);
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  return { ok: false, error: lastError };
}

export async function runAgentsParallel(prompt: string, tools: CodingFleetTool[], agents: readonly string[] = ["reviewer", "security", "tester"]): Promise<Array<{ agent: string; ok: boolean; text: string }>> {
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