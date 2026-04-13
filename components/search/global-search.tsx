"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { saveSearchHistoryAction } from "@/lib/actions/search-history";
import { cn } from "@/lib/utils";

export function GlobalSearch({
  className,
  initialValue = "",
}: {
  className?: string;
  initialValue?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      className={cn("relative w-full", className)}
      onSubmit={(event) => {
        event.preventDefault();
        const query = value.trim();

        startTransition(async () => {
          if (query) {
            await saveSearchHistoryAction(query, {});
          }

          router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
        });
      }}
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        aria-label="Search notes"
        className="h-11 w-full rounded-full border border-border/70 bg-card/90 pl-11 pr-20 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-ring/30"
        placeholder="Search notes, tags, folders..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-border/70 bg-muted px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {pending ? "..." : "Ctrl K"}
      </span>
    </form>
  );
}
