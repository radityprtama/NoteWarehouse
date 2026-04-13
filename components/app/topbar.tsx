"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";

import type { CurrentProfileResult } from "@/lib/queries/profile";
import { CommandMenu } from "@/components/app/command-menu";
import { Sidebar } from "@/components/app/sidebar";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { GlobalSearch } from "@/components/search/global-search";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type TopbarProps = {
  currentProfile: CurrentProfileResult;
};

export function Topbar({ currentProfile }: TopbarProps) {
  const displayName = currentProfile.profile?.display_name ?? currentProfile.email;
  const commandPaletteEnabled =
    currentProfile.preferences?.command_palette_enabled ?? true;

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open navigation">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>Browse the Note Warehouse workspace.</SheetDescription>
              </SheetHeader>
              <Sidebar currentProfile={currentProfile} className="h-full" />
            </SheetContent>
          </Sheet>
        </div>

        <Button asChild variant="outline" size="icon" className="rounded-full sm:hidden" aria-label="Search your vault">
          <Link href="/search">
            <Search className="size-4" />
          </Link>
        </Button>

        <GlobalSearch className="hidden max-w-2xl flex-1 sm:block" />

        <div className="flex flex-1 items-center justify-end gap-2">
          <CommandMenu enabled={commandPaletteEnabled} />
          <Button asChild variant="ghost" className="hidden rounded-full px-4 text-sm sm:inline-flex">
            <Link href="/profile">{displayName}</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
