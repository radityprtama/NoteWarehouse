"use client";

import type { LucideIcon } from "lucide-react";
import {
  Archive,
  BookOpenText,
  Command as CommandIcon,
  Folder,
  FolderKanban,
  Hash,
  LayoutGrid,
  Plus,
  Search,
  Settings2,
  Star,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

type CommandAction = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  shortcut?: string;
};

const primaryActions: CommandAction[] = [
  {
    label: "New note",
    description: "Open a blank Markdown note.",
    href: "/notes/new",
    icon: Plus,
    shortcut: "Ctrl N",
  },
  {
    label: "Search vault",
    description: "Open advanced note search.",
    href: "/search",
    icon: Search,
    shortcut: "Ctrl K",
  },
  {
    label: "All notes",
    description: "Browse the active note shelf.",
    href: "/notes",
    icon: BookOpenText,
  },
];

const navigationActions: CommandAction[] = [
  {
    label: "Dashboard",
    description: "Return to the vault overview.",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    label: "Folders",
    description: "Manage top-level note shelves.",
    href: "/folders",
    icon: Folder,
  },
  {
    label: "Collections",
    description: "Open curated note sets.",
    href: "/collections",
    icon: FolderKanban,
  },
  {
    label: "Tags",
    description: "Browse cross-reference labels.",
    href: "/tags",
    icon: Hash,
  },
  {
    label: "Favorites",
    description: "Open starred notes.",
    href: "/favorites",
    icon: Star,
  },
  {
    label: "Archived",
    description: "Review archived notes.",
    href: "/archived",
    icon: Archive,
  },
  {
    label: "Settings",
    description: "Change workspace preferences.",
    href: "/settings",
    icon: Settings2,
  },
  {
    label: "Profile",
    description: "Update account profile details.",
    href: "/profile",
    icon: UserRound,
  },
];

export function CommandMenu({ enabled = true }: { enabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useKeyboardShortcuts({
    onSearch: () => {
      if (enabled) {
        setOpen(true);
      }
    },
    onNewNote: () => {
      if (enabled) {
        router.push("/notes/new");
      }
    },
  });

  function runCommand(href: string) {
    setOpen(false);
    router.push(href);
  }

  if (!enabled) {
    return null;
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="hidden rounded-full px-4 text-sm md:inline-flex"
        onClick={() => setOpen(true)}
      >
        <CommandIcon className="size-4" />
        Command
        <span className="ml-1 rounded-full border border-border/70 bg-muted px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Ctrl K
        </span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="rounded-full md:hidden"
        aria-label="Open command palette"
        onClick={() => setOpen(true)}
      >
        <CommandIcon className="size-4" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Jump to a page or action..." />
        <CommandList>
          <CommandEmpty>No matching command found.</CommandEmpty>
          <CommandGroup heading="Fast actions">
            {primaryActions.map((item) => {
              const Icon = item.icon;

              return (
                <CommandItem key={item.href} onSelect={() => runCommand(item.href)}>
                  <Icon className="size-4 text-accent" />
                  <span className="flex min-w-0 flex-col">
                    <span>{item.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                  {item.shortcut ? (
                    <CommandShortcut>{item.shortcut}</CommandShortcut>
                  ) : null}
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigation">
            {navigationActions.map((item) => {
              const Icon = item.icon;

              return (
                <CommandItem key={item.href} onSelect={() => runCommand(item.href)}>
                  <Icon className="size-4 text-muted-foreground" />
                  <span className="flex min-w-0 flex-col">
                    <span>{item.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
