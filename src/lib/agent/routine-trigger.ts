import { createSessionManager, type CreateSessionInput } from './session-manager'

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

export function createRoutineTrigger(db: D1Database) {
  const sessions = createSessionManager(db)

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
      const input: CreateSessionInput = {
        instruction: routine.instructions,
        model: routine.model ?? undefined,
        repo: routine.repo ?? undefined,
        trigger: 'routine',
        routineId: routine.id,
      }
      const session = await sessions.create(input)

      const nextRunAt = routine.cron ? computeNextRun(routine.cron, routine.stagger_seconds) : null

      await db
        .prepare(
          `UPDATE routines
           SET last_run_id = ?, last_run_at = ?, last_run_status = 'running',
               next_run_at = ?, updated_at = ?
           WHERE id = ?`,
        )
        .bind(session.id, Date.now(), nextRunAt, Date.now(), routine.id)
        .run()

      return { routineId: routine.id, sessionId: session.id, status: 'triggered' }
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
    for (const routine of due) {
      const staggerMs = routine.stagger_seconds * 1000
      if (staggerMs > 0 && routine.next_run_at) {
        const staggeredAt = routine.next_run_at + staggerMs
        if (now < staggeredAt) {
          results.push({ routineId: routine.id, sessionId: '', status: 'skipped' })
          continue
        }
      }
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

function computeNextRun(cron: string, staggerSeconds: number): number | null {
  const now = new Date()
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return null

  const [minStr, hourStr, domStr, _monStr, dowStr] = parts

  if (minStr === '*' && hourStr === '*') {
    return now.getTime() + 60 * 60 * 1000 + staggerSeconds * 1000
  }

  const min = minStr === '*' ? 0 : parseInt(minStr, 10)
  const hour = hourStr === '*' ? now.getUTCHours() : parseInt(hourStr, 10)

  const next = new Date(now)
  next.setUTCMinutes(min, 0, 0)
  next.setUTCHours(hour)

  if (dowStr !== '*') {
    const targetDow = parseInt(dowStr, 10)
    const currentDow = next.getUTCDay()
    let daysAhead = targetDow - currentDow
    if (daysAhead <= 0) daysAhead += 7
    next.setUTCDate(next.getUTCDate() + daysAhead)
  } else if (domStr !== '*') {
    const targetDom = parseInt(domStr, 10)
    next.setUTCDate(targetDom)
    if (next.getTime() <= now.getTime()) {
      next.setUTCMonth(next.getUTCMonth() + 1)
    }
  } else {
    if (next.getTime() <= now.getTime()) {
      next.setUTCDate(next.getUTCDate() + 1)
    }
  }

  return next.getTime() + staggerSeconds * 1000
}
