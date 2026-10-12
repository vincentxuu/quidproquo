// src/plugins/remarkMathOptIn.ts
import remarkMath from 'remark-math';
import type { Root } from 'mdast';
import type { VFile } from 'vfile';

interface MathParser {
  use(plugin: unknown): { parse(doc: string): Root };
}

/** True when the post's frontmatter opts in with `math: true`. */
export function wantsMath(file: VFile): boolean {
  const astro = (file.data as Record<string, unknown>).astro as { frontmatter?: Record<string, unknown> } | undefined;
  return astro?.frontmatter?.math === true;
}

/**
 * Remark plugin: parses `$...$` and `$$...$$` as math only for posts whose
 * frontmatter sets `math: true`.
 *
 * Math syntax cannot be switched on site-wide: a thousand posts write prices as
 * `$5 ... $20`, and a math-aware parser would swallow the text between two
 * dollar signs. So the shared pipeline stays math-free, and an opted-in post is
 * re-parsed here with remark-math added, replacing the tree before the other
 * remark plugins see it. rehype-katex then renders the math nodes; it is a no-op
 * on posts that have none.
 *
 * Must be listed first in `remarkPlugins`.
 */
export function remarkMathOptIn(this: unknown) {
  // Calling a unified processor returns an unfrozen copy with the same plugins,
  // so the re-parse keeps GFM and every other syntax extension already in use.
  const copyProcessor = this as () => MathParser;
  return function (tree: Root, file: VFile) {
    if (!wantsMath(file)) return;
    const parsed = copyProcessor().use(remarkMath).parse(String(file.value));
    tree.children = parsed.children;
    tree.position = parsed.position;
  };
}
