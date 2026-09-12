import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { M as Check, j as ChevronDown } from "../_libs/lucide-react.mjs";
import { a as SelectItem$1, c as SelectLabel$1, d as SelectValue$1, f as SelectViewport, i as SelectIcon, l as SelectPortal, n as SelectContent$1, o as SelectItemIndicator, r as SelectGroup$1, s as SelectItemText, t as Select$1, u as SelectTrigger$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
import { d as MODELS, g as SYSTEM_PROMPTS, l as LANGUAGE_GROUPS, x as chatWithPuter } from "./router-B3oNlHCz.mjs";
import { i as cn } from "./app-shell-Dg3ARLsY.mjs";
import { t as useFleet } from "./store-CRSkAEWQ.mjs";
import { t as Badge } from "./badge-PAONx8b0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-v9XIMWjP.js
var import_jsx_runtime = require_jsx_runtime();
var Select = Select$1;
var SelectValue = SelectValue$1;
function SelectTrigger({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
		className: cn("flex h-10 w-full items-center justify-between gap-2 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 data-[placeholder]:text-subtle [&>span]:line-clamp-1", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted" })
		})]
	});
}
function SelectContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent$1, {
		className: cn("z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-pop),var(--shadow-border)]", className),
		position: "popper",
		sideOffset: 6,
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: "p-1.5",
			children
		})
	}) });
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
		className: cn("relative flex cursor-pointer items-center rounded-md py-2 pr-8 pl-2.5 text-sm outline-none data-[highlighted]:bg-elevated", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, {
			className: "absolute right-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-primary" })
		})]
	});
}
function SelectGroup({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectGroup$1, {
		className: cn(className),
		...props
	});
}
function SelectLabel({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
		className: cn("px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-subtle", className),
		...props
	});
}
function ModelPicker({ value, onChange, compact }) {
	const storeId = useFleet((s) => s.modelId);
	const setModel = useFleet((s) => s.setModel);
	const id = value ?? storeId;
	const set = onChange ?? setModel;
	const model = MODELS.find((m) => m.id === id) ?? MODELS[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
		value: id,
		onValueChange: set,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
			className: compact ? "h-8 w-[min(100%,16rem)] text-xs" : "w-[min(100%,22rem)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-2 truncate",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: model.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-subtle",
					children: "Free"
				})]
			}) })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
			"fast",
			"coding",
			"deep"
		].map((tier) => {
			const group = MODELS.filter((m) => m.tier === tier);
			if (!group.length) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectGroup, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel, { children: tier }), group.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
				value: m.id,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex w-full items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [m.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 text-subtle",
						children: m.provider
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "ok",
						children: "Free"
					})]
				})
			}, m.id))] }, tier);
		}) })]
	});
}
function LanguagePicker({ value, onChange, label }) {
	const storeLang = useFleet((s) => s.language);
	const setLanguage = useFleet((s) => s.setLanguage);
	const lang = value ?? storeLang;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium text-muted",
			children: label
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
			value: lang,
			onValueChange: onChange ?? setLanguage,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { children: lang }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: LANGUAGE_GROUPS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectGroup, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel, { children: g.name }), g.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
				value: item,
				children: item
			}, item))] }, g.name)) })]
		})]
	});
}
function buildUserMessage(data) {
	const parts = [];
	if (data.language) parts.push(`Language: ${data.language}`);
	if (data.targetLanguage) parts.push(`Target language: ${data.targetLanguage}`);
	if (data.extras) parts.push(data.extras);
	if (data.prompt) parts.push(data.prompt);
	if (data.code?.trim()) {
		const lang = (data.language ?? "").toLowerCase().split(/[\s/]/)[0] || "";
		parts.push(`\nCode:\n\`\`\`${lang}\n${data.code}\n\`\`\``);
	}
	return parts.filter(Boolean).join("\n\n");
}
async function runFleet(data, onDelta) {
	const system = SYSTEM_PROMPTS[data.mode] ?? SYSTEM_PROMPTS.chat;
	const user = buildUserMessage(data);
	if (!user.trim()) return {
		ok: false,
		error: "Write a prompt or paste some code first."
	};
	const history = (data.history ?? []).slice(-10);
	const messages = [
		{
			role: "system",
			content: system.slice(0, 8e3)
		},
		...history,
		{
			role: "user",
			content: user.slice(0, 24e3)
		}
	];
	return chatWithPuter({
		messages,
		model: data.modelId || "gpt-5.6-luna",
		onDelta
	});
}
//#endregion
export { ModelPicker as n, runFleet as r, LanguagePicker as t };
