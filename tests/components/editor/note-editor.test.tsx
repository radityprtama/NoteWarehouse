import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NoteEditor } from "@/components/editor/note-editor";

describe("NoteEditor", () => {
  it("inserts bold Markdown around the current selection", () => {
    render(<NoteEditor initialValue="hello" noteId={null} />);

    const textarea = screen.getByRole("textbox");
    fireEvent.select(textarea, {
      target: {
        selectionStart: 0,
        selectionEnd: 5,
      },
    });
    fireEvent.click(screen.getByRole("button", { name: /bold/i }));

    expect(textarea).toHaveValue("**hello**");
  });
});
