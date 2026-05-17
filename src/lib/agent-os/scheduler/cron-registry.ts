export interface ScheduledAgentEntry {
  agentId: string
  cron: string
  label?: string
  input?: Record<string, unknown>
  timezone?: string
}

export const scheduledAgentEntries: ScheduledAgentEntry[] = []
