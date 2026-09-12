import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as DOCS, r as Route$1 } from "./router-B3oNlHCz.mjs";
import { n as Button, t as AppShell } from "./app-shell-Dg3ARLsY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/docs._slug-DXmbTnNl.js
var import_jsx_runtime = require_jsx_runtime();
function DocPage() {
	const { slug } = Route$1.useParams();
	const doc = DOCS.find((d) => d.slug === slug);
	if (!doc) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		marketing: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg px-4 py-20 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-medium",
				children: "Missing article"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/docs",
					children: "All docs"
				})
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		marketing: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "mx-auto max-w-2xl px-4 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wider text-subtle",
					children: doc.section
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-3xl font-medium tracking-tight",
					children: doc.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-4 text-sm leading-relaxed text-muted",
					children: doc.body.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p.slice(0, 48)))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-10",
					variant: "secondary",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/docs",
						children: "All docs"
					})
				})
			]
		})
	});
}
//#endregion
export { DocPage as component };
