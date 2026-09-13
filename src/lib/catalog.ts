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

export const APP_NAME = "Bossnu SlieLo";
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
    posture: "read-only",
    instructions: "Test the behavior, edge cases, and failure modes before calling it done.",
  },
];
