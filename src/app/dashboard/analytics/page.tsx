"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, FileText, DollarSign, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalValue: 0,
    avgValue: 0,
    thisMonthCount: 0,
    topVendors: [] as { name: string; count: number; total: number }[],
  });

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

      const { data: invoices } = await supabase
        .from("invoices")
        .select("vendor_name, total, created_at")
        .eq("customer_id", user.id);

      if (!invoices || invoices.length === 0) {
        setLoading(false);
        return;
      }

      // Compute stats
      const totalValue = invoices.reduce(
        (sum, inv) => sum + (Number(inv.total) || 0),
        0
      );

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const thisMonth = invoices.filter(
        (inv) => new Date(inv.created_at) >= oneMonthAgo
      );

      // Group by vendor
      const vendorMap = new Map<string, { count: number; total: number }>();
      invoices.forEach((inv) => {
        const vendor = inv.vendor_name || "Unknown";
        const current = vendorMap.get(vendor) || { count: 0, total: 0 };
        vendorMap.set(vendor, {
          count: current.count + 1,
          total: current.total + (Number(inv.total) || 0),
        });
      });

      const topVendors = Array.from(vendorMap.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      setStats({
        totalInvoices: invoices.length,
        totalValue,
        avgValue: totalValue / invoices.length,
        thisMonthCount: thisMonth.length,
        topVendors,
      });
      setLoading(false);
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted/40" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted/30" />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: "Total invoices",
      value: stats.totalInvoices.toString(),
      icon: FileText,
    },
    {
      label: "Total value",
      value: `$${stats.totalValue.toFixed(2)}`,
      icon: DollarSign,
    },
    {
      label: "Average invoice",
      value: `$${stats.avgValue.toFixed(2)}`,
      icon: TrendingUp,
    },
    {
      label: "Last 30 days",
      value: stats.thisMonthCount.toString(),
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Insights into your invoice data
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border/50 bg-card/30 p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <card.icon className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top vendors */}
      {stats.topVendors.length > 0 && (
        <div className="rounded-2xl border border-border/50 bg-card/30 p-6">
          <h2 className="mb-4 text-base font-semibold">Top vendors</h2>
          <div className="space-y-3">
            {stats.topVendors.map((vendor, i) => {
              const maxTotal = stats.topVendors[0].total || 1;
              const percentage = (vendor.total / maxTotal) * 100;

              return (
                <div key={vendor.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {i + 1}. {vendor.name}
                    </span>
                    <span className="text-muted-foreground">
                      {vendor.count} invoice{vendor.count !== 1 ? "s" : ""} · $
                      {vendor.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-violet-500/10">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {stats.topVendors.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/20 p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No invoice data yet. Forward your first invoice to see analytics.
          </p>
        </div>
      )}
    </div>
  );
}
