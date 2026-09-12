export type PuterUser = {
  username?: string;
  uuid?: string;
  email?: string;
};

type PuterChatPart = { text?: string; message?: unknown };

type PuterAPI = {
  auth: {
    signIn: (opts?: {
      attempt_temp_user_creation?: boolean;
      request_auth?: boolean;
    }) => Promise<unknown>;
    signOut: () => Promise<void> | void;
    isSignedIn: () => boolean;
    getUser: () => Promise<PuterUser>;
  };
  ai: {
    chat: (
      prompt: unknown,
      options?: Record<string, unknown>,
    ) => Promise<unknown>;
    listModels?: () => Promise<unknown>;
  };
};

declare global {
  interface Window {
    puter?: PuterAPI;
  }
}

const SCRIPT_SRC = "https://js.puter.com/v2/";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getPuter(): PuterAPI | null {
  if (!isBrowser()) return null;
  return window.puter ?? null;
}

export function loadPuter(): Promise<PuterAPI> {
  if (!isBrowser()) return Promise.reject(new Error("Puter runs in the browser only."));
  if (window.puter) return Promise.resolve(window.puter);

  const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const tick = () => {
        if (window.puter) return resolve(window.puter);
        if (Date.now() - start > 12000) return reject(new Error("Puter.js loaded but did not initialize."));
        requestAnimationFrame(tick);
      };
      existing.addEventListener("error", () => reject(new Error("Failed to load Puter.js.")));
      tick();
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      const start = Date.now();
      const tick = () => {
        if (window.puter) return resolve(window.puter);
        if (Date.now() - start > 8000) return reject(new Error("Puter.js loaded but did not initialize."));
        requestAnimationFrame(tick);
      };
      tick();
    };
    script.onerror = () => reject(new Error("Failed to load Puter.js."));
    document.head.appendChild(script);
  });
}

export async function ensurePuter(): Promise<PuterAPI> {
  const current = getPuter();
  if (current) return current;
  return loadPuter();
}

export function extractText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    return value.map(extractText).filter(Boolean).join("");
  }
  if (typeof value === "object") {
    const rec = value as Record<string, unknown>;
    if (typeof rec.text === "string") return rec.text;
    if (typeof rec.content === "string") return rec.content;
    if (Array.isArray(rec.content)) return extractText(rec.content);
    if (rec.message) return extractText(rec.message);
    if (Array.isArray(rec.choices)) {
      const first = rec.choices[0] as Record<string, unknown> | undefined;
      if (first?.message) return extractText(first.message);
      if (typeof first?.text === "string") return first.text;
    }
  }
  return "";
}

export type ChatTurn = { role: "system" | "user" | "assistant"; content: string };

export type ChatResult =
  | { ok: true; text: string; model: string }
  | { ok: false; error: string };

function friendlyError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err ?? "Unknown error");
  const lower = raw.toLowerCase();
  if (lower.includes("popup") || lower.includes("blocked")) {
    return "Popup blocked. Allow popups for this site, then sign in with Puter.";
  }
  if (lower.includes("auth_window_closed") || lower.includes("closed")) {
    return "Sign-in window closed. Try again — Puter is required for free models.";
  }
  if (lower.includes("not signed") || lower.includes("unauthorized") || lower.includes("auth")) {
    return "Sign in with Puter to use free models.";
  }
  return raw.slice(0, 240);
}

export async function signInWithPuter(): Promise<PuterUser | null> {
  const puter = await ensurePuter();
  await puter.auth.signIn();
  if (!puter.auth.isSignedIn()) return null;
  try {
    return await puter.auth.getUser();
  } catch {
    return { username: "puter-user" };
  }
}

export async function signOutPuter() {
  const puter = await ensurePuter();
  await puter.auth.signOut();
}

export async function currentPuterUser(): Promise<PuterUser | null> {
  try {
    const puter = await ensurePuter();
    if (!puter.auth.isSignedIn()) return null;
    return await puter.auth.getUser();
  } catch {
    return null;
  }
}

export async function chatWithPuter(opts: {
  messages: ChatTurn[];
  model: string;
  onDelta?: (full: string) => void;
}): Promise<ChatResult> {
  let puter: PuterAPI;
  try {
    puter = await ensurePuter();
  } catch (err) {
    return { ok: false, error: friendlyError(err) };
  }

  if (!puter.auth.isSignedIn()) {
    try {
      await puter.auth.signIn();
    } catch (err) {
      return { ok: false, error: friendlyError(err) };
    }
  }

  const payload = opts.messages.map((m) => ({ role: m.role, content: m.content }));

  const run = async (stream: boolean) => {
    const resp = await puter.ai.chat(payload, { model: opts.model, stream });
    if (stream && resp && typeof resp === "object" && Symbol.asyncIterator in (resp as object)) {
      let full = "";
      for await (const part of resp as AsyncIterable<PuterChatPart | string>) {
        const piece = typeof part === "string" ? part : extractText(part);
        if (!piece) continue;
        full += piece;
        opts.onDelta?.(full);
      }
      return full;
    }
    const text = extractText(resp);
    if (text) opts.onDelta?.(text);
    return text;
  };

  try {
    const text = await run(true);
    if (!text.trim()) return { ok: false, error: "Empty response from the model." };
    return { ok: true, text, model: opts.model };
  } catch (err) {
    try {
      const text = await run(false);
      if (!text.trim()) return { ok: false, error: friendlyError(err) };
      return { ok: true, text, model: opts.model };
    } catch (err2) {
      return { ok: false, error: friendlyError(err2) };
    }
  }
}
