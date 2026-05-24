# Flow Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the raw-YAML-textarea editor at `/admin/console/flows/[id]/edit` with a canvas-first visual flow builder — ReactFlow DAG as source of truth, grouped node palette, click-to-edit properties sidebar, and read-only YAML preview.

**Architecture:** A new `flow-builder/` React component directory assembles the builder from focused sub-components (`NodePalette`, `StepNode`, `PropertiesPanel`, `ImportYamlModal`). The top-level `FlowBuilder` holds all React state; on save it calls `dagToYaml()` and POSTs to the existing API. The Astro page `edit.astro` mounts `FlowBuilder` via `client:only="react"`.

**Tech Stack:** React 18, `@xyflow/react` (already installed), `yaml` lib (already installed via `yaml-to-dag.ts`), Vitest for pure-function tests, Astro for the page shell.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/components/admin/console/flow-builder/types.ts` | Shared types: `BuilderNode`, `BuilderEdge`, `StepGroup` |
| Create | `src/components/admin/console/flow-builder/step-fields.ts` | `STEP_GROUPS`, `STEP_TOOLTIPS`, `fieldsForStepType()` — pure data, no React |
| Create | `src/components/admin/console/flow-builder/step-fields.test.ts` | Vitest: all 9 types covered, no missing fields |
| Create | `src/components/admin/console/flow-builder/StepNode.tsx` | ReactFlow custom node renderer |
| Create | `src/components/admin/console/flow-builder/NodePalette.tsx` | Left palette: 4 groups, drag + click to add |
| Create | `src/components/admin/console/flow-builder/PropertiesPanel.tsx` | Right sidebar: per-type form + YAML tab |
| Create | `src/components/admin/console/flow-builder/ImportYamlModal.tsx` | Modal: paste YAML → validate → replace canvas |
| Create | `src/components/admin/console/flow-builder/FlowBuilder.tsx` | Top-level: holds state, composes layout |
| Modify | `src/pages/admin/console/flows/[id]/edit.astro` | Mount `FlowBuilder` instead of old `FlowEditorWithPalette` |

---

## Task 1: types.ts and step-fields.ts (foundation)

**Files:**
- Create: `src/components/admin/console/flow-builder/types.ts`
- Create: `src/components/admin/console/flow-builder/step-fields.ts`
- Create: `src/components/admin/console/flow-builder/step-fields.test.ts`

- [ ] **Step 1.1: Write the failing test**

```ts
// src/components/admin/console/flow-builder/step-fields.test.ts
import { describe, it, expect } from 'vitest'
import { fieldsForStepType, STEP_GROUPS, STEP_TOOLTIPS, ALL_STEP_TYPES } from './step-fields'

describe('step-fields', () => {
  it('covers all 9 step types in STEP_GROUPS', () => {
    const allFromGroups = STEP_GROUPS.flatMap(g => g.steps)
    expect(allFromGroups.sort()).toEqual([...ALL_STEP_TYPES].sort())
  })

  it('provides tooltip for every step type', () => {
    for (const type of ALL_STEP_TYPES) {
      expect(STEP_TOOLTIPS[type]).toBeTruthy()
    }
  })

  it('returns field definitions for every step type', () => {
    for (const type of ALL_STEP_TYPES) {
      const fields = fieldsForStepType(type)
      expect(fields.length).toBeGreaterThan(0)
      // every field has a key and label
      for (const f of fields) {
        expect(f.key).toBeTruthy()
        expect(f.label).toBeTruthy()
      }
    }
  })
})
```

- [ ] **Step 1.2: Run test to verify it fails**

```bash
pnpm test src/components/admin/console/flow-builder/step-fields.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 1.3: Create types.ts**

```ts
// src/components/admin/console/flow-builder/types.ts
import type { Node, Edge } from '@xyflow/react'
import type { FlowStep } from '@/lib/agent-flow/dsl/ast'

export interface BuilderNodeData {
  stepId: string
  stepType: string
  label: string
  config: FlowStep
}

// ReactFlow Node with typed data
export type BuilderNode = Node<BuilderNodeData>

// ReactFlow Edge (label holds serialised condition JSON when set)
export type BuilderEdge = Edge
```

