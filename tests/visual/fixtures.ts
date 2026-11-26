import { expect, type Locator, type Page } from '@playwright/test';

// Keep screenshot cases and dev-server warmup on the same real pages.
export const POST_URL = '/posts/ai/2026-08-30-ask-ai-pipeline-overview/';
export const POST_TITLE = 'Ask AI 的問題怎麼走完整條 RAG 管線：UI、API、Agent 與來源卡片';
export const FLOATING_URL = '/about/';
export const FLOATING_TITLE = '關於我';

// Pixel baselines are review material, not a deploy gate: they break on every
// intended UI change and -linux images can only come from CI. Gating tests use
// the layout/contrast assertions below; screenshots run only when this is set
// (the non-blocking CI job and `pnpm test:visual:update`).
export const SCREENSHOTS = process.env.VISUAL_SCREENSHOTS === '1';

export async function compareScreenshot(page: Page, name: string) {
  if (!SCREENSHOTS) return;
  await expect(page).toHaveScreenshot(name, {
    animations: 'disabled',
    mask: [page.locator('img')],
    maxDiffPixels: 300,
  });
}

export async function expectNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 'Page must not scroll horizontally').toBeLessThanOrEqual(0);
}

export async function expectInsideViewport(locator: Locator, label: string) {
  // Poll: the article sidebar slides in, so a single read can land mid-animation.
  await expect.poll(() => locator.evaluate(node => {
    const r = node.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.left >= -1 && r.right <= innerWidth + 1 && r.top >= -1 && r.bottom <= innerHeight + 1;
  }), { message: `${label} must be fully inside the viewport` }).toBe(true);
}

// The regressions screenshots originally caught were dark text on dark panels
// and light fills in dark mode. Check every visible text run in the container
// against its composited background instead of comparing pixels.
export async function expectReadableText(container: Locator, minRatio = 4.5) {
  const failures = await container.evaluate((root, min) => {
    const parse = (value: string) => {
      const m = value.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
      return { r, g, b, a };
    };
    const over = (top: { r: number; g: number; b: number; a: number }, bottom: { r: number; g: number; b: number }) => ({
      r: top.r * top.a + bottom.r * (1 - top.a),
      g: top.g * top.a + bottom.g * (1 - top.a),
      b: top.b * top.a + bottom.b * (1 - top.a),
      a: 1,
    });
    const background = (el: Element) => {
      const layers = [];
      for (let node: Element | null = el; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        // Images and gradients cannot be composited reliably; skip such text.
        if (style.backgroundImage !== 'none') return null;
        const color = parse(style.backgroundColor);
        if (color && color.a > 0) layers.push(color);
        if (color && color.a >= 1) break;
      }
      let result = { r: 255, g: 255, b: 255, a: 1 };
      for (const layer of layers.reverse()) result = over(layer, result);
      return result;
    };
    const luminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
      const [R, G, B] = [r, g, b].map(v => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    };
    const out: string[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const seen = new Set<Element>();
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
      const el = text.parentElement;
      if (!el || seen.has(el) || !text.textContent?.trim()) continue;
      seen.add(el);
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0 || style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
      if (el.closest('[aria-hidden="true"], [disabled], [aria-disabled="true"]')) continue;
      const bg = background(el);
      const fg = parse(style.color);
      if (!bg || !fg) continue;
      const [hi, lo] = [luminance(over(fg, bg)), luminance(bg)].sort((a, b) => b - a);
      const ratio = (hi + 0.05) / (lo + 0.05);
      if (ratio < min) out.push(`${ratio.toFixed(2)} "${text.textContent.trim().slice(0, 30)}" (${style.color} on ${style.backgroundColor})`);
    }
    return out;
  }, minRatio);
  expect(failures, `Text below ${minRatio}:1 contrast`).toEqual([]);
}
