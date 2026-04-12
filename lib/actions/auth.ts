"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { publicEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { authSchema } from "@/lib/validators/auth";
import type { AuthActionState } from "@/lib/actions/state";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function safeRedirectPath(value: FormDataEntryValue | null, fallback = "/dashboard") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  try {
    const parsed = new URL(value, publicEnv.NEXT_PUBLIC_APP_URL);
    if (parsed.origin !== publicEnv.NEXT_PUBLIC_APP_URL) {
      return fallback;
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

function validationErrorState(
  fieldErrors: AuthActionState["fieldErrors"],
): AuthActionState {
  return {
    status: "error",
    message: "Check the highlighted fields and try again.",
    fieldErrors,
  };
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = authSchema.safeParse({
    email: getFormString(formData, "email"),
    password: getFormString(formData, "password"),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      status: "error",
      message: error.message || "Unable to sign in with those credentials.",
    };
  }

  revalidatePath("/", "layout");
  redirect(safeRedirectPath(formData.get("next")));
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = authSchema.safeParse({
    email: getFormString(formData, "email"),
    password: getFormString(formData, "password"),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return {
      status: "error",
      message: error.message || "Unable to create your account.",
    };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect(safeRedirectPath(formData.get("next")));
  }

  return {
    status: "success",
    message: "Account created. Check your email to confirm your address before signing in.",
  };
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
