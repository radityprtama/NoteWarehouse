import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;
type FolderRow = Tables<"folders">;
type TagRow = Tables<"tags">;
type CollectionRow = Tables<"collections">;

export type FolderSummary = Pick<
  FolderRow,
  "id" | "name" | "slug" | "description" | "color" | "created_at" | "updated_at"
> & {
  noteCount: number;
};

export type TagSummary = Pick<
  TagRow,
  "id" | "name" | "slug" | "color" | "created_at" | "updated_at"
> & {
  noteCount: number;
};

export type CollectionSummary = Pick<
  CollectionRow,
  "id" | "name" | "slug" | "description" | "is_pinned" | "created_at" | "updated_at"
> & {
  noteCount: number;
};

async function getAuthenticatedUserId(supabase: SupabaseServerClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user.id;
}

function countById<T extends string>(rows: Array<Record<T, string | null>>, key: T) {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const id = row[key];
    if (id) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }

  return counts;
}

export async function getFolders(): Promise<FolderSummary[]> {
  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return [];
  }

  const [foldersResult, notesResult] = await Promise.all([
    supabase
      .from("folders")
      .select("id, name, slug, description, color, created_at, updated_at")
      .eq("user_id", userId)
      .order("name", { ascending: true })
      .overrideTypes<Omit<FolderSummary, "noteCount">[], { merge: false }>(),
    supabase
      .from("notes")
      .select("folder_id")
      .eq("user_id", userId)
      .is("archived_at", null)
      .overrideTypes<Array<{ folder_id: string | null }>, { merge: false }>(),
  ]);

  if (foldersResult.error) {
    throw new Error(foldersResult.error.message);
  }

  if (notesResult.error) {
    throw new Error(notesResult.error.message);
  }

  const counts = countById(notesResult.data ?? [], "folder_id");

  return (foldersResult.data ?? []).map((folder) => ({
    ...folder,
    noteCount: counts.get(folder.id) ?? 0,
  }));
}

export async function getTags(): Promise<TagSummary[]> {
  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return [];
  }

  const [tagsResult, relationResult] = await Promise.all([
    supabase
      .from("tags")
      .select("id, name, slug, color, created_at, updated_at")
      .eq("user_id", userId)
      .order("name", { ascending: true })
      .overrideTypes<Omit<TagSummary, "noteCount">[], { merge: false }>(),
    supabase
      .from("note_tags")
      .select("tag_id")
      .overrideTypes<Array<{ tag_id: string }>, { merge: false }>(),
  ]);

  if (tagsResult.error) {
    throw new Error(tagsResult.error.message);
  }

  if (relationResult.error) {
    throw new Error(relationResult.error.message);
  }

  const counts = countById(relationResult.data ?? [], "tag_id");

  return (tagsResult.data ?? []).map((tag) => ({
    ...tag,
    noteCount: counts.get(tag.id) ?? 0,
  }));
}

export async function getCollections(): Promise<CollectionSummary[]> {
  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return [];
  }

  const [collectionsResult, relationResult] = await Promise.all([
    supabase
      .from("collections")
      .select("id, name, slug, description, is_pinned, created_at, updated_at")
      .eq("user_id", userId)
      .order("is_pinned", { ascending: false })
      .order("name", { ascending: true })
      .overrideTypes<Omit<CollectionSummary, "noteCount">[], { merge: false }>(),
    supabase
      .from("note_collections")
      .select("collection_id")
      .overrideTypes<Array<{ collection_id: string }>, { merge: false }>(),
  ]);

  if (collectionsResult.error) {
    throw new Error(collectionsResult.error.message);
  }

  if (relationResult.error) {
    throw new Error(relationResult.error.message);
  }

  const counts = countById(relationResult.data ?? [], "collection_id");

  return (collectionsResult.data ?? []).map((collection) => ({
    ...collection,
    noteCount: counts.get(collection.id) ?? 0,
  }));
}

export async function getFolderBySlug(slug: string) {
  const folders = await getFolders();
  return folders.find((folder) => folder.slug === slug) ?? null;
}

export async function getTagBySlug(slug: string) {
  const tags = await getTags();
  return tags.find((tag) => tag.slug === slug) ?? null;
}

export async function getCollectionBySlug(slug: string) {
  const collections = await getCollections();
  return collections.find((collection) => collection.slug === slug) ?? null;
}
