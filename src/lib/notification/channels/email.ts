import type { NotificationChannel, RoutineSummary, PlatformFailure } from '../types'

function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

function buildHtml(summary: RoutineSummary, siteUrl: string): string {
  const statusColor = summary.status === 'completed' ? '#22c55e' : summary.status === 'failed' ? '#ef4444' : '#eab308'
  const link = siteUrl ? `<a href="${siteUrl}/admin/sessions/${summary.sessionId}">View session</a>` : ''
  return `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto">
      <h2 style="border-left:4px solid ${statusColor};padding-left:12px">${summary.routineName}</h2>
      <p>${summary.detail}</p>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:4px 8px;color:#666">Status</td><td style="padding:4px 8px">${summary.status}</td></tr>
        <tr><td style="padding:4px 8px;color:#666">Duration</td><td style="padding:4px 8px">${formatDuration(summary.duration)}</td></tr>
        <tr><td style="padding:4px 8px;color:#666">Tokens</td><td style="padding:4px 8px">${summary.tokenCount.toLocaleString()}</td></tr>
      </table>
      ${link ? `<p style="margin-top:16px">${link}</p>` : ''}
    </div>
  `
}

export function createEmailChannel(opts: {
  id: string
  provider: 'resend' | 'ses'
  apiKey: string
  from: string
  to: string[]
  siteUrl?: string
}): NotificationChannel {
  const { id, provider, apiKey, from, to, siteUrl = '' } = opts

  async function sendEmail(subject: string, html: string): Promise<void> {
    try {
      if (provider === 'resend') {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from, to, subject, html }),
        })
        if (!res.ok) console.error(`[email/resend] ${res.status}: ${await res.text().catch(() => '')}`)
      } else {
        console.error('[email/ses] SES adapter not yet implemented — use Resend')
      }
    } catch (err) {
      console.error('[email] send failed:', err)
    }
  }

  return {
    id,
    type: 'email',

    async send(summary: RoutineSummary): Promise<void> {
      const statusEmoji = summary.status === 'completed' ? '✅' : summary.status === 'failed' ? '❌' : '⚠️'
      const subject = `${statusEmoji} ${summary.routineName} — ${summary.status}`
      await sendEmail(subject, buildHtml(summary, siteUrl))
    },

    async sendPlatformFailure(failure: PlatformFailure): Promise<void> {
      const stderr = failure.stderr.length > 1000 ? failure.stderr.slice(0, 1000) + '...' : failure.stderr
      const html = `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto">
          <h2 style="border-left:4px solid #ef4444;padding-left:12px">Platform failure: ${failure.routineName}</h2>
          <p>Step <strong>${failure.failedStep}</strong> failed before the agent could start.</p>
          <pre style="background:#f5f5f5;padding:12px;border-radius:4px;overflow:auto;font-size:13px">${stderr}</pre>
        </div>
      `
      await sendEmail(`❌ Platform failure: ${failure.routineName}`, html)
    },
  }
}
