import type { FlowDefinition, FlowPresetOverrides } from '../dsl/ast'

const FORBIDDEN_OVERRIDE_KEYS = new Set([
  'id', 'name', 'type', 'edges', 'inputs', 'artifacts',
])

const ALLOWED_STEP_OVERRIDE_KEYS = new Set([
  'retryPolicy', 'timeoutSeconds', 'providerRouting',
])

export class FlowPresetBoundaryError extends Error {
  constructor(key: string) {
    super(`Preset may not override forbidden field: "${key}"`)
    this.name = 'FlowPresetBoundaryError'
  }
}

export function validatePresetOverrides(
  overrides: FlowPresetOverrides,
  _def: FlowDefinition,
): void {
  for (const key of Object.keys(overrides)) {
    if (FORBIDDEN_OVERRIDE_KEYS.has(key)) {
      throw new FlowPresetBoundaryError(key)
    }
  }

  if (overrides.steps) {
    for (const [_stepId, stepOverride] of Object.entries(overrides.steps)) {
      if (!stepOverride) continue
      for (const key of Object.keys(stepOverride)) {
        if (!ALLOWED_STEP_OVERRIDE_KEYS.has(key)) {
          throw new FlowPresetBoundaryError(`steps.${key}`)
        }
      }
    }
  }
}
