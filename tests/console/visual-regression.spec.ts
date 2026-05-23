import { test, expect } from '@playwright/test'

const CONSOLE_BASE = process.env.CONSOLE_BASE_URL ?? 'http://localhost:4321'

const baselinePages = [
  { name: 'console-index', path: '/admin/console' },
  { name: 'console-runs', path: '/admin/console/runs' },
  { name: 'console-providers', path: '/admin/console/providers' },
  { name: 'console-policies', path: '/admin/console/policies' },
]

test.describe('Visual regression (baseline comparison)', () => {
  for (const { name, path } of baselinePages) {
    test(`${name}: matches baseline screenshot`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 })
      await page.goto(`${CONSOLE_BASE}${path}`)

      // Update baselines with: pnpm exec playwright test --update-snapshots
      await expect(page).toHaveScreenshot(`${name}.png`, {
        maxDiffPixelRatio: 0.01, // ≤1% pixel delta
        animations: 'disabled',
      })
    })

    test(`${name}: 375px mobile layout`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 })
      await page.goto(`${CONSOLE_BASE}${path}`)
      await expect(page).toHaveScreenshot(`${name}-mobile.png`, {
        maxDiffPixelRatio: 0.01,
        animations: 'disabled',
      })
    })
  }
})
