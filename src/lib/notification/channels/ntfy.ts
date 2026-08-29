import type { NotificationChannel, RoutineSummary, PlatformFailure } from '../types'

const STATUS_LABEL: Record<string, string> = {
  completed: '✅ completed',
  failed: '❌ failed',
  needs_action: '⚠️ needs action',
}

export function createNtfyChannel(opts: {
  id: string
  topic: string
  serverUrl?: string
}): NotificationChannel {
  const { id, topic, serverUrl = 'https://ntfy.sh' } = opts
  const url = `${serverUrl.replace(/\/$/, '')}/${topic}`

  return {
    id,
    type: 'ntfy',

    async send(summary: RoutineSummary): Promise<void> {
      const title = `${summary.routineName}: ${STATUS_LABEL[summary.status] ?? summary.status}`
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Title: title,
            Priority: summary.status === 'failed' ? 'high' : 'default',
            Tags: summary.status === 'failed' ? 'rotating_light' : 'robot',
          },
          body: summary.detail,
        })
        if (!res.ok) {
          console.error(`[ntfy] returned ${res.status}`)
        }
      } catch (err) {
        console.error('[ntfy] send failed:', err)
      }
    },

    async sendPlatformFailure(failure: PlatformFailure): Promise<void> {
      const title = `❌ Platform failure: ${failure.routineName}`
      const body = `Step: ${failure.failedStep}\n\n${failure.stderr.slice(0, 500)}`
      try {
        await fetch(url, {
          method: 'POST',
          headers: { Title: title, Priority: 'urgent', Tags: 'rotating_light' },
          body,
        })
      } catch (err) {
        console.error('[ntfy] platform-failure send failed:', err)
      }
    },
  }
}