- [ ] **Step 1.4: Create step-fields.ts**

```ts
// src/components/admin/console/flow-builder/step-fields.ts

export const ALL_STEP_TYPES = [
  'agent', 'tool_group', 'transform', 'verifier',
  'artifact', 'human_approval', 'sub_flow', 'parallel', 'loop',
] as const

export type StepType = typeof ALL_STEP_TYPES[number]

export interface StepGroup {
  label: string
  color: string
  steps: StepType[]
}

export const STEP_GROUPS: StepGroup[] = [
  { label: 'Execution', color: '#6366f1', steps: ['agent', 'tool_group'] },
  { label: 'Data',      color: '#059669', steps: ['transform', 'artifact'] },
  { label: 'Quality',   color: '#d97706', steps: ['verifier', 'human_approval'] },
  { label: 'Control',   color: '#0284c7', steps: ['sub_flow', 'parallel', 'loop'] },
]

export const STEP_COLORS: Record<StepType, string> = {
  agent:          '#6366f1',
  tool_group:     '#0891b2',
  transform:      '#059669',
  verifier:       '#d97706',
  artifact:       '#dc2626',
  human_approval: '#7c3aed',
  sub_flow:       '#64748b',
  parallel:       '#0284c7',
  loop:           '#65a30d',
}

export const STEP_TOOLTIPS: Record<StepType, string> = {
  agent:          'LLM agent 步驟',
  tool_group:     '工具呼叫群組',
  transform:      '資料轉換步驟',
  verifier:       '結果驗證',
  artifact:       '輸出產物',
  human_approval: '人工審核閘道',
  sub_flow:       '嵌入子工作流程',
  parallel:       '平行分支執行',
  loop:           '迴圈步驟',
}

export interface FieldDef {
  key: string
  label: string
  type: 'text' | 'number' | 'textarea' | 'tags'
  placeholder?: string
  optional?: boolean
}

export function fieldsForStepType(type: StepType): FieldDef[] {
  switch (type) {
    case 'agent':
      return [
        { key: 'agent',       label: 'Agent',       type: 'text',     placeholder: 'planner' },
        { key: 'model',       label: 'Model',       type: 'text',     placeholder: 'claude-sonnet-4', optional: true },
        { key: 'description', label: 'Description', type: 'textarea', optional: true },
        { key: 'retry',       label: 'Retry',       type: 'number',   placeholder: '2', optional: true },
        { key: 'timeout',     label: 'Timeout (ms)',type: 'number',   optional: true },
      ]
    case 'tool_group':
      return [
        { key: 'tools',       label: 'Tools',       type: 'tags',     placeholder: 'search.tavily' },
        { key: 'description', label: 'Description', type: 'textarea', optional: true },
      ]
    case 'transform':
      return [
        { key: 'input_key',   label: 'Input key',   type: 'text' },
        { key: 'output_key',  label: 'Output key',  type: 'text' },
        { key: 'template',    label: 'Template',    type: 'textarea', optional: true },
        { key: 'description', label: 'Description', type: 'textarea', optional: true },
      ]
    case 'verifier':
      return [
        { key: 'agent',       label: 'Agent',       type: 'text',     placeholder: 'verifier' },
        { key: 'criteria',    label: 'Criteria',    type: 'textarea', optional: true },
        { key: 'description', label: 'Description', type: 'textarea', optional: true },
      ]
    case 'artifact':
      return [
        { key: 'artifact_id', label: 'Artifact ID', type: 'text' },
        { key: 'type',        label: 'Type',        type: 'text',     placeholder: 'markdown' },
        { key: 'description', label: 'Description', type: 'textarea', optional: true },
      ]
    case 'human_approval':
      return [
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'assignee',    label: 'Assignee',    type: 'text',     optional: true },
      ]
    case 'sub_flow':
      return [
        { key: 'flow_id',     label: 'Flow ID',     type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea', optional: true },
      ]
    case 'parallel':
      return [
        { key: 'branches',    label: 'Branches (step IDs)', type: 'tags' },
        { key: 'description', label: 'Description', type: 'textarea', optional: true },
      ]
    case 'loop':
      return [
        { key: 'iterator',       label: 'Iterator step',  type: 'text' },
        { key: 'max_iterations', label: 'Max iterations', type: 'number', placeholder: '10' },
        { key: 'exit_condition', label: 'Exit condition', type: 'text',   optional: true },
        { key: 'description',    label: 'Description',    type: 'textarea', optional: true },
      ]
  }
}
```

