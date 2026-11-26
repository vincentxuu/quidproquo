import { test, expect, type Page } from '@playwright/test';
import { expectNoHorizontalOverflow, expectReadableText } from './fixtures';

// 文章元件總覽頁（/styleguide/）的版面斷言，擋部署、不比像素。
// 每一條都對應一個讀者先發現的 bug（2026-11-19）：
// - 表格用 width: max-content，儲存格不換行，三欄表在桌機也超寬要左右滑。
// - 圖被拉到超過畫布寬度：340 寬的圖放到 560px，15px 的字變 25px。
// - 文章開頭的語言切換套了提示框的大藍框。
// 總覽頁的內容在 src/content/styleguide/styleguide.md；第一張表是「放得下」的窄表，第二張是七欄寬表（允許在框內捲動）。

const URL = '/styleguide/';
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'phone', width: 390, height: 844 },
] as const;

async function gotoWithTheme(page: Page, theme: 'light' | 'dark') {
  await page.addInitScript((t: string) => localStorage.setItem('theme', t), theme);
  const response = await page.goto(URL, { waitUntil: 'load' });
  expect(response, `Expected a document response for ${URL}`).not.toBeNull();
  expect(response!.status(), `Expected the style guide at ${URL}`).toBe(200);
  await page.evaluate(() => document.fonts.ready);
}

test('styleguide is kept out of search engines', async ({ page }) => {
  await gotoWithTheme(page, 'light');
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(1);
});

for (const vp of VIEWPORTS) {
  for (const theme of ['light', 'dark'] as const) {
    test(`article components keep their layout (${vp.name}, ${theme})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await gotoWithTheme(page, theme);
      await expectNoHorizontalOverflow(page);

      // 語言切換：小膠囊，不是整條提示框。
      // 外層 blockquote 是一般區塊（才會跟內文欄對齊），膠囊畫在裡面那段上。
      const pill = page.locator('.content > blockquote:first-child');
      await expect(pill).toBeVisible();
      const pillBox = (await pill.boundingBox())!;
      expect(pillBox.height, 'Language switch must be a compact pill, not a callout box').toBeLessThan(40);
      const chip = (await pill.locator('> p').boundingBox())!;
      expect(chip.width, 'Language switch must not span the content width').toBeLessThan(320);
      const next = (await page.locator('.content > blockquote:first-child + *').boundingBox())!;
      expect(Math.abs(chip.x - next.x), 'Language switch must line up with the text column').toBeLessThanOrEqual(2);

      // 表格：放得下的窄表不能超出容器（在桌機上連捲動都不該需要）。
      const scrolls = page.locator('.content .table-scroll');
      await expect(scrolls.first()).toBeVisible();
      if (vp.name === 'desktop') {
        const [client, scroll] = await scrolls.first().evaluate((el) => [el.clientWidth, el.scrollWidth]);
        expect(scroll, 'A 3-column table that fits must not overflow its container').toBeLessThanOrEqual(client + 1);
      }

      // 圖：顯示寬度不超過畫布（viewBox）寬度，也就是最多 1:1、不放大。
      const diagrams = await page.locator('.content svg.dg-svg, .content svg.flow-diagram__svg').evaluateAll((svgs) =>
        svgs.map((svg) => ({
          drawn: (svg as SVGSVGElement).viewBox.baseVal.width,
          shown: svg.getBoundingClientRect().width,
          title: svg.querySelector('title')?.textContent ?? svg.closest('figure')?.querySelector('figcaption')?.textContent ?? '?',
        })),
      );
      expect(diagrams.length, 'The style guide must contain diagrams to check').toBeGreaterThanOrEqual(4);
      for (const d of diagrams) {
        expect(d.shown, `Diagram "${d.title}" is drawn ${d.drawn} wide but shown ${Math.round(d.shown)}px (upscaled)`).toBeLessThanOrEqual(d.drawn + 1);
      }

      await expectReadableText(page.locator('.content'));
    });
  }
}
