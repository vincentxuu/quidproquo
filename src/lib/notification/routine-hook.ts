import type { RoutineSummary } from './types'
import { notifyAll } from './registry'
import { ensureGlobalChannels } from './bootstrap'
import { createSessionManager } from '../agent/session-manager'
import type { Env } from '../config/env'

interface RoutineRecord {
  id: string
  name: string
  notification_enabled: number
  notification_channels: string | null
}

interface SessionRecord {
  id: string
  summary_category: string | null
  summary_detail: string | null
  needs_action: number
  total_tokens: number
  created_at: number
  finished_at: number | null
}

export async function onRoutineSessionComplete(
  routine: RoutineRecord,
  session: SessionRecord,
): Promise<void> {
  if (!routine.notification_enabled) return

  const channelIds = parseChannelIds(routine.notification_channels)
  if (channelIds.length === 0) return

  const status = resolveStatus(session)

  if (status === 'completed' && !session.needs_action) return

  const summary: RoutineSummary = {
    routineId: routine.id,
    routineName: routine.name,
    sessionId: session.id,
    status,
    detail: session.summary_detail ?? 'No summary available',
    duration: (session.finished_at ?? Date.now()) - session.created_at,
    tokenCount: session.total_tokens,
  }

  await notifyAll(summary, channelIds)
}

function resolveStatus(session: SessionRecord): RoutineSummary['status'] {
  if (session.needs_action) return 'needs_action'
  const cat = session.summary_category
  if (cat === 'failed') return 'failed'
  return 'completed'
}

function parseChannelIds(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x: unknown) => typeof x === 'string') : []
  } catch {
    return []
  }
}

/**
 * Best-effort routine completion notifier for the session DO.
 * Never throws: notification must not break session completion.
 * No-ops when the session has no routine, the routine disabled
 * notifications, or no channels are configured (env unset).
 */
export async function dispatchRoutineNotification(
  db: D1Database,
  env: Env,
  sessionId: string,
): Promise<void> {
  try {
    const mgr = createSessionManager(db)
    const session = await mgr.get(sessionId)
    if (!session?.routine_id) return

    const routine = await db
      .prepare('SELECT id, name, notification_enabled, notification_channels FROM routines WHERE id = ?')
      .bind(session.routine_id)
      .first<{ id: string; name: string; notification_enabled: number; notification_channels: string | null }>()
    if (!routine?.notification_enabled) return

    ensureGlobalChannels(env)

    await onRoutineSessionComplete(
      {
        id: routine.id,
        name: routine.name,
        notification_enabled: routine.notification_enabled,
        notification_channels: routine.notification_channels,
      },
      {
        id: session.id,
        summary_category: session.summary_category,
        summary_detail: session.summary_detail,
        needs_action: session.needs_action ? 1 : 0,
        total_tokens: session.total_tokens,
        created_at: session.created_at,
        finished_at: session.finished_at,
      },
    )
  } catch (err) {
    console.error('[notification] dispatch failed:', err instanceof Error ? err.message : err)
  }
}
