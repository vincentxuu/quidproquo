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
    Validation: '格式驗證',
    Critic: '品質檢查',
    Fallback: '降級輸出',
  }
  return (
    <div style={styles.container} aria-label="AI 回答進度">
      {steps.map((s, i) => (
        <span key={`${s.agent}:${i}`} style={styles.step}>
          <span style={s.status === 'completed' ? styles.dotDone : styles.dotActive} aria-hidden="true" />
          <span>{labels[s.agent] ?? s.agent}</span>
          {s.chunks_found !== undefined ? <span style={styles.meta}>{s.chunks_found}</span> : null}
        </span>
      ))}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.4rem',
    margin: '0 0 0.55rem',
  },
  step: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.25rem 0.45rem',
    borderRadius: 6,
    background: 'var(--brand-50)',
    color: 'var(--text-secondary)',
    fontSize: '0.76rem',
    lineHeight: 1.2,
    fontWeight: 600,
  },
  dotDone: {
    width: '0.42rem',
    height: '0.42rem',
    borderRadius: '50%',
    background: 'var(--brand-500)',
  },
  dotActive: {
    width: '0.42rem',
    height: '0.42rem',
    borderRadius: '50%',
    background: 'var(--heading-accent, var(--brand-500))',
    boxShadow: '0 0 0 3px var(--brand-100)',
  },
  meta: {
    color: 'var(--text-muted)',
    fontVariantNumeric: 'tabular-nums' as const,
  },
}
