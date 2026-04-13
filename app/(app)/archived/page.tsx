import type { Metadata } from "next";

import { NoteList } from "@/components/notes/note-list";
import { getNotesList } from "@/lib/queries/notes";

export const metadata: Metadata = {
  title: "Archived",
  description: "Archived notes in your Note Warehouse vault.",
};

export default async function ArchivedPage() {
  const notes = await getNotesList({ archived: true });

  return (
    <NoteList
      title="Archived"
      description="Notes removed from the active shelf but still stored for retrieval."
      notes={notes}
    />
  );
}
