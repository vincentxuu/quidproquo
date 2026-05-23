import type { FlowDefinition, FlowPresetOverrides } from '../dsl/ast'

export interface FlowPresetResolved {
  presetId: string
  flowId: string
  displayName: string
  overrides: FlowPresetOverrides
  createdAt: number
  updatedAt: number
}

export function resolvePreset(
  def: FlowDefinition,
  preset: FlowPresetResolved | undefined,
): FlowDefinition {
  if (!preset) return def

  const overrides = preset.overrides
  const resolved: FlowDefinition = { ...def }

  if (overrides.retry) {
    resolved.retry = { ...(def.retry ?? {}), ...overrides.retry }
  }

  if (overrides.timeout !== undefined) {
    resolved.timeout = overrides.timeout
  }

  if (overrides.steps) {
    resolved.steps = def.steps.map((step) => {
      const stepOverride = overrides.steps?.[step.id]
      if (!stepOverride) return step
      return { ...step, ...stepOverride }
    })
  }

  return resolved
}
