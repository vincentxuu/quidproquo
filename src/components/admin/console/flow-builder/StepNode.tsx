import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { STEP_COLORS } from './step-fields'
import type { BuilderNodeData } from './types'

export const StepNode = memo(function StepNode({ data, selected }: NodeProps) {
  const d = data as unknown as BuilderNodeData
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
