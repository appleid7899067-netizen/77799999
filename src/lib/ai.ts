import { SYSTEM_PROMPTS } from "@/lib/catalog";
import {
  createGitHubBranch,
  createGitHubIssue,
  createGitHubPullRequest,
  dispatchGitHubWorkflow,
  getGitHubActions,
  getGitHubStatus,
  readGitHubFile,
  writeGitHubFile,
} from "@/lib/github.functions";
import { chatWithPuter, type ChatResult, type ChatTurn } from "@/lib/puter";

export type FleetRequest = {
  mode: keyof typeof SYSTEM_PROMPTS | string;
  prompt: string;
  code?: string;
  language?: string;
  targetLanguage?: string;
  modelId?: string;
  extras?: string;
  history?: ChatTurn[];
};

const GITHUB_TOOLS = `
You have real server-side GitHub tools available through the Bossnu SlieLo bot.
The bot can: inspect a repository, read files, write/commit files, create branches, create pull requests, create issues, inspect recent GitHub Actions runs, and dispatch a workflow.
Never claim an action was completed unless a GitHub tool result confirms it.
Available command formats:
- github: status owner/repo
- github: read owner/repo/path/to/file [ref]
- github: write owner/repo/path/to/file <commit message>\\n---\\n<complete new file content>
- github: branch owner/repo new-branch [from-branch]
- github: pr owner/repo head-branch base-branch <title>\\n<body>
- github: issue owner/repo <title>\\n<body>
- github: actions owner/repo [branch]
- github: workflow owner/repo workflow-file-or-id [branch]
These commands execute on the server with the installed GitHub App permissions.
`;

function buildUserMessage(data: FleetRequest, githubContext?: string) {
  const parts: string[] = [GITHUB_TOOLS.trim()];
  if (data.language) parts.push(`Language: ${data.language}`);
  if (data.targetLanguage) parts.push(`Target language: ${data.targetLanguage}`);
  if (data.extras) parts.push(data.extras);
  if (githubContext) parts.push(`GitHub tool result:\n${githubContext}`);
  if (data.prompt) parts.push(data.prompt);
  if (data.code?.trim()) {
    const lang = (data.language ?? "").toLowerCase().split(/[\s/]/)[0] || "";
    parts.push(`\nCode:\n\`\`\`${lang}\n${data.code}\n\`\`\``);
  }
  return parts.filter(Boolean).join("\n\n");
}

function splitBody(text: string) {
  const separator = text.indexOf("\n---\n");
  if (separator < 0) return { first: text.trim(), body: "" };
  return { first: text.slice(0, separator).trim(), body: text.slice(separator + 5).trim() };
}

