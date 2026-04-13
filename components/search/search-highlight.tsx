import { highlightMatches } from "@/lib/search/highlight";

export function SearchHighlight({ text, query }: { text: string; query: string }) {
  return (
    <span
      className="[&_mark]:rounded-sm [&_mark]:bg-accent/20 [&_mark]:px-0.5 [&_mark]:text-foreground"
      dangerouslySetInnerHTML={{ __html: highlightMatches(text, query) }}
    />
  );
}
