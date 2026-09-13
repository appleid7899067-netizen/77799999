import { useRef, useState } from "react";
import { FileArchive, FileImage, FileSpreadsheet, FileText, Film, Paperclip, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const CHAT_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/zip", "video/mp4"] as const;
const MAX_FILES = 20;

function iconFor(type: string) {
  if (type.startsWith("image/")) return FileImage;
  if (type.startsWith("video/")) return Film;
  if (type.includes("spreadsheet")) return FileSpreadsheet;
  if (type.includes("zip")) return FileArchive;
  return FileText;
}

export function ChatRoom({ onSend, disabled = false }: { onSend?: (text: string, files: File[]) => void | Promise<void>; disabled?: boolean }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const input = useRef<HTMLInputElement>(null);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const accepted = Array.from(list).filter((file) => (CHAT_FILE_TYPES as readonly string[]).includes(file.type));
    setFiles((current) => [...current, ...accepted].slice(0, MAX_FILES));
  }

  async function send() {
    if ((!text.trim() && files.length === 0) || disabled) return;
    await onSend?.(text.trim(), files);
    setText("");
    setFiles([]);
  }

  return <div className="mx-auto w-full max-w-[900px] rounded-3xl border border-cyan-300/15 bg-[#06111b] p-3 shadow-[0_0_60px_rgba(0,190,255,.07)]">
    {files.length > 0 && <div className="mb-3 grid grid-cols-5 gap-2">{files.map((file, index) => { const Icon = iconFor(file.type); return <div key={`${file.name}-${index}`} className="group relative min-w-0 rounded-xl border border-border bg-elevated p-2">{file.type.startsWith("image/") ? <img src={URL.createObjectURL(file)} alt={file.name} className="aspect-square w-full rounded-lg object-cover" /> : <div className="grid aspect-square place-items-center rounded-lg bg-black/20"><Icon className="size-7 text-cyan-300" /></div>}<p className="mt-1 truncate text-[10px] text-muted" title={file.name}>{file.name}</p><button type="button" aria-label={`ลบ ${file.name}`} className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-black/70 text-white" onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}><X className="size-3" /></button></div>; })}</div>}
    <div className="flex items-end gap-2">
      <input ref={input} type="file" multiple accept={CHAT_FILE_TYPES.join(",")} className="hidden" onChange={(e) => addFiles(e.target.files)} />
      <Button variant="ghost" size="icon" aria-label="แนบไฟล์" onClick={() => input.current?.click()}><Paperclip className="size-5" /></Button>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder="พิมพ์ข้อความของคุณ…" className="min-h-12 border-0 bg-transparent shadow-none" onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }} />
      <Button size="icon" className="bg-cyan-300 text-slate-950 hover:bg-cyan-200" disabled={disabled || (!text.trim() && files.length === 0)} onClick={() => void send()}><Send className="size-4" /></Button>
    </div>
    <p className="mt-2 px-1 text-[11px] text-subtle">JPG · PNG · PDF · DOCX · XLSX · ZIP · MP4 · สูงสุด 20 ไฟล์ · ไฟล์จะไม่ถูกบีบอัดในฝั่ง UI</p>
  </div>;
}
