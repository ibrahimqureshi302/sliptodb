import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  const links = {
    Product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "How it works", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
    ],
    Company: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "mailto:ibrahimqurashi302@gmail.com" },
    ],
    Legal: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  };

  return (
    <footer className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm shadow-violet-600/40">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold tracking-tight">SlipToDB</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Turn forwarded emails into structured data. AI-powered invoice automation
              for small businesses and bookkeepers.
            </p>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-semibold">{category}</h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 SlipToDB. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js · Powered by Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
}
