"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

export async function saveSearchHistoryAction(
  query: string,
  filters: Record<string, unknown> = {},
) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return;
  }

  await supabase.from("search_history").insert({
    user_id: user.id,
    query: trimmedQuery,
    filters: filters as Json,
    last_used_at: new Date().toISOString(),
  } as never);
}
