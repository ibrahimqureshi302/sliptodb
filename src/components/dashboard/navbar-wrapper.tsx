"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DashboardNavbar } from "./navbar";

export function DashboardNavbarWrapper() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser({
        email: user.email || "",
        name: (user.user_metadata?.name as string) || null,
      });
      setLoading(false);
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </header>
    );
  }

  if (!user) return null;

  return <DashboardNavbar userEmail={user.email} userName={user.name} />;
}
