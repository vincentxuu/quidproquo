import { useCallback, useState, useRef, useEffect } from 'react'
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

  // Unsaved changes guard
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

  const selectedNode = nodes.find(n => n.id === selectedId) ?? null

  const onConnect = useCallback(
    (connection: Connection) => setEdges(eds => addEdge(connection, eds)),
    [setEdges],
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: BuilderNode) => {
    setSelectedId(node.id)
  }, [])

  const onPaneClick = useCallback(() => setSelectedId(null), [])

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
