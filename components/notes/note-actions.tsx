import { Archive, Download, RotateCcw, Star, Trash2, Pencil, Pin } from "lucide-react";
import Link from "next/link";

import {
  archiveNoteAction,
  deleteNoteAction,
  restoreNoteAction,
  toggleFavoriteAction,
  togglePinnedAction,
} from "@/lib/actions/notes";
import { Button } from "@/components/ui/button";

export function NoteActions({
  note,
}: {
  note: {
    id: string;
    slug: string;
    archived_at: string | null;
    is_favorite: boolean;
    is_pinned: boolean;
  };
}) {
  const isArchived = note.archived_at !== null;

  async function favoriteAction() {
    "use server";

    await toggleFavoriteAction(note.id, !note.is_favorite);
  }

  async function pinnedAction() {
    "use server";

    await togglePinnedAction(note.id, !note.is_pinned);
  }

  async function archiveAction() {
    "use server";

    if (isArchived) {
      await restoreNoteAction(note.id);
      return;
    }

    await archiveNoteAction(note.id);
  }

  async function deleteAction() {
    "use server";

    await deleteNoteAction(note.id);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form action={favoriteAction}>
        <Button type="submit" variant="outline" className="rounded-full">
          <Star className={note.is_favorite ? "size-4 fill-accent text-accent" : "size-4"} />
          {note.is_favorite ? "Unfavorite" : "Favorite"}
        </Button>
      </form>
      <form action={pinnedAction}>
        <Button type="submit" variant="outline" className="rounded-full">
          <Pin className="size-4" />
          {note.is_pinned ? "Unpin" : "Pin"}
        </Button>
      </form>
      <form action={archiveAction}>
        <Button type="submit" variant="outline" className="rounded-full">
          {isArchived ? <RotateCcw className="size-4" /> : <Archive className="size-4" />}
          {isArchived ? "Restore" : "Archive"}
        </Button>
      </form>
      <form action={deleteAction}>
        <Button type="submit" variant="outline" className="rounded-full">
          <Trash2 className="size-4" />
          Delete
        </Button>
      </form>
      <Button asChild className="rounded-full">
        <Link href={`/notes/${note.slug}/edit`}>
          <Pencil className="size-4" />
          Edit
        </Link>
      </Button>
      <Button asChild variant="outline" className="rounded-full">
        <a href={`/api/notes/${note.slug}/export`}>
          <Download className="size-4" />
          Export .md
        </a>
      </Button>
    </div>
  );
}
