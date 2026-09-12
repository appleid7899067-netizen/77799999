import { s as DEFAULT_MODEL_ID } from "./router-B3oNlHCz.mjs";
import { a as uid } from "./app-shell-Dg3ARLsY.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-CRSkAEWQ.js
var seedThread = () => ({
	id: "welcome",
	title: "Welcome",
	createdAt: Date.now(),
	updatedAt: Date.now(),
	tools: {
		web: true,
		code: true,
		files: false,
		agents: false
	},
	mcp: ["context7"],
	messages: [{
		id: "w1",
		role: "assistant",
		createdAt: Date.now(),
		content: "Copilot Chat is online. Sign in with Puter once — then every model in the picker is free.\n\nไม่มีอะไรที่ทำไม่ได้ · ไม่มีสิ่งใดที่แก้ไม่ได้\n\nTry:\n- “Convert this Python snippet to idiomatic Go”\n- “Review this handler for SQL injection”\n- “@shipper @security design a token bucket rate limiter”"
	}]
});
var useFleet = create()(persist((set, get) => ({
	modelId: DEFAULT_MODEL_ID,
	language: "Python",
	threads: [seedThread()],
	activeThreadId: "welcome",
	generations: [],
	sandboxes: [{
		id: "sb_default",
		name: "python-default",
		runtime: "Python 3.12",
		packages: "fastapi, pytest, pandas, httpx",
		status: "ready",
		snapshots: 1,
		createdAt: Date.now() - 864e5
	}, {
		id: "sb_node",
		name: "node-runner",
		runtime: "Node 22",
		packages: "vitest, tsx, zod",
		status: "ready",
		snapshots: 0,
		createdAt: Date.now() - 36e5
	}],
	routines: [{
		id: "r1",
		name: "Morning standup",
		cadence: "Weekdays 09:00",
		prompt: "Summarize open PRs and failing checks.",
		enabled: true
	}, {
		id: "r2",
		name: "Nightly tests",
		cadence: "Daily 02:00",
		prompt: "Generate missing tests for files touched in 24h.",
		enabled: false
	}],
	memory: [{
		id: "m1",
		text: "Prefers TypeScript, vitest, and short answers.",
		createdAt: Date.now()
	}],
	setModel: (id) => set({ modelId: id }),
	setLanguage: (language) => set({ language }),
	newThread: () => {
		const id = uid("chat");
		set({
			threads: [{
				id,
				title: "New chat",
				createdAt: Date.now(),
				updatedAt: Date.now(),
				tools: {
					web: false,
					code: false,
					files: false,
					agents: false
				},
				mcp: [],
				messages: []
			}, ...get().threads],
			activeThreadId: id
		});
		return id;
	},
	setActiveThread: (id) => set({ activeThreadId: id }),
	renameThread: (id, title) => set({ threads: get().threads.map((t) => t.id === id ? {
		...t,
		title
	} : t) }),
	pinThread: (id) => set({ threads: get().threads.map((t) => t.id === id ? {
		...t,
		pinned: !t.pinned
	} : t) }),
	deleteThread: (id) => {
		const next = get().threads.filter((t) => t.id !== id);
		set({
			threads: next.length ? next : [seedThread()],
			activeThreadId: get().activeThreadId === id ? next[0]?.id ?? "welcome" : get().activeThreadId
		});
	},
	appendMessage: (threadId, msg) => {
		const id = msg.id ?? uid("m");
		set({ threads: get().threads.map((t) => {
			if (t.id !== threadId) return t;
			const message = {
				id,
				createdAt: Date.now(),
				role: msg.role,
				content: msg.content,
				model: msg.model,
				activity: msg.activity
			};
			const title = t.title === "New chat" && msg.role === "user" ? msg.content.slice(0, 42) || t.title : t.title;
			return {
				...t,
				title,
				updatedAt: Date.now(),
				messages: [...t.messages, message]
			};
		}) });
		return id;
	},
	patchMessage: (threadId, messageId, content) => set({ threads: get().threads.map((t) => {
		if (t.id !== threadId) return t;
		return {
			...t,
			updatedAt: Date.now(),
			messages: t.messages.map((m) => m.id === messageId ? {
				...m,
				content
			} : m)
		};
	}) }),
	updateTools: (threadId, tools) => set({ threads: get().threads.map((t) => t.id === threadId ? {
		...t,
		tools
	} : t) }),
	toggleMcp: (threadId, id) => set({ threads: get().threads.map((t) => {
		if (t.id !== threadId) return t;
		const mcp = t.mcp.includes(id) ? t.mcp.filter((x) => x !== id) : [...t.mcp, id];
		return {
			...t,
			mcp
		};
	}) }),
	addGeneration: (g) => set({ generations: [{
		...g,
		id: uid("gen"),
		createdAt: Date.now()
	}, ...get().generations].slice(0, 80) }),
	addSandbox: (s) => set({ sandboxes: [{
		...s,
		id: uid("sb"),
		createdAt: Date.now(),
		status: "ready",
		snapshots: 0
	}, ...get().sandboxes] }),
	setSandboxStatus: (id, status) => set({ sandboxes: get().sandboxes.map((s) => s.id === id ? {
		...s,
		status
	} : s) }),
	snapshotSandbox: (id) => set({ sandboxes: get().sandboxes.map((s) => s.id === id ? {
		...s,
		snapshots: s.snapshots + 1
	} : s) }),
	removeSandbox: (id) => set({ sandboxes: get().sandboxes.filter((s) => s.id !== id) }),
	addRoutine: (r) => set({ routines: [{
		...r,
		id: uid("rt")
	}, ...get().routines] }),
	toggleRoutine: (id) => set({ routines: get().routines.map((r) => r.id === id ? {
		...r,
		enabled: !r.enabled
	} : r) }),
	markRoutineRun: (id) => set({ routines: get().routines.map((r) => r.id === id ? {
		...r,
		lastRun: Date.now()
	} : r) }),
	addMemory: (text) => set({ memory: [{
		id: uid("mem"),
		text,
		createdAt: Date.now()
	}, ...get().memory].slice(0, 24) }),
	removeMemory: (id) => set({ memory: get().memory.filter((m) => m.id !== id) })
}), { name: "copilot-chat-store" }));
//#endregion
export { useFleet as t };
