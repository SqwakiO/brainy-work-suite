import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateAssist } from "@/lib/ai.functions";

export type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "input" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  rows?: number;
};

export function ToolWorkspace({
  fields,
  system,
  buildPrompt,
  cta = "Generate with AI",
  outputLabel = "AI draft (editable)",
  tips,
}: {
  fields: Field[];
  system: string;
  buildPrompt: (values: Record<string, string>) => string;
  cta?: string;
  outputLabel?: string;
  tips?: string[];
}) {
  const initial = Object.fromEntries(
    fields.map((f) => [f.name, f.type === "select" ? (f.options?.[0] ?? "") : ""]),
  );
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [output, setOutput] = useState("");
  const generate = useServerFn(generateAssist);

  const mutation = useMutation({
    mutationFn: (prompt: string) => generate({ data: { system, prompt } }),
    onSuccess: (res) => setOutput(res.text.trim()),
    onError: (error: Error) => toast.error(error.message || "Generation failed"),
  });

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const submit = () => {
    const missing = fields.filter((f) => f.required && !values[f.name]?.trim());
    if (missing.length) {
      toast.error(`Please fill in: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }
    mutation.mutate(buildPrompt(values));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <section className="surface-card p-5 md:p-6">
        <h2 className="text-base font-semibold">Structured prompt</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill the fields — they are assembled into a guided AI prompt.
        </p>

        <div className="mt-5 space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  rows={field.rows ?? 5}
                  placeholder={field.placeholder ?? ""}
                  value={values[field.name] ?? ""}
                  onChange={(e) => set(field.name, e.target.value)}
                />
              ) : field.type === "select" ? (
                <Select value={values[field.name]} onValueChange={(v) => set(field.name, v)}>
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {(field.options ?? []).map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.name}
                  placeholder={field.placeholder ?? ""}
                  value={values[field.name] ?? ""}
                  onChange={(e) => set(field.name, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={submit} disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {mutation.isPending ? "Generating…" : cta}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setValues(initial);
              setOutput("");
            }}
          >
            <RotateCcw className="size-4" /> Reset
          </Button>
        </div>

        {tips && tips.length > 0 && (
          <ul className="mt-5 space-y-1.5 text-xs text-muted-foreground">
            {tips.map((tip) => (
              <li key={tip}>• {tip}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="surface-card flex flex-col p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">{outputLabel}</h2>
          <Button
            variant="ghost"
            size="sm"
            disabled={!output}
            onClick={() => {
              void navigator.clipboard.writeText(output);
              toast.success("Copied to clipboard");
            }}
          >
            <Copy className="size-4" /> Copy
          </Button>
        </div>

        <Textarea
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder="Your AI output will appear here — fully editable before you use it."
          className="prose-output mt-4 min-h-[22rem] flex-1 resize-y bg-background text-sm"
        />

        <div className="mt-4">
          <AiDisclaimer />
        </div>
      </section>
    </div>
  );
}
