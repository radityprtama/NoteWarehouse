import type { Metadata } from "next";

import { NoteFilters } from "@/components/notes/note-filters";
import { GlobalSearch } from "@/components/search/global-search";
import { SearchResults } from "@/components/search/search-results";
import { searchNotes, type SearchFilters } from "@/lib/queries/search";

export const metadata: Metadata = {
  title: "Search",
  description: "Search your Note Warehouse vault.",
};

function getStringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = getStringParam(params.q);
  const filters: SearchFilters = {
    archived: params.archived === "true",
    collection: getStringParam(params.collection) || null,
    favorite: params.favorite === "true",
    folder: getStringParam(params.folder) || null,
    pinned: params.pinned === "true",
    tag: getStringParam(params.tag) || null,
  };
  const hasActiveFilter = Object.values(filters).some(Boolean);
  const results = query || hasActiveFilter ? await searchNotes(query, filters) : [];

  return (
    <main className="space-y-8 px-6 py-8 lg:px-8">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Warehouse retrieval
          </p>
          <h1 className="font-display text-5xl tracking-tight">Search the vault</h1>
          <p className="max-w-2xl text-muted-foreground">
            Search note titles, content, excerpts, and metadata. Use quoted phrases
            or tags like <span className="font-mono">#math</span> for sharper results.
          </p>
        </div>
        <GlobalSearch initialValue={query} className="max-w-3xl" />
        <NoteFilters />
      </header>
      <SearchResults query={query} results={results} />
    </main>
  );
}
