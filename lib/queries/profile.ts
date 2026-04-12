import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type Profile = Tables<"profiles">;
export type UserPreferences = Tables<"user_preferences">;

export type CurrentProfileResult = {
  userId: string;
  email: string;
  profile: Profile | null;
  preferences: UserPreferences | null;
};

export async function getCurrentProfile(): Promise<CurrentProfileResult | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const [
    { data: profile, error: profileError },
    { data: preferences, error: preferencesError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle<Profile>(),
    supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle<UserPreferences>(),
  ]);

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (preferencesError) {
    throw new Error(preferencesError.message);
  }

  return {
    userId: user.id,
    email: user.email ?? profile?.email ?? "",
    profile,
    preferences,
  };
}
