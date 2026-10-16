import { test, expect, type Page } from '@playwright/test';
import { POST_URL, POST_TITLE, FLOATING_URL, FLOATING_TITLE } from './fixtures';

// 基線：tests/visual/baselines/ 下同名 png。更新基線前必須人眼看過 diff，
// 不准為了變綠而放寬（maxDiffPixels 只吃跨平台抗鋸齒噪音）。

async function gotoWithTheme(page: Page, url: string, theme: 'light' | 'dark') {
  // 各頁都在 head 同步讀 localStorage 決定 data-theme，必須在載入前寫入。
  await page.addInitScript((t: string) => localStorage.setItem('theme', t), theme);
  // 不用 networkidle：dev 模式文章頁載入後會再 reload 一次，CI 上曾因此卡滿 30s
  //（trace 裡所有請求 7s 內都完成，仍等不到 idle）。畫面就緒交給下面的
  // toBeVisible 與 toHaveScreenshot 自帶的穩定等待。
  const response = await page.goto(url, { waitUntil: 'load' });
  expect(response, `Expected a document response for ${url}`).not.toBeNull();
  expect(response!.status(), `Expected a published page at ${url}`).toBe(200);
  await page.evaluate(() => document.fonts.ready);
}

test.describe('Ask AI visual', () => {
  for (const theme of ['light', 'dark'] as const) {
    test(`chat page (${theme})`, async ({ page }) => {
      await gotoWithTheme(page, '/chat', theme);
      await expect(page.getByText('可以這樣問')).toBeVisible();
      await expect(page).toHaveScreenshot(`chat-${theme}.png`, {
        animations: 'disabled',
        mask: [page.locator('img')],
        maxDiffPixels: 300,
      });
    });

    test(`floating widget open (${theme})`, async ({ page }) => {
      await gotoWithTheme(page, FLOATING_URL, theme);
      await expect(page.getByRole('heading', { level: 1, name: FLOATING_TITLE, exact: true })).toBeVisible();
      const launcher = page.getByRole('button', { name: /開啟 AI 對話/ });
      await expect(launcher).toBeVisible();
      await launcher.click();
      await expect(page.getByText('可以這樣問')).toBeVisible();
      await expect(page).toHaveScreenshot(`floating-${theme}.png`, {
        animations: 'disabled',
        mask: [page.locator('img')],
        maxDiffPixels: 300,
      });
    });

    // 6fe73f0a: published articles use the companion sidebar; generic pages keep ChatFloating.
    test(`article sidebar open (${theme})`, async ({ page }) => {
      await gotoWithTheme(page, POST_URL, theme);
      await expect(page.getByRole('heading', { level: 1, name: POST_TITLE, exact: true })).toBeVisible();
      const launcher = page.getByRole('button', { name: '✦ Ask AI', exact: true });
      await expect(launcher).toBeVisible();
      await launcher.click();
      const sidebar = page.getByRole('complementary', { name: '關於這篇文章', exact: true });
      await expect(sidebar).toBeVisible();
      await expect(sidebar.getByText('可以這樣問', { exact: true })).toBeVisible();
      await sidebar.getByRole('button', { name: '關閉', exact: true }).click();
      await expect(sidebar).toHaveCount(0);
      await expect(launcher).toBeVisible();
      await launcher.click();
      await expect(sidebar).toBeVisible();
      await expect(sidebar.getByText('可以這樣問', { exact: true })).toBeVisible();
      await expect(page).toHaveScreenshot(`sidebar-${theme}.png`, {
        animations: 'disabled',
        mask: [page.locator('img')],
        maxDiffPixels: 300,
      });
    });
  }
});
