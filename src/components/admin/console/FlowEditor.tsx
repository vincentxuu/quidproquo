import { useCallback, useState, useEffect, useRef } from 'react'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { dagToYaml, type FlowMeta } from '@/lib/agent-flow/dsl/dag-to-yaml'

// ── types ─────────────────────────────────────────────────────────────────────

type StepType =
  | 'agent'
  | 'tool_group'
  | 'transform'
  | 'verifier'
  | 'artifact'
  | 'human_approval'
  | 'sub_flow'
  | 'parallel'
  | 'loop'

export const STEP_TYPES: StepType[] = [
  'agent',
  'tool_group',
  'transform',
  'verifier',
  'artifact',
  'human_approval',
  'sub_flow',
  'parallel',
  'loop',
]

// Minimal FlowDefinition shape (ast.ts types, inlined to avoid missing module)
interface FlowEdgeDef {
  from: string
  to: string
  condition?: unknown
}

interface FlowStepDef {
  id: string
  type: string
  [key: string]: unknown
}

interface FlowDefinition {
  id: string
  name: string
  version: number
  description?: string
  steps: FlowStepDef[]
  edges: FlowEdgeDef[]
  inputs?: unknown[]
  artifacts?: unknown[]
  artifactBindings?: unknown
  durable?: boolean
  retry?: unknown
  timeout?: number
}

// ── colors ────────────────────────────────────────────────────────────────────

export const STEP_COLORS: Record<string, string> = {
  agent: '#6366f1',
  tool_group: '#0891b2',
  transform: '#059669',
  verifier: '#d97706',
  artifact: '#dc2626',
  human_approval: '#7c3aed',
  sub_flow: '#64748b',
  parallel: '#0284c7',
  loop: '#65a30d',
}

// ── DAG conversion ────────────────────────────────────────────────────────────

function flowDefinitionToNodes(definition: FlowDefinition): Node[] {
  // Compute layers via topological BFS for automatic layout
  const successors = new Map<string, string[]>()
  for (const s of definition.steps) successors.set(s.id, [])
  for (const e of definition.edges) {
    successors.get(e.from)?.push(e.to)
  }

  const predecessorCount = new Map<string, number>()
  for (const s of definition.steps) predecessorCount.set(s.id, 0)
  for (const e of definition.edges) {
    predecessorCount.set(e.to, (predecessorCount.get(e.to) ?? 0) + 1)
  }

  const queue: string[] = []
  for (const [id, count] of predecessorCount) {
    if (count === 0) queue.push(id)
  }

  const layerOf = new Map<string, number>()
  let head = 0
  while (head < queue.length) {
    const id = queue[head++]
    const layer = layerOf.get(id) ?? 0
    for (const succ of successors.get(id) ?? []) {
      const newLayer = Math.max(layerOf.get(succ) ?? 0, layer + 1)
      layerOf.set(succ, newLayer)
      predecessorCount.set(succ, (predecessorCount.get(succ) ?? 1) - 1)
      if ((predecessorCount.get(succ) ?? 0) <= 0) queue.push(succ)
    }
  }

  for (const s of definition.steps) {
    if (!layerOf.has(s.id)) layerOf.set(s.id, 0)
  }

  const byLayer = new Map<number, string[]>()
  for (const [id, layer] of layerOf) {
    if (!byLayer.has(layer)) byLayer.set(layer, [])
    byLayer.get(layer)!.push(id)
  }

  return definition.steps.map(step => {
    const layer = layerOf.get(step.id) ?? 0
    const siblings = byLayer.get(layer) ?? [step.id]
    const indexInLayer = siblings.indexOf(step.id)
    const x = (indexInLayer - (siblings.length - 1) / 2) * 220
    const y = layer * 120
    return {
      id: step.id,
      type: 'step',
      position: { x, y },
      data: { label: step.id, stepType: step.type },
    }
  })
}

function flowDefinitionToEdges(definition: FlowDefinition): Edge[] {
  return definition.edges.map((e, i) => ({
    id: `e-${i}-${e.from}-${e.to}`,
    source: e.from,
    target: e.to,
    label: e.condition ? JSON.stringify(e.condition).slice(0, 30) : undefined,
  }))
}

