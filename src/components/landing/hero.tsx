import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-to-b from-violet-500/10 via-background to-background" />

      <div className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Forward an email.
            <br />
            <span className="text-violet-500">Get structured data.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            SlipToDB turns invoice emails into clean database rows — automatically.
            No manual entry, no PDF parsing, no setup headaches.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
                Start free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline">
                See how it works
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-violet-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-violet-500" />
              <span>Setup in 2 minutes</span>
            </div>
          </div>
        </div>

        {/* Product preview mockup */}
        <div className="mx-auto mt-20 max-w-5xl">
          <div className="rounded-2xl border border-border/50 bg-card/30 p-2 shadow-2xl shadow-violet-500/5 backdrop-blur">
            <div className="overflow-hidden rounded-xl border border-border/50 bg-background">
              <div className="flex items-center gap-1.5 border-b border-border/50 bg-muted/30 px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-3 text-xs text-muted-foreground">
                  sliptodb.app/dashboard
                </span>
              </div>

              <div className="grid grid-cols-12 gap-4 p-6">
                <div className="col-span-3 space-y-3">
                  <div className="h-3 w-16 rounded bg-violet-500/30" />
                  <div className="space-y-1.5">
                    {["Invoices", "Settings", "Billing"].map((item, i) => (
                      <div
                        key={item}
                        className={`rounded-md px-3 py-2 text-xs ${
                          i === 0
                            ? "bg-violet-500/15 text-violet-400 font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-9 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-24 rounded bg-foreground/20" />
                    <div className="h-6 w-16 rounded bg-violet-500/60" />
                  </div>
                  <div className="space-y-2">
                    {[
                      { vendor: "Acme Supplies Ltd", total: "$220.00", date: "2026-10-12" },
                      { vendor: "Berliner Werkstatt GmbH", total: "€1,733.83", date: "2026-10-12" },
                      { vendor: "Green Leaf Studio", total: "$2,646.00", date: "2026-10-10" },
                      { vendor: "Acme Supplies Ltd", total: "$2,200.00", date: "2026-10-08" },
                    ].map((row, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2.5 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{row.vendor}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">{row.date}</span>
                          <span className="font-medium">{row.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
