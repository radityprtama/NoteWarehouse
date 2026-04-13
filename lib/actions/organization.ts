"use server";

import { revalidatePath } from "next/cache";

import type { OrganizationActionState } from "@/lib/actions/state";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import {
  collectionSchema,
  folderSchema,
  tagSchema,
} from "@/lib/validators/organization";
import type { Database } from "@/types/database";

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;
type FolderInsert = Database["public"]["Tables"]["folders"]["Insert"];
type TagInsert = Database["public"]["Tables"]["tags"]["Insert"];
type CollectionInsert = Database["public"]["Tables"]["collections"]["Insert"];
type OrganizationTable = "folders" | "tags" | "collections";

const organizationRevalidationPaths = [
  "/dashboard",
  "/notes/new",
  "/search",
  "/folders",
  "/tags",
  "/collections",
];

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "true" || value === "on" || value === "1";
}

function nullableText(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

function actionError(message: string): OrganizationActionState {
  return {
    status: "error",
    message,
  };
}

function validationErrorState(
  fieldErrors: NonNullable<OrganizationActionState["fieldErrors"]>,
): OrganizationActionState {
  return {
    status: "error",
    message: "Check the highlighted fields and try again.",
    fieldErrors,
  };
}

function revalidateOrganizationViews(slug?: string, section?: OrganizationTable) {
  for (const path of organizationRevalidationPaths) {
    revalidatePath(path);
  }

  if (slug && section === "folders") {
    revalidatePath(`/folders/${slug}`);
  }

  if (slug && section === "tags") {
    revalidatePath(`/tags/${slug}`);
  }

  if (slug && section === "collections") {
    revalidatePath(`/collections/${slug}`);
  }
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

async function getUniqueOrganizationSlug(
  supabase: SupabaseServerClient,
  table: OrganizationTable,
  userId: string,
  requestedSlug: string,
  fallback: string,
) {
  const baseSlug = slugify(requestedSlug).slice(0, 96) || fallback;

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const suffix = attempt === 0 ? "" : `-${attempt + 1}`;
    const slug = `${baseSlug.slice(0, 96 - suffix.length)}${suffix}`;
    const { data, error } = await supabase
      .from(table)
      .select("id")
      .eq("user_id", userId)
      .eq("slug", slug)
      .limit(1)
      .overrideTypes<Array<{ id: string }>, { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    if ((data ?? []).length === 0) {
      return slug;
    }
  }

  return `${baseSlug.slice(0, 82)}-${Date.now()}`;
}

export async function createFolderAction(
  _previousState: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  const parsed = folderSchema.safeParse({
    name: getFormString(formData, "name"),
    slug: slugify(getFormString(formData, "slug") || getFormString(formData, "name")),
    description: getFormString(formData, "description"),
    color: getFormString(formData, "color"),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return actionError("You need to be signed in to create folders.");
  }

  try {
    const slug = await getUniqueOrganizationSlug(
      supabase,
      "folders",
      userId,
      parsed.data.slug,
      "folder",
    );
    const payload = {
      user_id: userId,
      name: parsed.data.name,
      slug,
      description: nullableText(parsed.data.description),
      color: nullableText(parsed.data.color),
    } satisfies FolderInsert;
    const { error } = await supabase.from("folders").insert(payload as never);

    if (error) {
      return actionError(error.message || "Unable to create the folder.");
    }

    revalidateOrganizationViews(slug, "folders");

    return {
      status: "success",
      message: `Folder "${parsed.data.name}" created.`,
    };
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Unable to create the folder.");
  }
}

export async function createTagAction(
  _previousState: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  const parsed = tagSchema.safeParse({
    name: getFormString(formData, "name"),
    slug: slugify(getFormString(formData, "slug") || getFormString(formData, "name")),
    color: getFormString(formData, "color"),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return actionError("You need to be signed in to create tags.");
  }

  try {
    const slug = await getUniqueOrganizationSlug(
      supabase,
      "tags",
      userId,
      parsed.data.slug,
      "tag",
    );
    const payload = {
      user_id: userId,
      name: parsed.data.name,
      slug,
      color: nullableText(parsed.data.color),
    } satisfies TagInsert;
    const { error } = await supabase.from("tags").insert(payload as never);

    if (error) {
      return actionError(error.message || "Unable to create the tag.");
    }

    revalidateOrganizationViews(slug, "tags");

    return {
      status: "success",
      message: `Tag "${parsed.data.name}" created.`,
    };
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Unable to create the tag.");
  }
}

export async function createCollectionAction(
  _previousState: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  const parsed = collectionSchema.safeParse({
    name: getFormString(formData, "name"),
    slug: slugify(getFormString(formData, "slug") || getFormString(formData, "name")),
    description: getFormString(formData, "description"),
    is_pinned: parseBoolean(formData.get("is_pinned")),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  const supabase = await createSupabaseServerClient();
  const userId = await getAuthenticatedUserId(supabase);

  if (!userId) {
    return actionError("You need to be signed in to create collections.");
  }

  try {
    const slug = await getUniqueOrganizationSlug(
      supabase,
      "collections",
      userId,
      parsed.data.slug,
      "collection",
    );
    const payload = {
      user_id: userId,
      name: parsed.data.name,
      slug,
      description: nullableText(parsed.data.description),
      is_pinned: parsed.data.is_pinned,
    } satisfies CollectionInsert;
    const { error } = await supabase.from("collections").insert(payload as never);

    if (error) {
      return actionError(error.message || "Unable to create the collection.");
    }

    revalidateOrganizationViews(slug, "collections");

    return {
      status: "success",
      message: `Collection "${parsed.data.name}" created.`,
    };
  } catch (error) {
    return actionError(
      error instanceof Error ? error.message : "Unable to create the collection.",
    );
  }
}
