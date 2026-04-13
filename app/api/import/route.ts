import { NextResponse } from "next/server";

import { createNoteAction } from "@/lib/actions/notes";
import { parseMarkdownFile } from "@/lib/import-export/markdown";

const maxMarkdownFileSize = 2 * 1024 * 1024;

function isMarkdownFile(file: File) {
  return /\.md(?:own)?$/i.test(file.name);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData
    .getAll("files")
    .filter((file): file is File => file instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No Markdown files provided." }, { status: 400 });
  }

  const imported: Array<{ filename: string; slug: string }> = [];
  const errors: Array<{ filename: string; error: string }> = [];

  for (const file of files) {
    if (!isMarkdownFile(file)) {
      errors.push({ filename: file.name, error: "Only .md or .markdown files are supported." });
      continue;
    }

    if (file.size > maxMarkdownFileSize) {
      errors.push({ filename: file.name, error: "File is larger than 2 MB." });
      continue;
    }

    const parsed = parseMarkdownFile(file.name, await file.text());
    const result = await createNoteAction({
      ...parsed,
      cover_icon: "",
      folder_id: null,
      tag_ids: [],
      collection_ids: [],
      is_favorite: false,
      is_pinned: false,
      visibility: "private",
    });

    if (result.status === "success" && result.slug) {
      imported.push({ filename: file.name, slug: result.slug });
      continue;
    }

    errors.push({
      filename: file.name,
      error: result.message || "Unable to import this note.",
    });
  }

  return NextResponse.json(
    {
      imported,
      imported_count: imported.length,
      errors,
    },
    { status: imported.length > 0 ? 200 : 400 },
  );
}
