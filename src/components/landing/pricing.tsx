import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "per month",
      description: "For solo founders and freelancers",
      features: [
        "500 invoices per month",
        "1 inbound email address",
        "AI-powered extraction",
        "Google Sheets sync",
        "CSV export",
        "Email support",
      ],
      cta: "Start 14-day trial",
      href: "/signup?plan=starter",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For growing businesses and bookkeepers",
      features: [
        "5,000 invoices per month",
        "3 inbound email addresses",
        "AI-powered extraction",
        "Google Sheets sync",
        "CSV + API access",
        "Custom fields & rules",
        "Priority support",
      ],
      cta: "Start 14-day trial",
      href: "/signup?plan=pro",
      highlight: true,
    },
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-violet-500">
            Pricing
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple pricing. Cancel anytime.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every plan starts with a 14-day free trial. No credit card required to try.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.highlight
                  ? "border-violet-500/50 bg-violet-500/5 shadow-xl shadow-violet-500/5"
                  : "border-border/50 bg-card/30"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-1 text-xs font-medium text-white shadow-sm">
                  Most popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/{plan.period}</span>
              </div>

              <Link href={plan.href} className="mb-6 block">
                <Button
                  className={`w-full ${
                    plan.highlight
                      ? "bg-violet-600 hover:bg-violet-700 text-white"
                      : ""
                  }`}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Need more volume?{" "}
          <Link
            href="mailto:ibrahimqurashi302@gmail.com"
            className="text-violet-500 hover:underline"
          >
            Contact us for enterprise pricing
          </Link>
        </p>
      </div>
    </section>
  );
}
