import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { S as LoaderCircle, c as Sparkles, h as Play } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as usePuter } from "./router-B3oNlHCz.mjs";
import { n as Button, t as AppShell } from "./app-shell-Dg3ARLsY.mjs";
import { t as MarkdownOutput } from "./markdown-output-CCq2E1JJ.mjs";
import { t as useFleet } from "./store-CRSkAEWQ.mjs";
import { n as ModelPicker, r as runFleet, t as LanguagePicker } from "./ai-v9XIMWjP.mjs";
import { t as Textarea } from "./textarea-DkTIpFtF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/runner-CylP2jA8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SAMPLE = `const nums = [3, 1, 4, 1, 5, 9];
console.log("sum", nums.reduce((a, b) => a + b, 0));
console.log("sorted", [...nums].sort((a, b) => a - b));`;
function isJs(lang) {
	return /javascript|typescript|node|\bjs\b|\bts\b|html/i.test(lang);
}
function RunnerPage() {
	const [language, setLanguage] = (0, import_react.useState)("JavaScript");
	const modelId = useFleet((s) => s.modelId);
	const [code, setCode] = (0, import_react.useState)(SAMPLE);
	const [stdout, setStdout] = (0, import_react.useState)("");
	const [stderr, setStderr] = (0, import_react.useState)("");
	const [aiHelp, setAiHelp] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [running, setRunning] = (0, import_react.useState)(false);
	const iframeRef = (0, import_react.useRef)(null);
	const { signedIn, signIn } = usePuter();
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if (!e.data || typeof e.data !== "object") return;
			if (e.data.source !== "fleet-runner") return;
			if (e.data.type === "log" || e.data.type === "done") setStdout(String(e.data.payload || ""));
			if (e.data.type === "err") setStderr(String(e.data.payload || ""));
		};
		window.addEventListener("message", handler);
		return () => window.removeEventListener("message", handler);
	}, []);
	function runLocal() {
		setRunning(true);
		setStdout("");
		setStderr("");
		const iframe = iframeRef.current;
		if (!iframe) return;
		iframe.srcdoc = `<!doctype html><html><body><script>
      const send = (type, payload) => parent.postMessage({ source: 'fleet-runner', type, payload }, '*');
      const log = [];
      console.log = (...a) => {
        log.push(a.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' '));
        send('log', log.join('\\n'));
      };
      console.error = (...a) => send('err', a.join(' '));
      window.onerror = (m) => send('err', String(m));
      try {
        ${code.replace(/<\/script/gi, "<\\\\/script")}
        send('done', log.join('\\n') || '(no output)');
      } catch (e) {
        send('err', e && e.stack ? e.stack : String(e));
      }
    <\/script></body></html>`;
		setTimeout(() => setRunning(false), 900);
	}
	async function run() {
		if (isJs(language)) {
			runLocal();
			return;
		}
		if (!signedIn) try {
			await signIn();
		} catch {
			toast.error("Sign in with Puter to trace non-JS languages.");
			return;
		}
		setRunning(true);
		setStdout("");
		setStderr("");
		try {
			const res = await runFleet({
				mode: "runner",
				prompt: "Execute this program and report stdout, stderr, exit code. Be literal.",
				code,
				language,
				modelId
			});
			if (!res.ok) {
				setStderr(res.error);
				return;
			}
			setStdout(res.text);
		} finally {
			setRunning(false);
		}
	}
	async function askAi() {
		if (!signedIn) try {
			await signIn();
		} catch {
			toast.error("Sign in with Puter first.");
			return;
		}
		setBusy(true);
		try {
			const res = await runFleet({
				mode: "runner",
				prompt: `Help with this ${language} snippet. ${stderr ? "It failed:\n" + stderr : "Optimize or explain the output."}\n\nOutput so far:\n${stdout}`,
				code,
				language,
				modelId
			}, (full) => setAiHelp(full));
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			setAiHelp(res.text);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wider text-subtle",
				children: "Runner"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-2xl font-medium tracking-tight",
				children: "Code runner"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "JavaScript runs in this browser. Other languages are traced by the Puter model you pick."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguagePicker, {
					value: language,
					onChange: setLanguage,
					label: "Language"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted",
						children: "Model"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelPicker, {})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				className: "mt-4 min-h-64 font-mono text-sm",
				value: code,
				onChange: (e) => setCode(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => void run(),
					disabled: running,
					children: [running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Run"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					onClick: () => void askAi(),
					disabled: busy,
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), "Ask Copilot"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				ref: iframeRef,
				title: "sandbox",
				className: "hidden",
				sandbox: "allow-scripts"
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wider text-subtle",
						children: "stdout"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-2 min-h-24 overflow-x-auto font-mono text-sm text-ok whitespace-pre-wrap",
						children: stdout || "—"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wider text-subtle",
						children: "stderr"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-2 min-h-16 overflow-x-auto font-mono text-sm text-danger whitespace-pre-wrap",
						children: stderr || "—"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wider text-subtle",
						children: "Copilot"
					}), aiHelp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownOutput, {
						text: aiHelp,
						className: "mt-2"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-subtle",
						children: "Ask Copilot after a run."
					})]
				})
			]
		})]
	}) });
}
//#endregion
export { RunnerPage as component };
