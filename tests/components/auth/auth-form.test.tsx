import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AuthForm } from "@/components/forms/auth-form";
import type { AuthActionState } from "@/lib/actions/state";

function createAction() {
  return vi.fn(
    async (
      previousState: AuthActionState,
      formData: FormData,
    ): Promise<AuthActionState> => ({
      status: previousState.status,
      message: formData.get("email") ? undefined : previousState.message,
    }),
  );
}

describe("AuthForm", () => {
  it("renders login fields and account switch link", () => {
    render(<AuthForm mode="login" action={createAction()} />);

    expect(
      screen.getByRole("heading", { name: /welcome back/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(/password/i)).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /create an account/i })).toHaveAttribute(
      "href",
      "/signup",
    );
  });

  it("renders signup copy and submit button", () => {
    render(<AuthForm mode="signup" action={createAction()} />);

    expect(
      screen.getByRole("heading", { name: /create your warehouse/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("submits the entered credentials through the action", async () => {
    const user = userEvent.setup();
    const action = createAction();

    render(<AuthForm mode="login" action={action} nextPath="/notes" />);

    await user.type(screen.getByLabelText(/email/i), "reader@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(action).toHaveBeenCalled();
  });
});
