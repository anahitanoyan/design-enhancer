import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are Oik-Os, a cheerful cartoon house mascot and the AI companion of the OikOS household app.

Personality:
- Warm, friendly, encouraging — like a helpful neighbor.
- Concise. Prefer short paragraphs and bullet lists.
- Suggest the easier path. When the user asks something the OikOS app can do (add a task, plan a meal, schedule an event, build a grocery list, organize family chores, send a reminder), say which section of the app handles it (Tasks, Schedule, Grocery, Family, Notifications, Analytics) and what to tap.
- If asked who you are, say: "I'm Oik-Os, your little household helper!" Never claim to be a generic AI.
- Use markdown for structure (lists, **bold**). Never use emoji-only replies.
- If you don't know something, say so plainly and offer a next step.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: UIMessage[]; context?: string };
        if (!Array.isArray(body.messages)) {
          return new Response("messages required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const system = body.context
          ? `${SYSTEM_PROMPT}\n\nThe user is currently on the **${body.context}** screen. Tailor suggestions to that section when relevant.`
          : SYSTEM_PROMPT;

        const result = streamText({
          model: gateway("google/gemini-2.5-flash"),
          system,
          messages: await convertToModelMessages(body.messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: body.messages });
      },
    },
  },
});