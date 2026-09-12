import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as createRootRoute, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as Languages, D as FileText, E as GitCompare, F as Bot, I as BookOpen, O as FileCode2, _ as MessageSquare, c as Sparkles, f as ScanSearch, h as Play, i as TriangleAlert, n as Workflow, o as TestTubeDiagonal } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B3oNlHCz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-danger",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-medium",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var TooltipProvider = Provider;
var SCRIPT_SRC = "https://js.puter.com/v2/";
function isBrowser() {
	return typeof window !== "undefined";
}
function getPuter() {
	if (!isBrowser()) return null;
	return window.puter ?? null;
}
function loadPuter() {
	if (!isBrowser()) return Promise.reject(/* @__PURE__ */ new Error("Puter runs in the browser only."));
	if (window.puter) return Promise.resolve(window.puter);
	const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
	if (existing) return new Promise((resolve, reject) => {
		const start = Date.now();
		const tick = () => {
			if (window.puter) return resolve(window.puter);
			if (Date.now() - start > 12e3) return reject(/* @__PURE__ */ new Error("Puter.js loaded but did not initialize."));
			requestAnimationFrame(tick);
		};
		existing.addEventListener("error", () => reject(/* @__PURE__ */ new Error("Failed to load Puter.js.")));
		tick();
	});
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = SCRIPT_SRC;
		script.async = true;
		script.onload = () => {
			const start = Date.now();
			const tick = () => {
				if (window.puter) return resolve(window.puter);
				if (Date.now() - start > 8e3) return reject(/* @__PURE__ */ new Error("Puter.js loaded but did not initialize."));
				requestAnimationFrame(tick);
			};
			tick();
		};
		script.onerror = () => reject(/* @__PURE__ */ new Error("Failed to load Puter.js."));
		document.head.appendChild(script);
	});
}
async function ensurePuter() {
	const current = getPuter();
	if (current) return current;
	return loadPuter();
}
function extractText(value) {
	if (value == null) return "";
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	if (Array.isArray(value)) return value.map(extractText).filter(Boolean).join("");
	if (typeof value === "object") {
		const rec = value;
		if (typeof rec.text === "string") return rec.text;
		if (typeof rec.content === "string") return rec.content;
		if (Array.isArray(rec.content)) return extractText(rec.content);
		if (rec.message) return extractText(rec.message);
		if (Array.isArray(rec.choices)) {
			const first = rec.choices[0];
			if (first?.message) return extractText(first.message);
			if (typeof first?.text === "string") return first.text;
		}
	}
	return "";
}
function friendlyError(err) {
	const raw = err instanceof Error ? err.message : String(err ?? "Unknown error");
	const lower = raw.toLowerCase();
	if (lower.includes("popup") || lower.includes("blocked")) return "Popup blocked. Allow popups for this site, then sign in with Puter.";
	if (lower.includes("auth_window_closed") || lower.includes("closed")) return "Sign-in window closed. Try again — Puter is required for free models.";
	if (lower.includes("not signed") || lower.includes("unauthorized") || lower.includes("auth")) return "Sign in with Puter to use free models.";
	return raw.slice(0, 240);
}
async function signInWithPuter() {
	const puter = await ensurePuter();
	await puter.auth.signIn();
	if (!puter.auth.isSignedIn()) return null;
	try {
		return await puter.auth.getUser();
	} catch {
		return { username: "puter-user" };
	}
}
async function signOutPuter() {
	await (await ensurePuter()).auth.signOut();
}
async function currentPuterUser() {
	try {
		const puter = await ensurePuter();
		if (!puter.auth.isSignedIn()) return null;
		return await puter.auth.getUser();
	} catch {
		return null;
	}
}
async function chatWithPuter(opts) {
	let puter;
	try {
		puter = await ensurePuter();
	} catch (err) {
		return {
			ok: false,
			error: friendlyError(err)
		};
	}
	if (!puter.auth.isSignedIn()) try {
		await puter.auth.signIn();
	} catch (err) {
		return {
			ok: false,
			error: friendlyError(err)
		};
	}
	const payload = opts.messages.map((m) => ({
		role: m.role,
		content: m.content
	}));
	const run = async (stream) => {
		const resp = await puter.ai.chat(payload, {
			model: opts.model,
			stream
		});
		if (stream && resp && typeof resp === "object" && Symbol.asyncIterator in resp) {
			let full = "";
			for await (const part of resp) {
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
		if (!text.trim()) return {
			ok: false,
			error: "Empty response from the model."
		};
		return {
			ok: true,
			text,
			model: opts.model
		};
	} catch (err) {
		try {
			const text = await run(false);
			if (!text.trim()) return {
				ok: false,
				error: friendlyError(err)
			};
			return {
				ok: true,
				text,
				model: opts.model
			};
		} catch (err2) {
			return {
				ok: false,
				error: friendlyError(err2)
			};
		}
	}
}
var PuterContext = (0, import_react.createContext)(null);
function PuterProvider({ children }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [signedIn, setSignedIn] = (0, import_react.useState)(false);
	const [user, setUser] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const refresh = (0, import_react.useCallback)(async () => {
		try {
			const ok = (await ensurePuter()).auth.isSignedIn();
			setSignedIn(ok);
			setUser(ok ? await currentPuterUser() : null);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Puter failed to load.");
			setSignedIn(false);
			setUser(null);
		} finally {
			setReady(true);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	const signIn = (0, import_react.useCallback)(async () => {
		setError(null);
		try {
			const next = await signInWithPuter();
			setSignedIn(Boolean(next) || (await ensurePuter()).auth.isSignedIn());
			setUser(next ?? await currentPuterUser());
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Sign-in failed.";
			setError(msg);
			throw err;
		}
	}, []);
	const signOut = (0, import_react.useCallback)(async () => {
		try {
			await signOutPuter();
		} finally {
			setSignedIn(false);
			setUser(null);
		}
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		ready,
		signedIn,
		user,
		error,
		signIn,
		signOut,
		refresh
	}), [
		ready,
		signedIn,
		user,
		error,
		signIn,
		signOut,
		refresh
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuterContext.Provider, {
		value,
		children
	});
}
function usePuter() {
	const ctx = (0, import_react.useContext)(PuterContext);
	if (!ctx) throw new Error("usePuter must be used within PuterProvider");
	return ctx;
}
var styles_default = "/assets/styles-D9fq3OkX.css";
var APP_NAME = "Copilot Chat";
var MOTTO_TH = "ไม่มีอะไรที่ทำไม่ได้ · ไม่มีสิ่งใดที่แก้ไม่ได้";
var MOTTO_EN = "Nothing is impossible. Nothing can't be fixed.";
var TOOLS = [
	{
		slug: "generator",
		name: "Code Generator",
		short: "Generate",
		blurb: "Clean, runnable code from a plain-language ask.",
		href: "/tools/generator",
		icon: Sparkles,
		kind: "prompt-code",
		cta: "Generate",
		samples: [{
			label: "REST API",
			prompt: "Build a FastAPI service with CRUD for notes, SQLite, pydantic models, and a health endpoint."
		}, {
			label: "CLI tool",
			prompt: "Write a TypeScript CLI that diffs two JSON files and prints a colored tree of added/removed/changed keys."
		}]
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
		samples: [{
			label: "Fix a bug",
			prompt: "This function drops the last item when the list has odd length. Fix it and explain why.",
			code: "def pairwise(xs):\n    out = []\n    for i in range(0, len(xs) - 1, 2):\n        out.append((xs[i], xs[i+1]))\n    return out"
		}]
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
		samples: [{
			label: "Python → Go",
			prompt: "Convert this to idiomatic Go.",
			code: "from collections import Counter\n\ndef top_k(words, k):\n    counts = Counter(w.lower() for w in words)\n    return [w for w, _ in counts.most_common(k)]"
		}]
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
		samples: [{
			label: "Regex",
			prompt: "Explain this like I'm a mid-level engineer. Call out pitfalls.",
			code: "^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$"
		}]
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
		samples: [{
			label: "Refactor",
			prompt: "Suggest concrete refactors ranked by impact. Show before/after for the top 3.",
			code: "function get(users, id){\n  for(var i=0;i<users.length;i++){\n    if(users[i].id==id){return users[i]}\n  }\n  return null\n}"
		}]
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
		samples: [{
			label: "README",
			prompt: "Write a README plus module-level docs for this library.",
			code: "export function retry<T>(fn: () => Promise<T>, attempts = 3, ms = 250) {\n  return fn().catch((err) => {\n    if (attempts <= 1) throw err;\n    return new Promise((r) => setTimeout(r, ms)).then(() => retry(fn, attempts - 1, ms * 2));\n  });\n}"
		}]
	},
	{
		slug: "tests",
		name: "Unit Tests",
		short: "Tests",
		blurb: "Real tests with edge cases — not snapshot theatre.",
		href: "/tools/tests",
		icon: TestTubeDiagonal,
		kind: "prompt-code",
		cta: "Generate tests",
		samples: [{
			label: "Edge cases",
			prompt: "Write vitest tests covering happy path, empty input, unicode, and overflow.",
			code: "export function slugify(s: string) {\n  return s.normalize('NFKD').replace(/[^\\w\\s-]/g, '').trim().replace(/[\\s_-]+/g, '-').toLowerCase();\n}"
		}]
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
		samples: [{
			label: "Auth flow",
			prompt: "Sequence diagram of OAuth authorization-code flow with PKCE, including the token refresh path."
		}]
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
		samples: [{
			label: "State machine",
			prompt: "Implement this as a TypeScript state machine with exhaustive switches.",
			code: "stateDiagram-v2\n  [*] --> idle\n  idle --> loading: fetch\n  loading --> success: ok\n  loading --> error: fail\n  error --> idle: retry\n  success --> idle: reset"
		}]
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
		samples: [{
			label: "Security pass",
			prompt: "Review for correctness, security, and maintainability. Severity on each finding.",
			code: "app.get('/user', (req, res) => {\n  const q = `SELECT * FROM users WHERE id = '${req.query.id}'`;\n  db.query(q, (err, rows) => res.json(rows));\n});"
		}]
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
		samples: [{
			label: "FizzBuzz",
			prompt: "",
			code: "for (let i = 1; i <= 30; i++) {\n  const f = i % 3 === 0 ? 'Fizz' : '';\n  const b = i % 5 === 0 ? 'Buzz' : '';\n  console.log((f + b) || i);\n}"
		}]
	}
];
var CHAT_NAV = {
	slug: "chat",
	name: "AI Chat",
	blurb: "Chat with free models via Puter — memory, tools, parallel agents.",
	href: "/chat",
	icon: Bot
};
var LANGUAGE_GROUPS = [
	{
		name: "Languages",
		items: [
			"Python",
			"JavaScript",
			"TypeScript",
			"Go",
			"Rust",
			"Java",
			"C",
			"C++",
			"C#",
			"Kotlin",
			"Swift",
			"Ruby",
			"PHP",
			"R",
			"Scala",
			"Haskell",
			"Elixir",
			"Dart",
			"Lua",
			"Bash",
			"SQL",
			"HTML/CSS/JS",
			"Solidity",
			"Zig",
			"Julia",
			"Assembly"
		]
	},
	{
		name: "Databases",
		items: [
			"PostgreSQL",
			"MySQL",
			"SQLite",
			"MongoDB",
			"Redis"
		]
	},
	{
		name: "Web",
		items: [
			"React",
			"VueJS",
			"Angular",
			"Django",
			"Flask",
			"FastAPI",
			"Express.js",
			"Next.js",
			"Rails",
			"Spring"
		]
	}
];
LANGUAGE_GROUPS.flatMap((g) => g.items);
var MODELS = [
	{
		id: "gpt-5.6-luna",
		name: "GPT-5.6 Luna",
		provider: "OpenAI",
		tier: "fast",
		context: "200K",
		coding: 84,
		speed: "fast"
	},
	{
		id: "gpt-5.6-terra",
		name: "GPT-5.6 Terra",
		provider: "OpenAI",
		tier: "coding",
		context: "400K",
		coding: 90,
		speed: "medium"
	},
	{
		id: "gpt-5.3-codex",
		name: "GPT-5.3 Codex",
		provider: "OpenAI",
		tier: "coding",
		context: "200K",
		coding: 93,
		speed: "medium"
	},
	{
		id: "gpt-5-nano",
		name: "GPT-5 Nano",
		provider: "OpenAI",
		tier: "fast",
		context: "128K",
		coding: 72,
		speed: "fast"
	},
	{
		id: "claude-sonnet-5",
		name: "Claude Sonnet 5",
		provider: "Anthropic",
		tier: "coding",
		context: "200K",
		coding: 91,
		speed: "medium"
	},
	{
		id: "claude-haiku-4-5",
		name: "Claude Haiku 4.5",
		provider: "Anthropic",
		tier: "fast",
		context: "200K",
		coding: 80,
		speed: "fast"
	},
	{
		id: "claude-opus-5",
		name: "Claude Opus 5",
		provider: "Anthropic",
		tier: "deep",
		context: "200K",
		coding: 94,
		speed: "deep"
	},
	{
		id: "gemini-3.1-flash-lite",
		name: "Gemini 3.1 Flash Lite",
		provider: "Google",
		tier: "fast",
		context: "1M",
		coding: 78,
		speed: "fast"
	},
	{
		id: "qwen/qwen3.8-flash",
		name: "Qwen 3.8 Flash",
		provider: "Qwen",
		tier: "fast",
		context: "128K",
		coding: 80,
		speed: "fast"
	},
	{
		id: "qwen/qwen3.8-max",
		name: "Qwen 3.8 Max",
		provider: "Qwen",
		tier: "coding",
		context: "256K",
		coding: 87,
		speed: "medium"
	},
	{
		id: "qwen/qwen3-coder-plus",
		name: "Qwen 3 Coder Plus",
		provider: "Qwen",
		tier: "coding",
		context: "128K",
		coding: 89,
		speed: "medium"
	},
	{
		id: "deepseek/deepseek-v4.1-flash",
		name: "DeepSeek V4.1 Flash",
		provider: "DeepSeek",
		tier: "fast",
		context: "128K",
		coding: 86,
		speed: "fast"
	},
	{
		id: "deepseek/deepseek-v4-pro",
		name: "DeepSeek V4 Pro",
		provider: "DeepSeek",
		tier: "coding",
		context: "128K",
		coding: 89,
		speed: "medium"
	}
];
var DEFAULT_MODEL_ID = "gpt-5.6-luna";
var AGENTS = [
	{
		id: "orchestrator",
		handle: "orchestrator",
		name: "Orchestrator",
		role: "Scopes work, delegates, synthesizes one answer.",
		posture: "full-auto",
		instructions: "Frame bounded sub-tasks. Never dump the whole job on one agent."
	},
	{
		id: "implementer",
		handle: "shipper",
		name: "Shipper",
		role: "Smallest durable change. Tests and a clean handoff.",
		posture: "allow-edits",
		instructions: "Make the smallest durable change. Leave tests and a clean handoff behind."
	},
	{
		id: "reviewer",
		handle: "reviewer",
		name: "Reviewer",
		role: "Correctness, style, missing edge cases.",
		posture: "read-only",
		instructions: "Hunt for gaps, risky assumptions, and missing edge cases."
	},
	{
		id: "security",
		handle: "security",
		name: "Security",
		role: "Threat-model before a single file is changed.",
		posture: "read-only",
		instructions: "Flag weak boundaries, injection, auth gaps, secret leakage."
	},
	{
		id: "tester",
		handle: "tester",
		name: "Tester",
		role: "Coverage, fixtures, failure modes.",
		posture: "allow-edits",
		instructions: "Write tests that would have caught the bug. No snapshot theatre."
	},
	{
		id: "architect",
		handle: "architect",
		name: "Architect",
		role: "Boundaries, data flow, what not to build.",
		posture: "read-only",
		instructions: "Propose the thinnest architecture that survives the next three features."
	},
	{
		id: "docs",
		handle: "scribe",
		name: "Scribe",
		role: "Docs that a stranger can run in five minutes.",
		posture: "allow-edits",
		instructions: "Document the contract, not the implementation gossip."
	},
	{
		id: "advocate",
		handle: "devils-advocate",
		name: "Devil's advocate",
		role: "Challenge the plan before anyone writes code.",
		posture: "read-only",
		instructions: "Challenge every plan. Hunt for gaps and unspoken assumptions."
	}
];
var MCP_SERVERS = [
	{
		id: "context7",
		name: "Context7",
		category: "Docs",
		blurb: "Up-to-date library docs by version."
	},
	{
		id: "deepwiki",
		name: "DeepWiki",
		category: "Docs",
		blurb: "Repo wikis turned into queryable context."
	},
	{
		id: "github",
		name: "GitHub",
		category: "Source",
		blurb: "Issues, PRs, contents, checks."
	},
	{
		id: "supabase",
		name: "Supabase",
		category: "Data",
		blurb: "Postgres, auth, storage, edge functions."
	},
	{
		id: "aws",
		name: "AWS Knowledge",
		category: "Cloud",
		blurb: "Service docs, IAM patterns, quotas."
	},
	{
		id: "sentry",
		name: "Sentry",
		category: "Observability",
		blurb: "Issues, stack traces, release health."
	},
	{
		id: "stripe",
		name: "Stripe",
		category: "Payments",
		blurb: "API, webhooks, billing objects."
	},
	{
		id: "huggingface",
		name: "Hugging Face",
		category: "ML",
		blurb: "Models, datasets, inference."
	}
];
var DOCS = [
	{
		slug: "about",
		title: "About Copilot Chat",
		section: "Start",
		body: ["Copilot Chat is a coding workspace that runs on Puter. You sign in once. After that, chat, generate, convert, review, and run code against free models — GPT, Claude, Gemini, Qwen, DeepSeek — with no API keys of your own.", "ไม่มีอะไรที่ทำไม่ได้ · ไม่มีสิ่งใดที่แก้ไม่ได้ Nothing is impossible. Nothing can't be fixed."]
	},
	{
		slug: "puter",
		title: "Puter login & free models",
		section: "Start",
		body: ["Puter uses a user-pays model: you sign in with a Puter account (or a temporary one) and Puter covers the model call against your Puter usage. This app never sees an API key.", "The first AI action may open a Puter popup. Allow popups for this site. If the window is blocked, use Sign in with Puter in the header and try again."]
	},
	{
		slug: "models",
		title: "Choosing a model",
		section: "Start",
		body: ["Luna, Haiku, Flash, and Nano are for short transforms. Sonnet, Terra, Codex, Qwen Coder, and DeepSeek Pro are for refactors. Opus is for hard reasoning.", "Every model in the picker is called through Puter with the real model id. If a vendor is down, switch models — nothing here is mocked."]
	},
	{
		slug: "code-execution",
		title: "Code execution",
		section: "Platform",
		body: ["The runner executes JavaScript and TypeScript in a sandboxed iframe in this browser. Other languages are traced by the selected model so you still get stdout, stderr, and a verdict."]
	},
	{
		slug: "parallel-agents",
		title: "Parallel agents",
		section: "Platform",
		body: ["Give one task to the orchestrator. It frames bounded sub-tasks for @shipper, @reviewer, @security, @tester and the rest, then synthesizes one answer back into your thread."]
	},
	{
		slug: "privacy",
		title: "Privacy",
		section: "Trust",
		body: ["Threads, generations, sandboxes, and memory live in this browser (localStorage). Prompts go to Puter so the selected model can answer. This app does not keep a server-side copy of your code."]
	}
];
var ROUTINE_TEMPLATES = [
	{
		id: "standup",
		name: "Morning standup",
		cadence: "Weekdays 09:00",
		prompt: "Summarize open PRs, failing checks, and yesterday's chat memory into an 8-line standup."
	},
	{
		id: "tests",
		name: "Nightly tests",
		cadence: "Daily 02:00",
		prompt: "Generate missing unit tests for files touched in the last 24 hours and open a review."
	},
	{
		id: "deps",
		name: "Dependency audit",
		cadence: "Mondays 08:00",
		prompt: "Scan lockfiles for CVEs and stale majors. Rank by blast radius."
	},
	{
		id: "review",
		name: "PR review sweep",
		cadence: "Every 4 hours",
		prompt: "Review open pull requests. Flag security and missing tests first."
	}
];
var STATS = {
	models: 500,
	tools: TOOLS.length,
	agents: AGENTS.length
};
function toolBySlug(slug) {
	return TOOLS.find((t) => t.slug === slug);
}
function modelById(id) {
	return MODELS.find((m) => m.id === id) ?? MODELS[0];
}
var SYSTEM_PROMPTS = {
	generator: "You are Copilot Chat Code Generator. Write production-quality code. Prefer complete, runnable files. Explain briefly after the code. Use markdown with fenced blocks labeled by language.",
	assistant: "You are Copilot Chat Code Assistant. Fix, improve, or extend the user's code. Show the patched code, then a short rationale. Do not rewrite unrelated parts.",
	converter: "You are Copilot Chat Code Converter. Translate code between languages/frameworks. Preserve behavior. Idiomatic target language. Note semantic mismatches.",
	explainer: "You are Copilot Chat Code Explainer. Explain clearly. Structure: what it does, how, pitfalls, a tiny example. Match the requested verbosity.",
	enhancer: "You are Copilot Chat Code Enhancer. Return ranked suggestions (High/Med/Low) with before/after snippets. Then an optional fully enhanced file.",
	documentation: "You are Copilot Chat Documentation Generator. Produce README, API docs, and docstrings. Accurate to the given code. No fluff.",
	tests: "You are Copilot Chat Unit Test Generator. Write real tests (vitest/pytest/go test as appropriate) covering edge cases. Include setup.",
	diagram: "You are Copilot Chat Diagram Generator. Output a mermaid diagram in a ```mermaid fence, then a short legend. Prefer flowchart, sequence, class, or erDiagram as fits the ask.",
	"diagram-to-code": "You are Copilot Chat Diagram-to-Code. Implement the diagram as working code in the requested language. Keep names from the diagram.",
	reviewer: "You are Copilot Chat Code Reviewer. Findings first, each with severity (blocker/major/minor/nit), location, why, and a patch. End with a verdict.",
	chat: "You are Copilot Chat, a coding copilot. Motto: nothing is impossible, nothing can't be fixed. Be direct. Prefer code fences. If tools or agents are enabled, reason with them conceptually and still give a usable answer.",
	agents: "You are the Copilot Chat orchestrator. For the user's task, produce work from these agents in this order, each under a heading `## @handle — Name`:\n@architect, @security, @shipper, @tester, @reviewer, @scribe, @devils-advocate.\nThen a final `## Synthesis` that the human can act on. Keep each agent section tight. Code in fences.",
	runner: "You are Copilot Chat Code Runner copilot. The user ran or asked about code. Diagnose, suggest a fix, or optimize. Show a corrected snippet if needed."
};
var Route$13 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: `${MOTTO_EN} Coding copilot with Puter login and 500+ free models.`
			},
			{
				name: "theme-color",
				content: "#0b0c0e"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;500;600&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuterProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, {
					delayDuration: 200,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
						theme: "dark",
						position: "bottom-right",
						toastOptions: { style: {
							background: "#1c2026",
							border: "1px solid #262b32",
							color: "#eceef2"
						} }
					})]
				}) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$12 = () => import("./routes-Dhxb4oWZ.mjs");
var Route$12 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./agents-36X_WD0s.mjs");
var Route$11 = createFileRoute("/agents")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./chat-DvRgq4dm.mjs");
var Route$10 = createFileRoute("/chat")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./contact-BxbLDIEf.mjs");
var Route$9 = createFileRoute("/contact")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./docs-C3zhw4mm.mjs");
var Route$8 = createFileRoute("/docs")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./history-4oQMI84m.mjs");
var Route$7 = createFileRoute("/history")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./models-D9funye0.mjs");
var Route$6 = createFileRoute("/models")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./pricing-BKJp07XH.mjs");
var Route$5 = createFileRoute("/pricing")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./routines-BLQNBW74.mjs");
var Route$4 = createFileRoute("/routines")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./runner-CylP2jA8.mjs");
var Route$3 = createFileRoute("/runner")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./sandbox-BxyBM6YC.mjs");
var Route$2 = createFileRoute("/sandbox")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./docs._slug-DXmbTnNl.mjs");
var Route$1 = createFileRoute("/docs/$slug")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./tools._slug-CRTNRnWo.mjs");
var Route = createFileRoute("/tools/$slug")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$12.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$13
});
var AgentsRoute = Route$11.update({
	id: "/agents",
	path: "/agents",
	getParentRoute: () => Route$13
});
var ChatRoute = Route$10.update({
	id: "/chat",
	path: "/chat",
	getParentRoute: () => Route$13
});
var ContactRoute = Route$9.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$13
});
var DocsRoute = Route$8.update({
	id: "/docs",
	path: "/docs",
	getParentRoute: () => Route$13
});
var HistoryRoute = Route$7.update({
	id: "/history",
	path: "/history",
	getParentRoute: () => Route$13
});
var ModelsRoute = Route$6.update({
	id: "/models",
	path: "/models",
	getParentRoute: () => Route$13
});
var PricingRoute = Route$5.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => Route$13
});
var RoutinesRoute = Route$4.update({
	id: "/routines",
	path: "/routines",
	getParentRoute: () => Route$13
});
var RunnerRoute = Route$3.update({
	id: "/runner",
	path: "/runner",
	getParentRoute: () => Route$13
});
var SandboxRoute = Route$2.update({
	id: "/sandbox",
	path: "/sandbox",
	getParentRoute: () => Route$13
});
var DocsSlugRoute = Route$1.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => DocsRoute
});
var ToolsSlugRoute = Route.update({
	id: "/tools/$slug",
	path: "/tools/$slug",
	getParentRoute: () => Route$13
});
var DocsRouteChildren = { DocsSlugRoute };
var rootRouteChildren = {
	IndexRoute,
	AgentsRoute,
	ChatRoute,
	ContactRoute,
	DocsRoute: DocsRoute._addFileChildren(DocsRouteChildren),
	HistoryRoute,
	ModelsRoute,
	PricingRoute,
	RoutinesRoute,
	RunnerRoute,
	SandboxRoute,
	ToolsSlugRoute
};
var routeTree = Route$13._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { TOOLS as _, APP_NAME as a, usePuter as b, DOCS as c, MODELS as d, MOTTO_EN as f, SYSTEM_PROMPTS as g, STATS as h, AGENTS as i, LANGUAGE_GROUPS as l, ROUTINE_TEMPLATES as m, Route as n, CHAT_NAV as o, MOTTO_TH as p, Route$1 as r, DEFAULT_MODEL_ID as s, router_exports as t, MCP_SERVERS as u, modelById as v, chatWithPuter as x, toolBySlug as y };
