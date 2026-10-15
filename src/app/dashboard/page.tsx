"use client";


import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { InboundEmailCard } from "@/components/dashboard/inbound-email-card";
import { GoogleSheetsCard } from "@/components/dashboard/google-sheets-card";
import { OnboardingBanner } from "@/components/dashboard/onboarding-banner";
import { InvoiceTable, type Invoice } from "@/components/dashboard/invoice-table";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

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

      const { data: customerData } = await supabase
        .from("customers")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!customerData) {
        router.push("/signup");
        return;
      }

      const { data: invoiceData } = await supabase
        .from("invoices")
        .select(
          "id, vendor_name, invoice_number, invoice_date, due_date, currency, total, source_filename, created_at"
        )
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      setCustomer(customerData);
      setInvoices((invoiceData as Invoice[]) || []);
      setLoading(false);
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted/40" />
        <div className="h-32 animate-pulse rounded-2xl bg-muted/30" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted/30" />
      </div>
    );
  }

  if (!customer) return null;

  const userName = customer.name || "there";
  const invoiceCount = invoices.length;

  // Compute totals
  const totalValue = invoices.reduce(
    (sum, inv) => sum + (Number(inv.total) || 0),
    0
  );
  const monthlyQuota = customer.monthly_quota ?? 500;
  const creditsRemaining = customer.credits_remaining ?? 0;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, {userName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here's what's happening with your SlipToDB account.
        </p>
      </div>

      {/* Onboarding banner */}
      {!customer.onboarding_completed && (
        <OnboardingBanner
          customerId={customer.id}
          initialStep={customer.onboarding_step ?? 0}
          hasInvoices={invoiceCount > 0}
          sheetConnected={customer.google_sheet_connected ?? false}
        />
      )}

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Invoices"
          value={invoiceCount.toString()}
          hint={
            invoiceCount === 0
              ? "Forward your first invoice"
              : "All time"
          }
        />
        <StatCard
          label="Total Value"
          value={`$${totalValue.toFixed(2)}`}
          hint="Sum of recent invoices"
        />
        <StatCard
          label="Credits"
          value={creditsRemaining.toString()}
          hint="Remaining this period"
        />
        <StatCard
          label="Quota"
          value={monthlyQuota.toString()}
          hint="Monthly invoice limit"
        />
      </div>

      {/* Inbound email */}
      <InboundEmailCard inboundKey={customer.inbound_key} />

      {/* Google Sheets */}
      <GoogleSheetsCard
        connected={customer.google_sheet_connected ?? false}
        sheetId={customer.google_sheet_id ?? null}
      />

      {/* Recent invoices */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent invoices</h2>
          {invoices.length > 0 && (
            <Link
              href="/dashboard/invoices"
              className="inline-flex items-center gap-1 text-sm text-violet-500 hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
        <InvoiceTable invoices={invoices} pageSize={5} />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/30 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
