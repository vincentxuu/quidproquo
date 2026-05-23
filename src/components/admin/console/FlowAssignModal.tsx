import { useState, useEffect } from 'react'

interface FlowRow {
  id: string
  name: string
  version: number
  description: string
}

interface FlowAssignModalProps {
  policyId: string
  onDone: () => void
  onClose: () => void
}

function FlowAssignModalInner({ policyId, onDone, onClose }: FlowAssignModalProps) {
  const [flows, setFlows] = useState<FlowRow[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/flows')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<{ flows: FlowRow[] }>
      })
      .then((data) => {
        setFlows(data.flows ?? [])
        setLoading(false)
      })
      .catch((err) => {
        setFetchError(String(err))
        setLoading(false)
      })
  }, [])

  function toggleRow(flowId: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(flowId)) {
        next.delete(flowId)
      } else {
        next.add(flowId)
      }
      return next
    })
  }

  async function handleAssign() {
    if (selected.size === 0) return
    setSubmitting(true)
    setSubmitError(null)

    const results = await Promise.allSettled(
      Array.from(selected).map((flowId) =>
        fetch(`/api/admin/policies/${encodeURIComponent(policyId)}/assignments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ flowId, scope: 'flow_definition' }),
        }).then((res) => {
          if (!res.ok) return res.text().then((t) => Promise.reject(new Error(t)))
        }),
      ),
    )

    const failures = results.filter((r) => r.status === 'rejected')
    if (failures.length > 0) {
      const msgs = failures.map((r) => (r as PromiseRejectedResult).reason?.message ?? String((r as PromiseRejectedResult).reason))
      setSubmitError(`${failures.length} assignment(s) failed: ${msgs.join('; ')}`)
      setSubmitting(false)
      return
    }

    setSubmitting(false)
    onDone()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="將政策指派至工作流程"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)',
      }}
    >
      <div
        style={{
          background: 'var(--color-surface, #fff)',
          borderRadius: '0.5rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          width: 'min(560px, 95vw)',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--color-border, #e5e7eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>指派至工作流程</h2>
          <button
            onClick={onClose}
            aria-label="關閉視窗"
            disabled={submitting}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.25rem',
              lineHeight: 1,
              color: 'var(--color-muted, #6b7280)',
            }}
          >
            x
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '0.75rem 1.25rem' }}>
          {loading && (
            <p style={{ color: 'var(--color-muted, #6b7280)', fontSize: '0.875rem' }}>載入工作流程中…</p>
          )}
          {fetchError && (
            <p style={{ color: 'var(--color-error, #dc2626)', fontSize: '0.875rem' }}>
              無法載入工作流程：{fetchError}
            </p>
          )}
          {!loading && !fetchError && flows.length === 0 && (
            <p style={{ color: 'var(--color-muted, #6b7280)', fontSize: '0.875rem' }}>
              尚無已登錄的工作流程。
            </p>
          )}
          {!loading && !fetchError && flows.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th style={{ width: '2rem', padding: '0.4rem 0.5rem', textAlign: 'left', color: 'var(--color-muted, #6b7280)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
                    <span className="sr-only">選取</span>
                  </th>
                  <th style={{ padding: '0.4rem 0.5rem', textAlign: 'left', color: 'var(--color-muted, #6b7280)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
                    工作流程
                  </th>
                  <th style={{ padding: '0.4rem 0.5rem', textAlign: 'left', color: 'var(--color-muted, #6b7280)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
                    ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {flows.map((flow) => (
                  <tr
                    key={flow.id}
                    onClick={() => toggleRow(flow.id)}
                    style={{
                      cursor: 'pointer',
                      background: selected.has(flow.id) ? 'var(--color-surface-alt, #f0f9ff)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '0.45rem 0.5rem', borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
                      <input
                        type="checkbox"
                        checked={selected.has(flow.id)}
                        onChange={() => toggleRow(flow.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`選取 ${flow.name}`}
                      />
                    </td>
                    <td style={{ padding: '0.45rem 0.5rem', borderBottom: '1px solid var(--color-border, #e5e7eb)', fontWeight: 500 }}>
                      {flow.name}
                    </td>
                    <td style={{ padding: '0.45rem 0.5rem', borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
                      <code style={{ fontSize: '0.78rem', color: 'var(--color-muted, #6b7280)' }}>{flow.id}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {submitError && (
            <p style={{ color: 'var(--color-error, #dc2626)', fontSize: '0.8125rem', marginTop: '0.75rem' }}>
              {submitError}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid var(--color-border, #e5e7eb)',
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
              fontSize: '0.875rem',
              borderRadius: '0.375rem',
              border: '1px solid var(--color-border, #e5e7eb)',
              background: 'transparent',
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            取消
          </button>
          <button
            onClick={handleAssign}
            disabled={submitting || selected.size === 0}
            style={{
              padding: '0.4375rem 0.875rem',
              fontSize: '0.875rem',
              borderRadius: '0.375rem',
              border: 'none',
              background: 'var(--color-accent, #2563eb)',
              color: '#fff',
              cursor: submitting || selected.size === 0 ? 'not-allowed' : 'pointer',
              opacity: submitting || selected.size === 0 ? 0.5 : 1,
            }}
          >
            {submitting ? '指派中…' : `指派${selected.size > 0 ? `（${selected.size}）` : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}

interface FlowAssignIslandProps {
  policyId: string
}

export function FlowAssignIsland({ policyId }: FlowAssignIslandProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '0.375rem 0.875rem',
          fontSize: '0.8125rem',
          borderRadius: '0.375rem',
          border: '1px solid var(--admin-border, #e5e7eb)',
          background: 'transparent',
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        指派至工作流程
      </button>
      {open && (
        <FlowAssignModalInner
          policyId={policyId}
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
