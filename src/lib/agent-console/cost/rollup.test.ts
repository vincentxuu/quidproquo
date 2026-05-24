import { describe, expect, it, vi } from 'vitest'
import { runConsoleRollupDaily } from './rollup'
import type { Env } from '../../config/env'

interface RollupRow {
  dimension_value: string
  tokens_in: number
  tokens_out: number
  cost_usd: number
  run_count: number
}

function makeResultRows(sql: string): RollupRow[] {
  if (sql.includes('fr.flow_id AS dimension_value')) {
    return [
      { dimension_value: 'research', tokens_in: 100, tokens_out: 50, cost_usd: 0.25, run_count: 2 },
      { dimension_value: 'summarize', tokens_in: 20, tokens_out: 10, cost_usd: 0.05, run_count: 1 },
    ]
  }

  if (sql.includes('ar.agent_id AS dimension_value')) {
    return [
      { dimension_value: 'agent-a', tokens_in: 120, tokens_out: 60, cost_usd: 0.3, run_count: 3 },
    ]
  }

  if (sql.includes('COALESCE(fr.preset_id')) {
    return [
      { dimension_value: 'deep', tokens_in: 120, tokens_out: 60, cost_usd: 0.3, run_count: 3 },
    ]
  }

  if (sql.includes('COALESCE(pd.policy_key')) {
    return [
      { dimension_value: 'policy-a', tokens_in: 120, tokens_out: 60, cost_usd: 0.3, run_count: 3 },
    ]
  }

  if (sql.includes('COALESCE(CAST(al.user_id')) {
    return [
      { dimension_value: 'admin', tokens_in: 120, tokens_out: 60, cost_usd: 0.3, run_count: 3 },
    ]
  }

  if (sql.includes('COALESCE(tc.syscall_name')) {
    return [
      { dimension_value: 'model.invoke', tokens_in: 120, tokens_out: 60, cost_usd: 0.3, run_count: 3 },
    ]
  }

  return []
}

function makeDb() {
  const batch = vi.fn(async () => ({ success: true }))
  const prepare = vi.fn((sql: string) => ({
    first: vi.fn(async () => {
      if (sql.includes('cost_rollup_meta')) return { last_built_day: 10 }
      return null
    }),
    bind: (..._args: unknown[]) => ({
      first: vi.fn(async () => {
        if (sql.includes('cost_rollup_meta')) return { last_built_day: 10 }
        return null
      }),
      all: vi.fn(async () => ({ results: makeResultRows(sql) })),
      run: vi.fn(async () => ({ success: true })),
    }),
  }))

  return {
    batch,
    prepare,
  } as unknown as D1Database & {
    batch: ReturnType<typeof vi.fn>
    prepare: ReturnType<typeof vi.fn>
  }
}

describe('runConsoleRollupDaily', () => {
  it('returns a backfill summary without double-counting totals across dimensions', async () => {
    const db = makeDb()
    const env = { DB: db } as unknown as Env

    const summary = await runConsoleRollupDaily(env, 20, 20)

    expect(summary).toEqual({
      fromDay: 20,
      toDay: 20,
      daysProcessed: 1,
      rowsWritten: 7,
      tokensIn: 120,
      tokensOut: 60,
      costUsd: 0.3,
      runCount: 3,
    })
    expect(db.batch).toHaveBeenCalledTimes(6)
  })

  it('returns an empty summary when the requested range is empty', async () => {
    const db = makeDb()
    const env = { DB: db } as unknown as Env

    const summary = await runConsoleRollupDaily(env, 21, 20)

    expect(summary).toMatchObject({
      fromDay: 21,
      toDay: 20,
      daysProcessed: 0,
      rowsWritten: 0,
      costUsd: 0,
    })
    expect(db.batch).not.toHaveBeenCalled()
  })
})
