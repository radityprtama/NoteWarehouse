"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  initialAuthActionState,
  type AuthActionState,
} from "@/lib/actions/state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthFormProps = {
  mode: "login" | "signup";
  action: (
    previousState: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
  nextPath?: string;
};

export function AuthForm({ mode, action, nextPath }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialAuthActionState);
  const isSignup = mode === "signup";
  const title = isSignup ? "Create your warehouse" : "Welcome back";
  const description = isSignup
    ? "Start a Markdown-first knowledge vault with secure Supabase auth."
    : "Sign in to search, write, and organize your study notes.";

  return (
    <Card className="w-full max-w-md border-border/70 bg-card/95 shadow-xl shadow-primary/5">
      <CardHeader className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Note Warehouse</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            {title}
          </h1>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
            />
            {state.fieldErrors?.email ? (
              <p id="email-error" className="text-sm text-destructive">
                {state.fieldErrors.email[0]}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              minLength={8}
              aria-describedby={state.fieldErrors?.password ? "password-error" : undefined}
            />
            {state.fieldErrors?.password ? (
              <p id="password-error" className="text-sm text-destructive">
                {state.fieldErrors.password[0]}
              </p>
            ) : null}
          </div>
          {state.message ? (
            <p
              className={
                state.status === "success"
                  ? "rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-foreground"
                  : "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              }
              role={state.status === "error" ? "alert" : "status"}
              aria-live="polite"
            >
              {state.message}
            </p>
          ) : null}
          <Button type="submit" className="h-11 w-full" disabled={pending}>
            {pending ? "Working..." : isSignup ? "Create account" : "Sign in"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account?" : "New to Note Warehouse?"}{" "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
