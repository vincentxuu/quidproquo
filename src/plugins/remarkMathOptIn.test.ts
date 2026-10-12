import { describe, expect, it } from 'vitest';
import remarkMath from 'remark-math';
import type { Root } from 'mdast';
import type { VFile } from 'vfile';
import { remarkMathOptIn, wantsMath } from './remarkMathOptIn';

function fileWith(frontmatter: Record<string, unknown> | undefined, value = 'body'): VFile {
  return { value, data: frontmatter ? { astro: { frontmatter } } : {} } as unknown as VFile;
}

function paragraph(text: string): Root {
  return { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', value: text }] }] };
}

describe('wantsMath', () => {
  it('is true only for an explicit math: true', () => {
    expect(wantsMath(fileWith({ math: true }))).toBe(true);
    expect(wantsMath(fileWith({ math: false }))).toBe(false);
    expect(wantsMath(fileWith({ math: 'true' }))).toBe(false);
    expect(wantsMath(fileWith({ title: 'no flag' }))).toBe(false);
    expect(wantsMath(fileWith(undefined))).toBe(false);
  });
});

describe('remarkMathOptIn', () => {
  it('leaves posts without the flag untouched, so prices like $5 ... $20 stay text', () => {
    const copyProcessor = () => {
      throw new Error('must not re-parse a post that did not opt in');
    };
    const transform = remarkMathOptIn.call(copyProcessor);
    const tree = paragraph('costs $5 today and $20 tomorrow');
    const before = JSON.stringify(tree);

    transform(tree, fileWith({ math: false }, 'costs $5 today and $20 tomorrow'));

    expect(JSON.stringify(tree)).toBe(before);
  });

  it('re-parses an opted-in post with remark-math added and swaps in the result', () => {
    const used: unknown[] = [];
    const parsedDocs: string[] = [];
    const mathTree = {
      type: 'root',
      children: [{ type: 'paragraph', children: [{ type: 'inlineMath', value: 'x_0' }] }],
    } as unknown as Root;
    const copyProcessor = () => ({
      use(plugin: unknown) {
        used.push(plugin);
        return {
          parse(doc: string) {
            parsedDocs.push(doc);
            return mathTree;
          },
        };
      },
    });
    const transform = remarkMathOptIn.call(copyProcessor);
    const tree = paragraph('$x_0$');

    transform(tree, fileWith({ math: true }, '$x_0$'));

    expect(used).toEqual([remarkMath]);
    expect(parsedDocs).toEqual(['$x_0$']);
    expect(tree.children).toBe(mathTree.children);
  });
});
