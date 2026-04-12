import { describe, expect, it } from "vitest";

import { extractTableOfContents } from "@/lib/markdown/toc";

describe("extractTableOfContents", () => {
  it("extracts H2 and H3 headings in order", () => {
    const markdown = "# Title\n\n## Section A\n\n### Detail\n";

    expect(extractTableOfContents(markdown)).toEqual([
      { id: "section-a", level: 2, text: "Section A" },
      { id: "detail", level: 3, text: "Detail" },
    ]);
  });

  it("ignores H1 and deeper headings", () => {
    const markdown = "# Title\n\n## Section\n\n#### Too Deep\n";

    expect(extractTableOfContents(markdown)).toEqual([
      { id: "section", level: 2, text: "Section" },
    ]);
  });

  it("deduplicates repeated heading ids", () => {
    const markdown = "## Notes\n\n### Notes\n";

    expect(extractTableOfContents(markdown)).toEqual([
      { id: "notes", level: 2, text: "Notes" },
      { id: "notes-2", level: 3, text: "Notes" },
    ]);
  });
});
