export interface NumericContradictionResult {
  contradicts: boolean
  kind?: 'number' | 'date' | 'percentage'
  delta?: number
}

interface NumericToken {
  value: number
  kind: 'number' | 'date' | 'percentage'
  contextBefore: string
  contextAfter: string
}

const NUMBER_RE = /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)\s*(%)?/g
const DATE_RE = /\b(20\d{2}|19\d{2})\b/g

function extractTokens(text: string): NumericToken[] {
  const tokens: NumericToken[] = []
  const lower = text.toLowerCase()

  let m: RegExpExecArray | null
  NUMBER_RE.lastIndex = 0
  while ((m = NUMBER_RE.exec(text)) !== null) {
    const raw = m[1].replace(/,/g, '')
    const value = parseFloat(raw)
    if (isNaN(value)) continue
    const kind: 'number' | 'percentage' = m[2] === '%' ? 'percentage' : 'number'
    const start = Math.max(0, m.index - 30)
    const end = Math.min(text.length, m.index + m[0].length + 30)
    tokens.push({
      value,
      kind,
      contextBefore: lower.slice(start, m.index).trim().split(/\s+/).slice(-3).join(' '),
      contextAfter: lower
        .slice(m.index + m[0].length, end)
        .trim()
        .split(/\s+/)
        .slice(0, 3)
        .join(' '),
    })
  }

  DATE_RE.lastIndex = 0
  while ((m = DATE_RE.exec(text)) !== null) {
    const value = parseInt(m[1], 10)
    const start = Math.max(0, m.index - 30)
    const end = Math.min(text.length, m.index + m[0].length + 30)
    tokens.push({
      value,
      kind: 'date',
      contextBefore: lower.slice(start, m.index).trim().split(/\s+/).slice(-3).join(' '),
      contextAfter: lower
        .slice(m.index + m[0].length, end)
        .trim()
        .split(/\s+/)
        .slice(0, 3)
        .join(' '),
    })
  }

  return tokens
}

function contextOverlap(a: NumericToken, b: NumericToken): number {
  const aTokens = new Set(
    [...a.contextBefore.split(/\s+/), ...a.contextAfter.split(/\s+/)].filter(Boolean),
  )
  let shared = 0
  for (const t of [...b.contextBefore.split(/\s+/), ...b.contextAfter.split(/\s+/)]) {
    if (t && aTokens.has(t)) shared++
  }
  return shared
}

export function detectNumericContradiction(
  claimA: string,
  claimB: string,
): NumericContradictionResult {
  const tokensA = extractTokens(claimA)
  const tokensB = extractTokens(claimB)

  for (const ta of tokensA) {
    for (const tb of tokensB) {
      if (ta.kind !== tb.kind) continue
      if (contextOverlap(ta, tb) < 3) continue
      if (ta.value === tb.value) continue
      return { contradicts: true, kind: ta.kind, delta: Math.abs(ta.value - tb.value) }
    }
  }

  return { contradicts: false }
}
