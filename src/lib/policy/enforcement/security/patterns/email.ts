export interface Match { kind: 'email'; start: number; end: number; value: string }

export function scan(text: string): Match[] {
  const re = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const results: Match[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    results.push({ kind: 'email', start: m.index, end: m.index + m[0].length, value: m[0] })
  }
  return results
}
