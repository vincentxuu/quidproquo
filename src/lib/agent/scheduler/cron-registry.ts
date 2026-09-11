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
  {
    agentId: 'daily-digest-github',
    cron: '45 18 * * *',
    label: 'GitHub trending AI repos',
    timezone: 'Asia/Taipei',
  },
  {
    agentId: 'daily-digest-funding',
    cron: '0 19 * * *',
    label: 'AI startup funding alerts',
    timezone: 'Asia/Taipei',
  },
  {
    agentId: 'daily-digest-tool',
    cron: '15 19 * * *',
    label: 'AI tool/MCP discovery',
    timezone: 'Asia/Taipei',
  },
  {
    agentId: 'daily-digest-model-card',
    cron: '30 19 * * *',
    label: 'New AI model detection',
    timezone: 'Asia/Taipei',
  },
  {
    agentId: 'daily-digest-ai-interview',
    cron: '45 19 * * *',
    label: 'AI Engineer interview prep',
    timezone: 'Asia/Taipei',
  },
  {
    agentId: 'daily-digest-product-interview',
    cron: '0 20 * * *',
    label: 'Product Builder interview prep',
    timezone: 'Asia/Taipei',
  },
]
