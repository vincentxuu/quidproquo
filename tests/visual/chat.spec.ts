import { test, expect, type Page } from '@playwright/test';

// 基線：tests/visual/baselines/ 下同名 png。更新基線前必須人眼看過 diff，
// 不准為了變綠而放寬（maxDiffPixels 只吃跨平台抗鋸齒噪音）。
const POST_URL = '/posts/ai/2026-08-30-ask-ai-pipeline-overview';

async function gotoWithTheme(page: Page, url: string, theme: 'light' | 'dark') {
  // 兩頁都在 head 同步讀 localStorage 決定 data-theme，必須在載入前寫入。
  await page.addInitScript((t: string) => localStorage.setItem('theme', t), theme);
  // 不用 networkidle：dev 模式文章頁載入後會再 reload 一次，CI 上曾因此卡滿 30s
  //（trace 裡所有請求 7s 內都完成，仍等不到 idle）。畫面就緒交給下面的
  // toBeVisible 與 toHaveScreenshot 自帶的穩定等待。
  await page.goto(url, { waitUntil: 'load' });
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
      await gotoWithTheme(page, POST_URL, theme);
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
  }
});
