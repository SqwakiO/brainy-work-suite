import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Workplace AI" },
      {
        name: "description",
        content:
          "Draft professional workplace emails in seconds with structured AI prompts and fully editable output.",
      },
      { property: "og:title", content: "Smart Email Generator | Workplace AI" },
      {
        property: "og:description",
        content: "Generate polished, on-tone business emails with AI and edit them before sending.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AppShell
      title="Smart Email Generator"
      description="Turn a few bullet points into a polished, on-tone business email."
    >
      <ToolWorkspace
        system="You are an expert business communication writer. Write clear, concise, professional emails. Never invent facts, figures, names or commitments that were not provided."
        cta="Generate email"
        outputLabel="Email draft (editable)"
        tips={[
          "Keep key facts in 'Key points' — the AI will not invent details.",
          "Edit the draft directly before copying it into your mail client.",
        ]}
        fields={[
          { name: "recipient", label: "Recipient & role", placeholder: "e.g. Priya, Client Success Lead", required: true },
          { name: "purpose", label: "Purpose of the email", placeholder: "e.g. Request a deadline extension", required: true },
          {
            name: "points",
            label: "Key points to include",
            type: "textarea",
            rows: 6,
            placeholder: "- Delivery slipped by 3 days\n- New date: 12 Sept\n- Mitigation plan attached",
            required: true,
          },
          { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Formal", "Direct", "Apologetic", "Persuasive"] },
          { name: "length", label: "Length", type: "select", options: ["Short", "Medium", "Detailed"] },
        ]}
        buildPrompt={(v) => `Write a workplace email.

Recipient: ${v("recipient")}
Purpose: ${v("purpose")}
Tone: ${v("tone")}
Length: ${v("length")}
Key points (use only these facts):
${v("points")}

Return: a subject line, then the email body with a greeting, structured paragraphs, a clear call to action and a sign-off placeholder [Your name].`}
      />
    </AppShell>
  );
}
