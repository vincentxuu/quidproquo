import type { ToolDefinition } from './types'

export class ToolRegistrationError extends Error {
  constructor(name: string) {
    super(`Tool already registered: ${name}`)
    this.name = 'ToolRegistrationError'
  }
}

const tools = new Map<string, ToolDefinition>()

export function register(def: ToolDefinition): void {
  if (tools.has(def.name)) {
    throw new ToolRegistrationError(def.name)
  }
  tools.set(def.name, def)
}

export function list(): ToolDefinition[] {
  return [...tools.values()]
}

export function get(name: string): ToolDefinition | undefined {
  return tools.get(name)
}

export function clear(): void {
  tools.clear()
}

export function validateAllowlist(names: string[]): { ok: boolean; missing: string[] } {
  const missing = names.filter((name) => !tools.has(name))
  return { ok: missing.length === 0, missing }
}