- [ ] **Step 1.5: Run test to verify it passes**

```bash
pnpm test src/components/admin/console/flow-builder/step-fields.test.ts
```
Expected: PASS (3 tests).

- [ ] **Step 1.6: Commit**

Use `format-commit` skill to generate message, then:
```bash
git add src/components/admin/console/flow-builder/types.ts \
        src/components/admin/console/flow-builder/step-fields.ts \
        src/components/admin/console/flow-builder/step-fields.test.ts
git commit
```

---

## Task 2: StepNode.tsx

**Files:**
- Create: `src/components/admin/console/flow-builder/StepNode.tsx`

- [ ] **Step 2.1: Create StepNode.tsx**

```tsx
// src/components/admin/console/flow-builder/StepNode.tsx
import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { STEP_COLORS } from './step-fields'
import type { BuilderNodeData } from './types'

export const StepNode = memo(function StepNode({ data, selected }: NodeProps) {
  const d = data as BuilderNodeData
  const color = STEP_COLORS[d.stepType as keyof typeof STEP_COLORS] ?? '#64748b'
  return (
    <div
      style={{
        background: color,
        color: '#fff',
        padding: '8px 14px',
        borderRadius: '6px',
        minWidth: '130px',
        fontSize: '12px',
        boxShadow: selected
          ? `0 0 0 2px #fff, 0 0 0 4px ${color}, 0 4px 12px rgba(0,0,0,0.3)`
          : '0 2px 6px rgba(0,0,0,0.25)',
        userSelect: 'none',
        transition: 'box-shadow 0.15s ease',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: 'rgba(255,255,255,0.6)' }} />
      <div style={{ fontSize: '9px', textTransform: 'uppercase', opacity: 0.75, marginBottom: '2px', letterSpacing: '0.06em' }}>
        {d.stepType.replace(/_/g, ' ')}
      </div>
      <div style={{ fontWeight: 600, fontSize: '12px' }}>{d.stepId}</div>
      <Handle type="source" position={Position.Bottom} style={{ background: 'rgba(255,255,255,0.6)' }} />
    </div>
  )
})
```

- [ ] **Step 2.2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit --skipLibCheck 2>&1 | grep "flow-builder"
```
Expected: no errors from flow-builder files.

- [ ] **Step 2.3: Commit**

```bash
git add src/components/admin/console/flow-builder/StepNode.tsx
git commit
```

---

## Task 3: NodePalette.tsx

**Files:**
- Create: `src/components/admin/console/flow-builder/NodePalette.tsx`

- [ ] **Step 3.1: Create NodePalette.tsx**

```tsx
// src/components/admin/console/flow-builder/NodePalette.tsx
import { STEP_GROUPS, STEP_TOOLTIPS, STEP_COLORS, type StepType } from './step-fields'

interface NodePaletteProps {
  onAddStep: (type: StepType) => void
}

export function NodePalette({ onAddStep }: NodePaletteProps) {
  return (
    <div
      style={{
        width: '128px',
        flexShrink: 0,
        background: 'var(--admin-bg)',
        borderRight: '1px solid var(--admin-border)',
        padding: '10px 6px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}
    >
      {STEP_GROUPS.map(group => (
        <div key={group.label}>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: group.color,
              padding: '6px 4px 3px',
            }}
          >
            {group.label}
          </div>
          {group.steps.map(type => (
            <div
              key={type}
              title={STEP_TOOLTIPS[type]}
              draggable
              onClick={() => onAddStep(type)}
              onDragStart={e => {
                e.dataTransfer.setData('application/flow-builder-step-type', type)
                e.dataTransfer.effectAllowed = 'copy'
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '5px 6px',
                borderRadius: '4px',
                cursor: 'grab',
                userSelect: 'none',
                marginBottom: '1px',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--admin-muted)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: STEP_COLORS[type],
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--admin-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {type}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3.2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit --skipLibCheck 2>&1 | grep "flow-builder"
```
Expected: no errors.

