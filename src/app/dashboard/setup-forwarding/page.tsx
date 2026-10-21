"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  Inbox,
  Filter,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const INBOUND_DOMAIN = "p6cddxoiyq.mailcare.dev";

export default function SetupForwardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedFilter, setCopiedFilter] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("customers")
        .select("*")
        .eq("id", user.id)
        .single();

      setCustomer(data);
      setLoading(false);
    }

    load();
  }, [router]);

  async function copyToClipboard(text: string, type: "email" | "filter") {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedFilter(true);
        setTimeout(() => setCopiedFilter(false), 2000);
      }
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }

  function markStepComplete(step: number) {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev : [...prev, step]
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted/40" />
        <div className="h-96 animate-pulse rounded-2xl bg-muted/30" />
      </div>
    );
  }

  if (!customer) return null;

  const inboundEmail = `${customer.inbound_key}@${INBOUND_DOMAIN}`;
  const filterTemplate = `subject:(invoice) OR subject:(receipt) OR subject:(bill)`;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-violet-500">
          <Sparkles className="h-4 w-4" />
          Automation Setup
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Set up Gmail auto-forwarding
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Stop manually forwarding invoices. Set up Gmail to forward them
          automatically — takes 2 minutes.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`h-1 flex-1 rounded-full transition-colors ${
              completedSteps.includes(step)
                ? "bg-violet-500"
                : "bg-muted/40"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Copy your email */}
      <div
        className={`rounded-2xl border p-6 transition-colors ${
          completedSteps.includes(1)
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-border/50 bg-card/30"
        }`}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-sm font-bold text-violet-500">
            1
          </div>
          <div>
            <h2 className="font-semibold">Copy your SlipToDB email</h2>
            <p className="text-sm text-muted-foreground">
              This is where Gmail will forward your invoices.
            </p>
          </div>
          {completedSteps.includes(1) && (
            <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-500" />
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <code className="flex-1 truncate rounded-lg border border-border/50 bg-background/60 px-3 py-2 text-sm">
            {inboundEmail}
          </code>
          <Button
            onClick={() => {
              copyToClipboard(inboundEmail, "email");
              markStepComplete(1);
            }}
            variant={copiedEmail ? "outline" : "default"}
            className={copiedEmail ? "" : "bg-violet-600 hover:bg-violet-700 text-white"}
          >
            {copiedEmail ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Email
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Step 2: Add forwarding address */}
      <div
        className={`rounded-2xl border p-6 transition-colors ${
          completedSteps.includes(2)
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-border/50 bg-card/30"
        }`}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-sm font-bold text-violet-500">
            2
          </div>
          <div>
            <h2 className="font-semibold">Add it as a forwarding address</h2>
            <p className="text-sm text-muted-foreground">
              Authorize Gmail to send emails to SlipToDB.
            </p>
          </div>
          {completedSteps.includes(2) && (
            <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-500" />
          )}
        </div>

        <div className="space-y-3 rounded-lg bg-background/40 p-4 text-sm">
          <p className="font-medium">Follow these steps:</p>
          <ol className="ml-4 list-decimal space-y-2 text-muted-foreground">
            <li>Open Gmail and click the gear icon ⚙️ → "See all settings"</li>
            <li>Go to the "Forwarding and POP/IMAP" tab</li>
            <li>Click "Add a forwarding address"</li>
            <li>Paste your SlipToDB email and click "Next"</li>
            <li>Check your inbox for a confirmation code and verify it</li>
          </ol>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <a
            href="https://mail.google.com/mail/u/0/#settings/fwdandpop"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              variant="outline"
              className="w-full"
              onClick={() => markStepComplete(2)}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Gmail Settings
            </Button>
          </a>
          <Button
            variant="ghost"
            onClick={() => markStepComplete(2)}
            className="text-xs"
          >
            Mark as done
          </Button>
        </div>
      </div>

      {/* Step 3: Create a filter */}
      <div
        className={`rounded-2xl border p-6 transition-colors ${
          completedSteps.includes(3)
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-border/50 bg-card/30"
        }`}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-sm font-bold text-violet-500">
            3
          </div>
          <div>
            <h2 className="font-semibold">Create a Gmail filter</h2>
            <p className="text-sm text-muted-foreground">
              Tell Gmail which emails to forward automatically.
            </p>
          </div>
          {completedSteps.includes(3) && (
            <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-500" />
          )}
        </div>

        <div className="space-y-3 rounded-lg bg-background/40 p-4 text-sm">
          <p className="font-medium">Filter criteria:</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <code className="flex-1 rounded border border-border/50 bg-background/60 px-3 py-2 text-xs">
              {filterTemplate}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(filterTemplate, "filter")}
            >
              {copiedFilter ? (
                <>
                  <Check className="mr-2 h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            You can customize this — for example, add specific supplier emails
            or use <code>from:(*@supplier.com)</code> to forward from a
            specific domain.
          </p>
        </div>

        <div className="mt-4 space-y-3 rounded-lg bg-background/40 p-4 text-sm">
          <p className="font-medium">Then in Gmail:</p>
          <ol className="ml-4 list-decimal space-y-2 text-muted-foreground">
            <li>Search Google "Create a filter" or go to Gmail → Settings → Filters</li>
            <li>Click "Create a new filter"</li>
            <li>Paste the filter criteria above</li>
            <li>Click "Create filter"</li>
            <li>Check: "Forward it to" → select your SlipToDB email</li>
            <li>Check: "Also apply filter to matching conversations"</li>
            <li>Click "Create filter"</li>
          </ol>
        </div>

        <Button
          variant="ghost"
          onClick={() => markStepComplete(3)}
          className="mt-4 text-xs"
        >
          Mark as done
        </Button>
      </div>

      {/* Completion */}
      {completedSteps.length === 3 && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
          <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-emerald-500" />
          <h2 className="text-xl font-bold">You're all set! 🎉</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Every future invoice will now appear in your dashboard
            automatically. No manual forwarding needed.
          </p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Back to dashboard */}
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="text-sm"
        >
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
