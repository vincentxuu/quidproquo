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
      if (!res.ok) {
        setErrors([{ path: '(server)', message: `驗證請求失敗 (${res.status})` }])
        return
      }
      const data = await res.json() as { valid: boolean; errors?: { path: string; message: string }[] }
      if (!data.valid) {
        setErrors(data.errors ?? [{ path: '(unknown)', message: '驗證失敗' }])
        return
      }
      const { yamlToDag } = await import('@/lib/flow/dsl/yaml-to-dag')
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
    <div style={{ position: 'fixed', inset: 0, background: 'var(--scrim)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--corner-md)', padding: '20px', width: '480px', maxWidth: '90vw', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--text-primary)' }}>匯入 YAML</h3>
        <p style={{ margin: 0, fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)' }}>
          貼入 YAML 後點「確認匯入」。<strong>此操作將覆蓋目前畫布。</strong>
        </p>
        <textarea
          value={yaml}
          onChange={e => setYaml(e.target.value)}
          rows={14}
          style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 'var(--fs-xs)', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--corner-sm)', resize: 'vertical', background: 'var(--bg-subtle)', color: 'var(--text-primary)', outline: 'none' }}
          placeholder="id: my-flow&#10;name: My Flow&#10;version: 1&#10;steps:&#10;  - id: step1&#10;    type: agent&#10;    agent: planner&#10;edges: []"
          spellCheck={false}
        />
        {errors.length > 0 && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid color-mix(in srgb, var(--danger) 28%, transparent)', borderRadius: 'var(--corner-sm)', padding: '8px 10px', fontSize: 'var(--fs-xs)', color: 'var(--danger)' }}>
            {errors.map((e, i) => <div key={i}><strong>{e.path}</strong>: {e.message}</div>)}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onClose} style={{ padding: '6px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--corner-sm)', fontSize: 'var(--fs-xs)', cursor: 'pointer', color: 'var(--text-primary)' }}>取消</button>
          <button
            onClick={handleConfirm}
            disabled={!yaml.trim() || loading}
            style={{ padding: '6px 14px', background: loading || !yaml.trim() ? 'var(--border)' : 'var(--brand-700)', border: 'none', borderRadius: 'var(--corner-sm)', fontSize: 'var(--fs-xs)', fontWeight: 600, color: 'var(--text-on-solid)', cursor: loading || !yaml.trim() ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '驗證中…' : '確認匯入'}
          </button>
        </div>
      </div>
    </div>
  )
}