- [ ] **Step 3.3: Commit**

```bash
git add src/components/admin/console/flow-builder/NodePalette.tsx
git commit
```

---

## Task 4: PropertiesPanel.tsx

**Files:**
- Create: `src/components/admin/console/flow-builder/PropertiesPanel.tsx`

- [ ] **Step 4.1: Create PropertiesPanel.tsx**

```tsx
// src/components/admin/console/flow-builder/PropertiesPanel.tsx
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
  // Local draft of config fields (string values for all inputs)
  const [draft, setDraft] = useState<Record<string, string>>({})

  // Sync draft when selected node changes
  useEffect(() => {
    if (!node) return
    const next: Record<string, string> = {}
    for (const [k, v] of Object.entries(node.data.config)) {
      if (k === 'id' || k === 'type') continue
      next[k] = Array.isArray(v) ? (v as string[]).join(', ') : String(v ?? '')
    }
    setDraft(next)
    setTab('props')
  }, [node?.id])

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
    const updated: FlowStep = { id: stepId, type: stepType }
    for (const field of fields) {
      const raw = draft[field.key] ?? ''
      if (!raw && field.optional) continue
      if (field.type === 'number') {
        const n = Number(raw)
        if (!Number.isNaN(n)) updated[field.key] = n
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
      {/* Header */}
      <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text)' }}>{stepId}</span>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {tab === 'props' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Step ID — read-only */}
            <div>
              <label style={labelStyle}>Step ID</label>
              <div style={{ ...inputStyle, color: 'var(--admin-text-muted)', fontFamily: 'monospace', fontSize: '11px' }}>{stepId}</div>
            </div>
            {/* Dynamic fields */}
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

      {/* Footer */}
      {tab === 'props' && (
        <div style={{ padding: '8px 10px', borderTop: '1px solid var(--admin-border)', display: 'flex', gap: '6px' }}>
          <button onClick={handleApply} style={{ flex: 1, ...primaryBtnStyle }}>套用</button>
          <button onClick={() => onDelete(node.id)} style={{ ...dangerBtnStyle }}>刪除</button>
        </div>
      )}
    </div>
  )
}

// ── shared styles ──────────────────────────────────────────────────────────────

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
```

- [ ] **Step 4.2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit --skipLibCheck 2>&1 | grep "flow-builder"
```
Expected: no errors.

- [ ] **Step 4.3: Commit**

```bash
git add src/components/admin/console/flow-builder/PropertiesPanel.tsx
git commit
```

---

## Task 5: ImportYamlModal.tsx

**Files:**
- Create: `src/components/admin/console/flow-builder/ImportYamlModal.tsx`

- [ ] **Step 5.1: Create ImportYamlModal.tsx**

```tsx
// src/components/admin/console/flow-builder/ImportYamlModal.tsx
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
      // Validate against existing endpoint
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
      // Parse to DAG
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
          <div style={{ background: 'var(--admin-color-danger-soft)', border: '1px solid #fca5a5', borderRadius: 'var(--admin-radius-xs)', padding: '8px 10px', fontSize: '11px', color: 'var(--admin-danger)' }}>
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
```

- [ ] **Step 5.2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit --skipLibCheck 2>&1 | grep "flow-builder"
```
Expected: no errors.

- [ ] **Step 5.3: Commit**

```bash
git add src/components/admin/console/flow-builder/ImportYamlModal.tsx
git commit
```

---

## Task 6: FlowBuilder.tsx (top-level assembly)

**Files:**
- Create: `src/components/admin/console/flow-builder/FlowBuilder.tsx`

- [ ] **Step 6.1: Create FlowBuilder.tsx**

