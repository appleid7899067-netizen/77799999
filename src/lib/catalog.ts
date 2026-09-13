import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Bot,
  FileCode2,
  FileText,
  GitCompare,
  Languages,
  MessageSquare,
  Play,
  ScanSearch,
  Sparkles,
  TestTube2,
  Workflow,
} from "lucide-react";

export const APP_NAME = "Copilot Chat";
export const MOTTO_TH = "ไม่มีอะไรที่ทำไม่ได้ · ไม่มีสิ่งใดที่แก้ไม่ได้";
export const MOTTO_EN = "Nothing is impossible. Nothing can't be fixed.";

export type ToolSlug =
  | "generator"
  | "assistant"
  | "converter"
  | "explainer"
  | "enhancer"
  | "documentation"
  | "tests"
  | "diagram"
  | "diagram-to-code"
  | "reviewer"
  | "runner";

export type ToolKind = "prompt-code" | "convert" | "diagram" | "diagram-to-code" | "runner";

export type FleetTool = {
  slug: ToolSlug;
  name: string;
  short: string;
  blurb: string;
  href: string;
  icon: LucideIcon;
  kind: ToolKind;
  cta: string;
  samples: { label: string; prompt: string; code?: string }[];
};

export const TOOLS: FleetTool[] = [
  {
    slug: "generator",
    name: "Code Generator",
    short: "Generate",
    blurb: "Clean, runnable code from a plain-language ask.",
    href: "/tools/generator",
    icon: Sparkles,
    kind: "prompt-code",
    cta: "Generate",
    samples: [
      {
        label: "REST API",
        prompt: "Build a FastAPI service with CRUD for notes, SQLite, pydantic models, and a health endpoint.",
      },
      {
        label: "CLI tool",
        prompt: "Write a TypeScript CLI that diffs two JSON files and prints a colored tree of added/removed/changed keys.",
      },
    ],
  },
  {
    slug: "assistant",
    name: "Code Assistant",
    short: "Assist",
    blurb: "Fix bugs, add features, leave the rest of the file alone.",
    href: "/tools/assistant",
    icon: MessageSquare,
    kind: "prompt-code",
    cta: "Get assistance",
    samples: [
      {
        label: "Fix a bug",
        prompt: "This function drops the last item when the list has odd length. Fix it and explain why.",
        code: "def pairwise(xs):\n    out = []\n    for i in range(0, len(xs) - 1, 2):\n        out.append((xs[i], xs[i+1]))\n    return out",
      },
    ],
  },
  {
    slug: "converter",
    name: "Code Converter",
    short: "Convert",
    blurb: "Translate between languages and frameworks without losing behavior.",
    href: "/tools/converter",
    icon: Languages,
    kind: "convert",
    cta: "Convert",
    samples: [
      {
        label: "Python → Go",
        prompt: "Convert this to idiomatic Go.",
        code: "from collections import Counter\n\ndef top_k(words, k):\n    counts = Counter(w.lower() for w in words)\n    return [w for w, _ in counts.most_common(k)]",
      },
    ],
  },
  {
    slug: "explainer",
    name: "Code Explainer",
    short: "Explain",
    blurb: "What it does, how, and the traps — at the level you ask for.",
    href: "/tools/explainer",
    icon: BookOpen,
    kind: "prompt-code",
    cta: "Explain",
    samples: [
      {
        label: "Regex",
        prompt: "Explain this like I'm a mid-level engineer. Call out pitfalls.",
        code: "^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$",
      },
    ],
  },
  {
    slug: "enhancer",
    name: "Code Enhancer",
    short: "Enhance",
    blurb: "Ranked refactors with before/after. Apply the ones that matter.",
    href: "/tools/enhancer",
    icon: GitCompare,
    kind: "prompt-code",
    cta: "Enhance",
    samples: [
      {
        label: "Refactor",
        prompt: "Suggest concrete refactors ranked by impact. Show before/after for the top 3.",
        code: "function get(users, id){\n  for(var i=0;i<users.length;i++){\n    if(users[i].id==id){return users[i]}\n  }\n  return null\n}",
      },
    ],
  },
  {
    slug: "documentation",
    name: "Documentation",
    short: "Docs",
    blurb: "README, API reference, and docstrings that match the code.",
    href: "/tools/documentation",
    icon: FileText,
    kind: "prompt-code",
    cta: "Generate docs",
    samples: [
      {
        label: "README",
        prompt: "Write a README plus module-level docs for this library.",
        code: "export function retry<T>(fn: () => Promise<T>, attempts = 3, ms = 250) {\n  return fn().catch((err) => {\n    if (attempts <= 1) throw err;\n    return new Promise((r) => setTimeout(r, ms)).then(() => retry(fn, attempts - 1, ms * 2));\n  });\n}",
      },
    ],
  },
  {
    slug: "tests",
    name: "Unit Tests",
    short: "Tests",
    blurb: "Real tests with edge cases — not snapshot theatre.",
    href: "/tools/tests",
    icon: TestTube2,
    kind: "prompt-code",
    cta: "Generate tests",
    samples: [
      {
        label: "Edge cases",
        prompt: "Write vitest tests covering happy path, empty input, unicode, and overflow.",
        code: "export function slugify(s: string) {\n  return s.normalize('NFKD').replace(/[^\\w\\s-]/g, '').trim().replace(/[\\s_-]+/g, '-').toLowerCase();\n}",
      },
    ],
  },
  {
    slug: "diagram",
    name: "Diagram Generator",
    short: "Diagram",
    blurb: "Architecture, sequence, and data flow as mermaid.",
    href: "/tools/diagram",
    icon: Workflow,
    kind: "diagram",
    cta: "Generate diagram",
    samples: [
      {
        label: "Auth flow",
        prompt: "Sequence diagram of OAuth authorization-code flow with PKCE, including the token refresh path.",
      },
    ],
  },
  {
    slug: "diagram-to-code",
    name: "Diagram to Code",
    short: "Dia → Code",
    blurb: "Turn mermaid or ASCII into a working implementation.",
    href: "/tools/diagram-to-code",
    icon: FileCode2,
    kind: "diagram-to-code",
    cta: "Convert diagram",
    samples: [
      {
        label: "State machine",
        prompt: "Implement this as a TypeScript state machine with exhaustive switches.",
        code: "stateDiagram-v2\n  [*] --> idle\n  idle --> loading: fetch\n  loading --> success: ok\n  loading --> error: fail\n  error --> idle: retry\n  success --> idle: reset",
      },
    ],
  },
  {
    slug: "reviewer",
    name: "Code Reviewer",
    short: "Review",
    blurb: "Findings with severity, location, and a patch.",
    href: "/tools/reviewer",
    icon: ScanSearch,
    kind: "prompt-code",
    cta: "Review",
    samples: [
      {
        label: "Security pass",
        prompt: "Review for correctness, security, and maintainability. Severity on each finding.",
        code: "app.get('/user', (req, res) => {\n  const q = `SELECT * FROM users WHERE id = '${req.query.id}'`;\n  db.query(q, (err, rows) => res.json(rows));\n});",
      },
    ],
  },
  {
    slug: "runner",
    name: "Code Runner",
    short: "Run",
    blurb: "Run JavaScript here. Ask the model about any other language.",
    href: "/runner",
    icon: Play,
    kind: "runner",
    cta: "Run",
    samples: [
      {
        label: "FizzBuzz",
        prompt: "",
        code: "for (let i = 1; i <= 30; i++) {\n  const f = i % 3 === 0 ? 'Fizz' : '';\n  const b = i % 5 === 0 ? 'Buzz' : '';\n  console.log((f + b) || i);\n}",
      },
    ],
  },
];

