import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NoteListItem } from "@/lib/queries/notes";

export function RelatedNotes({ notes }: { notes: NoteListItem[] }) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <Card className="border-border/60 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-3xl">Related notes</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {notes.map((note) => (
          <Link
            key={note.id}
            href={`/notes/${note.slug}`}
            className="rounded-2xl border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/45"
          >
            <p className="font-medium">{note.title}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Updated {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
            </p>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
