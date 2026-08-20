import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const AssistInput = z.object({
  system: z.string().min(1),
  prompt: z.string().min(1),
});

const ChatInput = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
});

const CHAT_SYSTEM = `You are the AI Workplace Productivity Assistant, a concise, professional
workplace copilot. Answer with clear structure, use markdown-style headings and bullet lists
where useful, and never invent facts, names, numbers or citations. If something is uncertain,
say so plainly.`;

async function runModel(system: string, messages: { role: "user" | "assistant"; content: string }[]) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

  const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
  const gateway = createLovableAiGatewayProvider(apiKey);

  try {
    const result = streamText({
      model: gateway("google/gemini-3.7-flash"),
      system,
      messages,
    });
    return { text: await result.text };
  } catch (error) {
    const status = (error as { statusCode?: number; status?: number })?.statusCode ??
      (error as { status?: number })?.status;
    if (status === 402) {
      throw new Error("AI credits are exhausted. Add credits in Lovable to keep generating.");
    }
    if (status === 429) {
      throw new Error("Too many requests right now. Please wait a moment and try again.");
    }
    throw new Error(
      error instanceof Error ? error.message : "The AI request failed. Please try again.",
    );
  }
}

export const generateAssist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AssistInput.parse(input))
  .handler(async ({ data }) => runModel(data.system, [{ role: "user", content: data.prompt }]));

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => runModel(CHAT_SYSTEM, data.messages));
