import { SYSTEM_PROMPTS } from "@/lib/catalog";
import { readGitHubFile, writeGitHubFile } from "@/lib/github.functions";
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

function buildUserMessage(data: FleetRequest, githubContext?: string) {
  const parts: string[] = [];
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

async function runGitHubCommand(prompt: string): Promise<string | undefined> {
  const match = prompt.match(/^github:\s*(read|write)\s+([^\s]+)\s+(.+)$/is);
  if (!match) return undefined;

  const action = match[1].toLowerCase();
  const target = match[2];
  const remainder = match[3];
  const [owner, repo, ...pathParts] = target.split("/");
  if (!owner || !repo || pathParts.length === 0) {
    throw new Error("GitHub command format: github: read owner/repo/path/to/file");
  }
  const path = pathParts.join("/");

  if (action === "read") {
    const file = await readGitHubFile({ data: { owner, repo, path } });
    return JSON.stringify(
      { action, repository: `${owner}/${repo}`, path: file.path, sha: file.sha, content: file.content },
      null,
      2,
    );
  }

  const separator = remainder.indexOf("\n---\n");
  if (separator < 0) {
    throw new Error("GitHub write format: github: write owner/repo/path/to/file <message>\\n---\\n<new file content>");
  }
  const message = remainder.slice(0, separator).trim() || "Update from Bossnu SlieLo bot";
  const content = remainder.slice(separator + 5);
  const current = await readGitHubFile({ data: { owner, repo, path } }).catch(() => null);
  const result = await writeGitHubFile({
    data: {
      owner,
      repo,
      path,
      content,
      message,
      ...(current?.sha ? { sha: current.sha } : {}),
    },
  });
  return JSON.stringify({ action, repository: `${owner}/${repo}`, path, result }, null, 2);
}

export async function runFleet(
  data: FleetRequest,
  onDelta?: (full: string) => void,
): Promise<ChatResult> {
  const system = SYSTEM_PROMPTS[data.mode] ?? SYSTEM_PROMPTS.chat;
  if (!data.prompt.trim()) {
    return { ok: false, error: "Write a prompt or paste some code first." };
  }

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

  return chatWithPuter({
    messages,
    model: data.modelId || "gpt-5.6-luna",
    onDelta,
  });
}
