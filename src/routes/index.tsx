import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Code2, Crown, Grid2X2, MessageSquarePlus, Rocket, ShieldCheck, Sparkles, Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { FleetMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { AGENTS, MOTTO_TH, STATS, TOOLS } from "@/lib/catalog";
import { usePuter } from "@/lib/puter-context";
import { toast } from "sonner";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { signedIn, signIn } = usePuter();
  const startChat = () => {
    if (signedIn) return;
    void signIn().catch((err: unknown) => toast.error(err instanceof Error ? err.message : "เปิดหน้าต่างเข้าสู่ระบบแล้วลองอีกครั้ง"));
  };

  return (
    <AppShell marketing>
      <main className="overflow-hidden bg-[#020812] text-white">
        <section className="relative border-b border-cyan-300/10 bg-[radial-gradient(circle_at_78%_28%,rgba(0,207,255,.18),transparent_28%),radial-gradient(circle_at_15%_18%,rgba(20,90,255,.12),transparent_34%)]">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(0,220,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,220,255,.025)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="relative mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:py-10">
            <div className="mb-8 flex items-center justify-between gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[.035] px-4 py-2"><p className="text-xs font-semibold tracking-[.22em] text-cyan-200">AI · CODING · FUTURE</p></div>
              <div className="flex gap-2">
                <Button variant="secondary" className="rounded-2xl border-cyan-300/10 bg-[#071523] text-white hover:bg-cyan-300/10" asChild><Link to="/chat"><MessageSquarePlus className="size-4" /> <span className="hidden sm:inline">คอมพิวเตอร์</span></Link></Button>
                <Button size="icon" className="rounded-2xl bg-cyan-300 text-slate-950 shadow-[0_0_35px_rgba(0,220,255,.3)] hover:bg-cyan-200" asChild><Link to="/chat" aria-label="เปิดแชท"><MessageSquarePlus className="size-5" /></Link></Button>
              </div>
            </div>

            <div className="grid items-center gap-10 lg:grid-cols-[1.04fr_.96fr] lg:gap-4">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/15 bg-cyan-300/[.08] px-4 py-2 text-sm font-semibold text-cyan-100 sm:px-5"><Crown className="size-5 text-cyan-300" /> ผู้บริหาร Bossnu SlieLo <span className="hidden text-xs font-normal text-slate-400 sm:inline">AI | Developer | Visionary</span></div>

                <div className="mt-7 flex items-center gap-3 sm:gap-5">
                  <FleetMark className="h-14 w-20 shrink-0 text-cyan-300 drop-shadow-[0_0_18px_rgba(0,220,255,.5)] sm:h-20 sm:w-28" />
                  <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">Bossnu <span className="text-cyan-300">SlieLo</span></h1>
                </div>
                <h2 className="mt-6 text-3xl font-extrabold leading-tight sm:text-5xl">แชทกับนักบินผู้ช่วย</h2>
                <p className="mt-4 text-3xl font-black leading-[1.15] text-cyan-300 sm:text-5xl">ไม่มีอะไรที่ทำไม่ได้<br />ไม่มีสิ่งที่แก้ไม่ได้</p>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">ผู้ช่วยอัจฉริยะของ <span className="font-bold text-cyan-300">ผู้บริหาร Bossnu SlieLo</span><br />พร้อมช่วยคุณในทุกเรื่อง ไม่ว่าจะเป็น เขียนโค้ด สร้างระบบ จัดการโปรเจกต์ หรือค้นหาข้อมูล ด้วยพลัง AI<br /><span className="text-slate-400">— รองรับ GPT, Claude, Gemini, Qwen, DeepSeek และอื่นๆ</span><br /><span className="text-slate-400">— ใช้งานผ่าน API ได้</span></p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button size="lg" className="h-14 rounded-2xl bg-cyan-300 px-6 text-base font-bold text-slate-950 shadow-[0_0_35px_rgba(0,220,255,.28)] hover:bg-cyan-200 sm:px-7 sm:text-lg" onClick={startChat} asChild={signedIn}>{signedIn ? <Link to="/chat"><Rocket className="size-5" /> เริ่มแชทกับ Bossnu SlieLo <ArrowRight /></Link> : <><Rocket className="size-5" /> เริ่มแชทกับ Bossnu SlieLo <ArrowRight /></>}</Button>
                  <Button size="lg" variant="secondary" className="h-14 rounded-2xl border-cyan-300/20 bg-white/[.06] px-6 text-base text-white hover:bg-white/10 sm:px-7 sm:text-lg" asChild><Link to="/tools/$slug" params={{ slug: TOOLS[0]?.slug ?? "generator" }}><Grid2X2 className="size-5" /> ลองใช้งานเดโม</Link></Button>
                </div>
              </div>

              <div className="relative mx-auto h-[390px] w-full max-w-[480px] sm:h-[470px] lg:h-[540px]">
                <div className="absolute inset-[6%] rounded-full border border-cyan-300/10 bg-[radial-gradient(circle_at_50%_35%,rgba(0,225,255,.25),rgba(0,55,100,.13)_42%,transparent_70%)] shadow-[0_0_110px_rgba(0,160,255,.15)]" />
                <div className="absolute inset-x-[8%] top-[12%] h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
                <div className="absolute left-1/2 top-[16%] h-[62%] w-[68%] -translate-x-1/2 rounded-[48%_48%_40%_40%] border border-cyan-200/25 bg-[linear-gradient(145deg,rgba(17,48,68,.95),rgba(1,12,22,.98)_58%,rgba(0,190,255,.12))] shadow-[inset_20px_15px_45px_rgba(0,220,255,.16),inset_-18px_-20px_35px_rgba(0,0,0,.7),0_0_70px_rgba(0,180,255,.18)]">
                  <div className="absolute left-[18%] right-[18%] top-[17%] h-[30%] rounded-[50%] border border-cyan-300/20 bg-[radial-gradient(ellipse,rgba(0,210,255,.22),transparent_65%)]" />
                  <div className="absolute left-[13%] right-[13%] top-[48%] h-14 rounded-[50%] border-y border-cyan-200/20 bg-[#020b14]/80 shadow-[0_0_30px_rgba(0,220,255,.18)]" />
                  <div className="absolute left-[25%] right-[25%] top-[54%] h-2 rounded-full bg-cyan-300 shadow-[0_0_22px_rgba(0,240,255,.95)]" />
                  <div className="absolute left-1/2 top-[70%] h-16 w-28 -translate-x-1/2 rounded-b-[50%] border-x border-b border-cyan-300/15 bg-[#030d17]" />
                  <FleetMark className="absolute left-1/2 top-[27%] h-20 w-28 -translate-x-1/2 text-cyan-300 drop-shadow-[0_0_28px_rgba(0,220,255,.8)]" />
                </div>
                <div className="absolute bottom-[7%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-cyan-300/20 bg-[#04121d]/90 px-5 py-2.5 text-xs font-semibold tracking-[.16em] text-cyan-200 backdrop-blur sm:text-sm">AI COPILOT · BOSSNU SLIELO</div>
                <div className="absolute left-[5%] top-[43%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_6px_rgba(0,220,255,.45)]" />
                <div className="absolute right-[7%] top-[29%] h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_5px_rgba(0,220,255,.4)]" />
              </div>
            </div>

            <div className="mt-10 grid max-w-4xl grid-cols-3 border-y border-cyan-300/10 py-6"><Stat icon={Bot} n="500+" l="ผู้ใช้งานทั้งหมด" /><Stat icon={Code2} n={String(STATS.tools)} l="เครื่องมือ AI" /><Stat icon={Star} n={String(STATS.agents)} l="ตัวอย่างโค้ด" /></div>
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8"><div className="rounded-[28px] border border-cyan-300/15 bg-[linear-gradient(135deg,rgba(7,25,40,.8),rgba(2,9,17,.9))] p-5 shadow-[0_0_70px_rgba(0,180,255,.06)] sm:p-7"><div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-300"><span className="rounded-xl bg-cyan-300/10 px-4 py-2 text-cyan-200">Python → Go</span><span>อธิบายโค้ด</span><span>การทดสอบหน่วย</span><span>แก้บั๊ก</span></div><div className="mt-5 rounded-2xl border border-cyan-300/10 bg-[#03111c] p-5"><p className="text-sm text-slate-400">แชทกับ Bossnu SlieLo ได้ทุกเรื่อง...</p><div className="mt-4 flex items-center gap-3 rounded-2xl border border-cyan-300/15 bg-black/20 px-4 py-3 text-slate-500"><span className="flex-1">พิมพ์ข้อความของคุณที่นี่...</span><Link to="/chat" className="grid size-12 place-items-center rounded-xl bg-cyan-300 text-slate-950"><ArrowRight /></Link></div></div></div></section>

        <section className="border-t border-cyan-300/10 bg-[#020911]"><div className="mx-auto max-w-7xl px-5 py-14 sm:px-8"><div><p className="text-xs font-bold uppercase tracking-[.25em] text-cyan-300">Bossnu SlieLo AI Platform</p><h2 className="mt-2 text-3xl font-black">ผู้ช่วย AI สำหรับงานจริง</h2></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{TOOLS.slice(0, 6).map((tool) => <Link key={tool.slug} to="/tools/$slug" params={{ slug: tool.slug }} className="group rounded-2xl border border-cyan-300/10 bg-white/[.025] p-5 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-cyan-300/[.04]"><tool.icon className="size-6 text-cyan-300" /><h3 className="mt-4 font-bold">{tool.name}</h3><p className="mt-1 text-sm leading-6 text-slate-400">{tool.blurb}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-300">เปิดใช้งาน <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></Link>)}</div></div></section>

        <section className="border-t border-cyan-300/10"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[.25em] text-cyan-300">AI CREW</p><h2 className="mt-2 text-3xl font-black">ผู้ช่วยหลายทีมในหนึ่งแชท</h2><p className="mt-4 leading-7 text-slate-400">มอบหมายงานให้ Agent ที่เหมาะสม แล้วให้ Bossnu SlieLo ช่วยรวบรวมผลลัพธ์กลับมาเป็นหนึ่งเดียว</p><div className="mt-6 space-y-3 text-sm text-slate-300"><p className="flex gap-3"><ShieldCheck className="text-cyan-300" />กำหนดสิทธิ์การทำงานและการแก้ไข</p><p className="flex gap-3"><Sparkles className="text-cyan-300" />เลือกโมเดลและเครื่องมือให้เหมาะกับงาน</p><p className="flex gap-3"><Rocket className="text-cyan-300" />สร้าง ตรวจสอบ และส่งมอบโค้ด</p></div></div><div className="grid gap-3 sm:grid-cols-2">{AGENTS.slice(0, 6).map((agent) => <div key={agent.id} className="rounded-2xl border border-cyan-300/10 bg-white/[.025] p-4"><p className="font-mono text-xs text-cyan-300">@{agent.handle}</p><p className="mt-2 font-bold">{agent.name}</p><p className="mt-1 text-xs text-slate-400">{agent.role}</p></div>)}</div></div></section>

        <section className="border-t border-cyan-300/10 bg-[radial-gradient(circle_at_50%_0%,rgba(0,220,255,.13),transparent_45%)]"><div className="mx-auto flex max-w-7xl flex-col items-center px-5 py-16 text-center sm:px-8"><Crown className="size-10 text-cyan-300" /><h2 className="mt-4 text-3xl font-black sm:text-4xl">ผู้บริหาร Bossnu SlieLo</h2><p className="mt-3 text-lg text-cyan-300">{MOTTO_TH}</p><Button size="lg" className="mt-7 rounded-2xl bg-cyan-300 px-8 text-slate-950 hover:bg-cyan-200" asChild><Link to="/chat">เริ่มแชทกับ Bossnu SlieLo <ArrowRight /></Link></Button></div></section>
      </main>
    </AppShell>
  );
}

function Stat({ icon: Icon, n, l }: { icon: typeof Bot; n: string; l: string }) {
  return <div className="flex items-center gap-3 border-r border-cyan-300/10 px-3 last:border-0"><Icon className="size-7 text-cyan-300" /><div><p className="text-2xl font-black">{n}</p><p className="text-xs text-slate-400">{l}</p></div></div>;
}