```tsx
// src/components/admin/console/flow-builder/FlowBuilder.tsx
import { useCallback, useState, useRef } from 'react'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  MiniMap,
  type Connection,
  type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { dagToYaml, type FlowMeta } from '@/lib/agent-flow/dsl/dag-to-yaml'
import type { FlowStep } from '@/lib/agent-flow/dsl/ast'
import type { BuilderNode, BuilderEdge } from './types'
import { StepNode } from './StepNode'
import { NodePalette } from './NodePalette'
import { PropertiesPanel } from './PropertiesPanel'
import { ImportYamlModal } from './ImportYamlModal'
import type { StepType } from './step-fields'

const nodeTypes: NodeTypes = { step: StepNode }

export interface FlowBuilderProps {
  initialNodes: BuilderNode[]
  initialEdges: BuilderEdge[]
  meta: FlowMeta
  flowId: string
}

export function FlowBuilder({ initialNodes, initialEdges, meta, flowId }: FlowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<BuilderNode>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<BuilderEdge>(initialEdges)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const lastSavedYaml = useRef<string>('')

  const selectedNode = nodes.find(n => n.id === selectedId) ?? null

  const onConnect = useCallback(
    (connection: Connection) => setEdges(eds => addEdge(connection, eds)),
    [setEdges],
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: BuilderNode) => {
    setSelectedId(node.id)
  }, [])

  const onPaneClick = useCallback(() => setSelectedId(null), [])

  // Add a step from palette (click or drop)
  function addStep(type: StepType, position?: { x: number; y: number }) {
    const id = `${type}-${Date.now()}`
    const newNode: BuilderNode = {
      id,
      type: 'step',
      position: position ?? { x: 80 + Math.random() * 120, y: 80 + Math.random() * 120 },
      data: { stepId: id, stepType: type, label: id, config: { id, type } },
    }
    setNodes(ns => [...ns, newNode])
    setSelectedId(id)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const type = e.dataTransfer.getData('application/flow-builder-step-type') as StepType
    if (!type) return
    const bounds = e.currentTarget.getBoundingClientRect()
    addStep(type, { x: e.clientX - bounds.left, y: e.clientY - bounds.top })
  }

  function handleUpdateNode(nodeId: string, config: FlowStep) {
    setNodes(ns => ns.map(n =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, config, stepId: String(config.id ?? n.data.stepId), label: String(config.id ?? n.data.stepId) } }
        : n,
    ))
  }

  function handleDeleteNode(nodeId: string) {
    setNodes(ns => ns.filter(n => n.id !== nodeId))
    setEdges(es => es.filter(e => e.source !== nodeId && e.target !== nodeId))
    setSelectedId(null)
  }

  async function handleSave() {
    setSaveStatus('saving')
    try {
      const dagNodes = nodes.map(n => ({
        id: n.id,
        type: n.data.stepType,
        position: n.position,
        data: n.data,
      }))
      const dagEdges = edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: typeof e.label === 'string' ? e.label : undefined,
      }))
      const yaml = dagToYaml(dagNodes, dagEdges, meta)
      const res = await fetch(`/api/admin/flows/${flowId}/version`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yaml }),
      })
      const data = await res.json() as { version?: number; error?: string }
      if (res.ok) {
        lastSavedYaml.current = yaml
        setSaveStatus('saved')
        setTimeout(() => { window.location.href = `/admin/console/flows/${flowId}` }, 800)
      } else {
        setSaveStatus('error')
        console.error('Save failed:', data.error)
      }
    } catch (err) {
      setSaveStatus('error')
      console.error(err)
    }
  }

  function handleImport(importedNodes: BuilderNode[], importedEdges: BuilderEdge[]) {
    setNodes(importedNodes)
    setEdges(importedEdges)
    setSelectedId(null)
  }

  const isDirty = saveStatus === 'idle'
  const saveLabel = saveStatus === 'saving' ? '儲存中…' : saveStatus === 'saved' ? '已儲存' : '儲存'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 12px',
        background: 'var(--admin-surface)',
        borderBottom: '1px solid var(--admin-border)',
        flexShrink: 0,
        gap: '8px',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a href="/admin/console/flows" style={{ color: 'var(--admin-text-muted)', fontSize: '12px', textDecoration: 'none' }}>← 工作流程</a>
          <span style={{ color: 'var(--admin-border)' }}>/</span>
          <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--admin-text)' }}>{meta.name}</span>
          <span style={{ fontSize: '10px', background: 'var(--admin-muted)', color: 'var(--admin-accent)', padding: '1px 6px', borderRadius: '3px' }}>v{meta.version}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button onClick={() => setShowImport(true)} style={secondaryBtn}>匯入 YAML</button>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving' || saveStatus === 'saved'}
            style={{ ...primaryBtn, opacity: saveStatus === 'saving' || saveStatus === 'saved' ? 0.7 : 1 }}
          >
            {saveLabel}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <NodePalette onAddStep={addStep} />

        {/* Canvas */}
        <div
          style={{ flex: 1, position: 'relative' }}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>

        <PropertiesPanel
          node={selectedNode}
          onUpdate={handleUpdateNode}
          onDelete={handleDeleteNode}
        />
      </div>

      {showImport && (
        <ImportYamlModal onImport={handleImport} onClose={() => setShowImport(false)} />
      )}
    </div>
  )
}

const primaryBtn: React.CSSProperties = {
  background: 'var(--brand-900)',
  border: 'none',
  borderRadius: 'var(--admin-radius-xs)',
  color: '#fff',
  padding: '5px 14px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
}

const secondaryBtn: React.CSSProperties = {
  background: 'var(--admin-surface)',
  border: '1px solid var(--admin-border)',
  borderRadius: 'var(--admin-radius-xs)',
  color: 'var(--admin-text)',
  padding: '5px 10px',
  fontSize: '12px',
  cursor: 'pointer',
}
```

