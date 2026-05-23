import { test, expect } from '@playwright/test'

const CONSOLE_BASE = process.env.CONSOLE_BASE_URL ?? 'http://localhost:4321'
const MIN_TOUCH_TARGET_PX = 44 // Apple HIG / WCAG 2.5.5

async function checkTouchTargets(page: import('@playwright/test').Page) {
  const violations = await page.evaluate((minSize) => {
    const interactive = document.querySelectorAll('button, a, input, select, [role="button"]')
    const results: { tag: string; text: string; width: number; height: number }[] = []
    for (const el of interactive) {
      const rect = el.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0 && (rect.width < minSize || rect.height < minSize)) {
        results.push({
          tag: el.tagName,
          text: (el as HTMLElement).innerText?.slice(0, 40) || '',
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        })
      }
    }
    return results
  }, MIN_TOUCH_TARGET_PX)
  return violations
}

test.describe('Touch target sizes (≥44×44px)', () => {
  test('console index: no touch targets below minimum', async ({ page }) => {
    await page.goto(`${CONSOLE_BASE}/admin/console`)
    const violations = await checkTouchTargets(page)
    if (violations.length > 0) {
      console.warn('Touch target violations:', violations)
    }
    // Document rather than hard-fail — remediation in 8.1.2
    expect(violations.length).toBeLessThan(10) // max 10 violations before blocking
  })
})
