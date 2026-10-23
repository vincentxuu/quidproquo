import { test, expect, type Page } from '@playwright/test';
import { POST_URL, POST_TITLE } from './fixtures';

// 三欄版面視覺回歸：驗證 Ask AI 面板開啟時，本文寬度穩定且不與面板產生異常空隙。
// 邊界寬度：1139（剛下門檻）、1140（剛上門檻）、1400（中間）、1519（三欄下限前）、1520（三欄上門檻）、1600、1920。
// 每個寬度都跑「面板關閉」與「面板開啟」兩態，以及淺／深色主題。
// 基線：tests/visual/three-column.spec.ts-snapshots/ 下同名 png。更新基線前必須人眼看過 diff。

const WIDTHS = [1139, 1140, 1400, 1519, 1520, 1600, 1920] as const;

async function gotoWithTheme(page: Page, url: string, theme: 'light' | 'dark') {
  await page.addInitScript((t: string) => localStorage.setItem('theme', t), theme);
  const response = await page.goto(url, { waitUntil: 'load' });
  expect(response, `Expected a document response for ${url}`).not.toBeNull();
  expect(response!.status(), `Expected a published page at ${url}`).toBe(200);
  await page.evaluate(() => document.fonts.ready);
}

async function openSidebar(page: Page) {
  const trigger = page.getByRole('button', { name: '✦ Ask AI' });
  await expect(trigger).toBeVisible();
  await trigger.click();
  // 面板滑入動畫 0.3s，等它出現再截圖
  await expect(page.getByRole('region', { name: /目前文章/ })).toBeVisible({ timeout: 5000 });
}

// Reserved desktop layout: the rightmost visible editorial column must meet
// the AI panel with the 24px gutter. At >=1520 the TOC sits between prose and
// AI, so measuring prose alone incorrectly counts the TOC as an empty gap.
async function assertNoGapBetweenMainAndSidebar(page: Page) {
  await page.waitForTimeout(400);
  const gap = await page.evaluate(() => {
    if (innerWidth < 1140) return null; // Smaller layouts intentionally overlay.
    const main = document.querySelector('.post-main');
    const sidebar = document.querySelector('.chat-sidebar-panel');
    if (!main || !sidebar) throw new Error('Missing article or AI panel');
    const toc = document.querySelector('.post-sidebar');
    const tocRight = toc && getComputedStyle(toc).display !== 'none' ? toc.getBoundingClientRect().right : 0;
    const editorialRight = Math.max(main.getBoundingClientRect().right, tocRight);
    return sidebar.getBoundingClientRect().left - editorialRight;
  });
  if (gap === null) return;
  expect(gap).toBeGreaterThanOrEqual(22); // Also reject overlap, not only gaps.
  expect(gap).toBeLessThanOrEqual(26);
}

test.describe('Ask AI three-column layout visual regression', () => {
  for (const theme of ['light', 'dark'] as const) {
    for (const width of WIDTHS) {
      test(`article ${width}px sidebar closed (${theme})`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await gotoWithTheme(page, POST_URL, theme);
        await expect(page.getByRole('heading', { level: 1, name: POST_TITLE, exact: true })).toBeVisible();
        // 面板關閉時不應有 .chat-sidebar-panel
        await expect(page.locator('.chat-sidebar-panel')).not.toBeVisible();
        await expect(page).toHaveScreenshot(`three-col-${width}-closed-${theme}.png`, {
          animations: 'disabled',
          mask: [page.locator('img')],
          maxDiffPixels: 300,
        });
      });

      test(`article ${width}px sidebar open (${theme})`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await gotoWithTheme(page, POST_URL, theme);
        await expect(page.getByRole('heading', { level: 1, name: POST_TITLE, exact: true })).toBeVisible();
        await openSidebar(page);
        // 斷言：本文右緣與面板左緣之間無異常空隙
        await assertNoGapBetweenMainAndSidebar(page);
        await expect(page).toHaveScreenshot(`three-col-${width}-open-${theme}.png`, {
          animations: 'disabled',
          mask: [page.locator('img')],
          maxDiffPixels: 300,
        });
      });
    }
  }
});
