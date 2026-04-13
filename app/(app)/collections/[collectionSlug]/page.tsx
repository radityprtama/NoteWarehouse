import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NoteList } from "@/components/notes/note-list";
import { getNotesList } from "@/lib/queries/notes";
import { getCollectionBySlug } from "@/lib/queries/organization";

export const metadata: Metadata = {
  title: "Collection",
  description: "Browse notes inside a curated collection.",
};

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ collectionSlug: string }>;
}) {
  const { collectionSlug } = await params;
  const [collection, notes] = await Promise.all([
    getCollectionBySlug(collectionSlug),
    getNotesList({ collectionSlug }),
  ]);

  if (!collection) {
    notFound();
  }

  return (
    <NoteList
      title={collection.name}
      description={
        collection.description ||
        `Curated notes in the ${collection.name} collection.`
      }
      notes={notes}
    />
  );
}
