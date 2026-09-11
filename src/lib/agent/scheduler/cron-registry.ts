export interface ScheduledAgentEntry {
  agentId: string
  cron: string
  label?: string
  input?: Record<string, unknown>
  timezone?: string
}

const DAILY_DIGEST_CRON = '0 21 * * *'

export const scheduledAgentEntries: ScheduledAgentEntry[] = [
  { agentId: 'daily-digest-framework', cron: DAILY_DIGEST_CRON, label: 'Framework release detection' },
  { agentId: 'daily-digest-pricing', cron: DAILY_DIGEST_CRON, label: 'AI API pricing tracking' },
  { agentId: 'daily-digest-security', cron: DAILY_DIGEST_CRON, label: 'Security incident detection' },
  { agentId: 'daily-digest-github', cron: DAILY_DIGEST_CRON, label: 'GitHub trending AI repos' },
  { agentId: 'daily-digest-funding', cron: DAILY_DIGEST_CRON, label: 'AI startup funding alerts' },
  { agentId: 'daily-digest-tool', cron: DAILY_DIGEST_CRON, label: 'AI tool/MCP discovery' },
  { agentId: 'daily-digest-model-card', cron: DAILY_DIGEST_CRON, label: 'New AI model detection' },
  { agentId: 'daily-digest-ai-interview', cron: DAILY_DIGEST_CRON, label: 'AI Engineer interview prep' },
  { agentId: 'daily-digest-product-interview', cron: DAILY_DIGEST_CRON, label: 'Product Builder interview prep' },
  { agentId: 'daily-digest-arxiv', cron: DAILY_DIGEST_CRON, label: 'arXiv paper screening' },
  { agentId: 'daily-digest-benchmark', cron: DAILY_DIGEST_CRON, label: 'Benchmark leaderboard watch' },
  { agentId: 'daily-digest-signals', cron: DAILY_DIGEST_CRON, label: 'Stage 2 — news signals scan' },
  { agentId: 'daily-digest-report', cron: DAILY_DIGEST_CRON, label: 'Stage 3 — daily report assembly' },
  { agentId: 'daily-digest-weekly', cron: DAILY_DIGEST_CRON, label: 'Weekly AI Agent review (runs Friday only)' },
  { agentId: 'daily-digest-region', cron: DAILY_DIGEST_CRON, label: 'Regional AI ecosystem (runs Friday only)' },
]
