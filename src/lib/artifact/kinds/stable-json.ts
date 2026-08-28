function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys)
  if (value && typeof value === 'object') {
    const sorted: Record<string, unknown> = {}
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      sorted[key] = sortKeys((value as Record<string, unknown>)[key])
    }
    return sorted
  }
  return value
}

/**
 * Canonical JSON: recursively sorts object keys so the same logical payload always serializes to
 * the same string (deterministic diffs), while preserving all nested values (round-trippable).
 * NOTE: do NOT use `JSON.stringify(value, Object.keys(value).sort(), 2)` — the array form is a
 * key allowlist that silently drops every key not at the top level.
 */
export function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeys(value), null, 2)
}
