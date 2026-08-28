import { Converter } from 'opencc-js/cn2t'

const toTaiwanTraditional = Converter({ from: 'cn', to: 'twp' })

const MARKDOWN_LITERAL_PATTERN = /```[\s\S]*?```|~~~[\s\S]*?~~~|`+[^`\n]*`+|https?:\/\/[^\s<]+|<[^>\n]+>/g

/**
 * Normalize model-facing prose to Taiwan Traditional Chinese while keeping
 * Markdown literals byte-for-byte intact. In particular, code and citation
 * URLs must not be changed because they are executable or source identifiers.
 */
export function normalizeAnswerLanguage(text: string, language: string): string {
  if (language === 'en' || text.length === 0) return text

  const literals: string[] = []
  const protectedText = text.replace(MARKDOWN_LITERAL_PATTERN, (literal) => {
    const token = `\u{F0000}${literals.length}\u{F0001}`
    literals.push(literal)
    return token
  })

  const normalized = toTaiwanTraditional(protectedText)
  return normalized.replace(/\u{F0000}(\d+)\u{F0001}/gu, (_, index: string) => literals[Number(index)] ?? '')
}
