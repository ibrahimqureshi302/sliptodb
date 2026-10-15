"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted/40" />
        <div className="h-96 animate-pulse rounded-2xl bg-muted/30" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <div className="space-y-4">
        <SettingCard
          title="Current plan"
          description="Your subscription tier and quota"
        >
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium capitalize">
                {customer?.plan || "starter"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Monthly quota</span>
              <span className="font-medium">
                {customer?.monthly_quota || 500} invoices
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Credits remaining</span>
              <span className="font-medium">
                {customer?.credits_remaining || 0}
              </span>
            </div>
          </div>
        </SettingCard>

        <SettingCard
          title="Inbound email"
          description="Your unique forwarding address"
        >
          <code className="block w-full truncate rounded-lg border border-border/50 bg-background/60 px-3 py-2 text-sm">
            {customer?.inbound_key}@p6cddxoiyq.mailcare.dev
          </code>
        </SettingCard>

        <SettingCard
          title="Account status"
          description="Your account is active"
        >
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="capitalize text-muted-foreground">
              {customer?.status || "active"}
            </span>
          </div>
        </SettingCard>
      </div>
    </div>
  );
}

function SettingCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/30 p-6">
      <div className="mb-4">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
