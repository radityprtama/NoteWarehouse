import { slugify } from "@/lib/utils";

const markdownExtensionPattern = /\.md(?:own)?$/i;

function stripMarkdown(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*_\-[\]()+~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function filenameToTitle(filename: string) {
  return filename
    .replace(markdownExtensionPattern, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function markdownFilename(value: string) {
  return `${slugify(value) || "note"}.md`;
}

export function serializeNoteToMarkdown(note: {
  title: string;
  content_md: string;
}) {
  const content = note.content_md.trim();
  const firstHeading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();

  if (firstHeading?.toLowerCase() === note.title.trim().toLowerCase()) {
    return `${content}\n`;
  }

  return `# ${note.title.trim()}\n\n${content}`.trimEnd() + "\n";
}

export function parseMarkdownFile(filename: string, content: string) {
  const trimmedContent = content.trim();
  const title =
    trimmedContent.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
    filenameToTitle(filename) ||
    "Untitled note";
  const contentForExcerpt = trimmedContent.replace(/^#\s+.+$(\r?\n)?/m, "");
  const plainText = stripMarkdown(contentForExcerpt);

  return {
    title,
    slug: slugify(title) || "untitled-note",
    excerpt: plainText.slice(0, 180) || null,
    content_md: trimmedContent || `# ${title}`,
  };
}
