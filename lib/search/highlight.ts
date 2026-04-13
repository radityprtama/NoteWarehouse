function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightMatches(text: string, query: string) {
  const escapedText = escapeHtml(text);
  const tokens = query
    .replace(/"([^"]+)"/g, "$1")
    .split(/\s+/)
    .map((token) => token.replace(/^#/, "").trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    return escapedText;
  }

  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "gi");
  return escapedText.replace(pattern, "<mark>$1</mark>");
}
