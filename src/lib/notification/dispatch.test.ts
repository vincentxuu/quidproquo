import { describe, it, expect, beforeEach } from 'vitest'
import { ensureGlobalChannels } from './bootstrap'
import { dispatchRoutineNotification } from './routine-hook'
import { listChannels, registerChannel } from './registry'
import type { RoutineSummary } from './types'

function fakeDb(sessionRow: unknown, routineRow: unknown) {
  return {
    prepare: (sql: string) => ({
      bind: (..._args: unknown[]) => ({
        first: async () =>
          sql.includes('agent_sessions') || sql.includes('FROM routines')
            ? (sql.includes('routines') ? routineRow : sessionRow)
            : null,
      }),
    }),
  } as unknown as D1Database
}

const baseSession = {
  id: 'sess_1',
  routine_id: 'rt_1',
  summary_category: null,
  summary_detail: null,
  needs_action: 1,
  total_tokens: 100,
  created_at: 1000,
  finished_at: 2000,
}

describe('ensureGlobalChannels', () => {
  it('registers nothing when env is empty', () => {
    ensureGlobalChannels({} as never)
    const ids = listChannels().map((c) => c.id)
    expect(ids).not.toContain('global-discord')
    expect(ids).not.toContain('global-ntfy')
  })

  it('registers discord + ntfy from env, idempotently', () => {
    const env = {
      NOTIFICATION_DISCORD_WEBHOOK_URL: 'https://discord.example/hook',
      NOTIFICATION_NTFY_TOPIC: 'my-topic',
    } as never
    ensureGlobalChannels(env)
    ensureGlobalChannels(env)
    const channels = listChannels()
    expect(channels.filter((c) => c.id === 'global-discord')).toHaveLength(1)
    expect(channels.filter((c) => c.id === 'global-ntfy')).toHaveLength(1)
  })
})

describe('dispatchRoutineNotification', () => {
  const sent: RoutineSummary[] = []
  beforeEach(() => {
    sent.length = 0
    registerChannel({
      id: 'test-channel',
      type: 'test',
      async send(summary: RoutineSummary) {
        sent.push(summary)
      },
    })
  })

  it('no-ops when session has no routine', async () => {
    const db = fakeDb({ ...baseSession, routine_id: null }, null)
    await dispatchRoutineNotification(db, {} as never, 'sess_1')
    expect(sent).toHaveLength(0)
  })

  it('no-ops when routine disabled notifications', async () => {
    const db = fakeDb(baseSession, {
      id: 'rt_1',
      name: 'r',
      notification_enabled: 0,
      notification_channels: '["test-channel"]',
    })
    await dispatchRoutineNotification(db, {} as never, 'sess_1')
    expect(sent).toHaveLength(0)
  })

  it('sends when enabled and needs action', async () => {
    const db = fakeDb(baseSession, {
      id: 'rt_1',
      name: 'nightly',
      notification_enabled: 1,
      notification_channels: '["test-channel"]',
    })
    await dispatchRoutineNotification(db, {} as never, 'sess_1')
    expect(sent).toHaveLength(1)
    expect(sent[0]?.routineId).toBe('rt_1')
    expect(sent[0]?.status).toBe('needs_action')
  })

  it('never throws on db failure', async () => {
    const db = {
      prepare: () => {
        throw new Error('d1 down')
      },
    } as unknown as D1Database
    await expect(dispatchRoutineNotification(db, {} as never, 'sess_1')).resolves.toBeUndefined()
  })
})
