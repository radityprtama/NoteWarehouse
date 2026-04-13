export type ParsedSearchInput = {
  raw: string;
  query: string;
  phrase: string | null;
  tag: string | null;
};

export function parseSearchInput(input: string): ParsedSearchInput {
  const raw = input.trim();
  const phraseMatch = raw.match(/"([^"]+)"/);
  const tagMatch = raw.match(/#([a-z0-9-]+)/i);

  return {
    raw,
    phrase: phraseMatch?.[1]?.trim() || null,
    tag: tagMatch?.[1]?.trim().toLowerCase() || null,
    query: raw
      .replace(/"([^"]+)"/g, "")
      .replace(/#([a-z0-9-]+)/gi, "")
      .trim(),
  };
}
