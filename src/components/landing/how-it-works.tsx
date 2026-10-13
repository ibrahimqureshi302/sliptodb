import { Mail, Sparkles, Database } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Mail,
      title: "Forward the email",
      description:
        "Forward any invoice email to your unique SlipToDB address. No PDF downloads, no uploads.",
    },
    {
      number: "02",
      icon: Sparkles,
      title: "AI extracts the data",
      description:
        "Our AI reads the PDF and pulls out vendor, invoice number, dates, totals, taxes, and line items.",
    },
    {
      number: "03",
      icon: Database,
      title: "Data lands in your database",
      description:
        "Structured rows appear in your database or Google Sheet within seconds.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-violet-500">
            How it works
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Three steps. Zero manual work.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From forwarded email to structured data in under 30 seconds.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-10 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="mb-6 flex items-center gap-4">
                <span className="text-4xl font-bold text-violet-500">
                  {step.number}
                </span>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
                  <step.icon className="h-5 w-5 text-violet-500" />
                </div>
              </div>
              <h3 className="mb-3 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
