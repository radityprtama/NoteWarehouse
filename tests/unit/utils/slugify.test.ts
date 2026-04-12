import { describe, expect, it } from "vitest";

import { slugify } from "@/lib/utils";

describe("slugify", () => {
  it("normalizes titles into URL-safe slugs", () => {
    expect(slugify("Linear Algebra Notes")).toBe("linear-algebra-notes");
  });

  it("collapses duplicate separators", () => {
    expect(slugify("Graphs  --  Trees")).toBe("graphs-trees");
  });

  it("removes leading and trailing separators", () => {
    expect(slugify("  README: Study Plan!  ")).toBe("readme-study-plan");
  });
});
