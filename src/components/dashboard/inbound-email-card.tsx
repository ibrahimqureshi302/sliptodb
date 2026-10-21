"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InboundEmailCardProps {
  inboundKey: string;
}

const INBOUND_DOMAIN = "p6cddxoiyq.mailcare.dev";

export function InboundEmailCard({ inboundKey }: InboundEmailCardProps) {
  const [copied, setCopied] = useState(false);
  const inboundEmail = `${inboundKey}@${INBOUND_DOMAIN}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(inboundEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }

  return (
    <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent p-6 sm:p-8">
      <div className="flex items-center gap-2 text-sm font-medium text-violet-500">
        <Mail className="h-4 w-4" />
        Your inbound email
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        Forward any invoice email to this address and watch the data appear.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <code className="flex-1 truncate rounded-lg border border-border/50 bg-background/60 px-4 py-3 font-mono text-sm">
          {inboundEmail}
        </code>
        <Button
          onClick={handleCopy}
          variant={copied ? "outline" : "default"}
          className={
            copied
              ? ""
              : "bg-violet-600 hover:bg-violet-700 text-white"
          }
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Auto-forwarding link */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          💡 Tired of forwarding manually?
        </p>
        <Link
          href="/dashboard/setup-forwarding"
          className="inline-flex items-center gap-1 text-xs font-medium text-violet-500 hover:underline"
        >
          Set up auto-forwarding
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
