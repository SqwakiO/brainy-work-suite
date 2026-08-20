import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, ListChecks, Mail, NotebookPen, Search, Sparkles } from "lucide-react";

import { AiDisclaimer } from "@/components/AiDisclaimer";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate workplace tasks with AI: draft emails, summarize meetings, plan work, research topics and chat with a professional copilot.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "One dashboard for AI email drafting, meeting summaries, task planning, research and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    copy: "Turn bullet points into polished, on-tone business emails with a clear call to action.",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    copy: "Convert transcripts into TL;DRs, decisions, risks and owner-assigned action items.",
  },
  {
    to: "/planner",
    icon: ListChecks,
    title: "AI Task Planner",
    copy: "Break any goal into a prioritized, time-boxed plan with estimates and dependencies.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    copy: "Structured briefings with confidence levels and a human verification checklist.",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "AI Chatbot Interface",
    copy: "A conversational copilot for quick answers, rewrites and brainstorming.",
  },
] as const;

const STATS = [
  { label: "Workflows", value: "5" },
  { label: "Structured prompts", value: "20+" },
  { label: "Editable outputs", value: "100%" },
  { label: "Setup required", value: "None" },
];

function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      description="Your AI workspace for drafting, summarizing, planning and researching."
    >
      <div className="space-y-8">
        <section className="gradient-hero relative overflow-hidden rounded-2xl px-6 py-10 text-primary-foreground md:px-10 md:py-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5" /> Powered by Lovable AI
          </span>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold md:text-4xl">
            Automate the busywork of your workday
          </h2>
          <p className="mt-3 max-w-xl text-sm text-primary-foreground/85 md:text-base">
            Five focused AI workflows with guided prompts and fully editable results — built for
            professionals who still want the final word.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link to="/email">
                Draft an email <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/chat">Open chatbot</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="surface-card px-5 py-4">
              <p className="text-2xl font-semibold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-lg font-semibold">Workflows</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {TOOLS.map(({ to, icon: Icon, title, copy }) => (
              <Link
                key={to}
                to={to}
                className="surface-card group flex flex-col p-5 transition-transform hover:-translate-y-0.5"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{title}</h3>
                <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{copy}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <AiDisclaimer note="Responsible AI: every output on this platform is generated by an AI model and may be incomplete or incorrect. Review and edit results, avoid entering confidential or personal data, and keep a human in the loop for any decision that matters." />
      </div>
    </AppShell>
  );
}
