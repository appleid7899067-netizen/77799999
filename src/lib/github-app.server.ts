import { createSign } from "node:crypto";

const API = "https://api.github.com";
const API_VERSION = "2026-03-10";

type GitHubResponse<T> = {
  data: T;
  response: Response;
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} environment variable`);
  return value;
}

function createAppJwt(): string {
  const appId = requiredEnv("GITHUB_APP_ID");
  const privateKey = requiredEnv("GITHUB_APP_PRIVATE_KEY").replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({ iat: now - 60, exp: now + 540, iss: appId }),
  ).toString("base64url");
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  return `${unsigned}.${signer.sign(privateKey, "base64url")}`;
}

async function github<T>(path: string, init: RequestInit = {}, token?: string): Promise<GitHubResponse<T>> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": API_VERSION,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  const data = (await response.json().catch(() => null)) as T;
  if (!response.ok) {
    const message =
      data && typeof data === "object" && data !== null && "message" in data
        ? String((data as { message?: unknown }).message)
        : response.statusText;
    throw new Error(`GitHub API ${response.status}: ${message}`);
  }
  return { data, response };
}

async function getInstallationToken(owner: string, repo: string): Promise<string> {
  const jwt = createAppJwt();
  const installation = await github<{ id: number }>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/installation`,
    { headers: { Authorization: `Bearer ${jwt}` } },
  );
  const token = await github<{ token: string }>(
    `/app/installations/${installation.data.id}/access_tokens`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` },
    },
  );
  return token.data.token;
}

export async function githubGetFile(input: {
  owner: string;
  repo: string;
  path: string;
  ref?: string;
}) {
  const token = await getInstallationToken(input.owner, input.repo);
  const ref = input.ref ? `?ref=${encodeURIComponent(input.ref)}` : "";
  const result = await github<{
    name: string;
    path: string;
    sha: string;
    content?: string;
    encoding?: string;
    type: string;
    html_url?: string;
  }>(
    `/repos/${encodeURIComponent(input.owner)}/${encodeURIComponent(input.repo)}/contents/${input.path
      .split("/")
      .map(encodeURIComponent)
      .join("/")}${ref}`,
    {},
    token,
  );
  const content = result.data.content
    ? Buffer.from(result.data.content.replace(/\n/g, ""), "base64").toString("utf8")
    : undefined;
  return { ...result.data, content };
}

export async function githubWriteFile(input: {
  owner: string;
  repo: string;
  path: string;
  content: string;
  message: string;
  sha?: string;
  branch?: string;
}) {
  const token = await getInstallationToken(input.owner, input.repo);
  const result = await github<{
    content?: { path?: string; sha?: string; html_url?: string };
    commit?: { sha?: string; html_url?: string; message?: string };
  }>(
    `/repos/${encodeURIComponent(input.owner)}/${encodeURIComponent(input.repo)}/contents/${input.path
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message: input.message,
        content: Buffer.from(input.content, "utf8").toString("base64"),
        ...(input.sha ? { sha: input.sha } : {}),
        ...(input.branch ? { branch: input.branch } : {}),
      }),
    },
    token,
  );
  return result.data;
}

export async function githubStatus(owner: string, repo: string) {
  const token = await getInstallationToken(owner, repo);
  const result = await github<{
    full_name: string;
    default_branch: string;
    private: boolean;
    html_url: string;
  }>(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {}, token);
  return result.data;
}
