import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, stepCountIs, tool, type UIMessage } from "ai";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are Oik-Os, a cheerful cartoon house mascot and the AI companion of the OikOS household app.

Personality:
- Warm, friendly, encouraging — like a helpful neighbor.
- Concise. Prefer short paragraphs and bullet lists.
- You can DIRECTLY take action using your tools: create tasks, add grocery items, schedule events, list today's events, and list open tasks. When the user asks for one of those, just do it — don't ask them to navigate manually. After acting, confirm what you did in one short line.
- If the user is not signed in, tools will fail with an auth error; in that case ask them to sign in.
- If asked who you are, say: "I'm Oik-Os, your little household helper!" Never claim to be a generic AI.
- Use markdown for structure (lists, **bold**). Never use emoji-only replies.
- If you don't know something, say so plainly and offer a next step.`;

function makeUserSupabase(token: string) {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

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

        const authHeader = request.headers.get("authorization") ?? "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
        const userClient = token ? makeUserSupabase(token) : null;
        const requireAuth = <T,>(fn: (sb: NonNullable<typeof userClient>) => Promise<T>) => async () => {
          if (!userClient) return { error: "Not signed in. Please sign in to let me act on your household." } as any;
          try { return await fn(userClient); } catch (e: any) { return { error: e?.message ?? "Action failed" }; }
        };

        const tools = {
          create_task: tool({
            description: "Create a new task for the signed-in user.",
            inputSchema: z.object({
              title: z.string().min(1).max(200),
              priority: z.enum(["low", "medium", "high"]).optional(),
              due_date: z.string().describe("ISO date YYYY-MM-DD").optional(),
              assignee: z.string().max(80).optional(),
            }),
            execute: async ({ title, priority, due_date, assignee }) =>
              requireAuth(async (sb) => {
                const { data: u } = await sb.auth.getUser();
                const owner_id = u.user?.id;
                if (!owner_id) return { error: "Auth missing" };
                const { data, error } = await sb.from("tasks").insert({
                  owner_id, title, priority: priority ?? "medium", due_date: due_date ?? null, assignee: assignee ?? null,
                }).select("id, title, priority, due_date").single();
                if (error) return { error: error.message };
                return { ok: true, task: data };
              })(),
          }),
          add_grocery_item: tool({
            description: "Add an item to the grocery list.",
            inputSchema: z.object({
              name: z.string().min(1).max(120),
              category: z.string().max(40).optional(),
              quantity: z.string().max(40).optional(),
            }),
            execute: async ({ name, category, quantity }) =>
              requireAuth(async (sb) => {
                const { data: u } = await sb.auth.getUser();
                const owner_id = u.user?.id;
                if (!owner_id) return { error: "Auth missing" };
                const { data, error } = await sb.from("grocery_items").insert({
                  owner_id, name, category: category ?? "Other", quantity: quantity ?? null, ai_suggested: true,
                }).select("id, name, category, quantity").single();
                if (error) return { error: error.message };
                return { ok: true, item: data };
              })(),
          }),
          create_event: tool({
            description: "Schedule a calendar event.",
            inputSchema: z.object({
              title: z.string().min(1).max(200),
              starts_at: z.string().describe("ISO datetime"),
              ends_at: z.string().describe("ISO datetime"),
              location: z.string().max(200).optional(),
              attendees: z.array(z.string()).optional(),
            }),
            execute: async ({ title, starts_at, ends_at, location, attendees }) =>
              requireAuth(async (sb) => {
                const { data: u } = await sb.auth.getUser();
                const owner_id = u.user?.id;
                if (!owner_id) return { error: "Auth missing" };
                const { data, error } = await sb.from("events").insert({
                  owner_id, title, starts_at, ends_at, location: location ?? null, attendees: attendees ?? [],
                }).select("id, title, starts_at, ends_at").single();
                if (error) return { error: error.message };
                return { ok: true, event: data };
              })(),
          }),
          list_today_events: tool({
            description: "List today's events for the user.",
            inputSchema: z.object({}),
            execute: async () =>
              requireAuth(async (sb) => {
                const start = new Date(); start.setHours(0, 0, 0, 0);
                const end = new Date(); end.setHours(23, 59, 59, 999);
                const { data, error } = await sb.from("events")
                  .select("id, title, starts_at, ends_at, location")
                  .gte("starts_at", start.toISOString())
                  .lte("starts_at", end.toISOString())
                  .order("starts_at", { ascending: true });
                if (error) return { error: error.message };
                return { ok: true, events: data ?? [] };
              })(),
          }),
          list_open_tasks: tool({
            description: "List the user's open (incomplete) tasks.",
            inputSchema: z.object({ limit: z.number().int().min(1).max(50).optional() }),
            execute: async ({ limit }) =>
              requireAuth(async (sb) => {
                const { data, error } = await sb.from("tasks")
                  .select("id, title, priority, due_date")
                  .eq("completed", false)
                  .order("due_date", { ascending: true, nullsFirst: false })
                  .limit(limit ?? 10);
                if (error) return { error: error.message };
                return { ok: true, tasks: data ?? [] };
              })(),
          }),
        };

        const gateway = createLovableAiGatewayProvider(key);
        const system = body.context
          ? `${SYSTEM_PROMPT}\n\nThe user is currently on the **${body.context}** screen. Tailor actions/suggestions to that section when relevant.`
          : SYSTEM_PROMPT;

        const result = streamText({
          model: gateway("google/gemini-2.5-flash"),
          system,
          tools,
          stopWhen: stepCountIs(50),
          messages: await convertToModelMessages(body.messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: body.messages });
      },
    },
  },
});