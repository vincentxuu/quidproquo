export interface DiffHunk {
  kind: 'unchanged' | 'added' | 'removed'
  lines: string[]
}

/**
 * Simple line-based diff (Myers diff-lite). For binary kinds, callers should check
 * `kind.binary` and skip calling diff — this function always operates on text.
 */
export function diff(textA: string, textB: string): DiffHunk[] {
  const linesA = textA.split('\n')
  const linesB = textB.split('\n')
  const result: DiffHunk[] = []
  let i = 0
  let j = 0
  while (i < linesA.length && j < linesB.length) {
    if (linesA[i] === linesB[j]) {
      const last = result[result.length - 1]
      if (last?.kind === 'unchanged') {
        last.lines.push(linesA[i])
      } else {
        result.push({ kind: 'unchanged', lines: [linesA[i]] })
      }
      i++
      j++
    } else {
      result.push({ kind: 'removed', lines: [linesA[i]] })
      result.push({ kind: 'added', lines: [linesB[j]] })
      i++
      j++
    }
  }
  while (i < linesA.length) {
    result.push({ kind: 'removed', lines: [linesA[i++]] })
  }
  while (j < linesB.length) {
    result.push({ kind: 'added', lines: [linesB[j++]] })
  }
  return result
}
