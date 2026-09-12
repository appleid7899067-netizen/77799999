import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { M as Check, k as Copy } from "../_libs/lucide-react.mjs";
import { i as cn, n as Button } from "./app-shell-Dg3ARLsY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/markdown-output-CCq2E1JJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function parseMarkdown(src) {
	const lines = src.replace(/\r\n/g, "\n").split("\n");
	const out = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (line.startsWith("```")) {
			const lang = line.slice(3).trim();
			const buf = [];
			i += 1;
			while (i < lines.length && !lines[i].startsWith("```")) {
				buf.push(lines[i]);
				i += 1;
			}
			out.push({
				type: "code",
				lang,
				content: buf.join("\n")
			});
			i += 1;
			continue;
		}
		if (/^###\s/.test(line)) {
			out.push({
				type: "h",
				level: 3,
				content: line.replace(/^###\s+/, "")
			});
			i += 1;
			continue;
		}
		if (/^##\s/.test(line)) {
			out.push({
				type: "h",
				level: 2,
				content: line.replace(/^##\s+/, "")
			});
			i += 1;
			continue;
		}
		if (/^#\s/.test(line)) {
			out.push({
				type: "h",
				level: 1,
				content: line.replace(/^#\s+/, "")
			});
			i += 1;
			continue;
		}
		if (/^[-*]\s/.test(line)) {
			out.push({
				type: "li",
				content: line.replace(/^[-*]\s+/, "")
			});
			i += 1;
			continue;
		}
		if (/^\d+\.\s/.test(line)) {
			out.push({
				type: "li",
				ordered: true,
				content: line.replace(/^\d+\.\s+/, "")
			});
			i += 1;
			continue;
		}
		if (line.startsWith("> ")) {
			out.push({
				type: "quote",
				content: line.slice(2)
			});
			i += 1;
			continue;
		}
		if (line.trim() === "") {
			i += 1;
			continue;
		}
		out.push({
			type: "p",
			content: line
		});
		i += 1;
	}
	return out;
}
function Inline({ text }) {
	const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: parts.map((p, i) => {
		if (p.startsWith("`") && p.endsWith("`")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "rounded-xs bg-elevated px-1 py-0.5 font-mono text-[0.85em] text-primary",
			children: p.slice(1, -1)
		}, i);
		if (p.startsWith("**") && p.endsWith("**")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-medium text-fg",
			children: p.slice(2, -2)
		}, i);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p }, i);
	}) });
}
function CodeBlock({ lang, content }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const isMermaid = lang.toLowerCase() === "mermaid";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative my-3 overflow-hidden rounded-lg bg-bg shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border px-3 py-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[11px] uppercase tracking-wider text-subtle",
				children: lang || "code"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon-sm",
				"aria-label": "Copy code",
				onClick: async () => {
					await navigator.clipboard.writeText(content);
					setCopied(true);
					setTimeout(() => setCopied(false), 1200);
				},
				children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-ok" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" })
			})]
		}), isMermaid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MermaidBlock, { source: content }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "overflow-x-auto p-3 font-mono text-[13px] leading-relaxed text-fg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: content })
		})]
	});
}
function MermaidBlock({ source }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-md bg-elevated p-4 font-mono text-[12px] leading-relaxed text-primary whitespace-pre-wrap",
			children: source
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] text-subtle",
			children: "Mermaid source — paste into any renderer, or keep it in the repo."
		})]
	});
}
function MarkdownOutput({ text, className }) {
	const blocks = (0, import_react.useMemo)(() => parseMarkdown(text), [text]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("text-sm leading-relaxed text-fg", className),
		children: blocks.map((b, i) => {
			if (b.type === "code") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
				lang: b.lang,
				content: b.content
			}, i);
			if (b.type === "h") {
				const cls = b.level === 1 ? "mt-5 mb-2 text-lg font-medium tracking-tight" : b.level === 2 ? "mt-4 mb-1.5 text-base font-medium tracking-tight" : "mt-3 mb-1 text-sm font-medium";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cls,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inline, { text: b.content })
				}, i);
			}
			if (b.type === "li") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 py-0.5 text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 size-1 shrink-0 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inline, { text: b.content }) })]
			}, i);
			if (b.type === "quote") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
				className: "my-2 border-l-2 border-primary/50 pl-3 text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inline, { text: b.content })
			}, i);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "my-1.5 text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inline, { text: b.content })
			}, i);
		})
	});
}
function extractFirstCode(text) {
	const m = text.match(/```([\w+-]*)\n([\s\S]*?)```/);
	if (!m) return null;
	return {
		lang: m[1] || "txt",
		content: m[2].trim()
	};
}
//#endregion
export { extractFirstCode as n, MarkdownOutput as t };