// ── StepNode ──────────────────────────────────────────────────────────────────

type StepNodeData = {
  label: string
  stepType: string
}

function StepNode({ data }: NodeProps) {
  const nodeData = data as StepNodeData
  const color = STEP_COLORS[nodeData.stepType] ?? '#64748b'
  return (
    <div
      style={{
        background: color,
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        minWidth: '120px',
        fontSize: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        userSelect: 'none',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div
        style={{
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: '10px',
          opacity: 0.8,
          marginBottom: '2px',
        }}
      >
        {nodeData.stepType.replace(/_/g, ' ')}
      </div>
      <div style={{ fontWeight: 500 }}>{nodeData.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

const nodeTypes: NodeTypes = { step: StepNode }

// ── NodePalette ───────────────────────────────────────────────────────────────

function NodePalette({ onAddNode }: { onAddNode: (type: StepType) => void }) {
  return (
    <div
      style={{
        width: '160px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '8px',
        borderRight: '1px solid #e2e8f0',
        overflowY: 'auto',
        background: '#f8fafc',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#64748b',
          letterSpacing: '0.05em',
          paddingBottom: '4px',
        }}
      >
        Step Types
      </div>
      {STEP_TYPES.map(type => (
        <div
          key={type}
          draggable
          onClick={() => onAddNode(type)}
          onDragStart={e => {
            e.dataTransfer.setData('application/reactflow-step-type', type)
            e.dataTransfer.effectAllowed = 'move'
          }}
          style={{
            background: STEP_COLORS[type],
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'grab',
            fontWeight: 500,
          }}
        >
          {type.replace(/_/g, ' ')}
        </div>
      ))}
    </div>
  )
}

// ── FlowEditor ────────────────────────────────────────────────────────────────

export interface FlowEditorProps {
  /** JSON-serialized FlowDefinition */
  definitionJson: string
  onValidate?: (yaml: string) => Promise<{ errors: { path: string; message: string }[] }>
  onSave?: (yaml: string) => void
  readonly?: boolean
}

// ── ValidationPanel ───────────────────────────────────────────────────────────

interface ValidationError {
  path: string
  message: string
}

function ValidationPanel({ errors }: { errors: ValidationError[] }) {
  if (errors.length === 0) return null
  return (
    <div
      className="validation-panel"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: '200px',
        overflowY: 'auto',
        background: '#1e1e1e',
        color: '#f44',
        zIndex: 10,
        padding: '8px 12px',
        fontSize: '12px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      }}
    >
      {errors.map((err, i) => (
        <div key={i} className="validation-error" data-path={err.path}>
          {err.path}: {err.message}
        </div>
      ))}
    </div>
  )
}

export function FlowEditor({ definitionJson, onValidate, onSave, readonly }: FlowEditorProps) {
  let definition: FlowDefinition
  try {
    definition = JSON.parse(definitionJson) as FlowDefinition
  } catch {
    return (
      <div style={{ padding: '1rem', color: '#dc2626', fontFamily: 'monospace', fontSize: '13px' }}>
        Invalid flow definition JSON
      </div>
    )
  }

  const initialNodes = flowDefinitionToNodes(definition)
  const initialEdges = flowDefinitionToEdges(definition)

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [validationErrors, setValidationErrors] = useState<{ path: string; message: string }[]>([])
  const [saving, setSaving] = useState(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Build FlowMeta from definition for dagToYaml
  const meta: FlowMeta = {
    id: definition.id,
    name: definition.name,
    version: definition.version,
    description: definition.description,
    inputs: definition.inputs as FlowMeta['inputs'],
    artifacts: definition.artifacts as FlowMeta['artifacts'],
    artifactBindings: definition.artifactBindings as FlowMeta['artifactBindings'],
    durable: definition.durable,
    retry: definition.retry as FlowMeta['retry'],
    timeout: definition.timeout,
  }

  // Debounced validation on nodes/edges change
  useEffect(() => {
    if (!onValidate || readonly) return
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(async () => {
      try {
        // Build DagNode/DagEdge shapes from current ReactFlow nodes/edges
        const dagNodes = nodes.map(n => ({
          id: n.id,
          type: (n.data as { stepType: string }).stepType,
          position: n.position,
          data: {
            stepId: n.id,
            stepType: (n.data as { stepType: string }).stepType,
            label: (n.data as { label: string }).label,
            config: { id: n.id, type: (n.data as { stepType: string }).stepType },
          },
        }))
        const dagEdges = edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: typeof e.label === 'string' ? e.label : undefined,
        }))
        const yaml = dagToYaml(dagNodes, dagEdges, meta)
        const result = await onValidate(yaml)
        setValidationErrors(result.errors)
      } catch {
        // ignore transient errors during editing
      }
    }, 500)
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [nodes, edges])

  const handleSave = useCallback(async () => {
    if (!onSave || saving) return
    setSaving(true)
    try {
      const dagNodes = nodes.map(n => ({
        id: n.id,
        type: (n.data as { stepType: string }).stepType,
        position: n.position,
        data: {
          stepId: n.id,
          stepType: (n.data as { stepType: string }).stepType,
          label: (n.data as { label: string }).label,
          config: { id: n.id, type: (n.data as { stepType: string }).stepType },
        },
      }))
      const dagEdges = edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: typeof e.label === 'string' ? e.label : undefined,
      }))
      const yaml = dagToYaml(dagNodes, dagEdges, meta)
      // Validate first
      if (onValidate) {
        const result = await onValidate(yaml)
        setValidationErrors(result.errors)
        if (result.errors.length > 0) {
          setSaving(false)
          return
        }
      }
      onSave(yaml)
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }, [nodes, edges, onSave, onValidate, saving])

  const onConnect = useCallback(
    (connection: Connection) => {
      if (readonly) return
      setEdges(eds => addEdge(connection, eds))
    },
    [readonly, setEdges],
  )

  const handleAddNode = useCallback(
    (type: StepType) => {
      const id = `${type}-${Date.now()}`
      const newNode: Node = {
        id,
        type: 'step',
        position: { x: 100 + Math.random() * 100, y: 100 + Math.random() * 100 },
        data: { label: id, stepType: type },
      }
      setNodes(ns => [...ns, newNode])
    },
    [setNodes],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (readonly) return
      e.preventDefault()
      const type = e.dataTransfer.getData('application/reactflow-step-type') as StepType
      if (!type) return
      const bounds = e.currentTarget.getBoundingClientRect()
      const position = { x: e.clientX - bounds.left, y: e.clientY - bounds.top }
      const id = `${type}-${Date.now()}`
      const newNode: Node = {
        id,
        type: 'step',
        position,
        data: { label: id, stepType: type },
      }
      setNodes(ns => [...ns, newNode])
    },
    [readonly, setNodes],
  )

  const hasErrors = validationErrors.length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 0 }}>
      {!readonly && onSave && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 10px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <button
            onClick={handleSave}
            disabled={hasErrors || saving}
            style={{
              padding: '4px 14px',
              borderRadius: '4px',
              border: '1px solid',
              fontSize: '13px',
              fontWeight: 600,
              cursor: hasErrors || saving ? 'not-allowed' : 'pointer',
              background: hasErrors || saving ? '#94a3b8' : '#1e40af',
              color: '#fff',
              borderColor: hasErrors || saving ? '#94a3b8' : '#1e40af',
              transition: 'background 0.15s ease',
            }}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          {hasErrors && (
            <span style={{ fontSize: '12px', color: '#dc2626' }}>
              Fix {validationErrors.length} error{validationErrors.length !== 1 ? 's' : ''} before saving
            </span>
          )}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '500px',
          border: '1px solid #e2e8f0',
          borderRadius: readonly || !onSave ? '8px' : '0 0 8px 8px',
          overflow: 'hidden',
        }}
      >
        {!readonly && <NodePalette onAddNode={handleAddNode} />}
        <div
          style={{ flex: 1, position: 'relative' }}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={readonly ? undefined : onNodesChange}
            onEdgesChange={readonly ? undefined : onEdgesChange}
            onConnect={readonly ? undefined : onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
          <ValidationPanel errors={validationErrors} />
        </div>
      </div>
    </div>
  )
}

// ── FlowEditorWithPalette (standalone wrapper) ────────────────────────────────

export function FlowEditorWithPalette(props: FlowEditorProps) {
  return <FlowEditor {...props} />
}
