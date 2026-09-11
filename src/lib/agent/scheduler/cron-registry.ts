export interface ScheduledAgentEntry {
  agentId: string
  cron: string
  label?: string
  input?: Record<string, unknown>
  timezone?: string
}

export const scheduledAgentEntries: ScheduledAgentEntry[] = [
  {
    agentId: 'daily-digest-framework',
    cron: '0 18 * * *',
    label: 'Framework release detection',
    timezone: 'Asia/Taipei',
  },
  {
    agentId: 'daily-digest-security',
    cron: '30 18 * * *',
    label: 'Security incident detection',
    timezone: 'Asia/Taipei',
  },
  {
    agentId: 'daily-digest-pricing',
    cron: '15 18 * * *',
    label: 'AI API pricing tracking',
    timezone: 'Asia/Taipei',
  },
]
