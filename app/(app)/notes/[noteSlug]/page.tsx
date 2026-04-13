import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NoteActions } from "@/components/notes/note-actions";
import { NoteReader } from "@/components/notes/note-reader";
import { RelatedNotes } from "@/components/notes/related-notes";
import {
  getNeighboringNotes,
  getNoteBySlug,
  getRelatedNotes,
} from "@/lib/queries/notes";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Read Note",
  description: "Read a Markdown note in Note Warehouse.",
};

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ noteSlug: string }>;
}) {
  const { noteSlug } = await params;
  const note = await getNoteBySlug(noteSlug);

  if (!note) {
    notFound();
  }

  const [related, neighbors] = await Promise.all([
    getRelatedNotes(note.id),
    getNeighboringNotes(note.id),
  ]);

  return (
    <main className="space-y-8 px-6 py-8 lg:px-8">
      <NoteActions
        note={{
          id: note.id,
          slug: note.slug,
          archived_at: note.archived_at,
          is_favorite: note.is_favorite,
          is_pinned: note.is_pinned,
        }}
      />
      <NoteReader title={note.title} content={note.content_md} updatedAt={note.updated_at} />
      <RelatedNotes notes={related} />
      <nav className="flex flex-wrap justify-between gap-3 border-t border-border/70 pt-6">
        {neighbors.previous ? (
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/notes/${neighbors.previous.slug}`}>Previous: {neighbors.previous.title}</Link>
          </Button>
        ) : <span />}
        {neighbors.next ? (
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/notes/${neighbors.next.slug}`}>Next: {neighbors.next.title}</Link>
          </Button>
        ) : null}
      </nav>
    </main>
  );
}
