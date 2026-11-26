import type { Env } from '../config/env'
import { startRoutineRun, type WaitUntil } from './routine-run'
import { nextRoutineRunAt } from './cron-schedule'

interface RoutineRow {
  id: string
  name: string
  instructions: string
  trigger_type: string
  cron: string | null
  repo: string | null
  enabled: number
  model: string | null
  stagger_seconds: number
  next_run_at: number | null
  notification_enabled: number
  notification_channels: string | null
}

interface TriggerResult {
  routineId: string
  sessionId: string
  status: 'triggered' | 'skipped' | 'failed'
  error?: string
}

export function createRoutineTrigger(env: Env, waitUntil?: WaitUntil) {
  const db = env.DB

  async function findDueRoutines(now: number): Promise<RoutineRow[]> {
    const result = await db
      .prepare(
        `SELECT * FROM routines
         WHERE enabled = 1
           AND trigger_type = 'schedule'
           AND next_run_at IS NOT NULL
           AND next_run_at <= ?
         ORDER BY next_run_at ASC
         LIMIT 50`,
      )
      .bind(now)
      .all<RoutineRow>()
    return result.results ?? []
  }

  async function triggerRoutine(routine: RoutineRow): Promise<TriggerResult> {
    try {
      // Advance next_run_at before starting so an overlapping tick cannot fire the same slot twice.
      const nextRunAt = routine.cron ? nextRoutineRunAt(routine.cron, routine.stagger_seconds) : null
      await db
        .prepare('UPDATE routines SET next_run_at = ?, updated_at = ? WHERE id = ?')
        .bind(nextRunAt, Date.now(), routine.id)
        .run()

      const { sessionId, run } = await startRoutineRun(env, routine, { trigger: 'routine' })
      waitUntil?.(run)

      return { routineId: routine.id, sessionId, status: 'triggered' }
    } catch (err) {
      return {
        routineId: routine.id,
        sessionId: '',
        status: 'failed',
        error: err instanceof Error ? err.message : String(err),
      }
    }
  }

  async function triggerDueRoutines(): Promise<TriggerResult[]> {
    const now = Date.now()
    const due = await findDueRoutines(now)
    const results: TriggerResult[] = []
    // next_run_at already includes the routine's stagger.
    for (const routine of due) {
      results.push(await triggerRoutine(routine))
    }
    return results
  }

  async function triggerById(routineId: string): Promise<TriggerResult> {
    const row = await db.prepare('SELECT * FROM routines WHERE id = ?').bind(routineId).first<RoutineRow>()
    if (!row) return { routineId, sessionId: '', status: 'failed', error: 'not found' }
    return triggerRoutine(row)
  }

  return { findDueRoutines, triggerRoutine, triggerDueRoutines, triggerById }
}