- [ ] **Step 6.2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit --skipLibCheck 2>&1 | grep "flow-builder"
```
Expected: no errors.

- [ ] **Step 6.3: Commit**

```bash
git add src/components/admin/console/flow-builder/FlowBuilder.tsx
git commit
```

---

## Task 7: Update edit.astro

**Files:**
- Modify: `src/pages/admin/console/flows/[id]/edit.astro`

- [ ] **Step 7.1: Replace the page content**

Replace the entire content of `src/pages/admin/console/flows/[id]/edit.astro` with:

```astro
---
export const prerender = false;
import AdminConsoleLayout from '@/layouts/AdminConsoleLayout.astro';
import AdminState from '@/components/admin/AdminState.astro';
import { FlowBuilder } from '@/components/admin/console/flow-builder/FlowBuilder';
import { getEnv } from '@/lib/config/env';
import { loadFlowDetail } from '@/lib/agent-console/flow-detail';
import { flowDefinitionToDag } from '@/lib/agent-flow/dsl/yaml-to-dag';
import { ensureConsoleUmbrella, isPageEnabled, consolePhaseFor } from '../../_guard';

const gate = ensureConsoleUmbrella();
if (gate) return gate;

const ready = isPageEnabled('flowEditor');
const flowId = Astro.params.id ?? '';

let initialNodesJson = '[]';
let initialEdgesJson = '[]';
let metaJson = '{}';
let flowName = flowId;
let loadError = false;

if (ready && flowId) {
  try {
    const detail = await loadFlowDetail(getEnv().DB, flowId);
    if (detail) {
      const def = detail.definition;
      flowName = def.name;
      const dag = flowDefinitionToDag(def);
      initialNodesJson = JSON.stringify(dag.nodes);
      initialEdgesJson = JSON.stringify(dag.edges);
      metaJson = JSON.stringify({
        id: def.id,
        name: def.name,
        version: def.version,
        description: def.description ?? '',
        inputs: def.inputs ?? [],
        artifacts: def.artifacts ?? [],
        artifactBindings: def.artifactBindings,
        durable: def.durable,
        retry: def.retry,
        timeout: def.timeout,
      });
    }
  } catch {
    loadError = true;
  }
}

const breadcrumb = [
  { label: '工作流程', href: '/admin/console/flows' },
  { label: flowName, href: `/admin/console/flows/${flowId}` },
  { label: '編輯' },
];
---

<AdminConsoleLayout title="編輯工作流程" section="flows" breadcrumb={breadcrumb}>
  {!ready && (
    <AdminState tone="empty">{`The flow editor ships in ${consolePhaseFor('flowEditor')}.`}</AdminState>
  )}
  {ready && loadError && <AdminState tone="error">無法載入工作流程。</AdminState>}
  {ready && !loadError && (
    <div class="builder-wrap">
      <FlowBuilder
        initialNodes={JSON.parse(initialNodesJson)}
        initialEdges={JSON.parse(initialEdgesJson)}
        meta={JSON.parse(metaJson)}
        flowId={flowId}
        client:only="react"
      />
    </div>
  )}
