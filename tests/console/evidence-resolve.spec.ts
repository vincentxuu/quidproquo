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

function sqlString(value: string): string {
  return `'${value.replaceAll("'", "''")}'`
}

function tableColumns(table: string): Set<string> {
  const [result] = execLocalD1Json<{ name: string }>(`PRAGMA table_info(${table});`)
  return new Set((result?.results ?? []).map((row) => row.name))
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

function cleanupEvidenceFixture(stamp: string) {
  execLocalD1(`
    DELETE FROM evidence_conflicts
    WHERE claim_a_id IN (SELECT claim_id FROM evidence_claims WHERE claim_hash LIKE 'e2e-${stamp}-%')
       OR claim_b_id IN (SELECT claim_id FROM evidence_claims WHERE claim_hash LIKE 'e2e-${stamp}-%');
    DELETE FROM evidence_citations
    WHERE claim_id IN (SELECT claim_id FROM evidence_claims WHERE claim_hash LIKE 'e2e-${stamp}-%')
       OR excerpt_id IN (
         SELECT excerpt_id
         FROM evidence_excerpts
         WHERE source_id IN (SELECT source_id FROM evidence_sources WHERE content_hash = 'e2e-source-${stamp}')
       );
    DELETE FROM evidence_claims WHERE claim_hash LIKE 'e2e-${stamp}-%';
    DELETE FROM evidence_excerpts
    WHERE source_id IN (SELECT source_id FROM evidence_sources WHERE content_hash = 'e2e-source-${stamp}');
    DELETE FROM evidence_sources WHERE content_hash = 'e2e-source-${stamp}';
    DELETE FROM flow_runs WHERE flow_run_id = 'e2e_evidence_run_${stamp}';
    DELETE FROM flow_versions WHERE flow_id = 'e2e_evidence_flow_${stamp}';
    DELETE FROM flow_definitions WHERE flow_id = 'e2e_evidence_flow_${stamp}';
  `)
}

function seedEvidenceFixture(stamp: string, conflictCount = 1): { flowRunId: string; conflictId: number; conflictIds: number[] } {
  const flowRunId = `e2e_evidence_run_${stamp}`
  const flowId = `e2e_evidence_flow_${stamp}`
  const now = Date.now()
  cleanupEvidenceFixture(stamp)

  const flowColumns = tableColumns('flow_definitions')
  if (flowColumns.has('display_name')) {
    execLocalD1(`
      INSERT INTO flow_definitions (flow_id, display_name, description, current_version, is_enabled, definition_yaml, created_at, updated_at)
      VALUES ('${flowId}', 'E2E evidence flow ${stamp}', 'Playwright evidence resolve fixture', 1, 1, 'id: e2e', ${now}, ${now});
    `)
  } else {
    execLocalD1(`
      INSERT INTO flow_definitions (flow_id, name, description, latest_version, deprecated, created_at, updated_at)
      VALUES ('${flowId}', 'E2E evidence flow ${stamp}', 'Playwright evidence resolve fixture', 1, 0, ${now}, ${now});
    `)
  }

  execLocalD1(`
    INSERT INTO flow_versions (flow_id, version, definition_yaml, compiled_json, published_by, published_at)
    VALUES ('${flowId}', 1, 'id: e2e', '{}', 'playwright', ${now});
  `)

  const flowRunColumns = tableColumns('flow_runs')
  if (flowRunColumns.has('input_json')) {
    execLocalD1(`
      INSERT INTO flow_runs (flow_run_id, flow_id, preset_id, status, input_json, started_at, created_at, updated_at)
      VALUES ('${flowRunId}', '${flowId}', NULL, 'done', '{}', ${now}, ${now}, ${now});
    `)
  } else {
    execLocalD1(`
      INSERT INTO flow_runs (flow_run_id, flow_id, flow_version, preset_id, status, trigger, inputs_json, started_at, created_at, updated_at)
      VALUES ('${flowRunId}', '${flowId}', 1, NULL, 'done', 'playwright', '{}', ${now}, ${now}, ${now});
    `)
  }

  execLocalD1(`
    INSERT INTO evidence_sources
      (url, content_hash, body_text, body_ref, freshness_score, retrieved_at, provider_call_id, flow_run_id, agent_run_id, status, created_at)
    VALUES
      ('https://example.com/evidence-${stamp}', 'e2e-source-${stamp}', ${sqlString(`The tested claim for ${stamp} is true. A contradictory claim is false.`)}, NULL, 0.8, ${now}, NULL, '${flowRunId}', NULL, 'active', ${now});
  `)
  const sourceId = execLocalD1Json<{ source_id: number }>(
    `SELECT source_id FROM evidence_sources WHERE content_hash = 'e2e-source-${stamp}' LIMIT 1;`,
  )[0]?.results[0]?.source_id
  if (!sourceId) throw new Error('failed to seed evidence source')

  execLocalD1(`
    INSERT INTO evidence_excerpts (source_id, offset, length, text, surrounding_context, created_at)
    VALUES (${sourceId}, 0, 32, ${sqlString(`The tested claim for ${stamp} is true.`)}, ${sqlString(`Context for ${stamp}`)}, ${now});
  `)
  const excerptId = execLocalD1Json<{ excerpt_id: number }>(
    `SELECT excerpt_id FROM evidence_excerpts WHERE source_id = ${sourceId} ORDER BY excerpt_id DESC LIMIT 1;`,
  )[0]?.results[0]?.excerpt_id
  if (!excerptId) throw new Error('failed to seed evidence excerpt')

  const conflictIds: number[] = []
  for (let index = 1; index <= conflictCount; index += 1) {
    const suffix = index === 1 ? '' : ` ${index}`
    const hashSuffix = index === 1 ? '' : `-${index}`
    execLocalD1(`
      INSERT INTO evidence_claims
        (claim_text, claim_hash, agent_id, confidence, flow_run_id, flow_step_run_id, agent_run_id, created_at)
      VALUES
        (${sqlString(`E2E accepted claim ${stamp}${suffix}`)}, 'e2e-${stamp}-a${hashSuffix}', 'playwright', 0.91, '${flowRunId}', NULL, NULL, ${now}),
        (${sqlString(`E2E conflicting claim ${stamp}${suffix}`)}, 'e2e-${stamp}-b${hashSuffix}', 'playwright', 0.42, '${flowRunId}', NULL, NULL, ${now});
    `)
    const claims = execLocalD1Json<{ claim_id: number; claim_hash: string }>(
      `SELECT claim_id, claim_hash FROM evidence_claims WHERE claim_hash IN ('e2e-${stamp}-a${hashSuffix}', 'e2e-${stamp}-b${hashSuffix}') ORDER BY claim_hash;`,
    )[0]?.results ?? []
    const claimAId = claims.find((claim) => claim.claim_hash === `e2e-${stamp}-a${hashSuffix}`)?.claim_id
    const claimBId = claims.find((claim) => claim.claim_hash === `e2e-${stamp}-b${hashSuffix}`)?.claim_id
    if (!claimAId || !claimBId) throw new Error('failed to seed evidence claims')

    execLocalD1(`
      INSERT INTO evidence_citations (claim_id, excerpt_id, relation, provenance_chain_json, created_at)
      VALUES
        (${claimAId}, ${excerptId}, 'supports', '[]', ${now}),
        (${claimBId}, ${excerptId}, 'refutes', '[]', ${now});

      INSERT INTO evidence_conflicts
        (claim_a_id, claim_b_id, confidence_delta, detected_by, status, approval_id, resolved_by, created_at, updated_at)
      VALUES
        (${claimAId}, ${claimBId}, 0.49, 'playwright', 'pending', NULL, NULL, ${now}, ${now});
    `)
    const conflictId = execLocalD1Json<{ conflict_id: number }>(
      `SELECT conflict_id FROM evidence_conflicts WHERE claim_a_id = ${claimAId} AND claim_b_id = ${claimBId} ORDER BY conflict_id DESC LIMIT 1;`,
    )[0]?.results[0]?.conflict_id
    if (!conflictId) throw new Error('failed to seed evidence conflict')
    conflictIds.push(conflictId)
  }

  return { flowRunId, conflictId: conflictIds[0], conflictIds }
}

async function login(page: import('@playwright/test').Page, next: string) {
  await page.goto(`${CONSOLE_BASE}/login?next=${encodeURIComponent(next)}`)
  await page.getByPlaceholder('密碼').fill(ADMIN_PASSWORD)
  await Promise.all([
    page.waitForURL(new RegExp(next.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 10_000 }),
    page.getByRole('button', { name: '登入' }).click(),
  ])
}

test.describe('Evidence conflict resolve operation UI', () => {
  test.beforeAll(() => {
    seedAdminRole()
  })

  test('surfaces pending conflicts on the evidence overview with a direct resolve CTA', async ({ page }) => {
    const stamp = Date.now().toString(36)
    const { flowRunId } = seedEvidenceFixture(stamp, 2)
    const next = `/admin/console/evidence?q=${encodeURIComponent(flowRunId)}`

    try {
      await login(page, next)

      const row = page.locator('tr').filter({ hasText: flowRunId })
      await expect(row).toBeVisible()
      await expect(row.locator('.evidence-stats')).toContainText('衝突 2')
      await expect(row.locator('.pending-conflict-pill')).toHaveText('待處理 2')
      await expect(row.locator('.row-operation-preview')).toContainText('可採用、排除或批次標記不處理')

      const cta = row.getByRole('link', { name: '處理 2 個衝突' })
      await expect(cta).toHaveAttribute('href', `/admin/console/runs/${flowRunId}/evidence#conflicts`)
      await cta.click()
      await expect(page).toHaveURL(new RegExp(`/admin/console/runs/${flowRunId}/evidence#conflicts$`))
      await expect(page.locator('#conflicts')).toBeVisible()
      await expect(page.locator('[data-conflict-card]')).toHaveCount(2)
    } finally {
      cleanupEvidenceFixture(stamp)
    }
  })

  test('resolves a pending conflict from the evidence rail', async ({ page }) => {
    const stamp = Date.now().toString(36)
    const { flowRunId, conflictId } = seedEvidenceFixture(stamp)
    const next = `/admin/console/runs/${flowRunId}/evidence`
    page.on('dialog', (dialog) => dialog.accept())

    try {
      await login(page, next)

      const conflictCard = page.locator('[data-conflict-card]').filter({ hasText: `E2E accepted claim ${stamp}` })
      await expect(conflictCard).toBeVisible()
      await expect(conflictCard.locator('.verdict-badge')).toHaveText('待處理')

      await conflictCard.getByRole('button', { name: '採用左側' }).click()

      await expect(page.locator('#conflict-action-status')).toContainText(`Conflict #${conflictId} 已更新為 approved`)
      await expect(page.locator('#conflict-action-status')).toHaveClass(/success/)
      await expect(conflictCard).toBeHidden()

      await page.getByRole('button', { name: '全部' }).click()
      await expect(conflictCard).toBeVisible()
      await expect(conflictCard.locator('.verdict-badge')).toHaveText('已採用')
      await expect(conflictCard.locator('.conflict-resolved-note')).toContainText('採用左側')
    } finally {
      cleanupEvidenceFixture(stamp)
    }
  })

  test('bulk-dismisses selected pending conflicts from the evidence rail', async ({ page }) => {
    const stamp = Date.now().toString(36)
    const { flowRunId, conflictIds } = seedEvidenceFixture(stamp, 2)
    const next = `/admin/console/runs/${flowRunId}/evidence`
    page.on('dialog', (dialog) => dialog.accept())

    try {
      await login(page, next)

      const firstCard = page.locator('[data-conflict-card]').filter({
        has: page.getByText(`E2E accepted claim ${stamp}`, { exact: true }),
      })
      const secondCard = page.locator('[data-conflict-card]').filter({
        has: page.getByText(`E2E accepted claim ${stamp} 2`, { exact: true }),
      })
      await expect(firstCard).toBeVisible()
      await expect(secondCard).toBeVisible()
      await expect(page.locator('[data-conflict-selection-count]')).toHaveText('已選 0')

      await firstCard.locator('[data-conflict-select]').check()
      await secondCard.locator('[data-conflict-select]').check()
      await expect(page.locator('[data-conflict-selection-count]')).toHaveText('已選 2')
      await expect(page.locator('[data-conflict-operation-preview]')).toContainText('已選 2 個衝突')

      await page.getByRole('button', { name: '標記所選不處理' }).click()

      await expect(page.locator('#conflict-action-status')).toContainText('所選批次處理完成：2 / 2 個衝突')
      await expect(page.locator('#conflict-action-status')).toHaveClass(/success/)
      await expect(firstCard).toBeHidden()
      await expect(secondCard).toBeHidden()
      await expect(page.locator('[data-conflict-selection-count]')).toHaveText('已選 0')

      await page.getByRole('button', { name: '全部' }).click()
      await expect(firstCard).toBeVisible()
      await expect(secondCard).toBeVisible()
      await expect(firstCard.locator('.verdict-badge')).toHaveText('已排除')
      await expect(secondCard.locator('.verdict-badge')).toHaveText('已排除')
      await expect(firstCard.locator('.conflict-resolved-note')).toContainText('標記不處理')
      await expect(secondCard.locator('.conflict-resolved-note')).toContainText('標記不處理')

      const rows = execLocalD1Json<{ conflict_id: number; status: string; resolved_by: string }>(
        `SELECT conflict_id, status, resolved_by FROM evidence_conflicts WHERE conflict_id IN (${conflictIds.join(', ')}) ORDER BY conflict_id;`,
      )[0]?.results ?? []
      expect(rows).toHaveLength(2)
      expect(rows.every((row) => row.status === 'rejected' && row.resolved_by === 'dismissed')).toBe(true)
    } finally {
      cleanupEvidenceFixture(stamp)
    }
  })
})
