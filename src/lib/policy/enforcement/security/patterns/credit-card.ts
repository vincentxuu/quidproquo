export interface Match { kind: 'credit-card'; start: number; end: number; value: string }

function luhn(digits: string): boolean {
  let sum = 0
  let alternate = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10)
    if (alternate) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alternate = !alternate
  }
  return sum % 10 === 0
}

export function scan(text: string): Match[] {
  const re = /\b(?:\d[ -]?){13,16}\b/g
  const results: Match[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const digits = m[0].replace(/[ -]/g, '')
    if (digits.length >= 13 && digits.length <= 16 && luhn(digits)) {
      results.push({ kind: 'credit-card', start: m.index, end: m.index + m[0].length, value: m[0] })
    }
  }
  return results
}
