import { scan as emailScan } from './patterns/email'
import { scan as phoneScan } from './patterns/phone'
import { scan as apiKeyScan } from './patterns/api-key'
import { scan as ssnScan } from './patterns/ssn'
import { scan as creditCardScan } from './patterns/credit-card'

export type PatternKind = 'email' | 'phone' | 'api-key' | 'ssn' | 'credit-card'
export type ScanMatch =
  | ReturnType<typeof emailScan>[number]
  | ReturnType<typeof phoneScan>[number]
  | ReturnType<typeof apiKeyScan>[number]
  | ReturnType<typeof ssnScan>[number]
  | ReturnType<typeof creditCardScan>[number]

export function scan(text: string, patternKinds: PatternKind[]): ScanMatch[] {
  const results: ScanMatch[] = []
  for (const kind of patternKinds) {
    switch (kind) {
      case 'email':
        results.push(...emailScan(text))
        break
      case 'phone':
        results.push(...phoneScan(text))
        break
      case 'api-key':
        results.push(...apiKeyScan(text))
        break
      case 'ssn':
        results.push(...ssnScan(text))
        break
      case 'credit-card':
        results.push(...creditCardScan(text))
        break
    }
  }
  results.sort((a, b) => a.start - b.start)
  return results
}

export function redact(
  text: string,
  matches: ScanMatch[],
): { redacted: string; redactionMap: Record<string, string> } {
  const redactionMap: Record<string, string> = {}
  const counters: Record<string, number> = {}

  // Sort descending by start so replacements don't shift offsets
  const sorted = [...matches].sort((a, b) => b.start - a.start)

  let redacted = text
  for (const match of sorted) {
    const kindKey = match.kind.toUpperCase().replace(/-/g, '_')
    counters[kindKey] = (counters[kindKey] ?? 0) + 1
    const id = `[REDACTED_${kindKey}_${counters[kindKey]}]`
    redactionMap[id] = match.value
    redacted = redacted.slice(0, match.start) + id + redacted.slice(match.end)
  }

  return { redacted, redactionMap }
}
