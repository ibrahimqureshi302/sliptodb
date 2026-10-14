import { FileText, Coins, Calendar } from "lucide-react";

interface StatsCardsProps {
  invoiceCount: number;
  creditsRemaining: number;
  monthlyQuota: number;
}

export function StatsCards({
  invoiceCount,
  creditsRemaining,
  monthlyQuota,
}: StatsCardsProps) {
  const stats = [
    {
      icon: FileText,
      label: "Invoices processed",
      value: invoiceCount,
    },
    {
      icon: Coins,
      label: "Credits remaining",
      value: creditsRemaining,
    },
    {
      icon: Calendar,
      label: "Quota this month",
      value: monthlyQuota,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-border/50 bg-card/30 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <stat.icon className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
