import { ShieldCheck } from "lucide-react";

export function AiDisclaimer({ note }: { note?: string }) {
  return (
    <p className="flex items-start gap-2 rounded-lg border border-border bg-secondary/60 px-3 py-2.5 text-xs text-muted-foreground">
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
      <span>
        {note ??
          "This output is AI-generated and may contain errors. Review, edit, and verify before use. Avoid entering confidential or personal data."}
      </span>
    </p>
  );
}
