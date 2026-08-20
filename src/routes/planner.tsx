import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Workplace AI" },
      {
        name: "description",
        content:
          "Break goals into prioritized, time-boxed task plans with dependencies, owners and a realistic schedule.",
      },
      { property: "og:title", content: "AI Task Planner | Workplace AI" },
      {
        property: "og:description",
        content: "Turn a goal into a prioritized, time-boxed execution plan you can edit.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <AppShell
      title="AI Task Planner"
      description="Break a goal into a prioritized, time-boxed plan you can act on today."
    >
      <ToolWorkspace
        system="You are a pragmatic project planner. Produce realistic, prioritized plans with time estimates. Flag assumptions explicitly instead of presenting them as facts."
        cta="Build plan"
        outputLabel="Task plan (editable)"
        tips={["Add constraints so estimates stay realistic.", "Edit priorities and estimates directly in the output."]}
        fields={[
          { name: "goal", label: "Goal or project", placeholder: "e.g. Launch the customer onboarding revamp", required: true },
          { name: "context", label: "Context, constraints & resources", type: "textarea", rows: 5, placeholder: "Team of 3, no design support, legal review needed…" },
          { name: "horizon", label: "Time horizon", type: "select", options: ["Today", "This week", "Two weeks", "One month", "One quarter"] },
          { name: "method", label: "Prioritization method", type: "select", options: ["Impact vs effort", "MoSCoW", "Eisenhower matrix", "Sequential milestones"] },
        ]}
        buildPrompt={(v) => `Create an execution plan.

Goal: ${v("goal")}
Time horizon: ${v("horizon")}
Prioritization method: ${v("method")}
Context & constraints: ${v("context") || "Not stated"}

Return:
1. Objective restated in one sentence
2. Milestones with target dates relative to the horizon
3. Prioritized task list — task | priority | estimate | dependency
4. Suggested schedule / time blocks
5. Risks and assumptions (clearly labelled as assumptions)
6. Definition of done`}
      />
    </AppShell>
  );
}
