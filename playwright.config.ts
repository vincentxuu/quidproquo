import { defineConfig, devices } from '@playwright/test';

// 瀏覽器回歸測試分兩層：
// - pnpm test:visual：版面、對比、互動斷言，擋部署。不比像素，Mac 與 Linux 結果一致，
//   刻意改 UI 不需要更新任何基線。
// - pnpm test:visual:screenshots（VISUAL_SCREENSHOTS=1）：chat 與三欄版面的像素比對，
//   CI 上不擋部署，只產 diff 給人審。基線分平台（-darwin／-linux），ubuntu 字型渲染
//   跟 mac 差約 8000px，不能共用；-linux 基線只由 visual-baselines.yml 在 CI 產，
//   pnpm verify 的 check-visual-baselines 會擋「整組沒有 -linux 基線」。
export default defineConfig({
  testDir: './tests/visual',
  // 冷啟動的 dev server 會在首次載入時重新最佳化依賴並整頁 reload，先暖身再測（見檔內說明）。
  globalSetup: './tests/visual/global-setup.ts',
  snapshotPathTemplate: '{testDir}/{testFileName}-snapshots/{arg}-{projectName}-{platform}{ext}',
  fullyParallel: true,
  // Missing baselines must fail without silently creating candidates in source.
  // The explicit --update-snapshots command remains available for reviewed updates.
  updateSnapshots: 'none',
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm dev --port 4321',
    // Keep content-sync and prerender-route diagnostics visible in CI failures.
    stdout: 'pipe',
    stderr: 'pipe',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    // 5,675 articles: CI cold preparation exceeded 5 min; local chunked dev returned a real 200.
    // This bounds server readiness only; HTTP/H1, test timeouts and screenshot thresholds stay strict.
    timeout: 600 * 1000,
  },
});
