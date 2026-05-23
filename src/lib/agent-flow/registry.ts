import type { D1Database } from '@cloudflare/workers-types'
import { nowMs } from '../utils/dates'

let loadFlow: ((source: string, format: 'yaml' | 'json') => unknown) | undefined

async function getLoadFlow() {
  if (loadFlow) return loadFlow
  const mod = await import('./dsl/load')
  loadFlow = mod.loadFlow
  return loadFlow
}

export async function registerFlows(db: D1Database, flowsDir = 'flows'): Promise<void> {
  let readdirSync: (path: string) => string[]
  let readFileSync: (path: string, encoding: BufferEncoding) => string
  let existsSync: (path: string) => boolean
  let join: (...segments: string[]) => string

  try {
    const fs = await import('node:fs')
    const path = await import('node:path')
    readdirSync = fs.readdirSync as (path: string) => string[]
    readFileSync = fs.readFileSync as (path: string, encoding: BufferEncoding) => string
    existsSync = fs.existsSync as (path: string) => boolean
    join = path.join
  } catch {
    // node:fs not available in this runtime — skip
    return
  }

  if (!existsSync(flowsDir)) return

  const yamlFiles = readdirSync(flowsDir).filter(
    (f) => f.endsWith('.yaml') || f.endsWith('.yml'),
  )

  const loader = await getLoadFlow()

  for (const file of yamlFiles) {
    try {
      const yamlSource = readFileSync(join(flowsDir, file), 'utf-8')
      const raw = loader(yamlSource, 'yaml') as Record<string, unknown>
      const flowId = String(raw.id ?? '')
      if (!flowId) continue

      const now = nowMs()
      await db
        .prepare(
          `INSERT INTO flow_definitions (flow_id, display_name, description, current_version, definition_yaml, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(flow_id) DO UPDATE SET
             display_name=excluded.display_name,
             description=excluded.description,
             current_version=excluded.current_version,
             definition_yaml=excluded.definition_yaml,
             updated_at=excluded.updated_at`,
        )
        .bind(
          flowId,
          String(raw.name ?? flowId),
          raw.description ? String(raw.description) : null,
          Number(raw.version ?? 1),
          yamlSource,
          now,
          now,
        )
        .run()
    } catch {
      // Skip malformed YAMLs during startup
    }
  }
}
