import { useState, useEffect } from 'react'
import { stringify } from 'yaml'
import { fieldsForStepType, STEP_COLORS, type StepType } from './step-fields'
import type { BuilderNode } from './types'
import type { FlowStep } from '@/lib/agent-flow/dsl/ast'

interface PropertiesPanelProps {
  node: BuilderNode | null
  onUpdate: (nodeId: string, config: FlowStep) => void
  onDelete: (nodeId: string) => void
}

export function PropertiesPanel({ node, onUpdate, onDelete }: PropertiesPanelProps) {
  const [tab, setTab] = useState<'props' | 'yaml'>('props')
  const [draft, setDraft] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!node) return
    const next: Record<string, string> = {}
    for (const [k, v] of Object.entries(node.data.config)) {
      if (k === 'id' || k === 'type') continue
      next[k] = Array.isArray(v) ? (v as string[]).join(', ') : String(v ?? '')
    }
    setDraft(next)
    setTab('props')
  }, [node])

  if (!node) {
    return (
      <div style={panelStyle}>
        <div style={{ padding: '20px 12px', color: 'var(--admin-text-muted)', fontSize: '12px', textAlign: 'center' }}>
          點選節點來編輯屬性
        </div>
      </div>
    )
  }

  const { stepType, stepId } = node.data
  const color = STEP_COLORS[stepType as StepType] ?? '#64748b'
  const fields = fieldsForStepType(stepType as StepType)

  function handleApply() {
    if (!node) return
    const updated: FlowStep = { id: stepId, type: stepType }
    for (const field of fields) {
      const raw = draft[field.key] ?? ''
      if (!raw && field.optional) continue
      if (field.type === 'number') {
        const trimmed = raw.trim()
        if (trimmed !== '') {
          const n = Number(trimmed)
          if (!Number.isNaN(n)) updated[field.key] = n
        }
      } else if (field.type === 'tags') {
        updated[field.key] = raw.split(',').map(s => s.trim()).filter(Boolean)
      } else {
        if (raw) updated[field.key] = raw
      }
    }
    onUpdate(node.id, updated)
  }

  const yamlPreview = (() => {
    try { return stringify(node.data.config, { sortMapEntries: true, lineWidth: 60 }) } catch { return '' }
  })()

  return (
    <div style={panelStyle}>
      <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text)' }}>{stepId}</span>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--admin-border)' }}>
        {(['props', 'yaml'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: '5px',
              fontSize: '10px',
              fontWeight: 600,
              background: 'transparent',
              border: 'none',
              borderBottom: tab === t ? `2px solid ${color}` : '2px solid transparent',
              color: tab === t ? color : 'var(--admin-text-muted)',
              cursor: 'pointer',
            }}
          >
            {t === 'props' ? '屬性' : 'YAML'}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {tab === 'props' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <label style={labelStyle}>Step ID</label>
              <div style={{ ...inputStyle, color: 'var(--admin-text-muted)', fontFamily: 'monospace', fontSize: '11px' }}>{stepId}</div>
            </div>
            {fields.map(field => (
              <div key={field.key}>
                <label style={labelStyle}>{field.label}{field.optional ? '' : ' *'}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={draft[field.key] ?? ''}
                    onChange={e => setDraft(d => ({ ...d, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  />
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={draft[field.key] ?? ''}
                    onChange={e => setDraft(d => ({ ...d, [field.key]: e.target.value }))}
                    placeholder={field.type === 'tags' ? 'a, b, c (逗號分隔)' : field.placeholder}
                    style={inputStyle}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'yaml' && (
          <div>
            <pre style={{ margin: 0, fontSize: '10px', lineHeight: 1.6, color: 'var(--admin-text)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {yamlPreview}
            </pre>
            <button
              onClick={() => navigator.clipboard.writeText(yamlPreview)}
              style={{ marginTop: '8px', ...secondaryBtnStyle }}
            >
              複製
            </button>
          </div>
        )}
      </div>

      {tab === 'props' && (
        <div style={{ padding: '8px 10px', borderTop: '1px solid var(--admin-border)', display: 'flex', gap: '6px' }}>
          <button onClick={handleApply} style={{ flex: 1, ...primaryBtnStyle }}>套用</button>
          <button onClick={() => onDelete(node.id)} style={{ ...dangerBtnStyle }}>刪除</button>
        </div>
      )}
    </div>
  )
}

const panelStyle: React.CSSProperties = {
  width: '200px',
  flexShrink: 0,
  background: 'var(--admin-bg)',
  borderLeft: '1px solid var(--admin-border)',
  display: 'flex',
  flexDirection: 'column',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '9px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--admin-text-muted)',
  marginBottom: '3px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'var(--admin-surface)',
  border: '1px solid var(--admin-border)',
  borderRadius: 'var(--admin-radius-xs)',
  padding: '4px 7px',
  fontSize: '11px',
  color: 'var(--admin-text)',
  outline: 'none',
}

const primaryBtnStyle: React.CSSProperties = {
  background: 'var(--brand-900)',
  border: 'none',
  borderRadius: 'var(--admin-radius-xs)',
  color: '#fff',
  padding: '5px 10px',
  fontSize: '11px',
  fontWeight: 600,
  cursor: 'pointer',
}

const secondaryBtnStyle: React.CSSProperties = {
  background: 'var(--admin-surface)',
  border: '1px solid var(--admin-border)',
  borderRadius: 'var(--admin-radius-xs)',
  color: 'var(--admin-text)',
  padding: '4px 8px',
  fontSize: '11px',
  cursor: 'pointer',
}

const dangerBtnStyle: React.CSSProperties = {
  background: 'var(--admin-surface)',
  border: '1px solid var(--admin-border)',
  borderRadius: 'var(--admin-radius-xs)',
  color: 'var(--admin-danger)',
  padding: '5px 8px',
  fontSize: '11px',
  cursor: 'pointer',
}
