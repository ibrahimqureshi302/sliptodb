import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "SlipToDB — Forward an email. Get structured data.",
  description:
    "AI-powered invoice automation. Forward any invoice email and watch structured data appear in your database — no manual entry, no PDF parsing.",
  keywords: [
    "invoice automation",
    "email to database",
    "AI invoice parser",
    "receipt automation",
    "accounting automation",
  ],
  openGraph: {
    title: "SlipToDB — Forward an email. Get structured data.",
    description:
      "AI-powered invoice automation for small businesses and bookkeepers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
