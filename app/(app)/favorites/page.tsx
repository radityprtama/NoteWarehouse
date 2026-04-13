import type { Metadata } from "next";

import { NoteList } from "@/components/notes/note-list";
import { getNotesList } from "@/lib/queries/notes";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Starred notes in your Note Warehouse vault.",
};

export default async function FavoritesPage() {
  const notes = await getNotesList({ favorites: true });

  return (
    <NoteList
      title="Favorites"
      description="Starred references and high-value study notes."
      notes={notes}
    />
  );
}
