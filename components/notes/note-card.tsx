import { formatDistanceToNow } from "date-fns";
import { Archive, Pin, Star } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { NoteListItem } from "@/lib/queries/notes";

export function NoteCard({ note }: { note: NoteListItem }) {
  return (
    <Link
      href={`/notes/${note.slug}`}
      className="group block rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {note.cover_icon ? <span aria-hidden>{note.cover_icon}</span> : null}
            <h2 className="truncate font-display text-2xl font-semibold tracking-tight">
              {note.title}
            </h2>
          </div>
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {note.excerpt ?? "No summary yet. Open the note to read the full Markdown document."}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          {note.is_pinned ? <Pin className="size-4 text-accent" aria-label="Pinned" /> : null}
          {note.is_favorite ? (
            <Star className="size-4 fill-accent text-accent" aria-label="Favorite" />
          ) : null}
          {note.archived_at ? (
            <Archive className="size-4 text-muted-foreground" aria-label="Archived" />
          ) : null}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Updated {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
        </p>
        {note.folder ? (
          <Badge variant="secondary" className="rounded-full">
            {note.folder.name}
          </Badge>
        ) : null}
      </div>
    </Link>
  );
}
