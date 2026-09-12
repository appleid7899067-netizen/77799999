import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./app-shell-Dg3ARLsY.mjs";
import { t as MarkdownOutput } from "./markdown-output-CCq2E1JJ.mjs";
import { t as useFleet } from "./store-CRSkAEWQ.mjs";
import { t as Badge } from "./badge-PAONx8b0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history-4oQMI84m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HistoryPage() {
	const generations = useFleet((s) => s.generations);
	const [open, setOpen] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wider text-subtle",
				children: "Activity"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-3xl font-medium tracking-tight",
				children: "History"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Stored in this browser only."
			}),
			generations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-10 text-sm text-subtle",
				children: [
					"Nothing yet.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tools/$slug",
						params: { slug: "generator" },
						className: "text-primary",
						children: "Generate something"
					}),
					"."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-2",
				children: generations.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-surface shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex w-full items-start justify-between gap-3 px-4 py-3 text-left",
						onClick: () => setOpen(open === g.id ? null : g.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-medium",
							children: g.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-xs text-subtle",
							children: [
								g.tool,
								" · ",
								g.language,
								" · ",
								g.model,
								" · ",
								new Date(g.createdAt).toLocaleString()
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "ok",
							children: "Free"
						})]
					}), open === g.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-xs text-subtle",
							children: g.prompt
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownOutput, { text: g.output })]
					}) : null]
				}, g.id))
			})
		]
	}) });
}
//#endregion
export { HistoryPage as component };
