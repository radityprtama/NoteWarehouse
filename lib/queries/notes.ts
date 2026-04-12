import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database, Tables } from "@/types/database";

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;
type NoteRow = Tables<"notes">;
type FolderRow = Tables<"folders">;
type TagRow = Tables<"tags">;
type CollectionRow = Tables<"collections">;
type SearchNotesRow = Database["public"]["Functions"]["search_notes"]["Returns"][number];

export type NoteListFilters = {
  archived?: boolean;
  favorites?: boolean;
  pinned?: boolean;
  folderSlug?: string | null;
  collectionSlug?: string | null;
  tagSlug?: string | null;
  query?: string | null;
  limit?: number;
  offset?: number;
};

export type NoteFolderSummary = Pick<
  FolderRow,
  "id" | "name" | "slug" | "description" | "color"
>;
export type NoteTagSummary = Pick<TagRow, "id" | "name" | "slug" | "color">;
export type NoteCollectionSummary = Pick<
  CollectionRow,
  "id" | "name" | "slug" | "description" | "is_pinned"
>;

export type NoteListItem = Pick<
  NoteRow,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "cover_icon"
  | "updated_at"
  | "created_at"
  | "archived_at"
  | "is_favorite"
  | "is_pinned"
  | "visibility"
> & {
  folder: NoteFolderSummary | null;
  rank?: number;
};

export type NoteDetail = NoteListItem & {
  content_md: string;
  tagIds: string[];
  collectionIds: string[];
  tags: NoteTagSummary[];
  collections: NoteCollectionSummary[];
};

export type NoteNeighbors = {
  previous: NoteListItem | null;
  next: NoteListItem | null;
};

export type SearchNoteResult = SearchNotesRow;

type NoteSummaryRow = Pick<
  NoteRow,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "cover_icon"
  | "updated_at"
  | "created_at"
  | "archived_at"
  | "is_favorite"
  | "is_pinned"
  | "visibility"
  | "folder_id"
>;
type SearchNotesArgs = Database["public"]["Functions"]["search_notes"]["Args"];
type SearchNotesRpc = (
  fn: "search_notes",
  args: SearchNotesArgs,
) => Promise<{ data: SearchNotesRow[] | null; error: { message: string } | null }>;

const noteSummarySelect =
  "id, folder_id, title, slug, excerpt, cover_icon, updated_at, created_at, archived_at, is_favorite, is_pinned, visibility";

const noteDetailSelect =
  "id, user_id, folder_id, title, slug, content_md, excerpt, cover_icon, visibility, is_pinned, is_favorite, archived_at, created_at, updated_at";

