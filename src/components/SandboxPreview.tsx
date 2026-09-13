import { useMemo, useState } from "react";
import { Eye, RotateCcw, Smartphone, Tablet, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const DEFAULT_HTML = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Bossnu Sandbox Preview</title>
<style>
  *{box-sizing:border-box}body{margin:0;min-height:100vh;background:#050814;color:#e8f7ff;font-family:Inter,system-ui,sans-serif;display:grid;place-items:center}
  .card{width:min(680px,90vw);padding:40px;border:1px solid #123b5a;border-radius:24px;background:linear-gradient(145deg,#071525,#03060d);box-shadow:0 0 50px #00d9ff18}
  .badge{display:inline-block;padding:6px 10px;border:1px solid #00d9ff55;border-radius:999px;color:#5ee7ff;font-size:12px}.title{font-size:clamp(32px,6vw,64px);margin:16px 0 8px}.muted{color:#8ca8b8}
  button{margin-top:24px;padding:12px 18px;border:0;border-radius:12px;background:#08cfff;color:#001018;font-weight:700}
</style>
</head>
<body><main class="card"><span class="badge">BOSSNU SANDBOX</span><h1 class="title">Live Preview</h1><p class="muted">แก้ HTML ทางซ้าย แล้วกด Preview เพื่อดูผลทันทีใน isolated iframe</p><button onclick="document.body.style.background='#071d16'">Test interaction</button></main></body>
</html>`;

type Viewport = "desktop" | "tablet" | "mobile";

export function SandboxPreview() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [source, setSource] = useState(DEFAULT_HTML);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const frameWidth = viewport === "desktop" ? "100%" : viewport === "tablet" ? "768px" : "390px";

  const preview = useMemo(() => source, [source]);

  return (
    <section className="mt-6 overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <div>
          <div className="flex items-center gap-2 font-medium"><Eye className="size-4" /> Sandbox Preview</div>
          <p className="mt-1 text-xs text-muted">Live HTML preview — รันใน iframe แยกจากหน้าแอป</p>
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" variant={viewport === "desktop" ? "secondary" : "ghost"} onClick={() => setViewport("desktop")} aria-label="Desktop"><Monitor className="size-4" /></Button>
          <Button size="sm" variant={viewport === "tablet" ? "secondary" : "ghost"} onClick={() => setViewport("tablet")} aria-label="Tablet"><Tablet className="size-4" /></Button>
          <Button size="sm" variant={viewport === "mobile" ? "secondary" : "ghost"} onClick={() => setViewport("mobile")} aria-label="Mobile"><Smartphone className="size-4" /></Button>
          <Button size="sm" variant="ghost" onClick={() => { setHtml(DEFAULT_HTML); setSource(DEFAULT_HTML); }} aria-label="Reset"><RotateCcw className="size-4" /></Button>
        </div>
      </div>
      <div className="grid min-h-[620px] lg:grid-cols-[minmax(300px,420px)_1fr]">
        <div className="border-b border-border p-4 lg:border-b-0 lg:border-r">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-subtle">Source</p>
          <Textarea value={html} onChange={(e) => setHtml(e.target.value)} className="min-h-[540px] resize-none font-mono text-xs" spellCheck={false} />
          <Button className="mt-3 w-full" onClick={() => setSource(html)}>Preview</Button>
        </div>
        <div className="min-w-0 overflow-auto bg-black/20 p-4">
          <div className="mx-auto h-[560px] overflow-hidden rounded-lg border border-border bg-white transition-[width]" style={{ width: frameWidth, maxWidth: "100%" }}>
            <iframe title="Bossnu Sandbox Preview" srcDoc={preview} sandbox="allow-scripts" className="h-full w-full border-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
