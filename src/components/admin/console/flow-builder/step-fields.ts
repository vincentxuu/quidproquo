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
