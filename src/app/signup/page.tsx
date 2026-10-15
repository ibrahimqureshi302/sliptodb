"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      const inboundKey = Math.random().toString(36).substring(2, 10);

      const { error: customerError } = await supabase
        .from("customers")
        .insert({
          id: authData.user.id,
          email: email,
          name: name || null,
          inbound_key: inboundKey,
          plan: "starter",
          monthly_quota: 500,
          credits_remaining: 500,
          status: "active",
        });

      if (customerError) {
        console.error("Customer creation error:", customerError);
        setError("Account created, but customer profile failed: " + customerError.message);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err instanceof Error
          ? `Network error: ${err.message}`
          : "An unexpected error occurred."
      );
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm shadow-violet-600/40">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight">SlipToDB</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/30 p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Start your 14-day trial. No credit card required.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters.
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-violet-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link href="#" className="underline">Terms</Link>{" "}
          and{" "}
          <Link href="#" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