</AdminConsoleLayout>

<style>
  .builder-wrap {
    height: calc(100vh - 100px);
    display: flex;
    flex-direction: column;
    border: 1px solid var(--admin-border);
    border-radius: var(--admin-radius);
    overflow: hidden;
  }
</style>
```

- [ ] **Step 7.2: Also update the "編輯 YAML" link on the detail page**

In `src/pages/admin/console/flows/[id]/index.astro`, find and update the edit link text:

```astro
<!-- Change: -->
<a href={`/admin/console/flows/${flowId}/edit`} class="btn-edit">編輯 YAML</a>
<!-- To: -->
<a href={`/admin/console/flows/${flowId}/edit`} class="btn-edit">編輯</a>
```

- [ ] **Step 7.3: Run type check on modified files**

```bash
pnpm exec tsc --noEmit --skipLibCheck 2>&1 | head -30
```
Expected: no new errors (pre-existing errors in unrelated files are OK).

- [ ] **Step 7.4: Start dev server and manually test**

```bash
pnpm dev
```

Open `http://localhost:4321/admin/console/flows` (sign in if needed), click a flow, click 編輯.

Verify:
1. Flow builder renders — left palette shows 4 groups, canvas shows nodes from the flow
2. Drag a step from palette → node appears on canvas
3. Click a node → right sidebar opens with 屬性 tab showing correct fields for that step type
4. Edit a field, click 套用 → node label updates
5. Switch to YAML tab → step YAML shown, copy button works
6. Click 匯入 YAML → modal opens, paste valid YAML → canvas replaces
7. Click 儲存 → saves and redirects to detail page

- [ ] **Step 7.5: Commit**

Use `format-commit` skill, then:
```bash
git add src/pages/admin/console/flows/\[id\]/edit.astro \
        src/pages/admin/console/flows/\[id\]/index.astro
git commit
```

---

## Self-Review

**Spec coverage check:**
- ✅ Canvas First — `FlowBuilder.tsx` holds DAG state, `dagToYaml` called only on save
- ✅ Grouped palette (Execution/Data/Quality/Control) — `NodePalette.tsx` + `step-fields.ts`
- ✅ Drag from palette → canvas — `onDragStart` in `NodePalette`, `handleDrop` in `FlowBuilder`
- ✅ Click to add step — `onAddStep` prop on `NodePalette`
- ✅ Right sidebar — `PropertiesPanel.tsx`, 200px, slides in on node click
- ✅ Per-type form fields — `fieldsForStepType()` covers all 9 types
- ✅ Step ID read-only (safe; edge re-linking is out of scope)
- ✅ YAML tab (read-only, serialize current node config via `stringify`)
- ✅ Import YAML modal — `ImportYamlModal.tsx`, validates via existing `/api/admin/flows/validate`, then `yamlToDag()`
- ✅ Breadcrumb + version badge — in `FlowBuilder` toolbar
- ✅ Unsaved guard — `beforeunload` not explicitly in this plan; **gap**: add it in `FlowBuilder` `useEffect`

**Gap fix — beforeunload guard** (add to `FlowBuilder.tsx` inside the component, after state declarations):

```tsx
// in FlowBuilder, after useState declarations:
useEffect(() => {
  const handler = (e: BeforeUnloadEvent) => {
    if (saveStatus !== 'saved') {
      e.preventDefault()
      e.returnValue = ''
    }
  }
  window.addEventListener('beforeunload', handler)
  return () => window.removeEventListener('beforeunload', handler)
}, [saveStatus])
```

Add this step to Task 6 before the commit — add it to `FlowBuilder.tsx` after the `const isDirty` line.

**Type consistency check:** `BuilderNode` and `BuilderEdge` defined in `types.ts` and used consistently across all components. `DagNode`/`DagEdge` from `yaml-to-dag.ts` are widened to `BuilderNode`/`BuilderEdge` in `ImportYamlModal` via cast — acceptable since `DagNode` satisfies `BuilderNode`'s shape.
