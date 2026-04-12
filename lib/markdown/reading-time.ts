const WORDS_PER_MINUTE = 200;

export type ReadingTime = {
  minutes: number;
  words: number;
};

export function getReadingTime(markdown: string): ReadingTime {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

  return { minutes, words };
}