export const CHAT_NAV = {
  slug: "chat",
  name: "AI Chat",
  blurb: "Chat with free models via Puter — memory, tools, parallel agents.",
  href: "/chat",
  icon: Bot,
};

export type LangGroup = { name: string; items: string[] };

export const LANGUAGE_GROUPS: LangGroup[] = [
  {
    name: "Languages",
    items: [
      "Python", "JavaScript", "TypeScript", "Go", "Rust", "Java", "C", "C++", "C#", "Kotlin",
      "Swift", "Ruby", "PHP", "R", "Scala", "Haskell", "Elixir", "Dart", "Lua", "Bash",
      "SQL", "HTML/CSS/JS", "Solidity", "Zig", "Julia", "Assembly",
    ],
  },
  {
    name: "Databases",
    items: ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis"],
  },
  {
    name: "Web",
    items: ["React", "VueJS", "Angular", "Django", "Flask", "FastAPI", "Express.js", "Next.js", "Rails", "Spring"],
  },
];

export const ALL_LANGUAGES = LANGUAGE_GROUPS.flatMap((g) => g.items);

export type ModelTier = "fast" | "coding" | "deep";

export type FleetModel = {
  id: string;
  name: string;
  provider: string;
  tier: ModelTier;
  context: string;
  coding: number;
  speed: "fast" | "medium" | "deep";
};

