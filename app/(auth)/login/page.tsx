import type { Metadata } from "next";

import { AuthForm } from "@/components/forms/auth-form";
import { signInAction } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Note Warehouse knowledge vault.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-12">
      <AuthForm mode="login" action={signInAction} />
    </main>
  );
}
