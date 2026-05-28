import { ArrowLeft, Check, Crown, Sparkles, Zap } from "lucide-react";
import { GlassCard } from "@/components/oikos/GlassCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { usePrefs } from "@/lib/i18n";

const features = {
  free: [
    "Up to 3 family members",
    "Basic schedule & tasks",
    "20 AI chat messages / day",
    "Standard notifications",
  ],
  pro: [
    "Unlimited family members",
    "Smart conflict resolution AI",
    "Unlimited AI chat & insights",
    "Advanced analytics dashboard",
    "Priority support",
    "Custom themes & branding",
    "Google Calendar 2-way sync",
  ],
};

export function BillingScreen({ onBack }: { onBack: () => void }) {
  const { t } = usePrefs();
  const [current] = useState<"free" | "pro">("free");
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    // Real Stripe checkout will be wired once Stripe is enabled.
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.info("Stripe checkout opens here once billing is connected.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack}><ArrowLeft className="w-6 h-6" /></button>
        <Crown className="w-6 h-6 text-primary" />
        <h2>{t("billing")}</h2>
      </div>

      <div className="p-4 pb-24 space-y-4 max-w-3xl w-full mx-auto">
        <GlassCard className="p-6 text-center">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
          <h2 className="text-2xl mb-2">Choose your plan</h2>
          <p className="text-sm text-muted-foreground">
            Start free, upgrade when your household needs more intelligence.
          </p>
        </GlassCard>

        <div className="grid md:grid-cols-2 gap-4">
          <GlassCard className="p-6 space-y-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Free</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-semibold">$0</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Perfect to try OikOS.</p>
            </div>
            <ul className="space-y-2">
              {features.free.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" disabled={current === "free"}>
              {current === "free" ? "Current plan" : "Downgrade"}
            </Button>
          </GlassCard>

          <GlassCard className="p-6 space-y-4 border-2 border-primary/40 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" /> Most popular
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-primary">Pro</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-semibold">$20</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Full power for the whole household.</p>
            </div>
            <ul className="space-y-2">
              {features.pro.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Button
              onClick={handleUpgrade}
              disabled={loading || current === "pro"}
              className="w-full bg-primary text-primary-foreground"
            >
              {current === "pro" ? "Current plan" : loading ? "Opening checkout…" : `${t("upgrade")} to Pro`}
            </Button>
          </GlassCard>
        </div>

        <GlassCard className="p-4 text-xs text-muted-foreground text-center">
          Secured by Stripe. Cancel anytime. Taxes calculated at checkout.
        </GlassCard>
      </div>
    </div>
  );
}