export const MODELS: FleetModel[] = [
  { id: "gpt-5.6-luna", name: "GPT-5.6 Luna", provider: "OpenAI", tier: "fast", context: "200K", coding: 84, speed: "fast" },
  { id: "gpt-5.6-terra", name: "GPT-5.6 Terra", provider: "OpenAI", tier: "coding", context: "400K", coding: 90, speed: "medium" },
  { id: "gpt-5.3-codex", name: "GPT-5.3 Codex", provider: "OpenAI", tier: "coding", context: "200K", coding: 93, speed: "medium" },
  { id: "gpt-5-nano", name: "GPT-5 Nano", provider: "OpenAI", tier: "fast", context: "128K", coding: 72, speed: "fast" },
  { id: "claude-sonnet-5", name: "Claude Sonnet 5", provider: "Anthropic", tier: "coding", context: "200K", coding: 91, speed: "medium" },
  { id: "claude-haiku-4-5", name: "Claude Haiku 4.5", provider: "Anthropic", tier: "fast", context: "200K", coding: 80, speed: "fast" },
  { id: "claude-opus-5", name: "Claude Opus 5", provider: "Anthropic", tier: "deep", context: "200K", coding: 94, speed: "deep" },
  { id: "gemini-3.1-flash-lite", name: "Gemini 3.1 Flash Lite", provider: "Google", tier: "fast", context: "1M", coding: 78, speed: "fast" },
  { id: "qwen/qwen3.8-flash", name: "Qwen 3.8 Flash", provider: "Qwen", tier: "fast", context: "128K", coding: 80, speed: "fast" },
  { id: "qwen/qwen3.8-max", name: "Qwen 3.8 Max", provider: "Qwen", tier: "coding", context: "256K", coding: 87, speed: "medium" },
  { id: "qwen/qwen3-coder-plus", name: "Qwen 3 Coder Plus", provider: "Qwen", tier: "coding", context: "128K", coding: 89, speed: "medium" },
  { id: "deepseek/deepseek-v4.1-flash", name: "DeepSeek V4.1 Flash", provider: "DeepSeek", tier: "fast", context: "128K", coding: 86, speed: "fast" },
  { id: "deepseek/deepseek-v4-pro", name: "DeepSeek V4 Pro", provider: "DeepSeek", tier: "coding", context: "128K", coding: 89, speed: "medium" },
];

export const DEFAULT_MODEL_ID = "gpt-5.6-luna";

export type AgentProfile = {
  id: string;
  handle: string;
  name: string;
  role: string;
  posture: "read-only" | "allow-edits" | "full-auto";
  instructions: string;
};

export const AGENTS: AgentProfile[] = [
  {
    id: "orchestrator",
    handle: "orchestrator",
    name: "Orchestrator",
    role: "Scopes work, delegates, synthesizes one answer.",
    posture: "full-auto",
    instructions: "Frame bounded sub-tasks. Never dump the whole job on one agent.",
  },
  {
    id: "implementer",
    handle: "shipper",
    name: "Shipper",
    role: "Smallest durable change. Tests and a clean handoff.",
    posture: "allow-edits",
    instructions: "Make the smallest durable change. Leave tests and a clean handoff behind.",
  },
  {
    id: "reviewer",
    handle: "reviewer",
    name: "Reviewer",
    role: "Correctness, style, missing edge cases.",
    posture: "read-only",
    instructions: "Hunt for gaps, risky assumptions, and missing edge cases.",
  },
  {
    id: "security",
    handle: "security",
    name: "Security",
    role: "Threat-model before a single file is changed.",
    posture: "read-only",
    instructions: "Flag weak boundaries, injection, auth gaps, secret leakage.",
  },
  {
    id: "tester",
    handle: "tester",
    name: "Tester",
    role: "Coverage, fixtures, failure modes.",
    posture: "allow-edits",
    instructions: "Write tests that would have caught the bug. No snapshot theatre.",
  },
  {
    id: "architect",
    handle: "architect",
    name: "Architect",
    role: "Boundaries, data flow, what not to build.",
    posture: "read-only",
    instructions: "Propose the thinnest architecture that survives the next three features.",
  },
  {
    id: "docs",
    handle: "scribe",
    name: "Scribe",
    role: "Docs that a stranger can run in five minutes.",
    posture: "allow-edits",
    instructions: "Document the contract, not the implementation gossip.",
  },
  {
    id: "advocate",
    handle: "devils-advocate",
    name: "Devil's advocate",
    role: "Challenge the plan before anyone writes code.",
    posture: "read-only",
    instructions: "Challenge every plan. Hunt for gaps and unspoken assumptions.",
  },
];

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
  {
    slug: "about",
    title: "About Copilot Chat",
    section: "Start",
    body: [
      "Copilot Chat is a coding workspace that runs on Puter. You sign in once. After that, chat, generate, convert, review, and run code against free models — GPT, Claude, Gemini, Qwen, DeepSeek — with no API keys of your own.",
      MOTTO_TH + " " + MOTTO_EN,
    ],
  },
  {
    slug: "puter",
    title: "Puter login & free models",
    section: "Start",
    body: [
      "Puter uses a user-pays model: you sign in with a Puter account (or a temporary one) and Puter covers the model call against your Puter usage. This app never sees an API key.",
      "The first AI action may open a Puter popup. Allow popups for this site. If the window is blocked, use Sign in with Puter in the header and try again.",
    ],
  },
  {
    slug: "models",
    title: "Choosing a model",
    section: "Start",
    body: [
      "Luna, Haiku, Flash, and Nano are for short transforms. Sonnet, Terra, Codex, Qwen Coder, and DeepSeek Pro are for refactors. Opus is for hard reasoning.",
      "Every model in the picker is called through Puter with the real model id. If a vendor is down, switch models — nothing here is mocked.",
    ],
  },
  {
    slug: "code-execution",
    title: "Code execution",
    section: "Platform",
    body: [
      "The runner executes JavaScript and TypeScript in a sandboxed iframe in this browser. Other languages are traced by the selected model so you still get stdout, stderr, and a verdict.",
    ],
  },
  {
    slug: "parallel-agents",
    title: "Parallel agents",
    section: "Platform",
    body: [
      "Give one task to the orchestrator. It frames bounded sub-tasks for @shipper, @reviewer, @security, @tester and the rest, then synthesizes one answer back into your thread.",
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    section: "Trust",
    body: [
      "Threads, generations, sandboxes, and memory live in this browser (localStorage). Prompts go to Puter so the selected model can answer. This app does not keep a server-side copy of your code.",
    ],
  },
];

