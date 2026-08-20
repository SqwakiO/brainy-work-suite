import { Link } from "@tanstack/react-router";
import {
  Bot,
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  Search,
  Menu,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email", icon: Mail },
  { to: "/notes", label: "Meeting Notes", icon: NotebookPen },
  { to: "/planner", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research", icon: Search },
  { to: "/chat", label: "AI Chatbot", icon: Bot },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className:
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium bg-sidebar-accent text-sidebar-accent-foreground",
          }}
        >
          <Icon className="size-4.5 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col gap-6 bg-sidebar p-5">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-3">
        <span className="gradient-hero flex size-9 items-center justify-center rounded-xl">
          <Sparkles className="size-5 text-primary-foreground" />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-sm font-semibold text-sidebar-foreground">
            Workplace AI
          </span>
          <span className="block text-xs text-sidebar-foreground/60">Productivity Assistant</span>
        </span>
      </Link>

      <NavLinks onNavigate={onNavigate} />

      <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
        <p className="flex items-center gap-2 text-xs font-semibold text-sidebar-foreground">
          <ShieldCheck className="size-4" /> Responsible AI
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-sidebar-foreground/65">
          Outputs are AI-generated and may be inaccurate. Review and edit before sharing.
        </p>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarBody />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-4 backdrop-blur md:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-sidebar-border p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarBody onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold md:text-xl">{title}</h1>
            <p className="truncate text-sm text-muted-foreground">{description}</p>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>

        <footer className="border-t border-border px-4 py-4 text-xs text-muted-foreground md:px-8">
          AI-generated content can be inaccurate or incomplete. Always verify facts and apply human
          judgement before acting on or sending any output.
        </footer>
      </div>
    </div>
  );
}
