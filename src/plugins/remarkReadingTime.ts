// src/plugins/remarkReadingTime.ts
import { toString } from 'mdast-util-to-string';
import type { Root } from 'mdast';
import type { VFile } from 'vfile';

const WPM = 200;

/**
 * Remark plugin: counts words in markdown and injects
 * `readingTime` (number of minutes) into frontmatter data.
 * Accessible as `post.data.readingTime` via Content Layer.
 */
export function remarkReadingTime() {
  return function (tree: Root, file: VFile) {
    const text = toString(tree);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / WPM));
    // Astro Content Layer reads from file.data.astro.frontmatter
    const fm = (file.data as Record<string, unknown>);
    if (!fm.astro) fm.astro = {};
    (fm.astro as Record<string, unknown>).frontmatter = {
      ...((fm.astro as Record<string, unknown>).frontmatter as object ?? {}),
      readingTime: minutes,
    };
  };
}
