import { defineConfig, devices } from '@playwright/test';

// Chat UI 視覺回歸：Ask AI 曾出現黑字壓深底、淺灰實心框、重黑影，
// 全部是「截圖才發現」。這裡把 /chat 與文章頁 floating widget 的淺／深兩態
// 拍成基線（tests/visual/chat.spec.ts-snapshots/），漂移即炸。
// 跑法：pnpm test:visual（起 astro dev＋比對）；只更新基線：pnpm test:visual:update。
// 注意：snapshotPathTemplate 刻意拿掉平台後綴，mac 產的基線要在 ubuntu CI 共用。
export default defineConfig({
  testDir: './tests/visual',
  snapshotPathTemplate: '{testDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}',
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
