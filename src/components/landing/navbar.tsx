"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "#how-it-works", label: "How it works" },
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm shadow-violet-600/40">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-base font-semibold tracking-tight">SlipToDB</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
              Sign up
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border/50 bg-background md:hidden">
          <div className="space-y-1 px-4 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button size="sm" className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
