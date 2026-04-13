import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NoteList } from "@/components/notes/note-list";
import { getNotesList } from "@/lib/queries/notes";
import { getTagBySlug } from "@/lib/queries/organization";

export const metadata: Metadata = {
  title: "Tag",
  description: "Browse notes marked with a tag.",
};

export default async function TagDetailPage({
  params,
}: {
  params: Promise<{ tagSlug: string }>;
}) {
  const { tagSlug } = await params;
  const [tag, notes] = await Promise.all([
    getTagBySlug(tagSlug),
    getNotesList({ tagSlug }),
  ]);

  if (!tag) {
    notFound();
  }

  return (
    <NoteList
      title={`#${tag.name}`}
      description={`Notes labeled with the ${tag.name} tag across your folders and collections.`}
      notes={notes}
    />
  );
}
