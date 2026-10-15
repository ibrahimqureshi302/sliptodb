import {
  Sparkles,
  Zap,
  Shield,
  Globe,
  BarChart3,
  RefreshCw,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-powered extraction",
      description:
        "Powered by Google Gemini vision. Handles diverse invoice formats, currencies, and layouts.",
    },
    {
      icon: Zap,
      title: "Processes in seconds",
      description:
        "Average processing time under 15 seconds per invoice — faster than reading the first line.",
    },
    {
      icon: Shield,
      title: "Multi-tenant isolation",
      description:
        "Every customer's data is separated at the database level with Row-Level Security.",
    },
    {
      icon: Globe,
      title: "Multi-language support",
      description:
        "Handles invoices in any language — English, German, French, Spanish, and more.",
    },
    {
      icon: BarChart3,
      title: "Complete audit trail",
      description:
        "Every processed email is logged with timestamps, status, and extracted data.",
    },
    {
      icon: RefreshCw,
      title: "Reliable by design",
      description:
        "Automatic retries, duplicate detection, and error alerts. Never lose an invoice again.",
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-violet-500">
            Features
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need. Nothing you don't.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built for small businesses and bookkeepers who want results, not complexity.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border/50 bg-card/30 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-500/40 hover:bg-violet-500/5"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 transition-colors group-hover:bg-violet-500/20">
                <feature.icon className="h-5 w-5 text-violet-500" />
              </div>
              <h3 className="mb-2 text-base font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

