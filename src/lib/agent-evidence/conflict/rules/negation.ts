export interface NegationContradictionResult {
  contradicts: boolean
}

const NEGATION_MARKERS = [
  'not',
  'no',
  "isn't",
  "doesn't",
  'never',
  'cannot',
  "can't",
  'without',
  'lacks',
  'lack',
  'failed',
  'fails',
]

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/['']/g, "'")
    .split(/\W+/)
    .filter(Boolean)
}

function hasNegation(tokens: string[]): boolean {
  return tokens.some((t) => NEGATION_MARKERS.includes(t))
}

function sharedContentTokens(tokensA: string[], tokensB: string[]): number {
  const STOP_WORDS = new Set([
    'the',
    'a',
    'an',
    'is',
    'are',
    'was',
    'were',
    'it',
    'of',
    'in',
    'to',
    'and',
    'or',
    'that',
  ])
  const contentA = new Set(tokensA.filter((t) => !STOP_WORDS.has(t)))
  return tokensB.filter((t) => !STOP_WORDS.has(t) && contentA.has(t)).length
}

export function detectNegationContradiction(
  claimA: string,
  claimB: string,
): NegationContradictionResult {
  const tokensA = tokenize(claimA)
  const tokensB = tokenize(claimB)

  const aNegated = hasNegation(tokensA)
  const bNegated = hasNegation(tokensB)

  if (aNegated === bNegated) return { contradicts: false }
  if (sharedContentTokens(tokensA, tokensB) < 2) return { contradicts: false }

  return { contradicts: true }
}
