import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { FleetTool } from "@/lib/catalog";

export function ToolLink({
  tool,
  className,
  children,
}: {
  tool: FleetTool;
  className?: string;
  children: ReactNode;
}) {
  if (tool.slug === "runner") {
    return (
      <Link to="/runner" className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/tools/$slug" params={{ slug: tool.slug }} className={className}>
      {children}
    </Link>
  );
}
