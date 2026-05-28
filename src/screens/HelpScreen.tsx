import { ArrowLeft, HelpCircle, Mail, MessageCircle, Book, Sparkles, ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/oikos/GlassCard";
import { useState } from "react";
import mascotUrl from "@/assets/oikos-mascot.png";
import { usePrefs } from "@/lib/i18n";

const faqs = [
  {
    q: "What is Oik-Os?",
    a: "Oik-Os is your friendly AI household assistant. It helps you organize schedules, tasks, groceries, and family events with intelligent suggestions across the entire app.",
  },
  {
    q: "What's the difference between Free and Pro?",
    a: "Free gives you 3 family members and 20 AI messages per day. Pro ($20/mo) unlocks unlimited members, unlimited AI, advanced analytics, conflict resolution, and Google Calendar sync.",
  },
  {
    q: "How does AI conflict resolution work?",
    a: "When two events overlap, Oik-Os scans calendars across the household, proposes a reschedule with a confidence score, and lets you accept in one tap.",
  },
  {
    q: "Is my family data private?",
    a: "Yes. All data is scoped to your account with row-level security. Only members you invite can see shared household information.",
  },
  {
    q: "Can I cancel my Pro subscription?",
    a: "Yes. You can downgrade to Free anytime from Billing — you'll keep Pro features until the end of your billing period.",
  },
];

export function HelpScreen({ onBack, onNavigate }: { onBack: () => void; onNavigate?: (s: string) => void }) {
  const { t } = usePrefs();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack}><ArrowLeft className="w-6 h-6" /></button>
        <HelpCircle className="w-6 h-6 text-primary" />
        <h2>{t("help")}</h2>
      </div>

      <div className="p-4 pb-24 space-y-4 max-w-3xl w-full mx-auto">
        <GlassCard className="p-6 flex items-center gap-4">
          <img src={mascotUrl} alt="Oik-Os mascot" className="w-16 h-16" />
          <div className="flex-1">
            <h3 className="text-lg">Hi, I'm Oik-Os!</h3>
            <p className="text-sm text-muted-foreground">Ask me anything — I'll help you get the most out of the app.</p>
          </div>
          <button
            onClick={() => onNavigate?.("ai")}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Chat
          </button>
        </GlassCard>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <a href="mailto:support@oik-os.app" className="glass-card p-4 flex flex-col items-center text-center gap-2 hover:bg-white/40 transition">
            <Mail className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Email us</span>
            <span className="text-xs text-muted-foreground">support@oik-os.app</span>
          </a>
          <button onClick={() => onNavigate?.("ai")} className="glass-card p-4 flex flex-col items-center text-center gap-2 hover:bg-white/40 transition">
            <MessageCircle className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Live chat</span>
            <span className="text-xs text-muted-foreground">With Oik-Os AI</span>
          </button>
          <a href="#" className="glass-card p-4 flex flex-col items-center text-center gap-2 hover:bg-white/40 transition col-span-2 md:col-span-1">
            <Book className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Guides</span>
            <span className="text-xs text-muted-foreground">Read the docs</span>
          </a>
        </div>

        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 pb-3">
            <h3>Frequently asked</h3>
          </div>
          <div className="divide-y divide-border">
            {faqs.map((f, i) => (
              <button
                key={i}
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left p-4 hover:bg-white/30 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{f.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
                </div>
                {open === i && <p className="text-sm text-muted-foreground mt-2">{f.a}</p>}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}