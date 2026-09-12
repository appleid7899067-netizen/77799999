import { SYSTEM_PROMPTS } from "@/lib/catalog";
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

function buildUserMessage(data: FleetRequest) {
  const parts: string[] = [];
  if (data.language) parts.push(`Language: ${data.language}`);
  if (data.targetLanguage) parts.push(`Target language: ${data.targetLanguage}`);
  if (data.extras) parts.push(data.extras);
  if (data.prompt) parts.push(data.prompt);
  if (data.code?.trim()) {
    const lang = (data.language ?? "").toLowerCase().split(/[\s/]/)[0] || "";
    parts.push(`\nCode:\n\`\`\`${lang}\n${data.code}\n\`\`\``);
  }
  return parts.filter(Boolean).join("\n\n");
}

export async function runFleet(
  data: FleetRequest,
  onDelta?: (full: string) => void,
): Promise<ChatResult> {
  const system = SYSTEM_PROMPTS[data.mode] ?? SYSTEM_PROMPTS.chat;
  const user = buildUserMessage(data);
  if (!user.trim()) {
    return { ok: false, error: "Write a prompt or paste some code first." };
  }

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
