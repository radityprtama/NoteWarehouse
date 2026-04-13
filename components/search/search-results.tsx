import { formatDistanceToNow } from "date-fns";
import { SearchX } from "lucide-react";
import Link from "next/link";

import { SearchHighlight } from "@/components/search/search-highlight";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { SearchNoteResult } from "@/lib/queries/notes";

export function SearchResults({
  query,
  results,
}: {
  query: string;
  results: SearchNoteResult[];
}) {
  if (results.length === 0) {
    return (
      <Card className="border-dashed border-border/70 bg-card/80">
        <CardContent className="flex flex-col items-center px-6 py-16 text-center">
          <SearchX className="size-10 text-muted-foreground" />
          <h2 className="mt-4 font-display text-3xl">No matching notes.</h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
            Try a shorter phrase, remove a filter, or search with a tag like
            <span className="font-mono"> #biology</span>.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-3">
      {results.map((result) => (
        <Link
          key={result.id}
          href={`/notes/${result.slug}`}
          className="block rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm transition hover:border-accent/60 hover:shadow-md"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                <SearchHighlight text={result.title} query={query} />
              </h2>
              <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                <SearchHighlight
                  text={result.excerpt ?? "No excerpt available."}
                  query={query}
                />
              </p>
            </div>
            <Badge variant="secondary" className="rounded-full">
              Rank {result.rank.toFixed(2)}
            </Badge>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Updated {formatDistanceToNow(new Date(result.updated_at), { addSuffix: true })}
          </p>
        </Link>
      ))}
    </section>
  );
}
