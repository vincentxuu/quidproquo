export async function checkCostThresholds(env: {
  DB: D1Database
  AGENT_CONSOLE_COST_ALERT_USD_24H?: string
}): Promise<void> {
  const threshold = parseFloat(env.AGENT_CONSOLE_COST_ALERT_USD_24H ?? '50')
  if (isNaN(threshold)) return

  // Query last 24h total cost from agent_runs via agent_tool_calls
  const result = await env.DB.prepare(
    `SELECT COALESCE(SUM(cost_usd), 0) AS total FROM agent_tool_calls
     WHERE run_id IN (SELECT run_id FROM agent_runs WHERE started_at > ?)`,
  )
    .bind(Date.now() - 86_400_000)
    .first<{ total: number }>()

  if (result && result.total > threshold) {
    console.warn(
      `[COST ALERT] 24h spend $${result.total.toFixed(4)} exceeds threshold $${threshold}`,
    )
    // Future: send Slack/email notification; for now WARN log is sufficient
  }
}