function unique(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function searchArgsFromFilters(
  query: string,
  filters: Omit<NoteListFilters, "query" | "limit" | "offset">,
): SearchNotesArgs {
  return {
    p_query: query,
    p_include_archived: filters.archived ?? false,
    p_folder_slug: filters.folderSlug ?? null,
    p_collection_slug: filters.collectionSlug ?? null,
    p_tag_slug: filters.tagSlug ?? null,
    p_only_favorites: filters.favorites ?? false,
    p_only_pinned: filters.pinned ?? false,
  };
}

async function runSearchNotes(supabase: SupabaseServerClient, args: SearchNotesArgs) {
  const rpc = supabase.rpc as unknown as SearchNotesRpc;
  return rpc("search_notes", args);
}

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

async function getFolderMap(supabase: SupabaseServerClient, folderIds: string[]) {
  const ids = unique(folderIds);
  if (ids.length === 0) {
    return new Map<string, NoteFolderSummary>();
  }

  const { data, error } = await supabase
    .from("folders")
    .select("id, name, slug, description, color")
    .in("id", ids)
    .overrideTypes<NoteFolderSummary[], { merge: false }>();

  if (error) {
    throw new Error(error.message);
  }

  return new Map((data ?? []).map((folder) => [folder.id, folder as NoteFolderSummary]));
}

async function getNoteTagIds(supabase: SupabaseServerClient, noteId: string) {
  const { data, error } = await supabase
    .from("note_tags")
    .select("tag_id")
    .eq("note_id", noteId)
    .overrideTypes<Array<{ tag_id: string }>, { merge: false }>();

  if (error) {
    throw new Error(error.message);
  }

  return unique((data ?? []).map((row) => row.tag_id));
}

async function getNoteCollectionIds(supabase: SupabaseServerClient, noteId: string) {
  const { data, error } = await supabase
    .from("note_collections")
    .select("collection_id")
    .eq("note_id", noteId)
    .overrideTypes<Array<{ collection_id: string }>, { merge: false }>();

  if (error) {
    throw new Error(error.message);
  }

  return unique((data ?? []).map((row) => row.collection_id));
}

async function getTagsByIds(supabase: SupabaseServerClient, tagIds: string[]) {
  const ids = unique(tagIds);
  if (ids.length === 0) {
    return [] as NoteTagSummary[];
  }

  const { data, error } = await supabase
    .from("tags")
    .select("id, name, slug, color")
    .in("id", ids)
    .overrideTypes<NoteTagSummary[], { merge: false }>();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as NoteTagSummary[];
}

async function getCollectionsByIds(
  supabase: SupabaseServerClient,
  collectionIds: string[],
) {
  const ids = unique(collectionIds);
  if (ids.length === 0) {
    return [] as NoteCollectionSummary[];
  }

  const { data, error } = await supabase
    .from("collections")
    .select("id, name, slug, description, is_pinned")
    .in("id", ids)
    .overrideTypes<NoteCollectionSummary[], { merge: false }>();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as NoteCollectionSummary[];
}

function toNoteListItem(
  note: Pick<
    NoteRow,
    | "id"
    | "title"
    | "slug"
    | "excerpt"
    | "cover_icon"
    | "updated_at"
    | "created_at"
    | "archived_at"
    | "is_favorite"
    | "is_pinned"
    | "visibility"
    | "folder_id"
  >,
  folderMap: Map<string, NoteFolderSummary>,
  rank?: number,
): NoteListItem {
  return {
    id: note.id,
    title: note.title,
    slug: note.slug,
    excerpt: note.excerpt,
    cover_icon: note.cover_icon,
    updated_at: note.updated_at,
    created_at: note.created_at,
    archived_at: note.archived_at,
    is_favorite: note.is_favorite,
    is_pinned: note.is_pinned,
    visibility: note.visibility,
    folder: note.folder_id ? folderMap.get(note.folder_id) ?? null : null,
    rank,
  };
}

async function getNoteBaseById(
  supabase: SupabaseServerClient,
  noteId: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from("notes")
    .select(noteDetailSelect)
    .eq("id", noteId)
    .eq("user_id", userId)
    .maybeSingle()
    .overrideTypes<NoteRow, { merge: false }>();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? null;
}

async function hydrateNoteDetail(
  supabase: SupabaseServerClient,
  note: Pick<
    NoteRow,
    | "id"
    | "folder_id"
    | "title"
    | "slug"
    | "content_md"
    | "excerpt"
    | "cover_icon"
    | "updated_at"
    | "created_at"
    | "archived_at"
    | "is_favorite"
    | "is_pinned"
    | "visibility"
  >,
): Promise<NoteDetail> {
  const [folderMap, tagIds, collectionIds] = await Promise.all([
    getFolderMap(supabase, note.folder_id ? [note.folder_id] : []),
    getNoteTagIds(supabase, note.id),
    getNoteCollectionIds(supabase, note.id),
  ]);

  const [tags, collections] = await Promise.all([
    getTagsByIds(supabase, tagIds),
    getCollectionsByIds(supabase, collectionIds),
  ]);

  return {
    ...toNoteListItem(note, folderMap),
    content_md: note.content_md,
    tagIds,
    collectionIds,
    tags,
    collections,
  };
}

export async function searchNotes(
  query: string,
  filters: Omit<NoteListFilters, "query" | "limit" | "offset"> = {},
): Promise<SearchNoteResult[]> {
  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return [];
  }

  const { data, error } = await runSearchNotes(
    supabase,
    searchArgsFromFilters(query, filters),
  );

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SearchNoteResult[];
}

export async function getNotesList(options: NoteListFilters = {}): Promise<NoteListItem[]> {
  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return [];
  }

  const { data: searchRows, error } = await runSearchNotes(
    supabase,
    searchArgsFromFilters(options.query ?? "", options),
  );

  if (error) {
    throw new Error(error.message);
  }

  const rows = (searchRows ?? []) as SearchNotesRow[];
  if (rows.length === 0) {
    return [];
  }

  const { data: notes, error: notesError } = await supabase
    .from("notes")
    .select(noteSummarySelect)
    .in(
      "id",
      rows.map((row) => row.id),
    )
    .overrideTypes<NoteSummaryRow[], { merge: false }>();

  if (notesError) {
    throw new Error(notesError.message);
  }

  const noteMap = new Map((notes ?? []).map((note) => [note.id, note]));
  const folderMap = await getFolderMap(
    supabase,
    unique((notes ?? []).map((note) => note.folder_id)),
  );
  const start = options.offset ?? 0;
  const end = start + (options.limit ?? rows.length);

  return rows
    .map((row) => {
      const note = noteMap.get(row.id);
      if (!note) {
        return null;
      }

      return toNoteListItem(note, folderMap, row.rank ?? undefined);
    })
    .filter((item): item is NoteListItem => {
      if (!item) {
        return false;
      }

      return options.archived ? item.archived_at !== null : item.archived_at === null;
    })
    .slice(start, end);
}

