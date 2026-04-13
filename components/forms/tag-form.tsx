"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";

import { createTagAction } from "@/lib/actions/organization";
import {
  initialOrganizationActionState,
  type OrganizationActionState,
} from "@/lib/actions/state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TagInput } from "@/lib/validators/organization";

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  return errors?.length ? (
    <p id={id} className="text-sm text-destructive">
      {errors[0]}
    </p>
  ) : null;
}

function ActionMessage({ state }: { state: OrganizationActionState }) {
  return state.message ? (
    <p
      className={
        state.status === "success"
          ? "rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm"
          : "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
      }
      role={state.status === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      {state.message}
    </p>
  ) : null;
}

export function TagForm() {
  const form = useForm<TagInput>({
    defaultValues: {
      name: "",
      slug: "",
      color: "",
    },
  });
  const [state, formAction, pending] = useActionState(
    createTagAction,
    initialOrganizationActionState,
  );

  return (
    <form
      action={formAction}
      className="grid gap-4 rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm md:grid-cols-[1fr_1fr_0.8fr_auto]"
    >
      <div className="grid gap-2">
        <Label htmlFor="tag-name">Tag name</Label>
        <Input
          id="tag-name"
          placeholder="linear algebra"
          maxLength={40}
          {...form.register("name")}
          aria-describedby={state.fieldErrors?.name ? "tag-name-error" : undefined}
        />
        <FieldError id="tag-name-error" errors={state.fieldErrors?.name} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="tag-slug">Slug</Label>
        <Input
          id="tag-slug"
          placeholder="linear-algebra"
          maxLength={60}
          {...form.register("slug")}
          aria-describedby={state.fieldErrors?.slug ? "tag-slug-error" : undefined}
        />
        <FieldError id="tag-slug-error" errors={state.fieldErrors?.slug} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="tag-color">Color token</Label>
        <Input
          id="tag-color"
          placeholder="amber"
          maxLength={24}
          {...form.register("color")}
          aria-describedby={state.fieldErrors?.color ? "tag-color-error" : undefined}
        />
        <FieldError id="tag-color-error" errors={state.fieldErrors?.color} />
      </div>
      <div className="flex items-end">
        <Button type="submit" disabled={pending} className="w-full rounded-full">
          {pending ? "Creating..." : "Create tag"}
        </Button>
      </div>
      <div className="md:col-span-4">
        <ActionMessage state={state} />
      </div>
    </form>
  );
}
