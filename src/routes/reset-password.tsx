import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set new password — OikOS" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated");
      navigate({ to: "/dashboard", replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-app-gradient flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size={48} showWordmark={false} />
          <h1 className="text-2xl font-semibold mt-4">Set a new password</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">New password</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 h-11" />
            </div>
          </div>
          <Button type="submit" disabled={submitting} className="w-full h-11 bg-gradient-to-r from-[#FF7E9D] to-[#7AB8E0] text-white">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update password"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            <Link to="/login" className="hover:underline">Back to sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}