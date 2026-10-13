"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does SlipToDB work?",
      answer:
        "You get a unique email address (like alice123@sliptodb.com). Forward any invoice email to it. Our AI reads the PDF attachment, extracts the structured data, and stores it in your database or Google Sheet — usually within 15 seconds.",
    },
    {
      question: "What invoice formats do you support?",
      answer:
        "Any PDF-based invoice: standard invoices, receipts, packing slips, credit notes. We handle different languages, currencies, layouts, and multi-page documents. No templates needed.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes. Every customer's data is isolated at the database level using Row-Level Security. Your data is only accessible to you and never shared, sold, or used for training. We use Supabase (Postgres) with enterprise-grade encryption.",
    },
    {
      question: "What happens if an invoice fails to extract?",
      answer:
        "We log every attempt with full context. You get a notification, and the failed invoice is preserved for manual review. Most failures are due to unusual PDF formats or image-only scans.",
    },
    {
      question: "Can I try SlipToDB before paying?",
      answer:
        "Yes — every plan includes a 14-day free trial. No credit card required to start. Upgrade, downgrade, or cancel anytime from your dashboard.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Absolutely. Cancel from your dashboard in one click. No contracts, no cancellation fees, no questions asked.",
    },
  ];

  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-violet-500">
            FAQ
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about SlipToDB.
          </p>
        </div>

        <div className="mt-12 space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-border/50 bg-card/30 transition-colors hover:border-border"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="pr-4 text-sm font-medium">{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
