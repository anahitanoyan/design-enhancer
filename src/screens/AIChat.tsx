import { ArrowLeft, Send, User, Loader2 } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import mascotUrl from "@/assets/oikos-mascot.png";

const SUGGESTIONS = [
  "Plan my week",
  "What's for dinner tonight?",
  "Find a free hour for my family",
  "Summarize today's tasks",
];

export function AIChat({ onBack, context }: { onBack: () => void; context?: string }) {
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat", body: { context } })).current;
  const { messages, sendMessage, status, error } = useChat({
    transport,
    onError: (e) => toast.error(e.message || "Oik-Os couldn't reply. Try again."),
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Auto-send a pending prompt handed off from the dashboard command bar.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const pending = sessionStorage.getItem("oikos_pending_ai_prompt");
    if (pending && pending.trim()) {
      sessionStorage.removeItem("oikos_pending_ai_prompt");
      sendMessage({ text: pending.trim() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setInput("");
    await sendMessage({ text: text.trim() });
  };

  return (
    <div className="min-h-screen flex flex-col bg-app-gradient">
      <header className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} aria-label="Back" className="md:hidden">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <img src={mascotUrl} alt="Oik-Os" width={40} height={40} className="w-10 h-10 drop-shadow-sm" />
        <div>
          <h2 className="font-semibold leading-tight">Oik-Os</h2>
          <p className="text-xs text-muted-foreground leading-tight">Your household helper</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-auto p-4 pb-28 md:pb-24 space-y-4 max-w-3xl w-full mx-auto">
        {messages.length === 0 && (
          <div className="text-center py-8 space-y-6">
            <img src={mascotUrl} alt="" width={120} height={120} className="w-28 h-28 mx-auto drop-shadow-lg" loading="eager" />
            <div>
              <h3 className="text-2xl font-semibold mb-1">Hi! I'm Oik-Os.</h3>
              <p className="text-sm text-muted-foreground">Ask me anything about your home, family, or day.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="px-4 py-2 rounded-full glass-card text-sm hover:bg-white/80 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => {
          const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
          const isUser = m.role === "user";
          return (
            <div key={m.id} className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
              <Avatar className="w-9 h-9 shrink-0">
                {isUser ? (
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                ) : (
                  <AvatarImage src={mascotUrl} alt="Oik-Os" />
                )}
              </Avatar>
              <div className={`max-w-[80%] ${isUser ? "" : ""}`}>
                {isUser ? (
                  <div className="rounded-2xl rounded-tr-sm px-4 py-3 bg-primary text-primary-foreground shadow-sm">
                    <p className="text-sm whitespace-pre-wrap">{text}</p>
                  </div>
                ) : (
                  <div className="px-1 py-2">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{text || (isLoading ? "…" : "")}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {status === "submitted" && (
          <div className="flex gap-3">
            <Avatar className="w-9 h-9 shrink-0">
              <AvatarImage src={mascotUrl} alt="Oik-Os" />
            </Avatar>
            <div className="px-1 py-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Thinking…
            </div>
          </div>
        )}

        {error && (
          <div className="text-sm text-destructive p-3 rounded-xl bg-destructive/10">
            {error.message}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="sticky bottom-0 md:bottom-0 p-4 pb-20 md:pb-4 bg-gradient-to-t from-background to-transparent"
      >
        <div className="glass-card max-w-3xl mx-auto p-2 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Oik-Os anything…"
            disabled={isLoading}
            className="flex-1 bg-transparent outline-none px-3 py-2 text-sm placeholder:text-muted-foreground"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition shrink-0"
            aria-label="Send"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
