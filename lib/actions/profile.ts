"use server";

import { revalidatePath } from "next/cache";

import type { ProfileActionState } from "@/lib/actions/state";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validators/auth";
import type { Database } from "@/types/database";

type ProfileMutationClient = {
  from(relation: "profiles"): {
    update(values: Database["public"]["Tables"]["profiles"]["Update"]): {
      eq(
        column: "id",
        value: string,
      ): Promise<{ error: { message: string } | null }>;
    };
  };
};

function nullableText(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

export async function updateProfileAction(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      status: "error",
      message: "You need to be signed in to update your profile.",
    };
  }

  const parsed = profileSchema.safeParse({
    display_name: formData.get("display_name"),
    avatar_url: formData.get("avatar_url"),
    bio: formData.get("bio"),
    onboarding_completed: formData.get("onboarding_completed") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const profileUpdate = {
    email: user.email ?? "",
    display_name: nullableText(parsed.data.display_name),
    avatar_url: nullableText(parsed.data.avatar_url),
    bio: nullableText(parsed.data.bio),
    onboarding_completed: parsed.data.onboarding_completed,
  } satisfies Database["public"]["Tables"]["profiles"]["Update"];

  const profileClient = supabase as unknown as ProfileMutationClient;
  const { error } = await profileClient
    .from("profiles")
    .update(profileUpdate)
    .eq("id", user.id);

  if (error) {
    return {
      status: "error",
      message: error.message || "Unable to update your profile.",
    };
  }

  revalidatePath("/profile");

  return {
    status: "success",
    message: "Profile updated.",
  };
}
