import { describe, expect, it } from "vitest";

import { parseSearchInput } from "@/lib/search/parse-search";

describe("parseSearchInput", () => {
  it("detects quoted phrase searches", () => {
    expect(parseSearchInput('"linear algebra"').phrase).toBe("linear algebra");
  });

  it("extracts hash-prefixed tags", () => {
    expect(parseSearchInput("graphs #math").tag).toBe("math");
  });
});
