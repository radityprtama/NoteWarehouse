import "server-only";

import { parseSearchInput } from "@/lib/search/parse-search";
import { searchNotes as searchNoteRows } from "@/lib/queries/notes";

export type SearchFilters = {
  folder?: string | null;
  collection?: string | null;
  tag?: string | null;
  favorite?: boolean;
  pinned?: boolean;
  archived?: boolean;
};

export async function searchNotes(rawInput: string, filters: SearchFilters = {}) {
  const parsed = parseSearchInput(rawInput);
  const query = parsed.phrase ?? parsed.query;

  return searchNoteRows(query, {
    archived: filters.archived ?? false,
    collectionSlug: filters.collection ?? null,
    favorites: filters.favorite ?? false,
    folderSlug: filters.folder ?? null,
    pinned: filters.pinned ?? false,
    tagSlug: parsed.tag ?? filters.tag ?? null,
  });
}
