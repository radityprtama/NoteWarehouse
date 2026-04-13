import { BookOpenText, Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { NoteCard } from "@/components/notes/note-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { NoteListItem } from "@/lib/queries/notes";

export function NoteList({
  title,
  description,
  notes,
  actions,
}: {
  title: string;
  description: string;
  notes: NoteListItem[];
  actions?: ReactNode;
}) {
  return (
    <main className="space-y-8 px-6 py-8 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Note shelf
          </p>
          <h1 className="font-display text-5xl tracking-tight">{title}</h1>
          <p className="max-w-2xl text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {actions}
          <Button asChild className="rounded-full">
            <Link href="/notes/new">
              <Plus className="size-4" />
              New note
            </Link>
          </Button>
        </div>
      </header>

      {notes.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </section>
      ) : (
        <Card className="border-dashed border-border/70 bg-card/80">
          <CardContent className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border bg-muted/40">
              <BookOpenText className="size-6 text-accent" />
            </div>
            <h2 className="mt-5 font-display text-3xl">This shelf is empty.</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Create your first Markdown note and it will appear here with its latest
              update, folder, and quick metadata.
            </p>
            <Button asChild className="mt-6 rounded-full">
              <Link href="/notes/new">Create a note</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
