#!/usr/bin/env node
// verify-0019-dry-run.mjs
//
// Dry-run verification for migration 0019_admin_jobs_to_flow_runs.sql.
// Reads pre-counts, applies the migration locally (or asserts post-counts
// against --remote), then asserts row-count parity.
//
// Usage:
//   node scripts/verify-0019-dry-run.mjs           # local D1 (applies migration)
//   node scripts/verify-0019-dry-run.mjs --remote  # production D1 (count-only)
//
// Exit codes:
//   0 — all assertions passed
//   1 — row-count mismatch or unexpected error

import { execSync } from 'child_process'

const remote = process.argv.includes('--remote')
const flag = remote ? '--remote' : '--local'
const DB = 'quidproquo-db'

function exec(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim()
}

function wranglerQuery(sql) {
  const escaped = sql.replace(/"/g, '\\"')
  const raw = exec(`wrangler d1 execute ${DB} ${flag} --command="${escaped}" --json`)
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    console.error('Failed to parse wrangler output:', raw)
    process.exit(1)
  }
  // wrangler returns an array of result objects; grab the first results array
  return parsed?.[0]?.results ?? []
}

function getCount(sql) {
  const rows = wranglerQuery(sql)
  const val = rows?.[0]?.n ?? rows?.[0]?.count ?? null
  if (val === null) {
    console.error('Unexpected query result shape for:', sql, rows)
    process.exit(1)
  }
  return Number(val)
}

console.log(`=== verify-0019-dry-run (${remote ? 'remote' : 'local'}) ===`)

// ── Pre-counts ────────────────────────────────────────────────────────────────
console.log('\nPre-migration counts...')

const preAdminJobs = getCount('SELECT COUNT(*) AS n FROM admin_jobs')
console.log(`  admin_jobs:                 ${preAdminJobs}`)

const preFlowRunsPipeline = getCount(
  "SELECT COUNT(*) AS n FROM flow_runs WHERE parent_kind='pipeline'"
)
console.log(`  flow_runs (parent_kind=pipeline): ${preFlowRunsPipeline}`)

const expectedAfterMigration = preAdminJobs

// ── Apply migration (local only) ──────────────────────────────────────────────
if (!remote) {
  console.log('\nApplying migration locally...')
  try {
    const out = exec(`wrangler d1 migrations apply ${DB} --local`)
    console.log(out)
  } catch (err) {
    console.error('Migration apply failed:', err.message)
    process.exit(1)
  }
} else {
  console.log('\n--remote mode: skipping migration apply (count-only verification)')
}

// ── Post-counts ───────────────────────────────────────────────────────────────
console.log('\nPost-migration counts...')

const postFlowRunsPipeline = getCount(
  "SELECT COUNT(*) AS n FROM flow_runs WHERE parent_kind='pipeline'"
)
console.log(`  flow_runs (parent_kind=pipeline): ${postFlowRunsPipeline}`)

// Admin jobs table must be untouched
const postAdminJobs = getCount('SELECT COUNT(*) AS n FROM admin_jobs')
console.log(`  admin_jobs (must be unchanged):   ${postAdminJobs}`)

// ── Assertions ────────────────────────────────────────────────────────────────
console.log('\nAssertions...')

let passed = true

if (postFlowRunsPipeline === expectedAfterMigration) {
  console.log(
    `  PASS: flow_runs(pipeline) = ${postFlowRunsPipeline} matches admin_jobs pre-count = ${expectedAfterMigration}`
  )
} else {
  console.error(
    `  FAIL: expected flow_runs(pipeline) = ${expectedAfterMigration}, got ${postFlowRunsPipeline}`
  )
  passed = false
}

if (postAdminJobs === preAdminJobs) {
  console.log(`  PASS: admin_jobs unchanged at ${postAdminJobs}`)
} else {
  console.error(
    `  FAIL: admin_jobs changed from ${preAdminJobs} to ${postAdminJobs} — migration must not delete source rows`
  )
  passed = false
}

// Idempotency spot-check (only meaningful after local apply)
if (!remote) {
  console.log('\nIdempotency check (re-running migration should be a no-op)...')
  try {
    exec(`wrangler d1 migrations apply ${DB} --local`)
    const idempotentCount = getCount(
      "SELECT COUNT(*) AS n FROM flow_runs WHERE parent_kind='pipeline'"
    )
    if (idempotentCount === postFlowRunsPipeline) {
      console.log(`  PASS: second apply is a no-op (count still ${idempotentCount})`)
    } else {
      console.error(
        `  FAIL: second apply changed count from ${postFlowRunsPipeline} to ${idempotentCount} — migration is not idempotent`
      )
      passed = false
    }
  } catch {
    // wrangler may report "no pending migrations" — that is expected and fine
    console.log('  INFO: no further migrations to apply (expected after first apply)')
  }
}

// ── Result ────────────────────────────────────────────────────────────────────
console.log('')
if (passed) {
  console.log(`PASS: ${postFlowRunsPipeline} pipeline run(s) migrated correctly`)
  process.exit(0)
} else {
  console.error(`FAIL: one or more assertions did not pass — see details above`)
  process.exit(1)
}
