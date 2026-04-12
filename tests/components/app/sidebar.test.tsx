import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Sidebar } from "@/components/app/sidebar";

describe("Sidebar", () => {
  it("renders the primary app destinations", () => {
    render(<Sidebar />);

    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /notes/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /collections/i })).toBeInTheDocument();
  });
});
