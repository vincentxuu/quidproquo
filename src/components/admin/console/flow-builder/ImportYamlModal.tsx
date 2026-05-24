import { useState } from 'react'
import type { BuilderNode, BuilderEdge } from './types'

interface ImportYamlModalProps {
  onImport: (nodes: BuilderNode[], edges: BuilderEdge[]) => void
  onClose: () => void
}

export function ImportYamlModal({ onImport, onClose }: ImportYamlModalProps) {
  const [yaml, setYaml] = useState('')
  const [errors, setErrors] = useState<{ path: string; message: string }[]>([])
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setErrors([])
    setLoading(true)
    try {
      const res = await fetch('/api/admin/flows/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yaml }),
      })
      const data = await res.json() as { valid: boolean; errors?: { path: string; message: string }[] }
      if (!data.valid) {
        setErrors(data.errors ?? [{ path: '(unknown)', message: '驗證失敗' }])
        return
      }
      const { yamlToDag } = await import('@/lib/agent-flow/dsl/yaml-to-dag')
      const dag = yamlToDag(yaml)
      onImport(dag.nodes as BuilderNode[], dag.edges as BuilderEdge[])
      onClose()
    } catch (err) {
      setErrors([{ path: '(parse)', message: String(err) }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius)', padding: '20px', width: '480px', maxWidth: '90vw', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--admin-text)' }}>匯入 YAML</h3>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-muted)' }}>
          貼入 YAML 後點「確認匯入」。<strong>此操作將覆蓋目前畫布。</strong>
        </p>
        <textarea
          value={yaml}
          onChange={e => setYaml(e.target.value)}
          rows={14}
          style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '12px', padding: '8px', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-xs)', resize: 'vertical', background: 'var(--admin-bg)', color: 'var(--admin-text)', outline: 'none' }}
          placeholder="id: my-flow&#10;name: My Flow&#10;version: 1&#10;steps:&#10;  - id: step1&#10;    type: agent&#10;    agent: planner&#10;edges: []"
          spellCheck={false}
        />
        {errors.length > 0 && (
          <div style={{ background: '#fef3f2', border: '1px solid #fca5a5', borderRadius: 'var(--admin-radius-xs)', padding: '8px 10px', fontSize: '11px', color: 'var(--admin-danger)' }}>
            {errors.map((e, i) => <div key={i}><strong>{e.path}</strong>: {e.message}</div>)}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onClose} style={{ padding: '6px 14px', background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-xs)', fontSize: '12px', cursor: 'pointer', color: 'var(--admin-text)' }}>取消</button>
          <button
            onClick={handleConfirm}
            disabled={!yaml.trim() || loading}
            style={{ padding: '6px 14px', background: loading || !yaml.trim() ? 'var(--admin-border)' : 'var(--brand-900)', border: 'none', borderRadius: 'var(--admin-radius-xs)', fontSize: '12px', fontWeight: 600, color: '#fff', cursor: loading || !yaml.trim() ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '驗證中…' : '確認匯入'}
          </button>
        </div>
      </div>
    </div>
  )
}
