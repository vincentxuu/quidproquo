type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

export function sanitizeToolSchema(obj: unknown): unknown {
  if (obj === null || obj === undefined) return undefined
  if (Array.isArray(obj)) return obj.map(sanitizeToolSchema).filter((v) => v !== undefined)
  if (typeof obj !== 'object') return obj

  const result: Record<string, JsonValue> = {}
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (v === null || v === undefined) continue
    if (k === '$schema') continue
    const cleaned = sanitizeToolSchema(v)
    if (cleaned !== undefined) {
      result[k] = cleaned as JsonValue
    }
  }
  return result
}

export function sanitizeToolsPayload(tools: unknown[]): unknown[] {
  return tools.map((t) => sanitizeToolSchema(t)) as unknown[]
}
