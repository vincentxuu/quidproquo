// src/plugins/remarkReadingTime.ts
import { toString } from 'mdast-util-to-string';
import type { Root } from 'mdast';
import type { VFile } from 'vfile';

const LATIN_WORDS_PER_MINUTE = 200;
const CJK_CHARS_PER_MINUTE = 500;

export function calculateReadingTime(text: string): number {
  const normalized = text.trim();
  if (!normalized) return 1;

  const cjkChars = normalized.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu)?.length ?? 0;
  const latinWords = normalized
    .replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu, ' ')
    .match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g)?.length ?? 0;

  const minutes = (cjkChars / CJK_CHARS_PER_MINUTE) + (latinWords / LATIN_WORDS_PER_MINUTE);
  return Math.max(1, Math.ceil(minutes));
}

/**
 * Remark plugin: counts words in markdown and injects
 * `readingTime` (number of minutes) into frontmatter data.
 * Accessible as `post.data.readingTime` via Content Layer.
 */
export function remarkReadingTime() {
  return function (tree: Root, file: VFile) {
    const text = toString(tree);
    const minutes = calculateReadingTime(text);
    // Astro Content Layer reads from file.data.astro.frontmatter
    const fm = (file.data as Record<string, unknown>);
    if (!fm.astro) fm.astro = {};
    (fm.astro as Record<string, unknown>).frontmatter = {
      ...((fm.astro as Record<string, unknown>).frontmatter as object),
      readingTime: minutes,
    };
  };
}
