import type { ProviderDefinition, ProviderCategory } from './types'
import type { ProviderBackends } from './storage/types'

const registry = new Map<string, ProviderDefinition>()
let booted = false

export function register(def: ProviderDefinition): void {
  registry.set(def.providerId, def)
}

export function unregister(id: string): void {
  registry.delete(id)
}

export function get(id: string): ProviderDefinition | undefined {
  return registry.get(id)
}

export function listByCategory(category: ProviderCategory): ProviderDefinition[] {
  return Array.from(registry.values()).filter((d) => d.category === category)
}

export function listAll(): ProviderDefinition[] {
  return Array.from(registry.values())
}

/** Test helper — clears all registered providers and resets boot state. */
export function clear(): void {
  registry.clear()
  booted = false
}

/**
 * Boot the registry from D1. Idempotent — skips if already booted.
 * Reads provider_definitions rows and registers each with is_enabled=1.
 */
export async function boot(db: D1Database, backends: ProviderBackends): Promise<void> {
  if (booted) return
  booted = true

  const categories: ProviderCategory[] = ['llm', 'search', 'reader', 'knowledge', 'action']
  for (const category of categories) {
    const defs = await backends.definitions.listByCategory(category)
    for (const def of defs) {
      if (def.isEnabled) {
        register(def)
      }
    }
  }
}
