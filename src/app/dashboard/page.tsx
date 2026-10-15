"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { InboundEmailCard } from "@/components/dashboard/inbound-email-card";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { EmptyInvoices } from "@/components/dashboard/empty-invoices";
import { OnboardingBanner } from "@/components/dashboard/onboarding-banner";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [invoiceCount, setInvoiceCount] = useState(0);

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

      const { count } = await supabase
        .from("invoices")
        .select("*", { count: "exact", head: true })
        .eq("customer_id", user.id);

      setCustomer(customerData);
      setInvoiceCount(count || 0);
      setLoading(false);
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  if (!customer) return null;

  const userName = customer.name || "there";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {userName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here's what's happening with your SlipToDB account.
        </p>
      </div>

      {!customer.onboarding_completed && (
        <OnboardingBanner
          customerId={customer.id}
          initialStep={customer.onboarding_step ?? 0}
          hasInvoices={invoiceCount > 0}
          sheetConnected={customer.google_sheet_connected ?? false}
        />
      )}

      <InboundEmailCard inboundKey={customer.inbound_key} />

      <StatsCards
        invoiceCount={invoiceCount}
        creditsRemaining={customer.credits_remaining ?? 0}
        monthlyQuota={customer.monthly_quota ?? 0}
      />

      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent invoices</h2>
        <EmptyInvoices />
      </div>
    </div>
  );
}
