// src/utils/readingTime.ts
//
// Estimated reading time for a post, computed from its Markdown body.
// Rates follow the usual convention (Medium, Hugo): ~500 CJK characters or
// ~200 latin words per minute.
//
// Computed from `entry.body` rather than injected by a remark plugin, so list
// pages can use it without calling render() on every post.

const LATIN_WORDS_PER_MINUTE = 200;
const CJK_CHARS_PER_MINUTE = 500;

const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;

/** CJK characters and latin words, counted separately. */
export function countText(text: string): { cjkChars: number; latinWords: number } {
  const normalized = text.trim();
  const cjkChars = normalized.match(CJK)?.length ?? 0;
  const latinWords = normalized
    .replace(CJK, ' ')
    .match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g)?.length ?? 0;
  return { cjkChars, latinWords };
}

export function calculateReadingTime(text: string): number {
  const { cjkChars, latinWords } = countText(text);
  const minutes = (cjkChars / CJK_CHARS_PER_MINUTE) + (latinWords / LATIN_WORDS_PER_MINUTE);
  return Math.max(1, Math.ceil(minutes));
}

/** Strips Markdown that isn't read as prose: fenced blocks, URLs, HTML tags. */
export function markdownToReadableText(markdown: string): string {
  return markdown
    .replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/<[^>]+>/g, ' ');
}

export function getReadingTime(entry: { body?: string }): number {
  return calculateReadingTime(markdownToReadableText(entry.body ?? ''));
}

/** Word count for structured data: each CJK character counts as one word. */
export function getWordCount(entry: { body?: string }): number {
  const { cjkChars, latinWords } = countText(markdownToReadableText(entry.body ?? ''));
  return cjkChars + latinWords;
}
