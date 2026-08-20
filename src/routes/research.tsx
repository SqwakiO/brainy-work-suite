import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Workplace AI" },
      {
        name: "description",
        content:
          "Get structured briefings, comparisons and background reading plans on any workplace topic.",
      },
      { property: "og:title", content: "AI Research Assistant | Workplace AI" },
      {
        property: "og:description",
        content: "Structured research briefings with explicit confidence levels and verification steps.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AppShell
      title="AI Research Assistant"
      description="Structured briefings with explicit confidence levels and verification steps."
    >
      <ToolWorkspace
        system="You are a rigorous research analyst. Do not fabricate statistics, citations, URLs or quotes. Where a claim needs a source, say what to verify and where to look instead of inventing a reference. State your confidence level."
        cta="Run research brief"
        outputLabel="Research brief (editable)"
        tips={[
          "The assistant does not browse the web — it will not invent sources.",
          "Use the verification checklist before circulating findings.",
        ]}
        fields={[
          { name: "topic", label: "Topic or question", placeholder: "e.g. Best practices for hybrid onboarding", required: true },
          { name: "purpose", label: "How will this be used?", placeholder: "e.g. Slide deck for leadership review" },
          { name: "depth", label: "Depth", type: "select", options: ["Quick overview", "Standard brief", "Deep dive"] },
          { name: "format", label: "Output format", type: "select", options: ["Briefing notes", "Pros & cons", "Comparison", "Q&A", "Executive summary"] },
        ]}
        buildPrompt={(v) => `Produce a ${v.depth?.toLowerCase()} research brief in "${v.format}" format.

Topic: ${v.topic}
Intended use: ${v.purpose || "General understanding"}

Return:
1. Executive summary
2. Key findings with a confidence label (high / medium / low) per finding
3. Considerations, trade-offs or counter-arguments
4. Practical recommendations
5. Verification checklist — what a human should independently confirm and which types of sources to check
Do not invent citations, URLs or statistics.`}
      />
    </AppShell>
  );
}
