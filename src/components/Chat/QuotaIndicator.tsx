export function QuotaIndicator({ remaining, limit }: { remaining: number; limit: number }) {
  const pct = (remaining / limit) * 100
  return (
    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>每日剩餘 {remaining}/{limit} 次</span>
        <div style={{ flex: 1, background: 'var(--border)', borderRadius: 4, height: 6 }}>
          <div style={{ width: `${pct}%`, background: pct > 40 ? 'var(--brand-500)' : 'var(--warning-border)', height: '100%', borderRadius: 4, transition: 'width 0.3s' }} />
        </div>
      </div>
    </div>
  )
}
