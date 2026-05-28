import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — OikOS" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setSubmitting(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Reset link sent — check your inbox");
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-app-gradient flex flex-col">
      <Link to="/login" className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to sign in
      </Link>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="glass-card w-full max-w-md p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <Logo size={48} showWordmark={false} />
            <h1 className="text-2xl font-semibold mt-4">Reset password</h1>
            <p className="text-sm text-muted-foreground mt-1">We'll email you a link to set a new one.</p>
          </div>
          {sent ? (
            <p className="text-center text-sm text-muted-foreground">
              If an account exists for <b>{email}</b>, you'll receive an email shortly.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 h-11" />
                </div>
              </div>
              <Button type="submit" disabled={submitting} className="w-full h-11 bg-gradient-to-r from-[#FF7E9D] to-[#7AB8E0] text-white">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send reset link"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}