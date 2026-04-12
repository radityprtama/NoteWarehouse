import type { Metadata } from "next";

import { AuthForm } from "@/components/forms/auth-form";
import { signUpAction } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a Note Warehouse account.",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-12">
      <AuthForm mode="signup" action={signUpAction} />
    </main>
  );
}
