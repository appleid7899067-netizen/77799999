import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <AppShell marketing>
      <div className="mx-auto max-w-lg px-4 py-12">
        <p className="text-xs font-medium uppercase tracking-wider text-subtle">Contact</p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">Talk to Copilot Chat</h1>
        <p className="mt-3 text-sm text-muted">This prototype keeps the message in your session.</p>
        {sent ? (
          <p className="mt-8 rounded-xl bg-surface p-5 text-sm text-muted shadow-[var(--shadow-border)]">
            Message recorded locally.
          </p>
        ) : (
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              toast.success("Sent.");
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="em">Email</Label>
              <Input id="em" type="email" required placeholder="you@company.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sub">Subject</Label>
              <Input id="sub" required placeholder="A stubborn bug" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="msg">Message</Label>
              <Textarea id="msg" required className="min-h-32" />
            </div>
            <Button type="submit">Send</Button>
          </form>
        )}
      </div>
    </AppShell>
  );
}
