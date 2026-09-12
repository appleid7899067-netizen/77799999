import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { S as LoaderCircle, h as Play } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as usePuter, i as AGENTS } from "./router-B3oNlHCz.mjs";
import { n as Button, t as AppShell } from "./app-shell-Dg3ARLsY.mjs";
import { t as MarkdownOutput } from "./markdown-output-CCq2E1JJ.mjs";
import { t as useFleet } from "./store-CRSkAEWQ.mjs";
import { t as Badge } from "./badge-PAONx8b0.mjs";
import { n as ModelPicker, r as runFleet } from "./ai-v9XIMWjP.mjs";
import { t as Textarea } from "./textarea-DkTIpFtF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agents-36X_WD0s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AgentsPage() {
	const [task, setTask] = (0, import_react.useState)("Design and implement a token-bucket rate limiter for a Node API. Cover concurrency, Redis vs in-memory, and tests.");
	const [selected, setSelected] = (0, import_react.useState)(AGENTS.filter((a) => a.id !== "orchestrator").map((a) => a.id));
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [phase, setPhase] = (0, import_react.useState)([]);
	const [output, setOutput] = (0, import_react.useState)("");
	const addGeneration = useFleet((s) => s.addGeneration);
	const modelId = useFleet((s) => s.modelId);
	const { signedIn, signIn } = usePuter();
	function toggle(id) {
		setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
	}
	async function run() {
		if (!signedIn) try {
			await signIn();
		} catch {
			toast.error("Sign in with Puter first. Allow popups if blocked.");
			return;
		}
		setBusy(true);
		setOutput("");
		const crew = AGENTS.filter((a) => selected.includes(a.id) || a.id === "orchestrator");
		setPhase(["Orchestrator scoping the work"]);
		for (const a of crew.slice(1)) {
			await new Promise((r) => setTimeout(r, 180));
			setPhase((p) => [...p, `@${a.handle} ${a.posture === "read-only" ? "reading" : "running"}`]);
		}
		try {
			const extras = `Enabled agents: ${crew.map((a) => `@${a.handle} (${a.posture}) — ${a.instructions}`).join("\n")}`;
			const res = await runFleet({
				mode: "agents",
				prompt: task,
				extras,
				modelId
			}, (full) => setOutput(full));
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			setOutput(res.text);
			addGeneration({
				tool: "agents",
				title: task.slice(0, 72),
				prompt: task,
				output: res.text,
				language: "multi",
				model: res.model
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Agents failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wider text-subtle",
				children: "Agents"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-3xl font-medium tracking-tight",
				children: "Parallel agents"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted",
				children: "One task. A crew. One synthesis. Powered by the Puter model you pick."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-muted",
							children: "Model"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelPicker, {})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-2",
						children: AGENTS.map((a) => {
							const on = a.id === "orchestrator" || selected.includes(a.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-start gap-3 rounded-lg bg-surface px-3 py-3 shadow-[var(--shadow-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									className: "mt-1",
									checked: on,
									disabled: a.id === "orchestrator",
									onChange: () => toggle(a.id)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex flex-wrap items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-xs text-primary",
												children: ["@", a.handle]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: a.posture })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-1 block text-sm font-medium",
											children: a.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-xs text-muted",
											children: a.role
										})
									]
								})]
							}, a.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-4 min-h-28",
						value: task,
						onChange: (e) => setTask(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-3",
						onClick: () => void run(),
						disabled: busy || !task.trim(),
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), busy ? "Running" : "Run crew"]
					}),
					phase.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-1 text-xs text-muted",
						children: phase.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "font-mono",
							children: p
						}, p))
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-80 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
					children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fleet-shimmer mb-3 h-1 rounded-full" }), output ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownOutput, { text: output }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-subtle",
						children: "Synthesis lands here."
					})]
				})]
			})
		]
	}) });
}
//#endregion
export { AgentsPage as component };
