export function nowMs(): number {
  return Date.now()
}

export function nowIso(): string {
  return new Date(nowMs()).toISOString()
}

export function toIsoDate(date: Date | number): string {
  return new Date(date).toISOString()
}

export function toIsoDay(date: Date | number = nowMs()): string {
  return toIsoDate(date).split('T')[0]
}

export function secondsUntilMidnight(now: Date | number = nowMs()): number {
  const current = new Date(now)
  const nextMidnight = Date.UTC(
    current.getUTCFullYear(),
    current.getUTCMonth(),
    current.getUTCDate() + 1,
    0,
    0,
    0,
    0
  )
  return Math.max(0, Math.ceil((nextMidnight - current.getTime()) / 1000))
}
