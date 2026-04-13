"use server";

import { revalidatePath } from "next/cache";

import type { PreferenceActionState } from "@/lib/actions/state";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { preferencesSchema } from "@/lib/validators/preferences";
import type { Database } from "@/types/database";

type PreferenceInsert = Database["public"]["Tables"]["user_preferences"]["Insert"];

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "true" || value === "on" || value === "1";
}

function actionError(message: string): PreferenceActionState {
  return {
    status: "error",
    message,
  };
}

function validationErrorState(
  fieldErrors: NonNullable<PreferenceActionState["fieldErrors"]>,
): PreferenceActionState {
  return {
    status: "error",
    message: "Check the highlighted settings and try again.",
    fieldErrors,
  };
}

export async function updatePreferencesAction(
  _previousState: PreferenceActionState,
  formData: FormData,
): Promise<PreferenceActionState> {
  const parsed = preferencesSchema.safeParse({
    theme: getFormString(formData, "theme"),
    editor_mode: getFormString(formData, "editor_mode"),
    editor_width: getFormString(formData, "editor_width"),
    sidebar_collapsed: parseBoolean(formData.get("sidebar_collapsed")),
    command_palette_enabled: parseBoolean(formData.get("command_palette_enabled")),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return actionError("You need to be signed in to update settings.");
  }

  const payload = {
    user_id: user.id,
    ...parsed.data,
  } satisfies PreferenceInsert;
  const { error } = await supabase
    .from("user_preferences")
    .upsert(payload as never, { onConflict: "user_id" });

  if (error) {
    return actionError(error.message || "Unable to update settings.");
  }

  revalidatePath("/settings");

  return {
    status: "success",
    message: "Workspace settings saved.",
  };
}
