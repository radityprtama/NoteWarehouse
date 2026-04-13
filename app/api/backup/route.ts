import { NextResponse } from "next/server";

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

  const [
    notesResult,
    foldersResult,
    tagsResult,
    collectionsResult,
    noteTagsResult,
    noteCollectionsResult,
    preferencesResult,
  ] = await Promise.all([
    supabase
      .from("notes")
      .select(
        "id, folder_id, title, slug, content_md, excerpt, cover_icon, visibility, is_pinned, is_favorite, archived_at, created_at, updated_at",
      )
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false }),
    supabase
      .from("folders")
      .select("id, name, slug, description, color, created_at, updated_at")
      .eq("user_id", user.id)
      .order("name", { ascending: true }),
    supabase
      .from("tags")
      .select("id, name, slug, color, created_at, updated_at")
      .eq("user_id", user.id)
      .order("name", { ascending: true }),
    supabase
      .from("collections")
      .select("id, name, slug, description, is_pinned, created_at, updated_at")
      .eq("user_id", user.id)
      .order("name", { ascending: true }),
    supabase.from("note_tags").select("note_id, tag_id"),
    supabase.from("note_collections").select("note_id, collection_id"),
    supabase
      .from("user_preferences")
      .select(
        "theme, editor_mode, editor_width, sidebar_collapsed, command_palette_enabled, updated_at",
      )
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  const error =
    notesResult.error ||
    foldersResult.error ||
    tagsResult.error ||
    collectionsResult.error ||
    noteTagsResult.error ||
    noteCollectionsResult.error ||
    preferencesResult.error;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      product: "Note Warehouse",
      exported_at: new Date().toISOString(),
      notes: notesResult.data ?? [],
      folders: foldersResult.data ?? [],
      tags: tagsResult.data ?? [],
      collections: collectionsResult.data ?? [],
      note_tags: noteTagsResult.data ?? [],
      note_collections: noteCollectionsResult.data ?? [],
      preferences: preferencesResult.data ?? null,
    },
    {
      headers: {
        "Content-Disposition": 'attachment; filename="note-warehouse-backup.json"',
      },
    },
  );
}
