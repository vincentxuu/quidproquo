import type { NotificationChannel, RoutineSummary, PlatformFailure } from '../types'

const STATUS_COLORS: Record<string, number> = {
  completed: 0x22c55e,
  failed: 0xef4444,
  needs_action: 0xeab308,
}

const STATUS_EMOJI: Record<string, string> = {
  completed: '✅',
  failed: '❌',
  needs_action: '⚠️',
}

function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  const rs = s % 60
  return rs > 0 ? `${m}m ${rs}s` : `${m}m`
}

export function createDiscordChannel(opts: {
  id: string
  webhookUrl: string
  siteUrl?: string
}): NotificationChannel {
  const { id, webhookUrl, siteUrl = '' } = opts

  return {
    id,
    type: 'discord',

    async send(summary: RoutineSummary): Promise<void> {
      const emoji = STATUS_EMOJI[summary.status] ?? ''
      const color = STATUS_COLORS[summary.status] ?? 0x6b7280
      const sessionLink = siteUrl
        ? `[View session](${siteUrl}/admin/sessions/${summary.sessionId})`
        : ''

      const fields = [
        { name: 'Status', value: summary.status, inline: true },
        { name: 'Duration', value: formatDuration(summary.duration), inline: true },
        { name: 'Tokens', value: summary.tokenCount.toLocaleString(), inline: true },
      ]
      if (sessionLink) {
        fields.push({ name: '', value: sessionLink, inline: false })
      }

      const embed = {
        title: `${emoji} ${summary.routineName}`,
        description: summary.detail,
        color,
        fields,
        timestamp: new Date().toISOString(),
      }

      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ embeds: [embed] }),
        })
        if (!res.ok) {
          console.error(`[discord] webhook returned ${res.status}: ${await res.text().catch(() => '')}`)
        }
      } catch (err) {
        console.error('[discord] webhook send failed:', err)
      }
    },

    async sendPlatformFailure(failure: PlatformFailure): Promise<void> {
      const stderr = failure.stderr.length > 1000
        ? failure.stderr.slice(0, 1000) + '…'
        : failure.stderr

      const embed = {
        title: `❌ Platform failure: ${failure.routineName}`,
        description: `Step **${failure.failedStep}** failed before the agent could start.`,
        color: 0xef4444,
        fields: [{ name: 'stderr', value: '```\n' + stderr + '\n```' }],
        timestamp: new Date().toISOString(),
      }

      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ embeds: [embed] }),
        })
        if (!res.ok) {
          console.error(`[discord] platform-failure webhook returned ${res.status}`)
        }
      } catch (err) {
        console.error('[discord] platform-failure webhook failed:', err)
      }
    },
  }
}
