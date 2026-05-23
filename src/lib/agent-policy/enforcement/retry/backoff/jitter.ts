export function nextDelayMs(attempt: number, baseMs: number): number {
  return baseMs * Math.pow(2, attempt - 1) + Math.random() * baseMs
}
