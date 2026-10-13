import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent p-12 sm:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-500/10 blur-[100px]" />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to stop typing invoices?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              Start processing invoices in the next 2 minutes. 14-day trial, no credit card required.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#pricing">
                <Button size="lg" variant="outline">
                  View pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
