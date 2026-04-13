import { NextResponse } from "next/server";

import {
  markdownFilename,
  serializeNoteToMarkdown,
} from "@/lib/import-export/markdown";
import { getNoteBySlug } from "@/lib/queries/notes";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ noteSlug: string }> },
) {
  const { noteSlug } = await params;
  const note = await getNoteBySlug(noteSlug);

  if (!note) {
    return NextResponse.json({ error: "Note not found." }, { status: 404 });
  }

  const filename = markdownFilename(note.slug);

  return new NextResponse(serializeNoteToMarkdown(note), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
