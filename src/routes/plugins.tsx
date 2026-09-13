import { createFileRoute } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Check, ExternalLink, Github, Globe2, Plus, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { PuterGate, PuterModelList } from "@/components/PuterGate";
import { usePuter } from "@/lib/puter-context";
import { toast } from "sonner";

// The route generator adds /plugins to routeTree.gen.ts during the build. The cast keeps
// standalone typecheck green before the generated tree is refreshed.
export const Route = createFileRoute("/plugins" as never)({ component: PluginsPage });

type Plugin = { name: string; description: string; kind: string; icon: LucideIcon; action: "google" | "github" | "vercel" | "external"; url?: string };
const plugins: Plugin[] = [
  { name: "Google", description: "บัญชี Google สำหรับการเข้าสู่ระบบของ Bossnu SlieLo", kind: "Identity", icon: Globe2, action: "google" },
  { name: "GitHub", description: "เปิดการเข้าสู่ระบบ GitHub และจัดการ repository ผ่าน GitHub", kind: "Developer", icon: Github, action: "github", url: "https://github.com/login" },
  { name: "Vercel", description: "เชื่อมต่อ Vercel เพื่อจัดการโปรเจกต์และ deployment", kind: "Platform", icon: Zap, action: "vercel", url: "https://vercel.com/oauth" },
  { name: "Railway", description: "เชื่อมต่อแพลตฟอร์ม deploy ของ Railway", kind: "Platform", icon: Zap, action: "external", url: "https://railway.app/" },
  { name: "Supabase", description: "เชื่อมต่อ database, auth และ storage ของ Supabase", kind: "Platform", icon: Sparkles, action: "external", url: "https://supabase.com/" },
  { name: "Neon", description: "เชื่อมต่อ PostgreSQL ของ Neon", kind: "Platform", icon: Sparkles, action: "external", url: "https://neon.tech/" },
  { name: "Base44", description: "เปิดพื้นที่เชื่อมต่อสำหรับ Base44 ตามบัญชีของคุณ", kind: "Platform", icon: Sparkles, action: "external", url: "https://base44.com/" },
];

function PluginsPage() {
  const { signedIn, signIn, user } = usePuter();
  async function connect(plugin: Plugin) {
    if (plugin.action === "google") {
      try { await signIn(); } catch (error) { toast.error(error instanceof Error ? error.message : "Google sign-in failed"); }
      return;
    }
    if (plugin.url) window.open(plugin.url, "_blank", "noopener,noreferrer");
  }

  return <AppShell marketing><main className="min-h-[calc(100dvh-76px)] bg-[#020812] px-4 py-8 text-white sm:px-8 sm:py-12"><div className="mx-auto max-w-6xl">
    <div className="flex flex-col gap-5 border-b border-cyan-300/10 pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.25em] text-cyan-300">Bossnu SlieLo · Plugins</p><h1 className="mt-2 text-3xl font-black sm:text-5xl">เชื่อมต่อเครื่องมือของคุณ</h1><p className="mt-3 max-w-2xl leading-7 text-slate-400">จัดการตัวเชื่อมต่อสำหรับ AI และงานพัฒนา โดยการเข้าสู่ระบบจริงจะใช้ provider ที่กำหนดไว้ในระบบ ส่วนแพลตฟอร์มภายนอกจะเปิดหน้า OAuth/บัญชีของผู้ให้บริการ</p></div><div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[.06] px-4 py-3 text-sm text-cyan-100"><ShieldCheck className="mr-2 inline size-4" />สถานะ Puter: {signedIn ? <span className="font-bold text-ok">เชื่อมต่อแล้ว</span> : <span className="text-slate-300">ยังไม่เข้าสู่ระบบ</span>}</div></div>
    <div className="mt-8"><PuterGate compact><div className="rounded-3xl border border-border bg-[#06111b] p-5"><p className="text-sm font-bold">Puter AI พร้อมใช้งาน</p><p className="mt-1 text-xs text-muted">{user?.username || user?.email || "บัญชี Puter"}</p><div className="mt-5"><PuterModelList /></div></div></PuterGate></div>
    <section className="mt-10"><div><h2 className="text-xl font-black">Installed & Popular</h2><p className="mt-1 text-sm text-slate-400">เลือกบริการเพื่อเริ่มขั้นตอนเชื่อมต่อ</p></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{plugins.map((plugin) => { const Icon = plugin.icon; const connected = plugin.action === "google" && signedIn; return <article key={plugin.name} className="rounded-2xl border border-cyan-300/10 bg-white/[.025] p-5 transition hover:border-cyan-300/25 hover:bg-cyan-300/[.035]"><div className="flex items-start gap-3"><div className="grid size-11 shrink-0 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300"><Icon className="size-5" /></div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="font-bold">{plugin.name}</h3>{connected && <Check className="size-4 text-ok" aria-label="Connected" />}</div><p className="mt-1 text-xs text-cyan-300/80">{plugin.kind}</p></div></div><p className="mt-4 min-h-12 text-sm leading-6 text-slate-400">{plugin.description}</p><Button className="mt-4 w-full" variant={connected ? "secondary" : "default"} onClick={() => void connect(plugin)}>{connected ? <><Check className="size-4" /> เชื่อมต่อแล้ว</> : <><Plus className="size-4" /> เชื่อมต่อ / Login</>}</Button>{plugin.url && <a className="mt-2 flex items-center justify-center gap-1 text-[11px] text-slate-500 hover:text-cyan-300" href={plugin.url} target="_blank" rel="noreferrer">เปิดผู้ให้บริการ <ExternalLink className="size-3" /></a>}</article>; })}</div></section>
  </div></main></AppShell>;
}
