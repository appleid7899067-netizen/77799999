import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as DOCS } from "./router-B3oNlHCz.mjs";
import { t as AppShell } from "./app-shell-Dg3ARLsY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/docs-C3zhw4mm.js
var import_jsx_runtime = require_jsx_runtime();
function DocsIndex() {
	const sections = [...new Set(DOCS.map((d) => d.section))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		marketing: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wider text-subtle",
					children: "Documentation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-3xl font-medium tracking-tight",
					children: "How Copilot Chat works"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-2xl text-sm text-muted",
					children: "Start with About, then Puter login, then models."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-8 sm:grid-cols-2",
					children: sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-wider text-subtle",
						children: section
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2",
						children: DOCS.filter((d) => d.section === section).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/docs/$slug",
							params: { slug: d.slug },
							className: "text-sm text-fg hover:text-primary",
							children: d.title
						}) }, d.slug))
					})] }, section))
				})
			]
		})
	});
}
//#endregion
export { DocsIndex as component };