export const ROUTINE_TEMPLATES = [
  { id: "standup", name: "Morning standup", cadence: "Weekdays 09:00", prompt: "Summarize open PRs, failing checks, and yesterday's chat memory into an 8-line standup." },
  { id: "tests", name: "Nightly tests", cadence: "Daily 02:00", prompt: "Generate missing unit tests for files touched in the last 24 hours and open a review." },
  { id: "deps", name: "Dependency audit", cadence: "Mondays 08:00", prompt: "Scan lockfiles for CVEs and stale majors. Rank by blast radius." },
  { id: "review", name: "PR review sweep", cadence: "Every 4 hours", prompt: "Review open pull requests. Flag security and missing tests first." },
];

export const STATS = {
  models: 500,
  tools: TOOLS.length,
  agents: AGENTS.length,
};

export function toolBySlug(slug: string) {
  return TOOLS.find((t) => t.slug === slug);
}

export function modelById(id: string) {
  return MODELS.find((m) => m.id === id) ?? MODELS[0];
}

export const SYSTEM_PROMPTS: Record<string, string> = {
  generator:
    "You are Copilot Chat Code Generator. Write production-quality code. Prefer complete, runnable files. Explain briefly after the code. Use markdown with fenced blocks labeled by language.",
  assistant:
    "You are Copilot Chat Code Assistant. Fix, improve, or extend the user's code. Show the patched code, then a short rationale. Do not rewrite unrelated parts.",
  converter:
    "You are Copilot Chat Code Converter. Translate code between languages/frameworks. Preserve behavior. Idiomatic target language. Note semantic mismatches.",
  explainer:
    "You are Copilot Chat Code Explainer. Explain clearly. Structure: what it does, how, pitfalls, a tiny example. Match the requested verbosity.",
  enhancer:
    "You are Copilot Chat Code Enhancer. Return ranked suggestions (High/Med/Low) with before/after snippets. Then an optional fully enhanced file.",
  documentation:
    "You are Copilot Chat Documentation Generator. Produce README, API docs, and docstrings. Accurate to the given code. No fluff.",
  tests:
    "You are Copilot Chat Unit Test Generator. Write real tests (vitest/pytest/go test as appropriate) covering edge cases. Include setup.",
  diagram:
    "You are Copilot Chat Diagram Generator. Output a mermaid diagram in a ```mermaid fence, then a short legend. Prefer flowchart, sequence, class, or erDiagram as fits the ask.",
  "diagram-to-code":
    "You are Copilot Chat Diagram-to-Code. Implement the diagram as working code in the requested language. Keep names from the diagram.",
  reviewer:
    "You are Copilot Chat Code Reviewer. Findings first, each with severity (blocker/major/minor/nit), location, why, and a patch. End with a verdict.",
  chat: "You are Copilot Chat, a coding copilot. Motto: nothing is impossible, nothing can't be fixed. Be direct. Prefer code fences. If tools or agents are enabled, reason with them conceptually and still give a usable answer.",
  agents:
    "You are the Copilot Chat orchestrator. For the user's task, produce work from these agents in this order, each under a heading `## @handle — Name`:\n@architect, @security, @shipper, @tester, @reviewer, @scribe, @devils-advocate.\nThen a final `## Synthesis` that the human can act on. Keep each agent section tight. Code in fences.",
  runner:
    "You are Copilot Chat Code Runner copilot. The user ran or asked about code. Diagnose, suggest a fix, or optimize. Show a corrected snippet if needed.",
};
