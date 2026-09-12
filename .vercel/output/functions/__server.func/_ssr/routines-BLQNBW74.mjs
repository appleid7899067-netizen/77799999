import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as Play, m as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { m as ROUTINE_TEMPLATES } from "./router-B3oNlHCz.mjs";
import { n as Button, t as AppShell } from "./app-shell-Dg3ARLsY.mjs";
import { t as useFleet } from "./store-CRSkAEWQ.mjs";
import { t as Badge } from "./badge-PAONx8b0.mjs";
import { t as Textarea } from "./textarea-DkTIpFtF.mjs";
import { t as Switch } from "./switch-DAJQXp65.mjs";
import { t as Input } from "./input-DdxVCHn4.mjs";
import { t as Label } from "./label-PCWeFTF3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routines-BLQNBW74.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RoutinesPage() {
	const routines = useFleet((s) => s.routines);
	const addRoutine = useFleet((s) => s.addRoutine);
	const toggleRoutine = useFleet((s) => s.toggleRoutine);
	const markRoutineRun = useFleet((s) => s.markRoutineRun);
	const [name, setName] = (0, import_react.useState)("");
	const [cadence, setCadence] = (0, import_react.useState)("Daily 09:00");
	const [prompt, setPrompt] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wider text-subtle",
				children: "Automation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-3xl font-medium tracking-tight",
				children: "Routines"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted",
				children: "Saved prompts on a cadence. Run now from this browser."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: ROUTINE_TEMPLATES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-full bg-elevated px-3 py-1 text-xs text-muted shadow-[var(--shadow-border)] hover:text-fg",
					onClick: () => {
						setName(t.name);
						setCadence(t.cadence);
						setPrompt(t.prompt);
					},
					children: t.name
				}, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-5 grid gap-3 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
				onSubmit: (e) => {
					e.preventDefault();
					if (!name.trim() || !prompt.trim()) return;
					addRoutine({
						name,
						cadence,
						prompt,
						enabled: true
					});
					toast.success("Routine saved.");
					setName("");
					setPrompt("");
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "rt-name",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "rt-name",
								value: name,
								onChange: (e) => setName(e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "rt-cad",
								children: "Cadence"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "rt-cad",
								value: cadence,
								onChange: (e) => setCadence(e.target.value)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "rt-p",
							children: "Prompt"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "rt-p",
							value: prompt,
							onChange: (e) => setPrompt(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						className: "w-fit",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Save routine"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-2",
				children: routines.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-3 rounded-xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: r.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-subtle",
									children: [r.cadence, r.lastRun ? ` · last ${new Date(r.lastRun).toLocaleString()}` : ""]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: r.prompt
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: r.enabled ? "ok" : "default",
							children: r.enabled ? "on" : "off"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: r.enabled,
							onCheckedChange: () => toggleRoutine(r.id)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => {
								markRoutineRun(r.id);
								toast.success("Marked as run.");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), " Run"]
						})
					]
				}, r.id))
			})
		]
	}) });
}
//#endregion
export { RoutinesPage as component };
