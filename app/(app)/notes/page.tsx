import type { Metadata } from "next";

import { NoteList } from "@/components/notes/note-list";
import { getNotesList } from "@/lib/queries/notes";

export const metadata: Metadata = {
  title: "Notes",
  description: "Browse every active Markdown note in your Note Warehouse vault.",
};

export default async function NotesPage() {
  const notes = await getNotesList();

  return (
    <NoteList
      title="All notes"
      description="Browse the latest active notes in your Markdown vault."
      notes={notes}
    />
  );
}
