import { describe, expect, it } from "vitest";

import { highlightMatches } from "@/lib/search/highlight";

describe("highlightMatches", () => {
  it("wraps the matched token with mark tags", () => {
    expect(highlightMatches("Binary search trees", "search")).toContain(
      "<mark>search</mark>",
    );
  });

  it("escapes html before applying highlights", () => {
    expect(highlightMatches("<script>search</script>", "search")).toContain(
      "&lt;script&gt;<mark>search</mark>&lt;/script&gt;",
    );
  });
});
