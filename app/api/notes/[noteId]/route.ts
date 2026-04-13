import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type NotePatchResult = {
  id: string;
  slug: string;
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ noteId: string }> },
) {
  const { noteId } = await params;
  const payload = (await request.json().catch(() => null)) as {
    content_md?: unknown;
  } | null;

  if (typeof payload?.content_md !== "string") {
    return NextResponse.json({ error: "content_md must be a string." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("notes")
    .update({ content_md: payload.content_md } as never)
    .eq("id", noteId)
    .eq("user_id", user.id)
    .select("id, slug")
    .maybeSingle()
    .overrideTypes<NotePatchResult, { merge: false }>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data) {
    return NextResponse.json({ error: "Note not found." }, { status: 404 });
  }

  revalidatePath("/dashboard");
  revalidatePath("/notes");
  revalidatePath(`/notes/${data.slug}`);
  revalidatePath(`/notes/${data.slug}/edit`);

  return NextResponse.json({ success: true, note: data });
}