export async function getNoteBySlug(slug: string): Promise<NoteDetail | null> {
  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return null;
  }

  const { data: note, error } = await supabase
    .from("notes")
    .select(noteDetailSelect)
    .eq("slug", slug)
    .eq("user_id", userId)
    .maybeSingle()
    .overrideTypes<NoteRow, { merge: false }>();

  if (error) {
    throw new Error(error.message);
  }

  return note ? hydrateNoteDetail(supabase, note) : null;
}

export async function getNoteById(noteId: string): Promise<NoteDetail | null> {
  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return null;
  }

  const note = await getNoteBaseById(supabase, noteId, userId);
  return note ? hydrateNoteDetail(supabase, note) : null;
}

export async function getRelatedNotes(noteId: string, limit = 4): Promise<NoteListItem[]> {
  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return [];
  }

  const note = await getNoteBaseById(supabase, noteId, userId);
  if (!note) {
    return [];
  }

  const [tagIds, collectionIds] = await Promise.all([
    getNoteTagIds(supabase, note.id),
    getNoteCollectionIds(supabase, note.id),
  ]);
  const relatedIds = new Set<string>();

  if (note.folder_id) {
    const { data, error } = await supabase
      .from("notes")
      .select("id")
      .eq("folder_id", note.folder_id)
      .eq("user_id", userId)
      .is("archived_at", null)
      .neq("id", note.id)
      .overrideTypes<Array<{ id: string }>, { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    for (const row of data ?? []) {
      relatedIds.add(row.id);
    }
  }

  if (tagIds.length > 0) {
    const { data, error } = await supabase
      .from("note_tags")
      .select("note_id")
      .in("tag_id", tagIds)
      .neq("note_id", note.id)
      .overrideTypes<Array<{ note_id: string }>, { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    for (const row of data ?? []) {
      relatedIds.add(row.note_id);
    }
  }

  if (collectionIds.length > 0) {
    const { data, error } = await supabase
      .from("note_collections")
      .select("note_id")
      .in("collection_id", collectionIds)
      .neq("note_id", note.id)
      .overrideTypes<Array<{ note_id: string }>, { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    for (const row of data ?? []) {
      relatedIds.add(row.note_id);
    }
  }

  if (relatedIds.size === 0) {
    return [];
  }

  const { data: relatedNotes, error } = await supabase
    .from("notes")
    .select(noteSummarySelect)
    .in("id", Array.from(relatedIds))
    .eq("user_id", userId)
    .is("archived_at", null)
    .order("updated_at", { ascending: false })
    .limit(limit)
    .overrideTypes<NoteSummaryRow[], { merge: false }>();

  if (error) {
    throw new Error(error.message);
  }

  const folderMap = await getFolderMap(
    supabase,
    unique((relatedNotes ?? []).map((noteRow) => noteRow.folder_id)),
  );

  return (relatedNotes ?? []).map((noteRow) => toNoteListItem(noteRow, folderMap));
}

export async function getNeighboringNotes(noteId: string): Promise<NoteNeighbors> {
  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return { previous: null, next: null };
  }

  const note = await getNoteBaseById(supabase, noteId, userId);
  if (!note) {
    return { previous: null, next: null };
  }

  const [olderResult, newerResult] = await Promise.all([
    supabase
      .from("notes")
      .select(noteSummarySelect)
      .eq("user_id", userId)
      .is("archived_at", null)
      .lt("updated_at", note.updated_at)
      .order("updated_at", { ascending: false })
      .limit(1)
      .overrideTypes<NoteSummaryRow[], { merge: false }>(),
    supabase
      .from("notes")
      .select(noteSummarySelect)
      .eq("user_id", userId)
      .is("archived_at", null)
      .gt("updated_at", note.updated_at)
      .order("updated_at", { ascending: true })
      .limit(1)
      .overrideTypes<NoteSummaryRow[], { merge: false }>(),
  ]);

  if (olderResult.error) {
    throw new Error(olderResult.error.message);
  }

  if (newerResult.error) {
    throw new Error(newerResult.error.message);
  }

  const neighborRows = [
    ...(olderResult.data ?? []),
    ...(newerResult.data ?? []),
  ];
  const folderMap = await getFolderMap(
    supabase,
    unique(neighborRows.map((noteRow) => noteRow.folder_id)),
  );
  const previous = olderResult.data?.[0]
    ? toNoteListItem(olderResult.data[0], folderMap)
    : null;
  const next = newerResult.data?.[0] ? toNoteListItem(newerResult.data[0], folderMap) : null;

  return { previous, next };
}
