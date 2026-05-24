import { expect, test } from '@playwright/test'
import { execFileSync } from 'node:child_process'

const CONSOLE_BASE = process.env.CONSOLE_BASE_URL ?? 'http://localhost:4321'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Ae86xxx2829!'

const consoleSections = [
  '/admin/console',
  '/admin/console/runs',
  '/admin/console/evidence',
  '/admin/console/artifacts',
  '/admin/console/flows',
  '/admin/console/providers',
  '/admin/console/policies',
  '/admin/console/cost',
  '/admin/console/rbac',
]

function execLocalD1(command: string): string {
  return execFileSync('pnpm', ['wrangler', 'd1', 'execute', 'quidproquo-db', '--local', '--command', command], {
    cwd: process.cwd(),
    stdio: 'pipe',
    encoding: 'utf8',
  })
}

function seedAdminRole() {
  const now = Date.now()
  execLocalD1(`
    INSERT OR IGNORE INTO console_users (email, created_at) VALUES ('admin', ${now});
    INSERT OR IGNORE INTO console_user_roles (user_id, role_id, assigned_by)
    SELECT u.user_id, r.role_id, 'playwright'
    FROM console_users u
    JOIN console_roles r ON r.name = 'admin'
    WHERE u.email = 'admin';
  `)
}

async function login(page: import('@playwright/test').Page, next: string) {
  await page.goto(`${CONSOLE_BASE}/login?next=${encodeURIComponent(next)}`)
  await page.getByPlaceholder('密碼').fill(ADMIN_PASSWORD)
  await Promise.all([
    page.waitForURL(new RegExp(next.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 10_000 }),
    page.getByRole('button', { name: '登入' }).click(),
  ])
}

test.describe('Console responsive layout', () => {
  test.beforeAll(() => {
    seedAdminRole()
  })

  for (const path of consoleSections) {
    test(`${path} fits a 375px viewport`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 })
      await login(page, path)

      await expect(page.locator('.mobile-nav')).toBeVisible()
      await expect(page.locator('.mobile-nav-trigger')).toBeVisible()
      await expect(page.locator('.admin-sidebar')).toBeHidden()

      const overflow = await page.evaluate(() => ({
        viewport: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
      }))
      expect(Math.max(overflow.documentWidth, overflow.bodyWidth)).toBeLessThanOrEqual(overflow.viewport + 1)
    })
  }
})
