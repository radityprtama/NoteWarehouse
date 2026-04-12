import { describe, expect, it } from "vitest";

import { getReadingTime } from "@/lib/markdown/reading-time";

describe("getReadingTime", () => {
  it("returns a minimum of one minute", () => {
    expect(getReadingTime("short note")).toEqual({ minutes: 1, words: 2 });
  });

  it("rounds up longer notes by 200 words per minute", () => {
    const markdown = Array.from({ length: 201 }, (_, index) => `word-${index}`).join(" ");

    expect(getReadingTime(markdown)).toEqual({ minutes: 2, words: 201 });
  });
});
