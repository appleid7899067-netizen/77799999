import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function FleetMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-elevated" />
      <path
        d="M11 8.5 21 16 11 23.5"
        fill="none"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2.5 text-fg no-underline" aria-label="Bossnu CodingFleet home">
      <FleetMark className="shrink-0" />
      {!compact && (
        <span className="hidden font-medium tracking-tight sm:inline">
          Bossnu <span className="text-primary">CodingFleet</span>
        </span>
      )}
    </Link>
  );
}
