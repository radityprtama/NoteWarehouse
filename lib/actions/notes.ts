"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { NoteActionState } from "@/lib/actions/state";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { noteCreateFormSchema, noteFormSchema } from "@/lib/validators/notes";
import type { Database, Tables } from "@/types/database";

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;
type NoteInsert = Database["public"]["Tables"]["notes"]["Insert"];
type NoteUpdate = Database["public"]["Tables"]["notes"]["Update"];
type NoteRow = Tables<"notes">;
type NoteIdentity = Pick<NoteRow, "id" | "slug">;
type FavoriteResult = NoteIdentity & Pick<NoteRow, "is_favorite">;
type PinnedResult = NoteIdentity & Pick<NoteRow, "is_pinned">;
type NoteFormValues = {
  title: string;
  slug: string;
  excerpt?: string;
  content_md: string;
  cover_icon?: string;
  folder_id: string | null;
  tag_ids: string[];
  collection_ids: string[];
  is_favorite: boolean;
  is_pinned: boolean;
  visibility: "private" | "unlisted" | "public";
};

const noteRevalidationPaths = [
  "/dashboard",
  "/notes",
  "/favorites",
  "/archived",
  "/search",
];

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function nullableText(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "true" || value === "on" || value === "1";
}

function parseIdList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.length > 0);
  }

  if (typeof value !== "string" || value.length === 0) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string" && item.length > 0)
      : [];
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function readNotePayload(input: unknown) {
  if (!(input instanceof FormData)) {
    return input;
  }

  return {
    title: getFormString(input, "title"),
    slug: getFormString(input, "slug"),
    excerpt: getFormString(input, "excerpt"),
    content_md: getFormString(input, "content_md"),
    cover_icon: getFormString(input, "cover_icon"),
    folder_id: getFormString(input, "folder_id") || null,
    tag_ids: parseIdList(input.get("tag_ids")),
    collection_ids: parseIdList(input.get("collection_ids")),
    is_favorite: parseBoolean(input.get("is_favorite")),
    is_pinned: parseBoolean(input.get("is_pinned")),
    visibility: getFormString(input, "visibility") || "private",
  };
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function actionError(message: string): NoteActionState {
  return {
    status: "error",
    message,
  };
}

function validationErrorState(
  fieldErrors: NonNullable<NoteActionState["fieldErrors"]>,
): NoteActionState {
  return {
    status: "error",
    message: "Check the highlighted note fields and try again.",
    fieldErrors,
  };
}

function normalizeValues(values: NoteFormValues): NoteFormValues {
  return {
    ...values,
    slug: slugify(values.slug || values.title),
    tag_ids: unique(values.tag_ids),
    collection_ids: unique(values.collection_ids),
  };
}

function toNoteInsert(values: NoteFormValues, userId: string, slug: string): NoteInsert {
  return {
    user_id: userId,
    folder_id: values.folder_id,
    title: values.title,
    slug,
    content_md: values.content_md,
    excerpt: nullableText(values.excerpt),
    cover_icon: nullableText(values.cover_icon),
    visibility: values.visibility,
    is_favorite: values.is_favorite,
    is_pinned: values.is_pinned,
  };
}

function toNoteUpdate(values: NoteFormValues, slug: string): NoteUpdate {
  return {
    folder_id: values.folder_id,
    title: values.title,
    slug,
    content_md: values.content_md,
    excerpt: nullableText(values.excerpt),
    cover_icon: nullableText(values.cover_icon),
    visibility: values.visibility,
    is_favorite: values.is_favorite,
    is_pinned: values.is_pinned,
  };
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

async function getOwnedNote(
  supabase: SupabaseServerClient,
  noteId: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", noteId)
    .eq("user_id", userId)
    .maybeSingle()
    .overrideTypes<NoteRow, { merge: false }>();

  if (error) {
    throw new Error(error.message);
  }

  return data as NoteRow | null;
}

async function getUniqueSlug(
  supabase: SupabaseServerClient,
  userId: string,
  requestedSlug: string,
  excludeNoteId?: string,
) {
  const baseSlug = slugify(requestedSlug).slice(0, 140) || "untitled-note";

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const suffix = attempt === 0 ? "" : `-${attempt + 1}`;
    const slug = `${baseSlug.slice(0, 140 - suffix.length)}${suffix}`;
    let query = supabase
      .from("notes")
      .select("id")
      .eq("user_id", userId)
      .eq("slug", slug);

    if (excludeNoteId) {
      query = query.neq("id", excludeNoteId);
    }

    const { data, error } = await query
      .limit(1)
      .overrideTypes<Array<{ id: string }>, { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    if ((data ?? []).length === 0) {
      return slug;
    }
  }

  return `${baseSlug.slice(0, 126)}-${Date.now()}`;
}

async function replaceNoteRelations(
  supabase: SupabaseServerClient,
  noteId: string,
  tagIds: string[],
  collectionIds: string[],
) {
  const [tagDelete, collectionDelete] = await Promise.all([
    supabase.from("note_tags").delete().eq("note_id", noteId),
    supabase.from("note_collections").delete().eq("note_id", noteId),
  ]);

  if (tagDelete.error) {
    throw new Error(tagDelete.error.message);
  }

  if (collectionDelete.error) {
    throw new Error(collectionDelete.error.message);
  }

  const tagRows = unique(tagIds).map((tagId) => ({
    note_id: noteId,
    tag_id: tagId,
  }));
  const collectionRows = unique(collectionIds).map((collectionId) => ({
    note_id: noteId,
    collection_id: collectionId,
  }));

  const [tagInsert, collectionInsert] = await Promise.all([
    tagRows.length
      ? supabase.from("note_tags").insert(tagRows as never[])
      : Promise.resolve({ error: null }),
    collectionRows.length
      ? supabase.from("note_collections").insert(collectionRows as never[])
      : Promise.resolve({ error: null }),
  ]);

  if (tagInsert.error) {
    throw new Error(tagInsert.error.message);
  }

  if (collectionInsert.error) {
    throw new Error(collectionInsert.error.message);
  }
}

async function getRelationIds(supabase: SupabaseServerClient, noteId: string) {
  const [tagResult, collectionResult] = await Promise.all([
    supabase
      .from("note_tags")
      .select("tag_id")
      .eq("note_id", noteId)
      .overrideTypes<Array<{ tag_id: string }>, { merge: false }>(),
    supabase
      .from("note_collections")
      .select("collection_id")
      .eq("note_id", noteId)
      .overrideTypes<Array<{ collection_id: string }>, { merge: false }>(),
  ]);

  if (tagResult.error) {
    throw new Error(tagResult.error.message);
  }

  if (collectionResult.error) {
    throw new Error(collectionResult.error.message);
  }

  return {
    tagIds: unique((tagResult.data ?? []).map((row) => row.tag_id)),
    collectionIds: unique(
      (collectionResult.data ?? []).map((row) => row.collection_id),
    ),
  };
}

function revalidateNoteViews(slug?: string, previousSlug?: string | null) {
  for (const path of noteRevalidationPaths) {
    revalidatePath(path);
  }

  if (slug) {
    revalidatePath(`/notes/${slug}`);
    revalidatePath(`/notes/${slug}/edit`);
  }

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/notes/${previousSlug}`);
    revalidatePath(`/notes/${previousSlug}/edit`);
  }
}

export async function createNoteAction(input: unknown): Promise<NoteActionState> {
  const parsed = noteCreateFormSchema.safeParse(readNotePayload(input));

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return actionError("You need to be signed in to create a note.");
  }

  let createdNote: { id: string; slug: string };

  try {
    const values = normalizeValues({
      ...parsed.data,
      slug: parsed.data.slug || parsed.data.title,
    });
    const slug = await getUniqueSlug(supabase, userId, values.slug);
    const { data, error } = await supabase
      .from("notes")
      .insert(toNoteInsert(values, userId, slug) as never)
      .select("id, slug")
      .single()
      .overrideTypes<NoteIdentity, { merge: false }>();

    if (error) {
      return actionError(error.message || "Unable to create the note.");
    }

    await replaceNoteRelations(supabase, data.id, values.tag_ids, values.collection_ids);
    revalidateNoteViews(data.slug);
    createdNote = data;
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Unable to create the note.");
  }

  if (input instanceof FormData) {
    redirect(`/notes/${createdNote.slug}/edit`);
  }

  return {
    status: "success",
    message: "Note created.",
    noteId: createdNote.id,
    slug: createdNote.slug,
  };
}

export async function updateNoteAction(
  noteId: string,
  input: unknown,
): Promise<NoteActionState> {
  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return actionError("You need to be signed in to update a note.");
  }

  try {
    const currentNote = await getOwnedNote(supabase, noteId, userId);
    if (!currentNote) {
      return actionError("Note not found.");
    }

    const payload = readNotePayload(input);
    const parsed = noteFormSchema.safeParse({
      ...(typeof payload === "object" && payload ? payload : {}),
      slug:
        typeof payload === "object" &&
        payload &&
        "slug" in payload &&
        typeof payload.slug === "string" &&
        payload.slug.length > 0
          ? payload.slug
          : currentNote.slug,
    });

    if (!parsed.success) {
      return validationErrorState(parsed.error.flatten().fieldErrors);
    }

    const values = normalizeValues(parsed.data);
    const slug = await getUniqueSlug(supabase, userId, values.slug, currentNote.id);
    const { data, error } = await supabase
      .from("notes")
      .update(toNoteUpdate(values, slug) as never)
      .eq("id", currentNote.id)
      .eq("user_id", userId)
      .select("id, slug")
      .single()
      .overrideTypes<NoteIdentity, { merge: false }>();

    if (error) {
      return actionError(error.message || "Unable to update the note.");
    }

    await replaceNoteRelations(supabase, data.id, values.tag_ids, values.collection_ids);
    revalidateNoteViews(data.slug, currentNote.slug);

    return {
      status: "success",
      message: "Note updated.",
      noteId: data.id,
      slug: data.slug,
    };
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Unable to update the note.");
  }
}

export async function archiveNoteAction(noteId: string): Promise<NoteActionState> {
  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return actionError("You need to be signed in to archive a note.");
  }

  const archivedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("notes")
    .update({ archived_at: archivedAt } as never)
    .eq("id", noteId)
    .eq("user_id", userId)
    .select("id, slug")
    .maybeSingle()
    .overrideTypes<NoteIdentity, { merge: false }>();

  if (error) {
    return actionError(error.message || "Unable to archive the note.");
  }

  if (!data) {
    return actionError("Note not found.");
  }

  revalidateNoteViews(data.slug);
  return {
    status: "success",
    message: "Note archived.",
    noteId: data.id,
    slug: data.slug,
    archivedAt,
  };
}

export async function restoreNoteAction(noteId: string): Promise<NoteActionState> {
  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return actionError("You need to be signed in to restore a note.");
  }

  const { data, error } = await supabase
    .from("notes")
    .update({ archived_at: null } as never)
    .eq("id", noteId)
    .eq("user_id", userId)
    .select("id, slug")
    .maybeSingle()
    .overrideTypes<NoteIdentity, { merge: false }>();

  if (error) {
    return actionError(error.message || "Unable to restore the note.");
  }

  if (!data) {
    return actionError("Note not found.");
  }

  revalidateNoteViews(data.slug);
  return {
    status: "success",
    message: "Note restored.",
    noteId: data.id,
    slug: data.slug,
    archivedAt: null,
  };
}

export async function duplicateNoteAction(noteId: string): Promise<NoteActionState> {
  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return actionError("You need to be signed in to duplicate a note.");
  }

  try {
    const original = await getOwnedNote(supabase, noteId, userId);
    if (!original) {
      return actionError("Note not found.");
    }

    const slug = await getUniqueSlug(supabase, userId, `${original.slug}-copy`);
    const { data, error } = await supabase
      .from("notes")
      .insert(
        ({
          user_id: userId,
          folder_id: original.folder_id,
          title: `${original.title} Copy`,
          slug,
          content_md: original.content_md,
          excerpt: original.excerpt,
          cover_icon: original.cover_icon,
          visibility: original.visibility,
          is_favorite: false,
          is_pinned: false,
        } satisfies NoteInsert) as never,
      )
      .select("id, slug")
      .single()
      .overrideTypes<NoteIdentity, { merge: false }>();

    if (error) {
      return actionError(error.message || "Unable to duplicate the note.");
    }

    const { tagIds, collectionIds } = await getRelationIds(supabase, original.id);
    await replaceNoteRelations(supabase, data.id, tagIds, collectionIds);
    revalidateNoteViews(data.slug);

    return {
      status: "success",
      message: "Note duplicated.",
      noteId: data.id,
      slug: data.slug,
    };
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Unable to duplicate the note.");
  }
}

export async function deleteNoteAction(noteId: string): Promise<NoteActionState> {
  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return actionError("You need to be signed in to delete a note.");
  }

  const { data, error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId)
    .eq("user_id", userId)
    .select("id, slug")
    .maybeSingle()
    .overrideTypes<NoteIdentity, { merge: false }>();

  if (error) {
    return actionError(error.message || "Unable to delete the note.");
  }

  if (!data) {
    return actionError("Note not found.");
  }

  revalidateNoteViews(data.slug);
  return {
    status: "success",
    message: "Note deleted.",
    noteId: data.id,
    slug: data.slug,
  };
}

export async function toggleFavoriteAction(
  noteId: string,
  nextValue: boolean,
): Promise<NoteActionState> {
  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return actionError("You need to be signed in to favorite a note.");
  }

  const { data, error } = await supabase
    .from("notes")
    .update({ is_favorite: nextValue } as never)
    .eq("id", noteId)
    .eq("user_id", userId)
    .select("id, slug, is_favorite")
    .maybeSingle()
    .overrideTypes<FavoriteResult, { merge: false }>();

  if (error) {
    return actionError(error.message || "Unable to update the note.");
  }

  if (!data) {
    return actionError("Note not found.");
  }

  revalidateNoteViews(data.slug);
  return {
    status: "success",
    message: nextValue ? "Note added to favorites." : "Note removed from favorites.",
    noteId: data.id,
    slug: data.slug,
    isFavorite: data.is_favorite,
  };
}

export async function togglePinnedAction(
  noteId: string,
  nextValue: boolean,
): Promise<NoteActionState> {
  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return actionError("You need to be signed in to pin a note.");
  }

  const { data, error } = await supabase
    .from("notes")
    .update({ is_pinned: nextValue } as never)
    .eq("id", noteId)
    .eq("user_id", userId)
    .select("id, slug, is_pinned")
    .maybeSingle()
    .overrideTypes<PinnedResult, { merge: false }>();

  if (error) {
    return actionError(error.message || "Unable to update the note.");
  }

  if (!data) {
    return actionError("Note not found.");
  }

  revalidateNoteViews(data.slug);
  return {
    status: "success",
    message: nextValue ? "Note pinned." : "Note unpinned.",
    noteId: data.id,
    slug: data.slug,
    isPinned: data.is_pinned,
  };
}