async function runGitHubCommand(prompt: string): Promise<string | undefined> {
  const status = prompt.match(/^github:\s*status\s+([^\s]+)\s*$/i);
  if (status) {
    const [owner, repo] = status[1].split("/");
    if (!owner || !repo) throw new Error("Use: github: status owner/repo");
    return JSON.stringify(await getGitHubStatus({ data: { owner, repo } }), null, 2);
  }

  const read = prompt.match(/^github:\s*read\s+([^\s]+)(?:\s+([^\s]+))?\s*$/i);
  if (read) {
    const parts = read[1].split("/");
    const owner = parts.shift();
    const repo = parts.shift();
    const path = parts.join("/");
    if (!owner || !repo || !path) throw new Error("Use: github: read owner/repo/path/to/file [ref]");
    const file = await readGitHubFile({ data: { owner, repo, path, ...(read[2] ? { ref: read[2] } : {}) } });
    return JSON.stringify({ action: "read", repository: `${owner}/${repo}`, path: file.path, sha: file.sha, content: file.content }, null, 2);
  }

  const write = prompt.match(/^github:\s*write\s+([^\s]+)\s+([\s\S]+)$/i);
  if (write) {
    const parts = write[1].split("/");
    const owner = parts.shift();
    const repo = parts.shift();
    const path = parts.join("/");
    if (!owner || !repo || !path) throw new Error("Use: github: write owner/repo/path/to/file <message>\\n---\\n<content>");
    const { first: message, body: content } = splitBody(write[2]);
    if (!content) throw new Error("GitHub write needs complete file content after \\n---\\n");
    const current = await readGitHubFile({ data: { owner, repo, path } }).catch(() => null);
    const result = await writeGitHubFile({
      data: { owner, repo, path, content, message: message || "Update from Bossnu SlieLo bot", ...(current?.sha ? { sha: current.sha } : {}) },
    });
    return JSON.stringify({ action: "write", repository: `${owner}/${repo}`, path, result }, null, 2);
  }

  const branch = prompt.match(/^github:\s*branch\s+([^\s]+)\s+([^\s]+)(?:\s+([^\s]+))?\s*$/i);
  if (branch) {
    const [owner, repo] = branch[1].split("/");
    if (!owner || !repo) throw new Error("Use: github: branch owner/repo new-branch [from-branch]");
    return JSON.stringify(await createGitHubBranch({ data: { owner, repo, branch: branch[2], ...(branch[3] ? { from: branch[3] } : {}) } }), null, 2);
  }

  const pr = prompt.match(/^github:\s*pr\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([\s\S]+)$/i);
  if (pr) {
    const [owner, repo] = pr[1].split("/");
    if (!owner || !repo) throw new Error("Use: github: pr owner/repo head-branch base-branch <title>\\n<body>");
    const { first: title, body } = splitBody(pr[4]);
    return JSON.stringify(await createGitHubPullRequest({ data: { owner, repo, head: pr[2], base: pr[3], title, ...(body ? { body } : {}) } }), null, 2);
  }

  const issue = prompt.match(/^github:\s*issue\s+([^\s]+)\s+([\s\S]+)$/i);
  if (issue) {
    const [owner, repo] = issue[1].split("/");
    if (!owner || !repo) throw new Error("Use: github: issue owner/repo <title>\\n<body>");
    const { first: title, body } = splitBody(issue[2]);
    return JSON.stringify(await createGitHubIssue({ data: { owner, repo, title, ...(body ? { body } : {}) } }), null, 2);
  }

  const actions = prompt.match(/^github:\s*actions\s+([^\s]+)(?:\s+([^\s]+))?\s*$/i);
  if (actions) {
    const [owner, repo] = actions[1].split("/");
    if (!owner || !repo) throw new Error("Use: github: actions owner/repo [branch]");
    return JSON.stringify(await getGitHubActions({ data: { owner, repo, ...(actions[2] ? { branch: actions[2] } : {}) } }), null, 2);
  }

  const workflow = prompt.match(/^github:\s*workflow\s+([^\s]+)\s+([^\s]+)(?:\s+([^\s]+))?\s*$/i);
  if (workflow) {
    const [owner, repo] = workflow[1].split("/");
    if (!owner || !repo) throw new Error("Use: github: workflow owner/repo workflow-file-or-id [branch]");
    return JSON.stringify(await dispatchGitHubWorkflow({ data: { owner, repo, workflow: workflow[2], ...(workflow[3] ? { branch: workflow[3] } : {}) } }), null, 2);
  }

  return undefined;
}

export async function runFleet(data: FleetRequest, onDelta?: (full: string) => void): Promise<ChatResult> {
  const system = SYSTEM_PROMPTS[data.mode] ?? SYSTEM_PROMPTS.chat;
  if (!data.prompt.trim()) return { ok: false, error: "Write a prompt or paste some code first." };

  let githubContext: string | undefined;
  try {
    githubContext = await runGitHubCommand(data.prompt);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "GitHub action failed" };
  }

  const user = buildUserMessage(data, githubContext);
  const history = (data.history ?? []).slice(-10);
  const messages: ChatTurn[] = [
    { role: "system", content: system.slice(0, 8000) },
    ...history,
    { role: "user", content: user.slice(0, 24000) },
  ];

  return chatWithPuter({ messages, model: data.modelId || "gpt-5.6-luna", onDelta });
}
