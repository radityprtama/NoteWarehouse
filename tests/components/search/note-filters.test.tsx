import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NoteFilters } from "@/components/notes/note-filters";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(""),
}));

describe("NoteFilters", () => {
  it("renders the quick status toggles", () => {
    render(<NoteFilters />);

    expect(screen.getByRole("button", { name: /favorite/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pinned/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /archived/i })).toBeInTheDocument();
  });
});
