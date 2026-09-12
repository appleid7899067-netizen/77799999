import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { L as ArrowRight, S as LoaderCircle, c as Sparkles, r as Upload } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as usePuter, n as Route, y as toolBySlug } from "./router-B3oNlHCz.mjs";
import { n as Button, t as AppShell } from "./app-shell-Dg3ARLsY.mjs";
import { n as extractFirstCode, t as MarkdownOutput } from "./markdown-output-CCq2E1JJ.mjs";
import { t as useFleet } from "./store-CRSkAEWQ.mjs";
import { n as ModelPicker, r as runFleet, t as LanguagePicker } from "./ai-v9XIMWjP.mjs";
import { t as Textarea } from "./textarea-DkTIpFtF.mjs";
import { t as Switch } from "./switch-DAJQXp65.mjs";
import { t as Label } from "./label-PCWeFTF3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools._slug-CRTNRnWo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ToolWorkspace({ tool }) {
	const language = useFleet((s) => s.language);
	const setLanguage = useFleet((s) => s.setLanguage);
	const modelId = useFleet((s) => s.modelId);
	const addGeneration = useFleet((s) => s.addGeneration);
	const { signedIn, signIn } = usePuter();
	const [prompt, setPrompt] = (0, import_react.useState)(tool.samples[0]?.prompt ?? "");
	const [code, setCode] = (0, import_react.useState)(tool.samples[0]?.code ?? "");
	const [target, setTarget] = (0, import_react.useState)("Go");
	const [web, setWeb] = (0, import_react.useState)(false);
	const [exec, setExec] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [output, setOutput] = (0, import_react.useState)("");
	const [files, setFiles] = (0, import_react.useState)([]);
	async function generate() {
		if (!signedIn) try {
			await signIn();
		} catch {
			toast.error("Sign in with Puter to run free models. Allow popups if blocked.");
			return;
		}
		setBusy(true);
		setOutput("");
		try {
			const extras = [
				web ? "Web access is enabled — use current public knowledge." : "",
				exec ? "Code execution is enabled — reason about running the snippet and expected stdout." : "",
				files.length ? `Attached files: ${files.join(", ")}` : ""
			].filter(Boolean).join("\n");
			const res = await runFleet({
				mode: tool.slug,
				prompt,
				code: tool.kind === "prompt-code" || tool.kind === "convert" || tool.kind === "diagram-to-code" ? code : code,
				language,
				targetLanguage: tool.kind === "convert" || tool.kind === "diagram-to-code" ? target : void 0,
				modelId,
				extras
			}, (full) => setOutput(full));
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			setOutput(res.text);
			addGeneration({
				tool: tool.slug,
				title: prompt.slice(0, 72) || tool.name,
				prompt,
				output: res.text,
				language: tool.kind === "convert" ? `${language} → ${target}` : language,
				model: res.model
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Request failed");
		} finally {
			setBusy(false);
		}
	}
	const first = extractFirstCode(output);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wider text-subtle",
					children: "Tool"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-2xl font-medium tracking-tight",
					children: tool.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-prose text-sm text-muted",
					children: tool.blurb
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Model" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelPicker, {})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguagePicker, {
							value: language,
							onChange: setLanguage,
							label: tool.kind === "convert" ? "From" : "Language"
						}),
						(tool.kind === "convert" || tool.kind === "diagram-to-code") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguagePicker, {
								value: target,
								onChange: setTarget,
								label: "To"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "prompt",
						children: "Instructions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "prompt",
						value: prompt,
						onChange: (e) => setPrompt(e.target.value),
						placeholder: "Describe what you want…",
						className: "min-h-24"
					})]
				}),
				tool.kind !== "diagram" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "code",
							children: tool.kind === "diagram-to-code" ? "Diagram source" : "Code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-xs text-subtle hover:text-fg",
							onClick: () => setCode(""),
							children: "Clear"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "code",
						value: code,
						onChange: (e) => setCode(e.target.value),
						placeholder: tool.kind === "diagram-to-code" ? "Paste mermaid or ASCII…" : "Paste source…",
						className: "min-h-44 font-mono text-sm"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 flex cursor-pointer items-center gap-3 rounded-lg bg-elevated px-3 py-3 text-sm text-muted shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Drop files or a project zip — names only, stored in this browser." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							multiple: true,
							className: "hidden",
							onChange: (e) => {
								const names = [...e.target.files ?? []].map((f) => f.name);
								setFiles((prev) => [...prev, ...names].slice(0, 12));
							}
						})
					]
				}),
				files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-subtle",
					children: files.join(" · ")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-lg bg-surface p-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted",
						children: "Advanced tools"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block",
								children: "Web access"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-subtle",
								children: "Current docs and public pages."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: web,
								onCheckedChange: setWeb
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block",
								children: "Code execution"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-subtle",
								children: "Reason about running the snippet."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: exec,
								onCheckedChange: setExec
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => void generate(),
						disabled: busy,
						className: "min-w-36",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), busy ? "Working" : tool.cta]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-subtle",
						children: "Free via Puter"
					})]
				}),
				tool.samples.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: tool.samples.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-full bg-elevated px-3 py-1 text-xs text-muted shadow-[var(--shadow-border)] hover:text-fg",
						onClick: () => {
							setPrompt(s.prompt);
							if (s.code) setCode(s.code);
						},
						children: s.label
					}, s.label))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "min-w-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-full min-h-80 flex-col rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] lg:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-wider text-subtle",
							children: "Output"
						}), first && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `/runner?lang=${encodeURIComponent(first.lang)}`,
								children: ["Open in runner ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
							})
						})]
					}),
					busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fleet-shimmer h-1 rounded-full" }),
					output ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownOutput, {
						text: output,
						className: "flex-1 overflow-auto"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-1 items-center justify-center text-center text-sm text-subtle",
						children: busy ? "Writing…" : "Output lands here after you sign in with Puter."
					})
				]
			})
		})]
	}) });
}
function ToolPage() {
	const { slug } = Route.useParams();
	const tool = toolBySlug(slug);
	if (!tool || tool.kind === "runner") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg px-4 py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-medium",
				children: "Tool not found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "That slug is not in the workspace."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: "Back home"
				})
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolWorkspace, { tool });
}
//#endregion
export { ToolPage as component };
