"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";

import type { CurrentProfileResult } from "@/lib/queries/profile";
import { Sidebar } from "@/components/app/sidebar";
import { ThemeToggle } from "@/components/app/theme-toggle";
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

        <Button asChild variant="outline" className="hidden min-h-11 flex-1 justify-between rounded-full px-4 text-left sm:flex sm:max-w-2xl">
          <Link href="/search" aria-label="Search your vault">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Search className="size-4" />
              Search your vault
            </span>
            <span className="rounded-full border border-border/70 bg-muted px-2.5 py-1 text-[0.7rem] font-medium tracking-[0.2em] text-muted-foreground">
              Ctrl K
            </span>
          </Link>
        </Button>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Button asChild variant="ghost" className="hidden rounded-full px-4 text-sm sm:inline-flex">
            <Link href="/profile">{displayName}</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
