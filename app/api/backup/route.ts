import { NextResponse } from "next/server";
import { desc, eq, inArray } from "drizzle-orm";

import {
  collections,
  folders,
  noteCollections,
  notes,
  noteTags,
  tags,
  userPreferences,
} from "@/db/schema";
import { getDrizzleDb } from "@/lib/db/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let backup:
    | {
        notes: unknown[];
        folders: unknown[];
        tags: unknown[];
        collections: unknown[];
        noteTags: unknown[];
        noteCollections: unknown[];
        preferences: unknown | null;
      }
    | null = null;

  try {
    const db = getDrizzleDb();
    const [noteRows, folderRows, tagRows, collectionRows, preferenceRows] =
      await Promise.all([
        db
          .select({
            id: notes.id,
            folder_id: notes.folderId,
            title: notes.title,
            slug: notes.slug,
            content_md: notes.contentMd,
            excerpt: notes.excerpt,
            cover_icon: notes.coverIcon,
            visibility: notes.visibility,
            is_pinned: notes.isPinned,
            is_favorite: notes.isFavorite,
            archived_at: notes.archivedAt,
            created_at: notes.createdAt,
            updated_at: notes.updatedAt,
          })
          .from(notes)
          .where(eq(notes.userId, user.id))
          .orderBy(desc(notes.updatedAt)),
        db
          .select({
            id: folders.id,
            name: folders.name,
            slug: folders.slug,
            description: folders.description,
            color: folders.color,
            created_at: folders.createdAt,
            updated_at: folders.updatedAt,
          })
          .from(folders)
          .where(eq(folders.userId, user.id))
          .orderBy(folders.name),
        db
          .select({
            id: tags.id,
            name: tags.name,
            slug: tags.slug,
            color: tags.color,
            created_at: tags.createdAt,
            updated_at: tags.updatedAt,
          })
          .from(tags)
          .where(eq(tags.userId, user.id))
          .orderBy(tags.name),
        db
          .select({
            id: collections.id,
            name: collections.name,
            slug: collections.slug,
            description: collections.description,
            is_pinned: collections.isPinned,
            created_at: collections.createdAt,
            updated_at: collections.updatedAt,
          })
          .from(collections)
          .where(eq(collections.userId, user.id))
          .orderBy(collections.name),
        db
          .select({
            theme: userPreferences.theme,
            editor_mode: userPreferences.editorMode,
            editor_width: userPreferences.editorWidth,
            sidebar_collapsed: userPreferences.sidebarCollapsed,
            command_palette_enabled: userPreferences.commandPaletteEnabled,
            updated_at: userPreferences.updatedAt,
          })
          .from(userPreferences)
          .where(eq(userPreferences.userId, user.id))
          .limit(1),
      ]);
    const noteIds = noteRows.map((note) => note.id);
    const [noteTagRows, noteCollectionRows] =
      noteIds.length > 0
        ? await Promise.all([
            db
              .select({
                note_id: noteTags.noteId,
                tag_id: noteTags.tagId,
              })
              .from(noteTags)
              .where(inArray(noteTags.noteId, noteIds)),
            db
              .select({
                note_id: noteCollections.noteId,
                collection_id: noteCollections.collectionId,
              })
              .from(noteCollections)
              .where(inArray(noteCollections.noteId, noteIds)),
          ])
        : [[], []];

    backup = {
      notes: noteRows,
      folders: folderRows,
      tags: tagRows,
      collections: collectionRows,
      noteTags: noteTagRows,
      noteCollections: noteCollectionRows,
      preferences: preferenceRows[0] ?? null,
    };
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to export a backup with Drizzle.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      product: "Note Warehouse",
      exported_at: new Date().toISOString(),
      notes: backup.notes,
      folders: backup.folders,
      tags: backup.tags,
      collections: backup.collections,
      note_tags: backup.noteTags,
      note_collections: backup.noteCollections,
      preferences: backup.preferences,
    },
    {
      headers: {
        "Content-Disposition": 'attachment; filename="note-warehouse-backup.json"',
      },
    },
  );
}
