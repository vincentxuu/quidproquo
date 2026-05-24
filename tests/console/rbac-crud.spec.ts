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

function cleanupE2EFixtures() {
  execLocalD1(`
    DELETE FROM console_user_roles WHERE role_id IN (SELECT role_id FROM console_roles WHERE name LIKE 'e2e_%');
    DELETE FROM console_permissions WHERE role_id IN (SELECT role_id FROM console_roles WHERE name LIKE 'e2e_%');
    DELETE FROM console_roles WHERE name LIKE 'e2e_%';
    DELETE FROM console_user_roles WHERE user_id IN (SELECT user_id FROM console_users WHERE email LIKE 'e2e+%@example.com');
    UPDATE console_audit_log SET user_id = NULL WHERE user_id IN (SELECT user_id FROM console_users WHERE email LIKE 'e2e+%@example.com');
    DELETE FROM console_users WHERE email LIKE 'e2e+%@example.com';
  `)
}

async function login(page: import('@playwright/test').Page) {
  await page.goto(`${CONSOLE_BASE}/login?next=/admin/console/rbac`)
  await page.getByPlaceholder('密碼').fill(ADMIN_PASSWORD)
  await Promise.all([
    page.waitForURL(/\/admin\/console\/rbac/, { timeout: 10_000 }),
    page.getByRole('button', { name: '登入' }).click(),
  ])
}

test.describe('RBAC frontend CRUD smoke', () => {
  test.beforeAll(() => {
    seedAdminRole()
    cleanupE2EFixtures()
  })

  test.afterEach(() => {
    cleanupE2EFixtures()
  })

  test('creates and deletes a custom role, permission, and user through the UI', async ({ page }) => {
    const stamp = Date.now().toString(36)
    const roleName = `e2e_${stamp}`
    const email = `e2e+${stamp}@example.com`

    page.on('dialog', (dialog) => dialog.accept())
    await login(page)

    await page.getByRole('tab', { name: '角色' }).click()
    await expect(page).toHaveURL(/tab=roles/)
    const createRoleForm = page.locator('[data-rbac-create-role-form]')
    await createRoleForm.locator('input[name="name"]').fill(roleName)
    await createRoleForm.locator('textarea[name="description"]').fill('Playwright RBAC CRUD smoke role')
    await Promise.all([
      page.waitForLoadState('networkidle'),
      createRoleForm.getByRole('button', { name: '新增角色' }).click(),
    ])
    await expect(page.getByRole('link', { name: roleName })).toBeVisible()

    await page.getByRole('link', { name: roleName }).click()
    await expect(page.locator('input[name="name"]')).toHaveValue(roleName)
    await page.locator('#resource_kind').selectOption('cost')
    await page.locator('#action').selectOption('view')
    await page.getByRole('button', { name: '新增權限' }).click()
    await expect(page.locator('[data-permission-row-form]').filter({ hasText: 'cost' })).toBeVisible()

    await page.goto(`${CONSOLE_BASE}/admin/console/rbac?tab=users`)
    await page.getByLabel('電子郵件').fill(email)
    await page.locator(`input[name="roles"][value="${roleName}"]`).check()
    await page.getByRole('button', { name: '新增使用者' }).click()
    await expect(page.getByRole('link', { name: email })).toBeVisible()

    const userRow = page.locator('[data-rbac-row="users"]').filter({ hasText: email })
    await userRow.getByRole('button', { name: `刪除 ${email}` }).click()
    await expect(page.getByRole('link', { name: email })).toHaveCount(0)

    await page.getByRole('tab', { name: '角色' }).click()
    const roleRow = page.locator('[data-rbac-row="roles"]').filter({ hasText: roleName })
    await roleRow.getByRole('button', { name: `刪除角色 ${roleName}` }).click()
    await expect(page.getByRole('link', { name: roleName })).toHaveCount(0)
  })
})
