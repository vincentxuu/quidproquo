import { expect, test } from '@playwright/test'
import { execFileSync } from 'node:child_process'

const CONSOLE_BASE = process.env.CONSOLE_BASE_URL ?? 'http://localhost:4321'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Ae86xxx2829!'

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
  await page.goto(`${CONSOLE_BASE}/login?next=/admin/console/cost`)
  await page.getByPlaceholder('密碼').fill(ADMIN_PASSWORD)
  await Promise.all([
    page.waitForURL(/\/admin\/console\/cost/, { timeout: 10_000 }),
    page.getByRole('button', { name: '登入' }).click(),
  ])
}

test.describe('Cost backfill operation UI', () => {
  test.beforeAll(() => {
    seedAdminRole()
  })

  test('previews, submits, and records a successful manual backfill', async ({ page }) => {
    let postedBody: { fromDay?: number; toDay?: number } | undefined

    await page.route('**/api/admin/console/cost/backfill', async (route) => {
      postedBody = route.request().postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          summary: {
            fromDay: postedBody?.fromDay,
            toDay: postedBody?.toDay,
            daysProcessed: 7,
            rowsWritten: 12,
            tokensIn: 1200,
            tokensOut: 340,
            costUsd: 0.2468,
          },
        }),
      })
    })

    await login(page)

    await page.getByRole('button', { name: '近 7 天' }).click()
    await expect(page.locator('#cost-backfill-preview-range')).toContainText('7 天')
    await expect(page.locator('#cost-backfill-preview-risk')).toContainText('可直接執行')

    await page.getByRole('button', { name: '執行回填' }).click()

    await expect(page.locator('#cost-backfill-status')).toContainText('費用回填完成')
    await expect(page.locator('#cost-backfill-summary')).toBeVisible()
    await expect(page.locator('[data-summary="days"]')).toHaveText('7')
    await expect(page.locator('[data-summary="rows"]')).toHaveText('12')
    await expect(page.locator('[data-summary="cost"]')).toHaveText('$0.2468')
    await expect(page.locator('[data-summary="tokens"]')).toHaveText('1,540')
    await expect(page.locator('#cost-backfill-history-body .backfill-history-row').first()).toContainText('12 列')
    await expect(page.locator('#cost-backfill-history-body .backfill-history-row').first()).toContainText('$0.2468')

    expect(postedBody?.fromDay).toBeLessThanOrEqual(postedBody?.toDay ?? 0)
    expect((postedBody?.toDay ?? 0) - (postedBody?.fromDay ?? 0) + 1).toBe(7)
  })

  test('surfaces failed manual backfills and lets operators repeat the selected range', async ({ page }) => {
    let postedBody: { fromDay?: number; toDay?: number } | undefined

    await page.route('**/api/admin/console/cost/backfill', async (route) => {
      postedBody = route.request().postDataJSON()
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'fixture backfill failure' }),
      })
    })

    await login(page)

    await page.getByRole('button', { name: '近 30 天' }).click()
    await expect(page.locator('#cost-backfill-preview-range')).toContainText('30 天')
    await expect(page.locator('#cost-backfill-preview-risk')).toContainText('可直接執行')

    await page.getByRole('button', { name: '執行回填' }).click()

    await expect(page.locator('#cost-backfill-status')).toHaveClass(/error/)
    await expect(page.locator('#cost-backfill-status')).toContainText('fixture backfill failure')
    await expect(page.locator('#cost-backfill-summary')).toBeHidden()

    const failedRow = page.locator('#cost-backfill-history-body .backfill-history-row').first()
    await expect(failedRow).toContainText('失敗')
    await expect(failedRow).toContainText('fixture backfill failure')
    await expect(failedRow.getByRole('button', { name: '重跑' })).toBeEnabled()

    const submittedFrom = postedBody?.fromDay
    const submittedTo = postedBody?.toDay
    expect(submittedFrom).toBeLessThanOrEqual(submittedTo ?? 0)
    expect((submittedTo ?? 0) - (submittedFrom ?? 0) + 1).toBe(30)

    await failedRow.getByRole('button', { name: '重跑' }).click()
    await expect(page.locator('#cost-backfill-status')).toContainText('已帶入歷史回填區間')
    await expect(page.locator('#cost-backfill-preview-range')).toContainText('30 天')
    await expect(page.locator('#backfill-from')).toHaveValue(dayToInputValue(submittedFrom ?? 0))
    await expect(page.locator('#backfill-to')).toHaveValue(dayToInputValue(submittedTo ?? 0))
  })
})

function dayToInputValue(day: number): string {
  return new Date(day * 86_400_000).toISOString().slice(0, 10)
}
