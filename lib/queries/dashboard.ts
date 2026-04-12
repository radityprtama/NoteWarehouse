import { subDays } from "date-fns";
import type { PostgrestError } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type NoteSummary = Pick<
  Database["public"]["Tables"]["notes"]["Row"],
  "id" | "title" | "slug" | "cover_icon" | "excerpt" | "updated_at" | "is_favorite" | "is_pinned"
>;

type CollectionSummary = Pick<
  Database["public"]["Tables"]["collections"]["Row"],
  "id" | "name" | "slug" | "description" | "is_pinned" | "updated_at"
>;

type TagSummary = Pick<Database["public"]["Tables"]["tags"]["Row"], "id" | "name" | "slug"> & {
  noteCount: number;
};

export type DashboardData = {
  totalNotes: number;
  favoriteCount: number;
  pinnedCollectionCount: number;
  recentActivityCount: number;
  recentNotes: NoteSummary[];
  favoriteNotes: NoteSummary[];
  pinnedCollections: CollectionSummary[];
  tagSummary: TagSummary[];
  errors: string[];
};

function pushError(errors: string[], label: string, error: PostgrestError | null | undefined) {
  if (error) {
    errors.push(`${label}: ${error.message}`);
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createSupabaseServerClient();
  const errors: string[] = [];
  const sevenDaysAgo = subDays(new Date(), 7).toISOString();

  const [
    totalNotesResult,
    favoriteCountResult,
    pinnedCollectionCountResult,
    recentActivityCountResult,
    recentNotesResult,
    favoriteNotesResult,
    pinnedCollectionsResult,
    tagsResult,
    noteTagsResult,
  ] = await Promise.all([
    supabase
      .from("notes")
      .select("id", { count: "exact", head: true })
      .is("archived_at", null),
    supabase
      .from("notes")
      .select("id", { count: "exact", head: true })
      .eq("is_favorite", true)
      .is("archived_at", null),
    supabase
      .from("collections")
      .select("id", { count: "exact", head: true })
      .eq("is_pinned", true),
    supabase
      .from("notes")
      .select("id", { count: "exact", head: true })
      .gte("updated_at", sevenDaysAgo)
      .is("archived_at", null),
    supabase
      .from("notes")
      .select("id, title, slug, cover_icon, excerpt, updated_at, is_favorite, is_pinned")
      .is("archived_at", null)
      .order("updated_at", { ascending: false })
      .limit(6),
    supabase
      .from("notes")
      .select("id, title, slug, cover_icon, excerpt, updated_at, is_favorite, is_pinned")
      .eq("is_favorite", true)
      .is("archived_at", null)
      .order("updated_at", { ascending: false })
      .limit(4),
    supabase
      .from("collections")
      .select("id, name, slug, description, is_pinned, updated_at")
      .eq("is_pinned", true)
      .order("updated_at", { ascending: false })
      .limit(4),
    supabase.from("tags").select("id, name, slug").order("updated_at", { ascending: false }).limit(12),
    supabase.from("note_tags").select("tag_id"),
  ]);

  pushError(errors, "total notes", totalNotesResult.error);
  pushError(errors, "favorite notes", favoriteCountResult.error);
  pushError(errors, "pinned collections", pinnedCollectionCountResult.error);
  pushError(errors, "recent activity", recentActivityCountResult.error);
  pushError(errors, "recent notes", recentNotesResult.error);
  pushError(errors, "favorite note list", favoriteNotesResult.error);
  pushError(errors, "pinned collections list", pinnedCollectionsResult.error);
  pushError(errors, "tags", tagsResult.error);
  pushError(errors, "tag usage", noteTagsResult.error);

  const tagRows = (tagsResult.data ?? []) as Array<{ id: string; name: string; slug: string }>;
  const noteTagRows = (noteTagsResult.data ?? []) as Array<{ tag_id: string }>;

  const tagUsage = new Map<string, number>();
  for (const row of noteTagRows) {
    tagUsage.set(row.tag_id, (tagUsage.get(row.tag_id) ?? 0) + 1);
  }

  const tagSummary = tagRows
    .map((tag) => ({
      ...tag,
      noteCount: tagUsage.get(tag.id) ?? 0,
    }))
    .filter((tag) => tag.noteCount > 0)
    .sort((left, right) => right.noteCount - left.noteCount)
    .slice(0, 8);

  return {
    totalNotes: totalNotesResult.count ?? 0,
    favoriteCount: favoriteCountResult.count ?? 0,
    pinnedCollectionCount: pinnedCollectionCountResult.count ?? 0,
    recentActivityCount: recentActivityCountResult.count ?? 0,
    recentNotes: (recentNotesResult.data ?? []) as NoteSummary[],
    favoriteNotes: (favoriteNotesResult.data ?? []) as NoteSummary[],
    pinnedCollections: (pinnedCollectionsResult.data ?? []) as CollectionSummary[],
    tagSummary,
    errors,
  };
}
