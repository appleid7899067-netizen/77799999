import { z } from "zod";

export type SandboxRequest = {
  language: string;
  code: string;
  timeoutMs?: number;
};

export type SandboxResult = {
  ok: boolean;
  stdout: string;
  stderr: string;
  exitCode?: number;
  durationMs?: number;
};

const requestSchema = z.object({
  language: z.string().min(1).max(40),
  code: z.string().max(500_000),
  timeoutMs: z.number().int().min(100).max(120_000).optional(),
});

/**
 * Production sandbox adapter. The actual executor is supplied by a trusted
 * HTTPS sandbox service (for example Modal/gVisor). No arbitrary shell is
 * executed inside the Vercel process.
 */
export async function runInSandbox(input: SandboxRequest): Promise<SandboxResult> {
  const request = requestSchema.parse(input);
  const endpoint = process.env.BOSSNU_SANDBOX_URL;
  if (!endpoint) {
    return { ok: false, stdout: "", stderr: "Sandbox is not configured. Set BOSSNU_SANDBOX_URL to the trusted sandbox service." };
  }
  if (!endpoint.startsWith("https://")) {
    throw new Error("BOSSNU_SANDBOX_URL must use HTTPS");
  }
  const started = Date.now();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal: AbortSignal.timeout(request.timeoutMs ?? 60_000),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Sandbox returned HTTP ${response.status}: ${text.slice(0, 500)}`);
  const parsed = JSON.parse(text) as Partial<SandboxResult>;
  return {
    ok: Boolean(parsed.ok),
    stdout: typeof parsed.stdout === "string" ? parsed.stdout : "",
    stderr: typeof parsed.stderr === "string" ? parsed.stderr : "",
    ...(typeof parsed.exitCode === "number" ? { exitCode: parsed.exitCode } : {}),
    durationMs: typeof parsed.durationMs === "number" ? parsed.durationMs : Date.now() - started,
  };
}
