import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Workplace AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes or transcripts into structured summaries, decisions and action items with owners.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | Workplace AI" },
      {
        property: "og:description",
        content: "Summarize transcripts into decisions, risks and owner-assigned action items.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Convert messy notes or transcripts into decisions, risks and action items."
    >
      <ToolWorkspace
        system="You are a meticulous meeting analyst. Summarize only what is present in the notes. Never invent decisions, owners or dates; write 'Not stated' when information is missing."
        cta="Summarize notes"
        outputLabel="Meeting summary (editable)"
        tips={["Paste raw notes or a transcript — bullet fragments are fine.", "Owners and dates are only extracted, never guessed."]}
        fields={[
          { name: "title", label: "Meeting title", placeholder: "e.g. Q3 roadmap sync" },
          {
            name: "notes",
            label: "Raw notes or transcript",
            type: "textarea",
            rows: 12,
            placeholder: "Paste your meeting notes here…",
            required: true,
          },
          { name: "audience", label: "Summary audience", type: "select", options: ["Team", "Executive", "Client", "Personal recap"] },
        ]}
        buildPrompt={(v) => `Summarize the following meeting for a ${v("audience").toLowerCase()} audience.

Meeting: ${v("title") || "Untitled meeting"}

Notes:
${v("notes")}

Return these sections:
1. TL;DR (3 bullets max)
2. Key discussion points
3. Decisions made
4. Action items — table style lines: task | owner | due date (use "Not stated" when unknown)
5. Risks / open questions
6. Suggested follow-ups`}
      />
    </AppShell>
  );
}
