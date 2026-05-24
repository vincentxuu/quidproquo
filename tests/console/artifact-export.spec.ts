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

function tableColumns(table: string): Set<string> {
  const [result] = execLocalD1Json<{ name: string }>(`PRAGMA table_info(${table});`)
  return new Set((result?.results ?? []).map((row) => row.name))
}

function sqlString(value: string): string {
  return `'${value.replaceAll("'", "''")}'`
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

function cleanupArtifactFixture(stamp: string) {
  const artifactColumns = tableColumns('artifact_definitions')
  const versionColumns = tableColumns('artifact_versions')
  const artifactIdColumn = artifactColumns.has('definition_id') ? 'definition_id' : 'artifact_id'
  const versionArtifactColumn = versionColumns.has('definition_id') ? 'definition_id' : 'artifact_id'
  const exportColumns = tableColumns('artifact_exports')
  const exportArtifactPredicate = exportColumns.has('artifact_id')
    ? ` OR artifact_id = 'e2e_artifact_${stamp}'`
    : ''

  execLocalD1(`
    DELETE FROM console_audit_log WHERE resource_id = 'e2e_version_${stamp}';
    DELETE FROM artifact_exports WHERE version_id = 'e2e_version_${stamp}'${exportArtifactPredicate};
    DELETE FROM artifact_versions WHERE version_id = 'e2e_version_${stamp}' OR ${versionArtifactColumn} = 'e2e_artifact_${stamp}';
    DELETE FROM artifact_definitions WHERE ${artifactIdColumn} = 'e2e_artifact_${stamp}';
    DELETE FROM flow_runs WHERE flow_run_id = 'e2e_run_${stamp}';
    DELETE FROM flow_versions WHERE flow_id = 'e2e_flow_${stamp}';
    DELETE FROM flow_definitions WHERE flow_id = 'e2e_flow_${stamp}';
  `)
}

function seedArtifactFixture(stamp: string) {
  const now = Date.now()
  const flowColumns = tableColumns('flow_definitions')
  const artifactColumns = tableColumns('artifact_definitions')
  const versionColumns = tableColumns('artifact_versions')

  if (flowColumns.has('display_name')) {
    execLocalD1(`
      INSERT INTO flow_definitions (flow_id, display_name, description, current_version, is_enabled, definition_yaml, created_at, updated_at)
      VALUES ('e2e_flow_${stamp}', 'E2E artifact flow ${stamp}', 'Playwright artifact export fixture', 1, 1, 'id: e2e', ${now}, ${now});
    `)
  } else {
    execLocalD1(`
      INSERT INTO flow_definitions (flow_id, name, description, latest_version, deprecated, created_at, updated_at)
      VALUES ('e2e_flow_${stamp}', 'E2E artifact flow ${stamp}', 'Playwright artifact export fixture', 1, 0, ${now}, ${now});
    `)
  }

  execLocalD1(`
    INSERT INTO flow_versions (flow_id, version, definition_yaml, compiled_json, published_by, published_at)
    VALUES ('e2e_flow_${stamp}', 1, 'id: e2e', '{}', 'playwright', ${now});
  `)

  const flowRunColumns = tableColumns('flow_runs')
  if (flowRunColumns.has('input_json')) {
    execLocalD1(`
      INSERT INTO flow_runs (flow_run_id, flow_id, preset_id, status, input_json, started_at, created_at, updated_at)
      VALUES ('e2e_run_${stamp}', 'e2e_flow_${stamp}', NULL, 'done', '{}', ${now}, ${now}, ${now});
    `)
  } else {
    execLocalD1(`
      INSERT INTO flow_runs (flow_run_id, flow_id, flow_version, preset_id, status, trigger, inputs_json, started_at, created_at, updated_at)
      VALUES ('e2e_run_${stamp}', 'e2e_flow_${stamp}', 1, NULL, 'done', 'playwright', '{}', ${now}, ${now}, ${now});
    `)
  }

  if (artifactColumns.has('definition_id')) {
    execLocalD1(`
      INSERT INTO artifact_definitions (definition_id, flow_id, kind, owner_scope, label, logical_name, inputs_hash, flow_run_id, created_at, updated_at)
      VALUES ('e2e_artifact_${stamp}', 'e2e_flow_${stamp}', 'markdown_report', 'flow_run', 'E2E artifact ${stamp}', 'e2e-export-${stamp}', 'hash-${stamp}', 'e2e_run_${stamp}', ${now}, ${now});
    `)
  } else {
    execLocalD1(`
      INSERT INTO artifact_definitions (artifact_id, flow_id, kind, logical_name, inputs_hash, latest_version_id, created_at, updated_at)
      VALUES ('e2e_artifact_${stamp}', 'e2e_flow_${stamp}', 'markdown_report', 'e2e-export-${stamp}', 'hash-${stamp}', 'e2e_version_${stamp}', ${now}, ${now});
    `)
  }

  if (versionColumns.has('definition_id')) {
    execLocalD1(`
      INSERT INTO artifact_versions (version_id, definition_id, version_number, status, payload_json, body_text, flow_run_id, created_at)
      VALUES ('e2e_version_${stamp}', 'e2e_artifact_${stamp}', 1, 'approved', '{}', ${sqlString(`# E2E artifact ${stamp}`)}, 'e2e_run_${stamp}', ${now});
    `)
  } else {
    execLocalD1(`
      INSERT INTO artifact_versions (version_id, artifact_id, flow_run_id, org_id, version_number, kind, body_inline, body_byte_size, body_content_hash, approval_status, created_at)
      VALUES ('e2e_version_${stamp}', 'e2e_artifact_${stamp}', 'e2e_run_${stamp}', 'default', 1, 'markdown_report', ${sqlString(`# E2E artifact ${stamp}`)}, 16, 'body-hash-${stamp}', 'approved', ${now});
    `)
  }
}

function seedFailedArtifactExport(stamp: string) {
  const now = Date.now()
  const exportColumns = tableColumns('artifact_exports')

  if (exportColumns.has('destination')) {
    execLocalD1(`
      INSERT INTO artifact_exports
        (export_id, version_id, destination, status, export_metadata_json, created_at, updated_at)
      VALUES
        ('e2e_failed_export_${stamp}', 'e2e_version_${stamp}', 'file', 'failed', ${sqlString(JSON.stringify({ error: 'fixture export failure' }))}, ${now}, ${now});
    `)
  } else {
    execLocalD1(`
      INSERT INTO artifact_exports
        (export_id, version_id, artifact_id, org_id, exporter_id, target_config_json, status, attempt_count, last_error_json, requested_at, completed_at)
      VALUES
        ('e2e_failed_export_${stamp}', 'e2e_version_${stamp}', 'e2e_artifact_${stamp}', 'default', 'file', '{}', 'failed', 1, ${sqlString(JSON.stringify({ error: 'fixture export failure' }))}, ${now}, ${now});
    `)
  }
}

async function login(page: import('@playwright/test').Page, next: string) {
  await page.goto(`${CONSOLE_BASE}/login?next=${encodeURIComponent(next)}`)
  await page.getByPlaceholder('密碼').fill(ADMIN_PASSWORD)
  await Promise.all([
    page.waitForURL(new RegExp(next.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 10_000 }),
    page.getByRole('button', { name: '登入' }).click(),
  ])
}

test.describe('Artifact quick export operation UI', () => {
  test.beforeAll(() => {
    seedAdminRole()
  })

  test('exports the latest artifact version from the artifact list', async ({ page }) => {
    const stamp = Date.now().toString(36)
    const next = `/admin/console/artifacts?q=e2e-export-${stamp}`
    let exportRequested = false

    cleanupArtifactFixture(stamp)
    seedArtifactFixture(stamp)
    page.on('dialog', (dialog) => dialog.accept())
    await page.route('**/api/admin/artifacts/e2e_version_*/export/*', async (route) => {
      exportRequested = true
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          exportId: `e2e_export_${stamp}`,
          externalRef: `file://e2e-export-${stamp}.txt`,
          status: 'done',
        }),
      })
    })

    try {
      await login(page, next)

      const row = page.locator('tr').filter({ hasText: `e2e-export-${stamp}` })
      await expect(row).toBeVisible()
      await expect(row.locator('[data-export-preview]')).toContainText('快速匯出最新版本')

      await row.locator('[data-export-destination]').selectOption('file')
      await expect(row.locator('[data-export-preview]')).toContainText('File')

      await row.getByRole('button', { name: `匯出 e2e-export-${stamp}` }).click()

      await expect(page.locator('#artifact-list-action-status')).toContainText(`file://e2e-export-${stamp}.txt`)
      await expect(page.locator('#artifact-list-action-status')).toHaveClass(/success/)
      await expect(row.locator('[data-export-preview]')).toContainText('最近匯出：File · done')
      expect(exportRequested).toBe(true)
    } finally {
      cleanupArtifactFixture(stamp)
    }
  })

  test('surfaces quick export setup failures without rewriting the row preview', async ({ page }) => {
    const stamp = Date.now().toString(36)
    const next = `/admin/console/artifacts?q=e2e-export-${stamp}`
    let exportRequested = false

    cleanupArtifactFixture(stamp)
    seedArtifactFixture(stamp)
    page.on('dialog', (dialog) => dialog.accept())
    await page.route('**/api/admin/artifacts/e2e_version_*/export/*', async (route) => {
      exportRequested = true
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: false,
          error: 'export_requires_kernel',
        }),
      })
    })

    try {
      await login(page, next)

      const row = page.locator('tr').filter({ hasText: `e2e-export-${stamp}` })
      await expect(row).toBeVisible()

      await row.locator('[data-export-destination]').selectOption('file')
      await expect(row.locator('[data-export-preview]')).toContainText('將最新版本匯出到 File')

      const exportButton = row.getByRole('button', { name: `匯出 e2e-export-${stamp}` })
      await exportButton.click()

      await expect(page.locator('#artifact-list-action-status')).toHaveClass(/error/)
      await expect(page.locator('#artifact-list-action-status')).toContainText('File 匯出需要 kernel 或外部服務設定')
      await expect(row.locator('[data-export-preview]')).toContainText('將最新版本匯出到 File')
      await expect(exportButton).toBeEnabled()
      expect(exportRequested).toBe(true)
    } finally {
      cleanupArtifactFixture(stamp)
    }
  })

  test('updates artifact approval status from the artifact detail page', async ({ page }) => {
    const stamp = Date.now().toString(36)
    const next = `/admin/console/runs/e2e_run_${stamp}/artifacts/e2e_artifact_${stamp}`
    const versionColumns = tableColumns('artifact_versions')
    const statusColumn = versionColumns.has('status') ? 'status' : 'approval_status'

    cleanupArtifactFixture(stamp)
    seedArtifactFixture(stamp)
    page.on('dialog', (dialog) => dialog.accept())

    try {
      await login(page, next)

      await expect(page.locator('#artifact-status')).toHaveText('approved')
      await expect(page.locator('#artifact-operation-preview')).toContainText('匯出目的地')

      await page.getByRole('button', { name: `拒絕產出物 e2e_artifact_${stamp}` }).click()
      await expect(page.locator('#artifact-action-status')).toContainText('產出物已更新為 rejected')
      await expect(page.locator('#artifact-action-status')).toHaveClass(/success/)
      await expect(page.locator('#artifact-status')).toHaveText('rejected')
      await expect(page.locator('#artifact-audit-history')).toContainText('artifact.version.status.update')
      await expect(page.locator('#artifact-audit-history')).toContainText('version → rejected')

      const rejectedState = d1First<{ approval_status: string }>(
        `SELECT ${statusColumn} AS approval_status FROM artifact_versions WHERE version_id = 'e2e_version_${stamp}' LIMIT 1;`,
      )
      expect(rejectedState?.approval_status).toBe('rejected')

      await page.getByRole('button', { name: `核准產出物 e2e_artifact_${stamp}` }).click()
      await expect(page.locator('#artifact-action-status')).toContainText('產出物已更新為 approved')
      await expect(page.locator('#artifact-status')).toHaveText('approved')
      await expect(page.locator('#artifact-audit-history')).toContainText('version → approved')

      const approvedState = d1First<{ approval_status: string }>(
        `SELECT ${statusColumn} AS approval_status FROM artifact_versions WHERE version_id = 'e2e_version_${stamp}' LIMIT 1;`,
      )
      expect(approvedState?.approval_status).toBe('approved')
    } finally {
      cleanupArtifactFixture(stamp)
    }
  })

  test('retries a failed export directly from artifact detail history', async ({ page }) => {
    const stamp = Date.now().toString(36)
    const next = `/admin/console/runs/e2e_run_${stamp}/artifacts/e2e_artifact_${stamp}`
    let exportRequested = false

    cleanupArtifactFixture(stamp)
    seedArtifactFixture(stamp)
    seedFailedArtifactExport(stamp)
    page.on('dialog', (dialog) => dialog.accept())
    await page.route('**/api/admin/artifacts/e2e_version_*/export/file', async (route) => {
      exportRequested = true
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          exportId: `e2e_retry_export_${stamp}`,
          externalRef: `file://retry-${stamp}.txt`,
          status: 'done',
        }),
      })
    })

    try {
      await login(page, next)

      const failedRow = page.locator('[data-export-history-row]').filter({ hasText: 'e2e_failed_export_' })
      await expect(failedRow).toBeVisible()
      await expect(failedRow.locator('.export-failed')).toHaveText('失敗')
      await expect(failedRow.locator('.mini-action.retry-export')).toHaveText('重試')

      await failedRow.getByRole('button', { name: '重試' }).click()

      await expect(page.locator('#artifact-action-status')).toContainText(`重試匯出已送出：file://retry-${stamp}.txt`)
      await expect(page.locator('#artifact-action-status')).toHaveClass(/success/)
      await expect(page.locator('#artifact-export-history')).toContainText(`e2e_retry_export_${stamp}`)
      await expect(page.locator('#artifact-export-history')).toContainText(`file://retry-${stamp}.txt`)
      await expect(page.locator('#artifact-audit-history')).toContainText('artifact.export')
      expect(exportRequested).toBe(true)
    } finally {
      cleanupArtifactFixture(stamp)
    }
  })
})
