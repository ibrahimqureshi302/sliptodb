import { Clock, AlertCircle, TrendingDown } from "lucide-react";

export function Problem() {
  const problems = [
    {
      icon: Clock,
      title: "5–20 hours wasted weekly",
      description:
        "Manually typing invoice data from PDFs into spreadsheets is mind-numbing, repetitive work.",
    },
    {
      icon: AlertCircle,
      title: "3–5% error rate",
      description:
        "Humans make mistakes. Wrong totals, missed line items, typos — they compound over time.",
    },
    {
      icon: TrendingDown,
      title: "Enterprise tools cost $500+/mo",
      description:
        "Docparser, Rossum, Klippa — powerful, but overkill and unaffordable for small teams.",
    },
  ];

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Manual invoice entry is
            <span className="text-violet-500"> killing your time</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every hour spent typing invoice data is an hour not spent growing your business.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-3">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="rounded-2xl border border-border/50 bg-card/30 p-6"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <problem.icon className="h-5 w-5 text-violet-500" />
              </div>
              <h3 className="mb-2 text-base font-semibold">{problem.title}</h3>
              <p className="text-sm text-muted-foreground">{problem.description}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-violet-500/5 p-8 text-center">
          <p className="text-base">
            <span className="font-semibold text-violet-500">Real cost for a small business:</span>{" "}
            <span className="text-muted-foreground">
              $500–$5,000/month in wasted labor.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
