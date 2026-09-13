import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { MarkdownOutput } from "@/components/markdown-output";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { runFleet } from "@/lib/ai";
import { usePuter } from "@/lib/puter-context";
import { useFleet } from "@/lib/store";

const FRAMEWORKS = ["Vitest", "Jest", "Pytest", "Go testing", "JUnit", "xUnit", "RSpec"];

export function UnitTestGenerator() {
  const language = useFleet((s) => s.language);
  const modelId = useFleet((s) => s.modelId);
  const { signedIn, signIn } = usePuter();
  const [framework, setFramework] = useState("Vitest");
  const [code, setCode] = useState("");
  const [requirements, setRequirements] = useState("Cover happy paths, edge cases, invalid input, errors, boundaries, and important branches. Prefer deterministic tests.");
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);

  async function generate() {
    if (!code.trim()) {
      toast.error("ใส่โค้ดที่ต้องการสร้าง Unit Test ก่อน");
      return;
    }
    if (!signedIn) {
      try { await signIn(); } catch { toast.error("Sign in with Puter to run the free model."); return; }
    }
    setBusy(true);
    setOutput("");
    try {
      const prompt = [
        "Act as a senior test engineer. Generate production-quality unit tests for the supplied code.",
        `Language: ${language}`,
        `Framework: ${framework}`,
        "Requirements:", requirements,
        "Return the complete test file in a fenced code block, followed by a concise coverage analysis.",
        "Do not invent APIs that are not implied by the source. Mock external boundaries where appropriate. Include readable test names and arrange/act/assert structure when it fits.",
      ].join("\n");
      const res = await runFleet({ mode: "tests", prompt, code, language, modelId }, (full) => setOutput(full));
      if (!res.ok) { toast.error(res.error); return; }
      setOutput(res.text);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Request failed");
    } finally { setBusy(false); }
  }

  return (
    <AppShell>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section>
          <p className="text-xs font-medium uppercase tracking-wider text-subtle">Testing Lab</p>
          <h1 className="mt-1 text-2xl font-medium tracking-tight">Unit Test Generator</h1>
          <p className="mt-2 text-sm text-muted">สร้าง Unit Test พร้อม edge cases, error paths และวิเคราะห์ coverage จากโค้ดจริง</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Framework</Label>
              <select value={framework} onChange={(e) => setFramework(e.target.value)} className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm">
                {FRAMEWORKS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Language</Label>
              <div className="flex h-10 items-center rounded-md bg-elevated px-3 text-sm">{language}</div>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <Label htmlFor="test-code">Source code</Label>
            <Textarea id="test-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="วางฟังก์ชัน / class / module ที่ต้องการทดสอบ…" className="min-h-64 font-mono text-sm" />
          </div>
          <div className="mt-3 space-y-1.5">
            <Label htmlFor="requirements">Test requirements</Label>
            <Textarea id="requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} className="min-h-24" />
          </div>
          <Button onClick={() => void generate()} disabled={busy} className="mt-4 min-w-44">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {busy ? "Generating…" : "Generate Unit Tests"}
          </Button>
        </section>

        <section className="min-h-96 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] lg:p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-subtle">Generated tests</p>
          {output ? <MarkdownOutput text={output} className="max-h-[70vh] overflow-auto" /> : <div className="flex min-h-80 items-center justify-center text-center text-sm text-subtle">ผลลัพธ์ Unit Test และ coverage analysis จะแสดงที่นี่</div>}
        </section>
      </div>
    </AppShell>
  );
}
