import { createFileRoute } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Calendar, CheckSquare, ShoppingCart, Sparkles, Users, TrendingUp, Bell, Shield } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import logoUrl from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OikOS — AI Household Operating System" },
      { name: "description", content: "OikOS is your AI-powered household command center for schedules, tasks, grocery, family and notifications. Free to try." },
      { property: "og:title", content: "OikOS — AI Operating System for Household Life" },
      { property: "og:description", content: "Your AI-powered household command center." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [user, loading, navigate]);

  const features = [
    { icon: Calendar, title: "Smart Schedule", desc: "AI conflict resolution and color-coded family calendar." },
    { icon: CheckSquare, title: "Tasks That Move", desc: "Kanban + assignment + priority, optimized by AI." },
    { icon: ShoppingCart, title: "Grocery Genius", desc: "Auto-built lists from your meal plan." },
    { icon: Bell, title: "Context Alerts", desc: "Reminders that know who, when, and where." },
    { icon: Users, title: "Family First", desc: "Shared spaces with roles and permissions." },
    { icon: TrendingUp, title: "Insights", desc: "Beautiful analytics on household productivity." },
  ];

  return (
    <div className="min-h-screen bg-app-gradient">
      {/* Nav */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Logo tagline="AI Household OS" />
        <nav className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-primary text-primary-foreground hover:opacity-90">
              Get started
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main>
        <section className="px-6 pt-12 pb-20 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img src={logoUrl} alt="OikOS" width={120} height={120} className="mx-auto mb-6 drop-shadow-xl" />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Now with 4 AI agents for your home</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-tight">
              The operating system <br />
              for <span className="text-gradient-brand">your household</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Schedules, tasks, groceries, notifications and family — coordinated by AI agents that actually feel like helpful roommates.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 h-12 px-8 text-base">
                  Start free <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  I already have an account
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5" /> End-to-end encrypted · No credit card needed
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="px-6 pb-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card p-6"
              >
                <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-24 max-w-3xl mx-auto text-center">
          <div className="glass-card p-10">
            <h2 className="text-3xl font-semibold mb-3">Make home feel effortless.</h2>
            <p className="text-muted-foreground mb-6">Join thousands of families using OikOS to take the load off.</p>
            <Link to="/signup">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                Create your free account
              </Button>
            </Link>
          </div>
        </section>

        <footer className="px-6 py-8 text-center text-xs text-muted-foreground">
          © 2026 OikOS · Made with care
        </footer>
      </main>
    </div>
  );
}
