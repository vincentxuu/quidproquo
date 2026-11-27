import { useState } from 'react'
import { ToastProvider, useToast } from './Toast'

interface PendingApproval {
  approvalId: string
  runId: string
  reason: string
  stepId?: string
}

interface RowState {
  status: 'idle' | 'loading' | 'done' | 'error'
  decision?: 'approve' | 'reject'
  errorMsg?: string
}

interface BulkApprovalModalProps {
  approvals: PendingApproval[]
  onDone: () => void
  onClose: () => void
}

function BulkApprovalModalInner({ approvals, onDone, onClose }: BulkApprovalModalProps) {
  const { success, error: toastError } = useToast()
  const [rows, setRows] = useState<Record<string, RowState>>(() =>
    Object.fromEntries(approvals.map((a) => [a.approvalId, { status: 'idle' }])),
  )
  const [submitting, setSubmitting] = useState(false)

  function setRow(approvalId: string, patch: Partial<RowState>) {
    setRows((prev) => ({ ...prev, [approvalId]: { ...prev[approvalId], ...patch } }))
  }

  async function resolveOne(approvalId: string, decision: 'approve' | 'reject') {
    setRow(approvalId, { status: 'loading', decision })
    try {
      const res = await fetch(`/api/admin/sessions/approvals/${approvalId}/${decision}`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error(await res.text())
      setRow(approvalId, { status: 'done', decision })
      success(`${approvalId.slice(0, 8)}… 已${decision === 'approve' ? '核准' : '拒絕'}`)
    } catch (e) {
      setRow(approvalId, { status: 'error', decision, errorMsg: String(e) })
      toastError(`${approvalId.slice(0, 8)}… failed: ${String(e)}`)
    }
  }

  async function resolveAll(decision: 'approve' | 'reject') {
    setSubmitting(true)
    const pending = approvals.filter((a) => rows[a.approvalId]?.status === 'idle')
    await Promise.all(pending.map((a) => resolveOne(a.approvalId, decision)))
    setSubmitting(false)
    const updatedRows = { ...rows }
    const allDone = approvals.every(
      (a) => updatedRows[a.approvalId]?.status === 'done' || updatedRows[a.approvalId]?.status === 'error',
    )
    if (allDone) onDone()
  }

  const anyIdle = approvals.some((a) => rows[a.approvalId]?.status === 'idle')

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="批次處理待審核項目"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--scrim)',
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--corner-md)',
          boxShadow: 'var(--shadow-modal)',
          width: 'min(640px, 95vw)',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 'var(--fs-md)', fontWeight: 600 }}>
            批次處理 — {approvals.length} 筆待審核項目
          </h2>
          <button
            onClick={onClose}
            aria-label="關閉對話框"
            disabled={submitting}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'var(--fs-h2)',
              lineHeight: 1,
              color: 'var(--text-secondary)',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '0.75rem 1.25rem' }}>
          {approvals.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
              目前無待審核項目。
            </p>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {approvals.map((a) => {
                const row = rows[a.approvalId] ?? { status: 'idle' }
                return (
                  <li
                    key={a.approvalId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.625rem 0.75rem',
                      borderRadius: 'var(--corner-md)',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.reason}
                      </div>
                      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                        <a
                          href={`/admin/console/runs/${a.runId}${a.stepId ? `?step=${a.stepId}` : ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', textDecoration: 'underline' }}
                        >
                          {a.runId.slice(0, 12)}…
                        </a>
                      </div>
                    </div>

                    {row.status === 'idle' && (
                      <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                        <button
                          onClick={() => resolveOne(a.approvalId, 'approve')}
                          disabled={submitting}
                          aria-label={`核准 ${a.approvalId}`}
                          style={{
                            padding: '0.25rem 0.625rem',
                            fontSize: 'var(--fs-xs)',
                            borderRadius: 'var(--corner-sm)',
                            border: '1px solid var(--success)',
                            background: 'transparent',
                            color: 'var(--success)',
                            cursor: 'pointer',
                          }}
                        >
                          核准
                        </button>
                        <button
                          onClick={() => resolveOne(a.approvalId, 'reject')}
                          disabled={submitting}
                          aria-label={`拒絕 ${a.approvalId}`}
                          style={{
                            padding: '0.25rem 0.625rem',
                            fontSize: 'var(--fs-xs)',
                            borderRadius: 'var(--corner-sm)',
                            border: '1px solid var(--danger)',
                            background: 'transparent',
                            color: 'var(--danger)',
                            cursor: 'pointer',
                          }}
                        >
                          拒絕
                        </button>
                      </div>
                    )}

                    {row.status === 'loading' && (
                      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)', flexShrink: 0 }}>
                        處理中…
                      </span>
                    )}

                    {row.status === 'done' && (
                      <span
                        style={{
                          fontSize: 'var(--fs-xs)',
                          fontWeight: 500,
                          color: row.decision === 'approve' ? 'var(--success)' : 'var(--danger)',
                          flexShrink: 0,
                        }}
                      >
                        {row.decision === 'approve' ? '已核准' : '已拒絕'}
                      </span>
                    )}

                    {row.status === 'error' && (
                      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--danger)', flexShrink: 0 }}>
                        失敗
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            disabled={submitting}
            style={{
              padding: '0.4375rem 0.875rem',
              fontSize: 'var(--fs-sm)',
              borderRadius: 'var(--corner-md)',
              border: '1px solid var(--border)',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            關閉
          </button>
          <button
            onClick={() => resolveAll('reject')}
            disabled={submitting || !anyIdle}
            style={{
              padding: '0.4375rem 0.875rem',
              fontSize: 'var(--fs-sm)',
              borderRadius: 'var(--corner-md)',
              border: '1px solid var(--danger)',
              background: 'transparent',
              color: 'var(--danger)',
              cursor: submitting || !anyIdle ? 'not-allowed' : 'pointer',
              opacity: submitting || !anyIdle ? 0.5 : 1,
            }}
          >
            批次拒絕
          </button>
          <button
            onClick={() => resolveAll('approve')}
            disabled={submitting || !anyIdle}
            style={{
              padding: '0.4375rem 0.875rem',
              fontSize: 'var(--fs-sm)',
              borderRadius: 'var(--corner-md)',
              border: 'none',
              background: 'var(--success)',
              color: 'var(--text-on-solid)',
              cursor: submitting || !anyIdle ? 'not-allowed' : 'pointer',
              opacity: submitting || !anyIdle ? 0.5 : 1,
            }}
          >
            批次核准
          </button>
        </div>
      </div>
    </div>
  )
}

export function BulkApprovalModal(props: BulkApprovalModalProps) {
  return (
    <ToastProvider>
      <BulkApprovalModalInner {...props} />
    </ToastProvider>
  )
}

// Top-level island: manages open/closed state + re-mount on done
interface PendingApprovalsBannerIslandProps {
  approvals: PendingApproval[]
}

export function PendingApprovalsBannerIsland({ approvals }: PendingApprovalsBannerIslandProps) {
  const [open, setOpen] = useState(false)

  if (approvals.length === 0) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '0.25rem 0.75rem',
          fontSize: 'var(--fs-sm)',
          borderRadius: 'var(--corner-md)',
          border: '1px solid currentColor',
          background: 'transparent',
          color: 'inherit',
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        批次處理
      </button>
      {open && (
        <BulkApprovalModal
          approvals={approvals}
          onClose={() => setOpen(false)}
          onDone={() => {
            setOpen(false)
            window.location.reload()
          }}
        />
      )}
    </>
  )
}
