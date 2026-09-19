import { defineConfig, devices } from '@playwright/test';

// Chat UI 視覺回歸：Ask AI 曾出現黑字壓深底、淺灰實心框、重黑影，
// 全部是「截圖才發現」。這裡把 /chat 與文章頁 floating widget 的淺／深兩態
// 拍成基線（tests/visual/chat.spec.ts-snapshots/），漂移即炸。
// 跑法：pnpm test:visual（起 astro dev＋比對）；只更新基線：pnpm test:visual:update。
// 注意：基線分平台（-darwin／-linux）。曾試過共用 mac 基線，ubuntu 字型渲染差
// 約 8000px（上限 300）從沒綠過；CI 只認 -linux，本機開發只認 -darwin。
// linux 基線的來源：CI 失敗時上傳的 visual-diff artifact 裡的 *-actual.png，
// 人眼看過後放進 snapshots 目錄（不要在 mac 上產 linux 基線）。
export default defineConfig({
  testDir: './tests/visual',
  // 冷啟動的 dev server 會在首次載入時重新最佳化依賴並整頁 reload，先暖身再測（見檔內說明）。
  globalSetup: './tests/visual/global-setup.ts',
  snapshotPathTemplate: '{testDir}/{testFileName}-snapshots/{arg}-{projectName}-{platform}{ext}',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm dev --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 300 * 1000,
  },
});
