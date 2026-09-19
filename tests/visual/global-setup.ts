import { chromium, type FullConfig } from '@playwright/test';

// 暖身：astro dev 冷啟動時，第一次載入文章頁會讓 Vite 發現新依賴、重新最佳化並強制整頁
// reload（trace 裡模組雜湊從 v=d753748a 變成 v=18cbb7a3），截圖若撞上這次 reload 就會
// 「Execution context was destroyed」。這裡先用真瀏覽器把兩個受測頁各走一遍，等依賴穩定後
// 才開始正式測試。只是預熱，不做任何斷言。
const WARMUP_URLS = ['/chat', '/posts/ai/2026-08-30-ask-ai-pipeline-overview'];

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL ?? 'http://localhost:4321';
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    for (let round = 0; round < 2; round++) {
      for (const path of WARMUP_URLS) {
        await page.goto(`${baseURL}${path}`, { waitUntil: 'load', timeout: 120_000 });
        // 給 Vite 時間發現依賴、重新最佳化並 reload；第二輪應已無 reload。
        await page.waitForTimeout(round === 0 ? 8_000 : 2_000);
      }
    }
  } finally {
    await browser.close();
  }
}
