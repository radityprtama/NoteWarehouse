"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export function ConfirmSubmitButton({
  children,
  message,
}: {
  children: ReactNode;
  message: string;
}) {
  return (
    <Button
      type="submit"
      variant="outline"
      className="rounded-full"
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </Button>
  );
}
