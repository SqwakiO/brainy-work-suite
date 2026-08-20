import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Loader2, Send, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/AiDisclaimer";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatWithAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot Assistant | Workplace AI" },
      {
        name: "description",
        content:
          "Chat with an AI workplace copilot for quick answers, rewrites, brainstorming and process help.",
      },
      { property: "og:title", content: "AI Chatbot Assistant | Workplace AI" },
      {
        property: "og:description",
        content: "A conversational AI copilot for everyday workplace questions and drafting.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Rewrite this update to be more concise",
  "Help me prepare for a performance review",
  "Draft an agenda for a 30-minute kickoff",
  "Suggest a follow-up sequence for a stalled deal",
];

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const send = useServerFn(chatWithAssistant);
  const endRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation({
    mutationFn: (next: Message[]) => send({ data: { messages: next } }),
    onSuccess: (res) =>
      setMessages((m) => [...m, { role: "assistant", content: res.text.trim() }]),
    onError: (error: Error) => toast.error(error.message || "The assistant could not reply"),
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mutation.isPending]);

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || mutation.isPending) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    mutation.mutate(next);
  };

  return (
    <AppShell
      title="AI Chatbot Assistant"
      description="Ask anything about your work — drafting, planning, analysis or process help."
    >
      <div className="surface-card mx-auto flex h-[calc(100vh-14rem)] min-h-[32rem] max-w-4xl flex-col">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <span className="text-sm font-semibold">Conversation</span>
          <Button
            variant="ghost"
            size="sm"
            disabled={messages.length === 0}
            onClick={() => setMessages([])}
          >
            <Trash2 className="size-4" /> Clear
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.length === 0 && (
            <div className="mx-auto max-w-lg py-8 text-center">
              <span className="gradient-hero mx-auto flex size-12 items-center justify-center rounded-2xl">
                <Bot className="size-6 text-primary-foreground" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">How can I help today?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Start with a prompt, or type your own question below.
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-lg border border-border bg-background px-3 py-2.5 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                  m.role === "user" ? "bg-secondary" : "gradient-hero"
                }`}
              >
                {m.role === "user" ? (
                  <User className="size-4 text-secondary-foreground" />
                ) : (
                  <Bot className="size-4 text-primary-foreground" />
                )}
              </span>
              <div
                className={`prose-output max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {mutation.isPending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Thinking…
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="space-y-3 border-t border-border px-5 py-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              rows={2}
              placeholder="Ask the assistant… (Enter to send, Shift+Enter for a new line)"
              className="min-h-[3rem] resize-none bg-background"
            />
            <Button onClick={() => submit(input)} disabled={mutation.isPending || !input.trim()}>
              <Send className="size-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
          <AiDisclaimer note="Responses are AI-generated and may be inaccurate. Do not share confidential or personal data, and verify anything you rely on." />
        </div>
      </div>
    </AppShell>
  );
}
