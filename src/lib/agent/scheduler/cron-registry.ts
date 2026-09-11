export interface ScheduledAgentEntry {
  agentId: string
  cron: string
  label?: string
  input?: Record<string, unknown>
  timezone?: string
  stage?: number
}

const DAILY_DIGEST_CRON = '0 21 * * *'

export const scheduledAgentEntries: ScheduledAgentEntry[] = [
  { agentId: 'daily-digest-framework', cron: DAILY_DIGEST_CRON, label: 'Framework release detection', stage: 1 },
  { agentId: 'daily-digest-pricing', cron: DAILY_DIGEST_CRON, label: 'AI API pricing tracking', stage: 1 },
  { agentId: 'daily-digest-security', cron: DAILY_DIGEST_CRON, label: 'Security incident detection', stage: 1 },
  { agentId: 'daily-digest-github', cron: DAILY_DIGEST_CRON, label: 'GitHub trending AI repos', stage: 1 },
  { agentId: 'daily-digest-funding', cron: DAILY_DIGEST_CRON, label: 'AI startup funding alerts', stage: 1 },
  { agentId: 'daily-digest-tool', cron: DAILY_DIGEST_CRON, label: 'AI tool/MCP discovery', stage: 1 },
  { agentId: 'daily-digest-model-card', cron: DAILY_DIGEST_CRON, label: 'New AI model detection', stage: 1 },
  { agentId: 'daily-digest-ai-interview', cron: DAILY_DIGEST_CRON, label: 'AI Engineer interview prep', stage: 1 },
  { agentId: 'daily-digest-product-interview', cron: DAILY_DIGEST_CRON, label: 'Product Builder interview prep', stage: 1 },
  { agentId: 'daily-digest-arxiv', cron: DAILY_DIGEST_CRON, label: 'arXiv paper screening', stage: 1 },
  { agentId: 'daily-digest-benchmark', cron: DAILY_DIGEST_CRON, label: 'Benchmark leaderboard watch', stage: 1 },
  { agentId: 'daily-digest-weekly', cron: DAILY_DIGEST_CRON, label: 'Weekly AI Agent review (runs Friday only)', stage: 1 },
  { agentId: 'daily-digest-region', cron: DAILY_DIGEST_CRON, label: 'Regional AI ecosystem (runs Friday only)', stage: 1 },
  { agentId: 'daily-digest-signals', cron: DAILY_DIGEST_CRON, label: 'Stage 2 — news signals scan', stage: 2 },
  { agentId: 'daily-digest-report', cron: DAILY_DIGEST_CRON, label: 'Stage 3 — daily report assembly', stage: 3 },
]
