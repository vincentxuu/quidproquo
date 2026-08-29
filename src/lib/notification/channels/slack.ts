import type { NotificationChannel, RoutineSummary, PlatformFailure } from '../types'

const STATUS_EMOJI: Record<string, string> = {
  completed: ':white_check_mark:',
  failed: ':x:',
  needs_action: ':warning:',
}

function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  return `${m}m ${s % 60}s`
}

export function createSlackChannel(opts: {
  id: string
  webhookUrl: string
  siteUrl?: string
}): NotificationChannel {
  const { id, webhookUrl, siteUrl = '' } = opts

  return {
    id,
    type: 'slack',

    async send(summary: RoutineSummary): Promise<void> {
      const emoji = STATUS_EMOJI[summary.status] ?? ''
      const sessionLink = siteUrl ? `<${siteUrl}/admin/sessions/${summary.sessionId}|View session>` : ''

      const blocks = [
        {
          type: 'header',
          text: { type: 'plain_text', text: `${emoji} ${summary.routineName}` },
        },
        {
          type: 'section',
          text: { type: 'mrkdwn', text: summary.detail },
        },
        {
          type: 'context',
          elements: [
            { type: 'mrkdwn', text: `*Status:* ${summary.status}` },
            { type: 'mrkdwn', text: `*Duration:* ${formatDuration(summary.duration)}` },
            { type: 'mrkdwn', text: `*Tokens:* ${summary.tokenCount.toLocaleString()}` },
          ],
        },
      ]

      if (sessionLink) {
        blocks.push({
          type: 'context',
          elements: [{ type: 'mrkdwn', text: sessionLink }],
        })
      }

      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blocks }),
        })
        if (!res.ok) console.error(`[slack] webhook returned ${res.status}`)
      } catch (err) {
        console.error('[slack] webhook failed:', err)
      }
    },

    async sendPlatformFailure(failure: PlatformFailure): Promise<void> {
      const stderr = failure.stderr.length > 500 ? failure.stderr.slice(0, 500) + '...' : failure.stderr
      const blocks = [
        {
          type: 'header',
          text: { type: 'plain_text', text: `:x: Platform failure: ${failure.routineName}` },
        },
        {
          type: 'section',
          text: { type: 'mrkdwn', text: `Step *${failure.failedStep}* failed before the agent could start.\n\`\`\`${stderr}\`\`\`` },
        },
      ]

      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blocks }),
        })
      } catch (err) {
        console.error('[slack] platform-failure failed:', err)
      }
    },
  }
}
