"use client";

import { useEffect } from "react";

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

export function useKeyboardShortcuts({
  onSearch,
  onNewNote,
}: {
  onSearch: () => void;
  onNewNote: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey;

      if (!mod) {
        return;
      }

      if (event.key.toLowerCase() === "k") {
        event.preventDefault();
        onSearch();
        return;
      }

      if (event.key.toLowerCase() === "n" && !isEditableTarget(event.target)) {
        event.preventDefault();
        onNewNote();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNewNote, onSearch]);
}
