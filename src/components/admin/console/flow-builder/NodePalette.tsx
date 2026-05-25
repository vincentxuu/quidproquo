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
