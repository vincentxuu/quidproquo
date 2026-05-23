export type CandidateKind = 'np' | 'vp'

export interface Candidate {
  text: string
  start: number
  end: number
  kind: CandidateKind
}

const SENTENCE_RE = /[.!?]\s+|\n+/
const CONNECTIVES =
  /\b(is|are|was|were|has|have|will|can|shows|indicates|reported|found|suggests)\b/i

function splitSentences(text: string): Array<{ text: string; offset: number }> {
  const sentences: Array<{ text: string; offset: number }> = []
  let offset = 0
  for (const part of text.split(SENTENCE_RE)) {
    const trimmed = part.trim()
    if (trimmed.length >= 10) {
      const start = text.indexOf(trimmed, offset)
      sentences.push({ text: trimmed, offset: start >= 0 ? start : offset })
    }
    offset = Math.min(offset + part.length + 2, text.length)
  }
  return sentences
}

export function generateCandidates(text: string): Candidate[] {
  const candidates: Candidate[] = []
  const sentences = splitSentences(text)

  for (const { text: sentence, offset } of sentences) {
    // NP candidate: the full sentence if it starts with a capital letter (likely a factual claim)
    if (/^[A-Z]/.test(sentence) && sentence.length >= 10 && sentence.length <= 200) {
      candidates.push({
        text: sentence,
        start: offset,
        end: offset + sentence.length,
        kind: 'np',
      })
    }

    // VP candidate: the half of the sentence after a connective
    const match = CONNECTIVES.exec(sentence)
    if (match) {
      const vpText = sentence.slice(match.index).trim()
      if (vpText.length >= 10 && vpText.length <= 200) {
        candidates.push({
          text: vpText,
          start: offset + match.index,
          end: offset + match.index + vpText.length,
          kind: 'vp',
        })
      }
    }
  }

  return candidates
}
