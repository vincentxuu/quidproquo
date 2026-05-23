import { useState, useEffect } from 'react'
import { useToast } from './Toast'

interface ApprovalCardProps {
  approvalId: string
  reason: string
  context: Record<string, unknown>
  ttlSeconds: number
  createdAt: number  // epoch ms
  onResolved?: (decision: 'approve' | 'reject') => void
}

export function ApprovalCard({ approvalId, reason, context, ttlSeconds, createdAt, onResolved }: ApprovalCardProps) {
  const { success, error: toastError } = useToast()
  const [loading, setLoading] = useState(false)
  const [resolved, setResolved] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const elapsed = Math.floor((Date.now() - createdAt) / 1000)
    return Math.max(0, ttlSeconds - elapsed)
  })

  useEffect(() => {
    if (secondsLeft <= 0) return
    const t = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [secondsLeft])

  async function resolve(decision: 'approve' | 'reject') {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/agents/approvals/${approvalId}/${decision}`, { method: 'POST' })
      if (!res.ok) throw new Error(await res.text())
      setResolved(true)
      success(`操作已${decision === 'approve' ? '核准' : '拒絕'}`)
      onResolved?.(decision)
    } catch (e) {
      toastError(String(e))
    } finally {
      setLoading(false)
    }
  }

  if (resolved) return <div className="approval-card approval-card--resolved">已處理</div>

  return (
    <div className="approval-card">
      <div className="approval-card__header">
        <span className="approval-card__reason">{reason}</span>
        <span className={`approval-card__ttl ${secondsLeft < 300 ? 'approval-card__ttl--urgent' : ''}`}>
          {secondsLeft > 0 ? `剩餘 ${Math.floor(secondsLeft / 3600)}h ${Math.floor((secondsLeft % 3600) / 60)}m` : '已過期'}
        </span>
      </div>
      {Object.keys(context).length > 0 && (
        <pre className="approval-card__context">{JSON.stringify(context, null, 2)}</pre>
      )}
      <div className="approval-card__actions">
        <button
          onClick={() => resolve('approve')}
          disabled={loading || secondsLeft <= 0}
          className="approval-card__btn approval-card__btn--approve"
          aria-label="核准"
        >
          核准
        </button>
        <button
          onClick={() => resolve('reject')}
          disabled={loading || secondsLeft <= 0}
          className="approval-card__btn approval-card__btn--reject"
          aria-label="拒絕"
        >
          拒絕
        </button>
      </div>
    </div>
  )
}
