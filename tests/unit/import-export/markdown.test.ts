import { describe, expect, it } from "vitest";

import {
  markdownFilename,
  parseMarkdownFile,
  serializeNoteToMarkdown,
} from "@/lib/import-export/markdown";

describe("Markdown import/export helpers", () => {
  it("serializes a note with a README heading", () => {
    expect(
      serializeNoteToMarkdown({
        title: "Matrix Notes",
        content_md: "Definitions and examples.",
      }),
    ).toBe("# Matrix Notes\n\nDefinitions and examples.\n");
  });

  it("does not duplicate an existing top-level title", () => {
    expect(
      serializeNoteToMarkdown({
        title: "Matrix Notes",
        content_md: "# Matrix Notes\n\nDefinitions and examples.",
      }),
    ).toBe("# Matrix Notes\n\nDefinitions and examples.\n");
  });

  it("parses title, slug, and excerpt from Markdown files", () => {
    expect(parseMarkdownFile("linear-algebra.md", "# Eigenvectors\n\n`Ax = lambda x`")).toMatchObject({
      title: "Eigenvectors",
      slug: "eigenvectors",
      excerpt: "Ax = lambda x",
    });
  });

  it("creates safe Markdown filenames", () => {
    expect(markdownFilename("Exam Prep: Week 1")).toBe("exam-prep-week-1.md");
  });
});
