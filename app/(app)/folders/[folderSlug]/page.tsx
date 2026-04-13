import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NoteList } from "@/components/notes/note-list";
import { getNotesList } from "@/lib/queries/notes";
import { getFolderBySlug } from "@/lib/queries/organization";

export const metadata: Metadata = {
  title: "Folder",
  description: "Browse notes inside a folder shelf.",
};

export default async function FolderDetailPage({
  params,
}: {
  params: Promise<{ folderSlug: string }>;
}) {
  const { folderSlug } = await params;
  const [folder, notes] = await Promise.all([
    getFolderBySlug(folderSlug),
    getNotesList({ folderSlug }),
  ]);

  if (!folder) {
    notFound();
  }

  return (
    <NoteList
      title={folder.name}
      description={
        folder.description ||
        `Active notes filed in the ${folder.name} folder shelf.`
      }
      notes={notes}
    />
  );
}
