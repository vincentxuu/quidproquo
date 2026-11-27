import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { STEP_COLORS, STEP_COLOR_FALLBACK, STEP_HANDLE, STEP_ON_COLOR } from './step-fields'
import type { BuilderNodeData } from './types'

export const StepNode = memo(function StepNode({ data, selected }: NodeProps) {
  const d = data as unknown as BuilderNodeData
  const color = STEP_COLORS[d.stepType as keyof typeof STEP_COLORS] ?? STEP_COLOR_FALLBACK
  return (
    <div
      style={{
        background: color,
        color: STEP_ON_COLOR,
        padding: '8px 14px',
        borderRadius: 'var(--corner-md)',
        minWidth: '130px',
        fontSize: 'var(--fs-xs)',
        boxShadow: selected
          ? `0 0 0 2px var(--bg-card), 0 0 0 4px ${color}, var(--shadow-raised)`
          : 'var(--shadow-floating)',
        userSelect: 'none',
        transition: 'box-shadow 0.15s ease',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: STEP_HANDLE }} />
      <div style={{ fontSize: 'var(--fs-2xs)', textTransform: 'uppercase', opacity: 0.75, marginBottom: '2px', letterSpacing: '0.06em' }}>
        {d.stepType.replace(/_/g, ' ')}
      </div>
      <div style={{ fontWeight: 600, fontSize: 'var(--fs-xs)' }}>{d.stepId}</div>
      <Handle type="source" position={Position.Bottom} style={{ background: STEP_HANDLE }} />
    </div>
  )
})
