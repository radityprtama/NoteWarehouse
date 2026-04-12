import { slugify } from "@/lib/utils";

export type TocItem = {
  id: string;
  level: 2 | 3;
  text: string;
};

export function extractTableOfContents(markdown: string): TocItem[] {
  const usedIds = new Map<string, number>();

  return markdown
    .split("\n")
    .map((line) => line.match(/^(#{2,3})\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => match !== null)
    .map((match) => {
      const text = match[2].replace(/\s+#+$/, "").trim();
      const baseId = slugify(text);
      const currentCount = usedIds.get(baseId) ?? 0;
      usedIds.set(baseId, currentCount + 1);

      return {
        id: currentCount === 0 ? baseId : `${baseId}-${currentCount + 1}`,
        level: match[1].length as 2 | 3,
        text,
      };
    });
}
