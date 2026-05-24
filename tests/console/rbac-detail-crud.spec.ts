import { expect, test } from '@playwright/test'
import { execFileSync } from 'node:child_process'

const CONSOLE_BASE = process.env.CONSOLE_BASE_URL ?? 'http://localhost:4321'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Ae86xxx2829!'

interface D1CommandResult<T = Record<string, unknown>> {
  results: T[]
  success: boolean
}

function execLocalD1(command: string): string {
  return execFileSync('pnpm', ['wrangler', 'd1', 'execute', 'quidproquo-db', '--local', '--command', command], {
    cwd: process.cwd(),
    stdio: 'pipe',
    encoding: 'utf8',
  })
}

function execLocalD1Json<T = Record<string, unknown>>(command: string): D1CommandResult<T>[] {
  const output = execLocalD1(command)
  const start = output.indexOf('[\n')
  const end = output.lastIndexOf(']')
  if (start === -1 || end === -1) return []
  return JSON.parse(output.slice(start, end + 1)) as D1CommandResult<T>[]
}

function d1First<T = Record<string, unknown>>(command: string): T | undefined {
  return execLocalD1Json<T>(command)[0]?.results[0]
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
    DELETE FROM console_user_roles WHERE role_id IN (SELECT role_id FROM console_roles WHERE name LIKE 'e2e_detail_%');
    DELETE FROM console_permissions WHERE role_id IN (SELECT role_id FROM console_roles WHERE name LIKE 'e2e_detail_%');
    DELETE FROM console_roles WHERE name LIKE 'e2e_detail_%';
    DELETE FROM console_user_roles WHERE user_id IN (SELECT user_id FROM console_users WHERE email LIKE 'e2e+detail%@example.com');
    UPDATE console_audit_log SET user_id = NULL WHERE user_id IN (SELECT user_id FROM console_users WHERE email LIKE 'e2e+detail%@example.com');
    DELETE FROM console_users WHERE email LIKE 'e2e+detail%@example.com';
  `)
}

function seedDetailFixture(stamp: string) {
  const now = Date.now()
  const roleName = `e2e_detail_${stamp}`
  const assignedEmail = `e2e+detail-${stamp}@example.com`
  const unassignedEmail = `e2e+detail-unassigned-${stamp}@example.com`

  cleanupE2EFixtures()
  execLocalD1(`
    INSERT INTO console_roles (name, description) VALUES ('${roleName}', 'Detail CRUD fixture');
    INSERT INTO console_users (email, created_at) VALUES ('${assignedEmail}', ${now});
    INSERT INTO console_users (email, created_at) VALUES ('${unassignedEmail}', ${now});
    INSERT INTO console_user_roles (user_id, role_id, assigned_by)
    SELECT u.user_id, r.role_id, 'playwright'
    FROM console_users u
    JOIN console_roles r ON r.name = '${roleName}'
    WHERE u.email = '${assignedEmail}';
    INSERT INTO console_permissions (role_id, resource_kind, resource_id, action)
    SELECT role_id, 'flow', NULL, 'view'
    FROM console_roles
    WHERE name = '${roleName}';
  `)

  const role = d1First<{ role_id: number }>(`SELECT role_id FROM console_roles WHERE name = '${roleName}' LIMIT 1;`)
  const assignedUser = d1First<{ user_id: number }>(
    `SELECT user_id FROM console_users WHERE email = '${assignedEmail}' LIMIT 1;`,
  )
  const unassignedUser = d1First<{ user_id: number }>(
    `SELECT user_id FROM console_users WHERE email = '${unassignedEmail}' LIMIT 1;`,
  )
  const permission = d1First<{ permission_id: number }>(
    `SELECT permission_id FROM console_permissions WHERE role_id = ${role?.role_id ?? 0} LIMIT 1;`,
  )

  if (!role || !assignedUser || !unassignedUser || !permission) {
    throw new Error('failed to seed RBAC detail fixture')
  }

  return {
    roleId: role.role_id,
    roleName,
    assignedEmail,
    assignedUserId: assignedUser.user_id,
    unassignedEmail,
    unassignedUserId: unassignedUser.user_id,
    permissionId: permission.permission_id,
  }
}

async function login(page: import('@playwright/test').Page, next = '/admin/console/rbac') {
  await page.goto(`${CONSOLE_BASE}/login?next=${encodeURIComponent(next)}`)
  await page.getByPlaceholder('密碼').fill(ADMIN_PASSWORD)
  await Promise.all([
    page.waitForURL(new RegExp(next.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 10_000 }),
    page.getByRole('button', { name: '登入' }).click(),
  ])
}

test.describe('RBAC detail CRUD UI', () => {
  test.beforeAll(() => {
    seedAdminRole()
    cleanupE2EFixtures()
  })

  test.afterEach(() => {
    cleanupE2EFixtures()
  })

  test('edits role details, role membership, permissions, and user detail state', async ({ page }) => {
    const stamp = Date.now().toString(36)
    const fixture = seedDetailFixture(stamp)
    const renamedRole = `${fixture.roleName}_renamed`
    const updatedEmail = `e2e+detail-updated-${stamp}@example.com`

    page.on('dialog', (dialog) => dialog.accept())
    await login(page, `/admin/console/rbac/roles/${fixture.roleId}`)

    await page.locator('input[name="name"]').fill(renamedRole)
    await page.locator('textarea[name="description"]').fill('Updated from RBAC detail smoke')
    await Promise.all([
      page.waitForLoadState('networkidle'),
      page.getByRole('button', { name: '儲存角色' }).click(),
    ])
    await expect(page.locator('input[name="name"]')).toHaveValue(renamedRole)
    await expect(page.locator('textarea[name="description"]')).toHaveValue('Updated from RBAC detail smoke')

    await page.locator('#assign-user').selectOption(String(fixture.unassignedUserId))
    await Promise.all([
      page.waitForLoadState('networkidle'),
      page.getByRole('button', { name: '加入角色' }).click(),
    ])
    await expect(page.getByRole('link', { name: fixture.unassignedEmail })).toBeVisible()

    const assignedRow = page.locator('tr').filter({ hasText: fixture.assignedEmail })
    await Promise.all([
      page.waitForLoadState('networkidle'),
      assignedRow.getByRole('button', { name: '移除此角色' }).click(),
    ])
    await expect(page.getByRole('link', { name: fixture.assignedEmail })).toHaveCount(0)

    const permissionForm = page.locator(`[data-permission-id="${fixture.permissionId}"]`)
    await permissionForm.locator('select[name="resource_kind"]').selectOption('provider')
    await permissionForm.locator('select[name="permission_action"]').selectOption('edit')
    await permissionForm.locator('input[name="resource_id"]').fill('provider-alpha')
    await Promise.all([
      page.waitForLoadState('networkidle'),
      permissionForm.getByRole('button', { name: '儲存' }).click(),
    ])
    await expect(page.locator('[data-permission-row-form]').filter({ hasText: 'provider-alpha' })).toBeVisible()

    await Promise.all([
      page.waitForLoadState('networkidle'),
      page.getByRole('button', { name: '移除 provider edit 權限' }).click(),
    ])
    await expect(page.locator('[data-permission-row-form]')).toHaveCount(0)
    await expect(page.getByText('此角色尚未指派任何權限。')).toBeVisible()

    await page.goto(`${CONSOLE_BASE}/admin/console/rbac/users/${fixture.unassignedUserId}`)
    await expect(page.locator('input[name="email"]')).toHaveValue(fixture.unassignedEmail)
    await page.locator('input[name="email"]').fill(updatedEmail)
    await Promise.all([
      page.waitForLoadState('networkidle'),
      page.getByRole('button', { name: '儲存使用者' }).click(),
    ])
    await expect(page.locator('input[name="email"]')).toHaveValue(updatedEmail)

    await page.locator(`input[name="roles"][value="${renamedRole}"]`).uncheck()
    await Promise.all([
      page.waitForLoadState('networkidle'),
      page.getByRole('button', { name: '儲存角色' }).click(),
    ])
    await expect(page.locator(`input[name="roles"][value="${renamedRole}"]`)).not.toBeChecked()
    await expect(page.getByText('將移除此使用者所有角色，儲存後會失去主控台權限。')).toBeVisible()

    await Promise.all([
      page.waitForURL(/\/admin\/console\/rbac\?tab=users/),
      page.getByRole('button', { name: '刪除使用者' }).click(),
    ])
    await expect(page.getByRole('link', { name: updatedEmail })).toHaveCount(0)

    const dbState = d1First<{
      role_name: string
      permission_count: number
      assigned_user_count: number
      deleted_user_count: number
    }>(`
      SELECT
        (SELECT name FROM console_roles WHERE role_id = ${fixture.roleId}) AS role_name,
        (SELECT COUNT(*) FROM console_permissions WHERE role_id = ${fixture.roleId}) AS permission_count,
        (SELECT COUNT(*) FROM console_user_roles WHERE role_id = ${fixture.roleId}) AS assigned_user_count,
        (SELECT COUNT(*) FROM console_users WHERE user_id = ${fixture.unassignedUserId}) AS deleted_user_count;
    `)
    expect(dbState?.role_name).toBe(renamedRole)
    expect(dbState?.permission_count).toBe(0)
    expect(dbState?.assigned_user_count).toBe(0)
    expect(dbState?.deleted_user_count).toBe(0)
  })

  test('disables and re-enables a user from the user detail page', async ({ page }) => {
    const stamp = Date.now().toString(36)
    const fixture = seedDetailFixture(stamp)

    page.on('dialog', (dialog) => dialog.accept())
    await login(page, `/admin/console/rbac/users/${fixture.assignedUserId}`)

    await expect(page.locator('.badge.active')).toHaveText('啟用中')
    await expect(page.getByText('停用後，此使用者將無法存取主控台。')).toBeVisible()

    await Promise.all([
      page.waitForLoadState('networkidle'),
      page.getByRole('button', { name: '停用使用者' }).click(),
    ])
    await expect(page.locator('.notice.success')).toContainText('已停用使用者。')
    await expect(page.locator('.badge.disabled')).toContainText('停用於')
    await expect(page.getByText('此使用者目前已停用，無法登入。')).toBeVisible()

    const disabledState = d1First<{ disabled_at: number | null }>(
      `SELECT disabled_at FROM console_users WHERE user_id = ${fixture.assignedUserId};`,
    )
    expect(disabledState?.disabled_at).toBeGreaterThan(0)

    await Promise.all([
      page.waitForLoadState('networkidle'),
      page.getByRole('button', { name: '重新啟用使用者' }).click(),
    ])
    await expect(page.locator('.notice.success')).toContainText('已重新啟用使用者。')
    await expect(page.locator('.badge.active')).toHaveText('啟用中')
    await expect(page.getByText('停用後，此使用者將無法存取主控台。')).toBeVisible()

    const enabledState = d1First<{ disabled_at: number | null }>(
      `SELECT disabled_at FROM console_users WHERE user_id = ${fixture.assignedUserId};`,
    )
    expect(enabledState?.disabled_at).toBeNull()
  })

  test('previews and applies an RBAC permission preset from the role detail page', async ({ page }) => {
    const stamp = Date.now().toString(36)
    const fixture = seedDetailFixture(stamp)

    page.on('dialog', (dialog) => dialog.accept())
    await login(page, `/admin/console/rbac/roles/${fixture.roleId}`)

    const operatorPreset = page.locator('[data-preset-form]').filter({ hasText: '執行操作' })
    await expect(operatorPreset).toBeVisible()
    await expect(operatorPreset).toContainText('8 項權限')
    await expect(operatorPreset.locator('.preset-grants')).toContainText('run cancel')
    await expect(operatorPreset.locator('.preset-grants')).toContainText('approval approve')

    await Promise.all([
      page.waitForLoadState('networkidle'),
      operatorPreset.getByRole('button', { name: '套用範本' }).click(),
    ])

    await expect(page.locator('.notice.success')).toContainText('已套用「執行操作」範本，新增 7 項權限。')
    await expect(page.locator('[data-permission-row-form]')).toHaveCount(8)
    const visibleGrants = await page.locator('[data-permission-row-form]').evaluateAll((forms) =>
      forms.map((form) => {
        const kind = (form.querySelector('select[name="resource_kind"]') as HTMLSelectElement | null)?.value ?? ''
        const action = (form.querySelector('select[name="permission_action"]') as HTMLSelectElement | null)?.value ?? ''
        return `${kind} ${action}`
      }),
    )
    expect(visibleGrants).toContain('run cancel')
    expect(visibleGrants).toContain('approval approve')

    const dbState = d1First<{
      permission_count: number
      run_cancel_count: number
      approval_approve_count: number
    }>(`
      SELECT
        (SELECT COUNT(*) FROM console_permissions WHERE role_id = ${fixture.roleId}) AS permission_count,
        (SELECT COUNT(*) FROM console_permissions WHERE role_id = ${fixture.roleId} AND resource_kind = 'run' AND action = 'cancel') AS run_cancel_count,
        (SELECT COUNT(*) FROM console_permissions WHERE role_id = ${fixture.roleId} AND resource_kind = 'approval' AND action = 'approve') AS approval_approve_count;
    `)
    expect(dbState?.permission_count).toBe(8)
    expect(dbState?.run_cancel_count).toBe(1)
    expect(dbState?.approval_approve_count).toBe(1)
  })
})
