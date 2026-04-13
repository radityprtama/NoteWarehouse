"use client";

import Link from "next/link";
import { Archive, BookOpenText, Folder, FolderKanban, LayoutGrid, LogOut, Search, Settings2, Star, Tags, UserRound } from "lucide-react";

import { signOutAction } from "@/lib/actions/auth";
import type { CurrentProfileResult } from "@/lib/queries/profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type SidebarProps = {
  className?: string;
  currentProfile?: CurrentProfileResult;
};

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/notes", label: "Notes", icon: BookOpenText },
  { href: "/folders", label: "Folders", icon: Folder },
  { href: "/collections", label: "Collections", icon: FolderKanban },
  { href: "/tags", label: "Tags", icon: Tags },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/archived", label: "Archived", icon: Archive },
  { href: "/search", label: "Search", icon: Search },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

export function Sidebar({ className, currentProfile }: SidebarProps) {
  const displayName = currentProfile?.profile?.display_name ?? currentProfile?.email ?? "Vault user";
  const email = currentProfile?.email ?? "Personal workspace";

  return (
    <div className={cn("flex h-full flex-col px-4 py-5", className)}>
      <div className="flex items-center gap-3 px-2">
        <div className="flex size-11 items-center justify-center rounded-2xl border border-border/70 bg-background shadow-sm">
          <span className="font-display text-xl">NW</span>
        </div>
        <div>
          <p className="font-display text-2xl leading-none">Note Warehouse</p>
          <p className="text-xs text-muted-foreground">Editorial vault workspace</p>
        </div>
      </div>

      <ScrollArea className="mt-6 flex-1 pr-2">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className="h-11 w-full justify-start gap-3 rounded-2xl px-4 text-sm font-medium"
              >
                <Link href={item.href}>
                  <Icon className="size-4 text-muted-foreground" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="space-y-4 pt-4">
        <Card className="border-border/70 bg-muted/25 shadow-none">
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-background">
                <UserRound className="size-4 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-2">
              <Badge variant="secondary" className="rounded-full">
                {currentProfile?.profile?.onboarding_completed ? "Ready" : "Setup needed"}
              </Badge>
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link href="/profile">
                  <Settings2 className="size-4" />
                  Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <form action={signOutAction}>
          <Button type="submit" variant="outline" className="h-11 w-full justify-start rounded-2xl px-4">
            <LogOut className="size-4" />
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
