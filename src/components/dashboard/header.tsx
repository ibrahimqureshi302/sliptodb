"use client";

import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  onMenuClick: () => void;
  userEmail: string;
  userName: string | null;
}

export function Header({ onMenuClick, userEmail, userName }: HeaderProps) {
  const initials = (userName || userEmail)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Mobile logo */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          {userName && (
            <p className="text-sm font-medium leading-tight">{userName}</p>
          )}
          <p className="text-xs leading-tight text-muted-foreground">
            {userEmail}
          </p>
        </div>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-violet-600/10 text-xs font-medium text-violet-500">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
