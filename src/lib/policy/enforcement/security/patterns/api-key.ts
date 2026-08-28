export interface Match { kind: 'api-key'; start: number; end: number; value: string }

export function scan(text: string): Match[] {
  const re = /(?:key|token|secret|Authorization:\s*Bearer\s+)['"]?:\s*['"]?([A-Za-z0-9_-]{32,})/gi
  const results: Match[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const value = m[1]
    const start = m.index + m[0].length - value.length
    results.push({ kind: 'api-key', start, end: start + value.length, value })
  }
  return results
}
