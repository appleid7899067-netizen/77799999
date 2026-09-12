import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as usePuter, p as MOTTO_TH } from "./router-B3oNlHCz.mjs";
import { n as Button, t as AppShell } from "./app-shell-Dg3ARLsY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pricing-BKJp07XH.js
var import_jsx_runtime = require_jsx_runtime();
function PricingPage() {
	const { signedIn, signIn } = usePuter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		marketing: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-4 py-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wider text-subtle",
					children: "Free"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-3xl font-medium tracking-tight",
					children: "No credits. Sign in with Puter."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "Copilot Chat uses Puter’s user-pays model. You log in. Puter routes GPT, Claude, Gemini, Qwen, and DeepSeek. This app never holds an API key and never sells seats."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-primary",
					children: MOTTO_TH
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-8 space-y-3 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
							children: "Sign in with Puter — a popup. Temporary accounts work."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
							children: "Every model in the picker is free at the app layer. Usage counts against your Puter account."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
							children: "Threads stay in this browser. Nothing is billed by Copilot Chat."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap gap-3",
					children: [signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/chat",
							children: "Open chat"
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							signIn().catch((err) => {
								toast.error(err instanceof Error ? err.message : "Allow popups, then retry.");
							});
						},
						children: "Sign in with Puter"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/docs/$slug",
							params: { slug: "puter" },
							children: "How Puter works"
						})
					})]
				})
			]
		})
	});
}
//#endregion
export { PricingPage as component };
