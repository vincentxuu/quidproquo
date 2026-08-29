import type { NotificationChannel, RoutineSummary, PlatformFailure } from '../types'

const STATUS_EMOJI: Record<string, string> = {
  completed: '✅',
  failed: '❌',
  needs_action: '⚠️',
}

function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function createTelegramChannel(opts: {
  id: string
  botToken: string
  chatId: string
  siteUrl?: string
}): NotificationChannel {
  const { id, botToken, chatId, siteUrl = '' } = opts

  async function sendMessage(html: string): Promise<void> {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: html, parse_mode: 'HTML', disable_web_page_preview: true }),
      })
      if (!res.ok) console.error(`[telegram] ${res.status}: ${await res.text().catch(() => '')}`)
    } catch (err) {
      console.error('[telegram] send failed:', err)
    }
  }

  return {
    id,
    type: 'telegram',

    async send(summary: RoutineSummary): Promise<void> {
      const emoji = STATUS_EMOJI[summary.status] ?? ''
      const link = siteUrl ? `\n<a href="${siteUrl}/admin/sessions/${summary.sessionId}">View session</a>` : ''
      const html = [
        `${emoji} <b>${escapeHtml(summary.routineName)}</b>`,
        escapeHtml(summary.detail),
        `Status: ${summary.status} | Duration: ${formatDuration(summary.duration)} | Tokens: ${summary.tokenCount.toLocaleString()}`,
        link,
      ].join('\n')
      await sendMessage(html)
    },

    async sendPlatformFailure(failure: PlatformFailure): Promise<void> {
      const stderr = failure.stderr.length > 500 ? failure.stderr.slice(0, 500) + '...' : failure.stderr
      const html = [
        `❌ <b>Platform failure: ${escapeHtml(failure.routineName)}</b>`,
        `Step <b>${escapeHtml(failure.failedStep)}</b> failed.`,
        `<pre>${escapeHtml(stderr)}</pre>`,
      ].join('\n')
      await sendMessage(html)
    },
  }
}
