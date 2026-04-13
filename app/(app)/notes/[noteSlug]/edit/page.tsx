import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NoteEditor } from "@/components/editor/note-editor";
import { getNoteBySlug } from "@/lib/queries/notes";

export const metadata: Metadata = {
  title: "Edit Note",
  description: "Edit a Markdown note in Note Warehouse.",
};

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ noteSlug: string }>;
}) {
  const { noteSlug } = await params;
  const note = await getNoteBySlug(noteSlug);

  if (!note) {
    notFound();
  }

  return (
    <main className="px-6 py-8 lg:px-8">
      <NoteEditor initialValue={note.content_md} noteId={note.id} title={note.title} />
    </main>
  );
}
