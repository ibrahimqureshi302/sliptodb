"use client";

import { useState } from "react";
import { PartyPopper, X, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface OnboardingBannerProps {
  customerId: string;
  initialStep: number;
  hasInvoices: boolean;
  sheetConnected: boolean;
}

export function OnboardingBanner({
  customerId,
  initialStep,
  hasInvoices,
  sheetConnected,
}: OnboardingBannerProps) {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(initialStep);

  const steps = [
    {
      number: 1,
      label: "Copy your inbound email",
      completed: step >= 1,
      description: "Use the card above to copy your unique forwarding address.",
    },
    {
      number: 2,
      label: "Forward your first invoice",
      completed: hasInvoices,
      description: "Forward any invoice email to your inbound address.",
    },
    {
      number: 3,
      label: "Connect Google Sheets (optional)",
      completed: sheetConnected,
      description: "Sync your invoices to a Google Sheet automatically.",
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progress = (completedCount / steps.length) * 100;
  const allComplete = completedCount === steps.length;

  async function handleDismiss() {
    setVisible(false);
    const supabase = createClient();
    await supabase
      .from("customers")
      .update({ onboarding_completed: true })
      .eq("id", customerId);
  }

  async function handleMarkCopied() {
    if (step >= 1) return;
    const supabase = createClient();
    await supabase
      .from("customers")
      .update({ onboarding_step: 1 })
      .eq("id", customerId);
    setStep(1);
  }

  if (!visible) return null;
  if (allComplete) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent p-6">
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/20">
          <PartyPopper className="h-5 w-5 text-violet-500" />
        </div>

        <div className="flex-1">
          <h3 className="text-base font-semibold">Welcome to SlipToDB!</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete these 3 steps to get the most out of your account.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-violet-500/10">
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-violet-500">
              {completedCount}/{steps.length}
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {steps.map((s) => (
              <div
                key={s.number}
                className="flex items-start gap-3"
                onClick={s.number === 1 && !s.completed ? handleMarkCopied : undefined}
              >
                {s.completed ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <div>
                  <p
                    className={`text-sm font-medium ${
                      s.completed ? "text-muted-foreground line-through" : ""
                    }`}
                  >
                    {s.number}. {s.label}
                  </p>
                  {!s.completed && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {s.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <Button
              size="sm"
              onClick={handleDismiss}
              variant="outline"
              className="text-xs"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
