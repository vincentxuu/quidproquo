import { expect, test } from '@playwright/test'
import { execFileSync } from 'node:child_process'

const CONSOLE_BASE = process.env.CONSOLE_BASE_URL ?? 'http://localhost:4321'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Ae86xxx2829!'

const consoleNav = [
  { label: '工作流程', path: '/admin/console' },
  { label: '執行記錄', path: '/admin/console/runs' },
  { label: '來源證據', path: '/admin/console/evidence' },
  { label: '產出物', path: '/admin/console/artifacts' },
  { label: '工作流程', path: '/admin/console/flows' },
  { label: '提供者', path: '/admin/console/providers' },
  { label: '政策', path: '/admin/console/policies' },
  { label: '費用', path: '/admin/console/cost' },
  { label: '權限管理', path: '/admin/console/rbac' },
]

function execLocalD1(command: string) {
  execFileSync('pnpm', ['wrangler', 'd1', 'execute', 'quidproquo-db', '--local', '--command', command], {
    cwd: process.cwd(),
    stdio: 'pipe',
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

async function login(page: import('@playwright/test').Page) {
  await page.goto(`${CONSOLE_BASE}/login?next=/admin/console`)
  await page.getByPlaceholder('密碼').fill(ADMIN_PASSWORD)
  await Promise.all([
    page.waitForURL(/\/admin\/console/, { timeout: 10_000 }),
    page.getByRole('button', { name: '登入' }).click(),
  ])
}

test.describe('Console shell navigation', () => {
  test.beforeAll(() => {
    seedAdminRole()
  })

  test('clicks through every sidebar section and captures the shell baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await login(page)

    for (const item of consoleNav) {
      const link = page.locator(`.sidebar-nav a.nav-item[href="${item.path}"]`, { hasText: item.label })
      await link.click()
      await expect(page).toHaveURL(new RegExp(`${item.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\?.*)?$`))
      await expect(page.locator('.sidebar-nav a[aria-current="page"]')).toHaveAttribute('href', item.path)
    }

    await page.screenshot({
      path: 'tests/console/screenshots/shell-baseline.png',
      fullPage: true,
    })
  })
})
