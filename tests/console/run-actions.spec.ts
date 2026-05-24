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

function tableColumns(table: string): Set<string> {
  const [result] = execLocalD1Json<{ name: string }>(`PRAGMA table_info(${table});`)
  return new Set((result?.results ?? []).map((row) => row.name))
}

function sqlString(value: string): string {
  return `'${value.replaceAll("'", "''")}'`
}

function bindSql(template: string, values: string[]): string {
  let index = 0
  return template.replace(/\?/g, () => values[index++] ?? 'NULL')
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

function cleanupRunFixture(stamp: string) {
  const flowId = `e2e_run_actions_flow_${stamp}`
  execLocalD1(`
    DELETE FROM console_audit_log
    WHERE resource_id IN ('e2e_cancel_run_${stamp}', 'e2e_retry_run_${stamp}', 'e2e_list_cancel_run_${stamp}')
       OR resource_id IN (SELECT flow_run_id FROM flow_runs WHERE flow_id = '${flowId}');
    DELETE FROM flow_step_runs
    WHERE flow_run_id IN ('e2e_cancel_run_${stamp}', 'e2e_retry_run_${stamp}', 'e2e_list_cancel_run_${stamp}')
       OR flow_run_id IN (SELECT flow_run_id FROM flow_runs WHERE flow_id = '${flowId}');
    DELETE FROM flow_runs
    WHERE flow_run_id IN ('e2e_cancel_run_${stamp}', 'e2e_retry_run_${stamp}', 'e2e_list_cancel_run_${stamp}')
       OR flow_id = '${flowId}';
    DELETE FROM flow_versions WHERE flow_id = '${flowId}';
    DELETE FROM flow_definitions WHERE flow_id = '${flowId}';
  `)
}

function insertFlow(stamp: string) {
  const now = Date.now()
  const flowColumns = tableColumns('flow_definitions')
  const flowId = `e2e_run_actions_flow_${stamp}`

  if (flowColumns.has('display_name')) {
    execLocalD1(`
      INSERT INTO flow_definitions (flow_id, display_name, description, current_version, is_enabled, definition_yaml, created_at, updated_at)
      VALUES ('${flowId}', 'E2E run actions ${stamp}', 'Playwright run action fixture', 1, 1, 'id: e2e', ${now}, ${now});
    `)
  } else {
    execLocalD1(`
      INSERT INTO flow_definitions (flow_id, name, description, latest_version, deprecated, created_at, updated_at)
      VALUES ('${flowId}', 'E2E run actions ${stamp}', 'Playwright run action fixture', 1, 0, ${now}, ${now});
    `)
  }

  execLocalD1(`
    INSERT INTO flow_versions (flow_id, version, definition_yaml, compiled_json, published_by, published_at)
    VALUES ('${flowId}', 1, 'id: e2e', '{}', 'playwright', ${now});
  `)
}

function insertFlowRun(runId: string, flowId: string, status: string) {
  const now = Date.now()
  const flowRunColumns = tableColumns('flow_runs')
  if (flowRunColumns.has('input_json')) {
    execLocalD1(`
      INSERT INTO flow_runs (flow_run_id, flow_id, preset_id, status, input_json, started_at, created_at, updated_at)
      VALUES ('${runId}', '${flowId}', NULL, '${status}', '{}', ${now}, ${now}, ${now});
    `)
  } else {
    execLocalD1(`
      INSERT INTO flow_runs (flow_run_id, flow_id, flow_version, preset_id, status, trigger, inputs_json, started_at, created_at, updated_at)
      VALUES ('${runId}', '${flowId}', 1, NULL, '${status}', 'playwright', '{}', ${now}, ${now}, ${now});
    `)
  }
}

function insertStepRun(input: {
  stepRunId: string
  runId: string
  stepId: string
  order: number
  status: string
  attempt?: number
  error?: string
}) {
  const now = Date.now()
  const columns = tableColumns('flow_step_runs')
  const insertColumns = ['step_run_id', 'flow_run_id', 'step_id', 'step_order', 'status', 'started_at', 'created_at']
  const values: string[] = [
    sqlString(input.stepRunId),
    sqlString(input.runId),
    sqlString(input.stepId),
    String(input.order),
    sqlString(input.status),
    String(now),
    String(now),
  ]

  if (columns.has('parent_step_run_id')) {
    insertColumns.push('parent_step_run_id')
    values.push('NULL')
  }
  if (columns.has('step_type')) {
    insertColumns.push('step_type')
    values.push(sqlString('agent'))
  } else if (columns.has('kind')) {
    insertColumns.push('kind')
    values.push(sqlString('agent'))
  }
  if (columns.has('iteration')) {
    insertColumns.push('iteration')
    values.push('0')
  }
  if (columns.has('attempt')) {
    insertColumns.push('attempt')
    values.push(String(input.attempt ?? 1))
  }
  if (columns.has('error_json') && input.error) {
    insertColumns.push('error_json')
    values.push(sqlString(JSON.stringify({ message: input.error })))
  }
  if (columns.has('outputs_json')) {
    insertColumns.push('outputs_json')
    values.push(sqlString('{}'))
  }
  if (columns.has('inputs_json')) {
    insertColumns.push('inputs_json')
    values.push(sqlString('{}'))
  }
  if (columns.has('updated_at')) {
    insertColumns.push('updated_at')
    values.push(String(now))
  }

  execLocalD1(`
    INSERT INTO flow_step_runs (${insertColumns.join(', ')})
    VALUES (${values.join(', ')});
  `)
}

function seedRunActionsFixture(stamp: string) {
  cleanupRunFixture(stamp)
  const flowId = `e2e_run_actions_flow_${stamp}`
  const cancelRunId = `e2e_cancel_run_${stamp}`
  const retryRunId = `e2e_retry_run_${stamp}`
  const failedStepRunId = `e2e_failed_step_${stamp}`
  insertFlow(stamp)
  insertFlowRun(cancelRunId, flowId, 'running')
  insertStepRun({
    stepRunId: `e2e_cancel_step_${stamp}`,
    runId: cancelRunId,
    stepId: 'long-running',
    order: 1,
    status: 'running',
  })
  insertFlowRun(retryRunId, flowId, 'running')
  insertStepRun({
    stepRunId: failedStepRunId,
    runId: retryRunId,
    stepId: 'search',
    order: 1,
    status: 'failed',
    attempt: 1,
    error: 'fixture failure',
  })

  return { cancelRunId, retryRunId, failedStepRunId }
}

function seedRunsListCancelFixture(stamp: string) {
  cleanupRunFixture(stamp)
  const flowId = `e2e_run_actions_flow_${stamp}`
  const listCancelRunId = `e2e_list_cancel_run_${stamp}`
  insertFlow(stamp)
  insertFlowRun(listCancelRunId, flowId, 'running')
  insertStepRun({
    stepRunId: `e2e_list_cancel_step_${stamp}`,
    runId: listCancelRunId,
    stepId: 'list-running',
    order: 1,
    status: 'running',
  })

  return { flowId, listCancelRunId }
}

function d1First<T = Record<string, unknown>>(command: string): T | undefined {
  return execLocalD1Json<T>(command)[0]?.results[0]
}

function setRunStatus(runId: string, status: string) {
  const now = Date.now()
  const flowRunColumns = tableColumns('flow_runs')
  const assignments = ['status = ?', 'updated_at = ?']
  const values: string[] = [sqlString(status), String(now)]
  if (status === 'done' || status === 'failed' || status === 'cancelled') {
    if (flowRunColumns.has('finished_at')) {
      assignments.push('finished_at = ?')
      values.push(String(now))
    }
    if (flowRunColumns.has('latency_ms')) {
      assignments.push('latency_ms = ?')
      values.push('750')
    }
  }

  execLocalD1(`
    ${bindSql(
      `UPDATE flow_runs
       SET ${assignments.join(', ')}
       WHERE flow_run_id = ?;`,
      [...values, sqlString(runId)],
    )}
  `)
}

function completeStepRun(stepRunId: string) {
  const now = Date.now()
  const columns = tableColumns('flow_step_runs')
  const assignments = ['status = ?', 'finished_at = ?', 'latency_ms = ?']
  const values: string[] = [sqlString('done'), String(now), '750']
  if (columns.has('outputs_json')) {
    assignments.push('outputs_json = ?')
    values.push(sqlString(JSON.stringify({ ok: true })))
  }
  if (columns.has('updated_at')) {
    assignments.push('updated_at = ?')
    values.push(String(now))
  }

  execLocalD1(`
    ${bindSql(
      `UPDATE flow_step_runs
       SET ${assignments.join(', ')}
       WHERE step_run_id = ?;`,
      [...values, sqlString(stepRunId)],
    )}
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

test.describe('Run cancel and retry operation UI', () => {
  test.beforeAll(() => {
    seedAdminRole()
  })

  test('cancels a running run and retries a failed step from the timeline', async ({ page }) => {
    const stamp = Date.now().toString(36)
    const { cancelRunId, retryRunId, failedStepRunId } = seedRunActionsFixture(stamp)
    page.on('dialog', (dialog) => dialog.accept())

    try {
      await login(page, `/admin/console/runs/${cancelRunId}`)

      await expect(page.locator('#run-status')).toHaveText('running')
      await page.getByRole('button', { name: `取消執行 ${cancelRunId}` }).click()
      await expect(page.locator('#run-action-status')).toContainText('執行已取消')
      await expect(page.locator('#run-action-status')).toHaveClass(/success/)
      await expect(page.locator('#run-status')).toHaveText('cancelled')
      await expect(page.locator('#cancel-run-btn')).toBeHidden()

      const cancelled = d1First<{ status: string }>(
        `SELECT status FROM flow_runs WHERE flow_run_id = '${cancelRunId}' LIMIT 1;`,
      )
      expect(cancelled?.status).toBe('cancelled')

      await page.goto(`${CONSOLE_BASE}/admin/console/runs/${retryRunId}`)
      const failedRow = page.locator(`[data-step-run-id="${failedStepRunId}"]`)
      await expect(failedRow.locator('.badge')).toHaveText('failed')
      await failedRow.getByRole('button', { name: /重試步驟 search/ }).click()

      await expect(page.locator('#run-action-status')).toContainText('重試已送出：第 2 次嘗試')
      await expect(page.locator('#run-action-status')).toHaveClass(/success/)
      await expect(
        page.locator(`[data-step-run-id="${failedStepRunId}"]`).getByRole('button', { name: /重試步驟 search/ }),
      ).toHaveCount(0)
      await expect(page.locator('[data-step-attempt="2"]').filter({ hasText: 'pending' })).toBeVisible()

      const retryResult = d1First<{ retry_count: number; max_attempt: number }>(`
        SELECT COUNT(*) AS retry_count, MAX(attempt) AS max_attempt
        FROM flow_step_runs
        WHERE flow_run_id = '${retryRunId}' AND step_id = 'search';
      `)
      expect(retryResult?.retry_count).toBe(2)
      expect(retryResult?.max_attempt).toBe(2)
    } finally {
      cleanupRunFixture(stamp)
    }
  })

  test('cancels a running run directly from the runs list row operation', async ({ page }) => {
    const stamp = Date.now().toString(36)
    const { flowId, listCancelRunId } = seedRunsListCancelFixture(stamp)
    page.on('dialog', (dialog) => dialog.accept())

    try {
      await login(page, `/admin/console/runs?flow=${encodeURIComponent(flowId)}&status=running`)

      const row = page.locator(`tr[data-run-id="${listCancelRunId}"]`)
      await expect(row).toBeVisible()
      await expect(row.locator('[data-run-status]')).toHaveText('running')
      await expect(row.locator('[data-cancel-operation-preview]')).toContainText('已完成的步驟與稽核紀錄會保留')

      await row.getByRole('button', { name: `取消執行 ${listCancelRunId}` }).click()

      await expect(page.locator('#runs-list-action-status')).toContainText(`已取消 ${listCancelRunId.slice(0, 8)}。`)
      await expect(page.locator('#runs-list-action-status')).toHaveClass(/success/)
      await expect(row.locator('[data-run-status]')).toHaveText('cancelled')
      await expect(row.getByRole('button', { name: `取消執行 ${listCancelRunId}` })).toHaveCount(0)
      await expect(row.locator('[data-cancel-operation-preview]')).toContainText('已送出取消')

      const cancelled = d1First<{ status: string }>(
        `SELECT status FROM flow_runs WHERE flow_run_id = '${listCancelRunId}' LIMIT 1;`,
      )
      expect(cancelled?.status).toBe('cancelled')
    } finally {
      cleanupRunFixture(stamp)
    }
  })

  test('streams a launched run step from running to done on the timeline', async ({ page }) => {
    const stamp = Date.now().toString(36)
    const flowId = `e2e_run_actions_flow_${stamp}`
    const stepRunId = `e2e_live_step_${stamp}`

    cleanupRunFixture(stamp)
    insertFlow(stamp)

    try {
      await login(page, '/admin/console')

      const launch = await page.evaluate(async ({ flowId, stamp }) => {
        const res = await fetch(`/api/admin/flows/${encodeURIComponent(flowId)}/run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ input: { fixture: stamp } }),
        })
        const body = await res.json().catch(() => ({}))
        return { status: res.status, body }
      }, { flowId, stamp })
      expect(launch.status).toBe(201)
      const launchBody = launch.body as { flowRunId?: string }
      expect(launchBody.flowRunId).toBeTruthy()
      const flowRunId = launchBody.flowRunId as string

      setRunStatus(flowRunId, 'running')
      insertStepRun({
        stepRunId,
        runId: flowRunId,
        stepId: 'live-step',
        order: 1,
        status: 'running',
      })

      await page.goto(`${CONSOLE_BASE}/admin/console/runs/${flowRunId}`)
      const row = page.locator(`[data-step-run-id="${stepRunId}"]`)
      await expect(page.locator('#run-status')).toHaveText('running')
      await expect(row.locator('.badge')).toHaveText('running')

      completeStepRun(stepRunId)
      setRunStatus(flowRunId, 'done')

      await expect(page.locator('#run-status')).toHaveText('done', { timeout: 5_000 })
      await expect(page.locator(`[data-step-run-id="${stepRunId}"]`).locator('.badge')).toHaveText('done')
      await expect(page.locator('#run-action-status')).toContainText('執行完成：done')
    } finally {
      cleanupRunFixture(stamp)
    }
  })
})
