"use client";

import { Archive, Pin, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

const filters = [
  { key: "favorite", label: "Favorite", icon: Star },
  { key: "pinned", label: "Pinned", icon: Pin },
  { key: "archived", label: "Archived", icon: Archive },
];

export function NoteFilters() {
  const router = useRouter();
  const params = useSearchParams();

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const active = params.get(filter.key) === "true";

        return (
          <Button
            key={filter.key}
            type="button"
            variant={active ? "default" : "outline"}
            className="rounded-full"
            onClick={() => {
              const next = new URLSearchParams(params.toString());

              if (active) {
                next.delete(filter.key);
              } else {
                next.set(filter.key, "true");
              }

              router.push(`/search?${next.toString()}`);
            }}
          >
            <Icon className="size-4" />
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}
