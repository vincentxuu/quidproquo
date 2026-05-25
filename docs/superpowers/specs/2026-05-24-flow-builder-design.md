# Flow Builder — Design Spec

**Date:** 2026-05-24  
**Scope:** `/admin/console/flows/[id]/edit` — replace current YAML textarea + toggle-graph UX with a canvas-first flow builder  
**Status:** Approved, ready for implementation planning

---

## Problem

The current edit page is a raw YAML textarea as the primary interface. The ReactFlow visual graph exists as a hidden secondary panel toggled by a button, but:

- Graph changes do not write back to the YAML (they are lost on toggle)
- Clicking a node shows no properties — there is no way to edit step fields without knowing YAML syntax
- The YAML/graph toggle requires a valid YAML to switch, creating a chicken-and-egg problem
- New users cannot discover what fields each step type accepts

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Primary editing paradigm | Canvas First | DAG is source of truth; YAML is derived output only |
| Properties presentation | Right Sidebar | Established canvas-tool pattern (Figma, n8n); sufficient space for complex fields; YAML tab fits naturally as a second tab |
| Node palette | Grouped list (Execution / Data / Quality / Control) | 9 step types are too many without grouping; labels without descriptions keep the palette compact; hover tooltips provide discovery |
| YAML access | Read-only preview tab + toolbar "匯入 YAML" | Avoids dual source-of-truth; import is a deliberate one-way action |

---

## Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← 工作流程 / research-brief  [v3] [enabled]   [匯入 YAML] [▶ 執行] [儲存] │
├──────────┬──────────────────────────────────────┬───────────────────┤
│          │                                      │                   │
│ PALETTE  │           CANVAS (ReactFlow)         │  RIGHT SIDEBAR    │
│ 128px    │           flex: 1                    │  200px            │
│          │                                      │                   │
│ Execution│  [dot-grid background]               │ (empty if no node │
│  ● agent │                                      │  selected)        │
│  ● tool_ │  ┌──────────────┐                   │                   │
│    group │  │ AGENT        │ ← selected,        │ ● planner  [✕]   │
│          │  │ planner      │   glowing ring     │ ─────────────── │
│ Data     │  └──────────────┘                   │ [屬性] [YAML]     │
│  ● trans-│        ↓  ↓                          │ ─────────────── │
│    form  │  ┌──────┐  ┌──────┐                 │ Step ID           │
│  ● arti- │  │tools │  │summ- │                 │ [planner_______]  │
│    fact  │  │      │  │arize │                 │ Agent             │
│          │  └──────┘  └──────┘                 │ [planner ▾      ] │
│ Quality  │        ↓                             │ Model             │
│  ● veri- │  ┌──────────────┐                   │ [claude-sonnet ▾] │
│    fier  │  │ ARTIFACT     │                   │ Description       │
│  ● human │  │ brief_output │                   │ [_______________] │
│    _appr │  └──────────────┘                   │ Retry  [2]        │
│    oval  │                                      │ Timeout [未設定]   │
│          │  [＋][－][⊡]          [minimap]     │                   │
│ Control  │                                      │ [套用]  [刪除]    │
│  ● sub_  │                                      │                   │
│    flow  │                                      │                   │
│  ● paral-│                                      │                   │
│    lel   │                                      │                   │
│  ● loop  │                                      │                   │
└──────────┴──────────────────────────────────────┴───────────────────┘
```

---

## Components

### 1. Toolbar

Fixed at the top. Contains:
- Breadcrumb: `← 工作流程 / {flow name}` with version badge and enabled/disabled badge
- Right actions: `匯入 YAML` (secondary) · `▶ 執行` (secondary) · `儲存` (primary, disabled when no changes)
- Dirty state: `儲存` button activates when DAG state diverges from last-saved version
- Unsaved-changes `beforeunload` guard (already exists, keep it)

### 2. Left Palette

Width: 128px, fixed, non-collapsible (9 items fit without scroll on any normal screen).

Four groups with group label headers:

| Group | Steps |
|---|---|
| Execution | `agent`, `tool_group` |
| Data | `transform`, `artifact` |
| Quality | `verifier`, `human_approval` |
| Control | `sub_flow`, `parallel`, `loop` |

Each item: `● {color dot}  {step type name}`. Hover → background highlight + tooltip showing one-line Chinese description of the step type. Drag to canvas, or click to add at canvas center.

### 3. Canvas

ReactFlow instance. Full height of remaining area.

- Background: dot grid (`<Background variant="dots">`)
- Controls: zoom in/out/fit (`<Controls>`)
- MiniMap: bottom-right (`<MiniMap>`)
- Nodes: `StepNode` custom type — color-coded by step type, shows type badge + step ID
- Selected node: glowing ring (`box-shadow: 0 0 0 2px {stepColor}`)
- Edges: connecting handles top/bottom; label shows condition if set
- Drop zone: drag from palette → drop on canvas → node created at drop position

Canvas is the **sole source of truth**. On save: `dagToYaml(nodes, edges, meta)` → POST to `/api/admin/flows/[id]/version`.

### 4. Right Sidebar

Width: 200px. Hidden when no node is selected; slides in on node click.

**Header:** colored dot + step ID + `✕` close button.

**Tabs:**
- **屬性 tab** (default): form fields specific to the step type (see below)
- **YAML tab**: read-only `<pre>` showing the serialized YAML fragment for this step; copy button

**Footer:** `[套用]` (apply edits to node data) · `[刪除]` (remove node and its edges from canvas)

**No node selected state:** sidebar shows empty state: `「點選節點來編輯屬性」`

#### Per-type field sets

| Step type | Fields |
|---|---|
| `agent` | Step ID, Agent (dropdown from registry), Model (dropdown), Description, Retry, Timeout |
| `tool_group` | Step ID, Tools (multi-select chips), Description |
| `transform` | Step ID, Input key, Output key, Template, Description |
| `verifier` | Step ID, Agent, Criteria, Description |
| `artifact` | Step ID, Artifact ID, Type, Description |
| `human_approval` | Step ID, Description, Assignee (optional) |
| `sub_flow` | Step ID, Flow ID (dropdown), Input mapping |
| `parallel` | Step ID, Branches (list of step IDs) |
| `loop` | Step ID, Iterator step, Max iterations, Exit condition |

All dropdowns that reference agents or flows should load from existing API endpoints.

### 5. Import YAML modal

Triggered by `[匯入 YAML]` toolbar button.

1. Modal opens with a `<textarea>` for pasting YAML
2. On confirm: call `/api/admin/flows/validate` → if valid, parse YAML to DAG → replace current canvas nodes/edges → close modal
3. On error: show validation errors inline in the modal (do not replace canvas)
4. This is a **one-way, destructive** action — modal warns: `「匯入後將覆蓋目前畫布」`

---

## Data Flow

```
Canvas nodes/edges (React state)
        │
        │  on Save
        ▼
  dagToYaml(nodes, edges, meta)
        │
        ▼
  POST /api/admin/flows/[id]/version  { yaml }
        │
        ▼
  server validates + stores → responds { version }
        │
        ▼
  redirect to /admin/console/flows/[id]
```

Import path (reverse, one-time):
```
Paste YAML in modal
        │
        ▼
  POST /api/admin/flows/validate
        │ valid
        ▼
  yamlToDag(yaml) → setNodes + setEdges
```

---

## What Changes vs. Current

| Current | New |
|---|---|
| YAML textarea is primary editor | ReactFlow canvas is primary editor |
| Graph is a hidden secondary panel (toggle) | Graph is the only edit surface |
| Clicking a node does nothing | Clicking a node opens right sidebar with form |
| No palette grouping | 4-group palette with hover tooltips |
| Graph changes lost on YAML toggle | No toggle — DAG is always source of truth |
| YAML tab shows editable raw text | YAML tab is read-only serialized preview |
| No import flow | `匯入 YAML` toolbar button → modal |

---

## Out of Scope

- Edge condition editor (conditions remain set via YAML import for now)
- Evidence policy form (complex nested object — use YAML import for advanced config)
- Flow meta editing (id, name, description) in the builder — stays on the detail page
- Undo/redo history
- Real-time collaboration
