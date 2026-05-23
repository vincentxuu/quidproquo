export interface Match { kind: 'phone'; start: number; end: number; value: string }

export function scan(text: string): Match[] {
  const re = /\b(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g
  const results: Match[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    results.push({ kind: 'phone', start: m.index, end: m.index + m[0].length, value: m[0] })
  }
  return results
}
