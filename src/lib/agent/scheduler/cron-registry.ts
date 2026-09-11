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
]
