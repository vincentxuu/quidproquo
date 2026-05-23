export interface Match { kind: 'ssn'; start: number; end: number; value: string }

export function scan(text: string): Match[] {
  const re = /\b\d{3}-\d{2}-\d{4}\b/g
  const results: Match[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    results.push({ kind: 'ssn', start: m.index, end: m.index + m[0].length, value: m[0] })
  }
  return results
}
