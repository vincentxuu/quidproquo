import type { RoutineSummary } from './types'
import { notifyAll } from './registry'

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
