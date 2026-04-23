interface AgentStep {
  agent: string
  status: 'started' | 'completed'
  chunks_found?: number
}

export function AgentSteps({ steps }: { steps: AgentStep[] }) {
  if (steps.length === 0) return null
  const labels: Record<string, string> = {
    Planner: '分析問題',
    Research: '搜尋文章',
    Writer: '生成回應',
    Critic: '品質檢查',
  }
  return (
    <div style={{ fontSize: '0.8rem', color: '#888', padding: '0.25rem 0' }}>
      {steps.map((s, i) => (
        <span key={i} style={{ marginRight: '1rem' }}>
          {s.status === 'completed' ? '✓' : '⟳'} {labels[s.agent] ?? s.agent}
          {s.chunks_found !== undefined ? ` (${s.chunks_found})` : ''}
        </span>
      ))}
    </div>
  )
}
