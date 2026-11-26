// Standard 5-field cron (minute hour day-of-month month day-of-week), evaluated in UTC.
// Each field accepts `*`, numbers, ranges `a-b`, steps `*/n` or `a-b/n`, and comma lists.
// Day-of-week 0 and 7 are both Sunday. When both day fields are restricted, a day matches
// if either one matches (Vixie cron semantics).

interface CronSpec {
  minute: Set<number>
  hour: Set<number>
  dom: Set<number>
  month: Set<number>
  dow: Set<number>
  domRestricted: boolean
  dowRestricted: boolean
}

const FIELD_RANGES: Array<[number, number]> = [
  [0, 59],
  [0, 23],
  [1, 31],
  [1, 12],
  [0, 7],
]

function parseField(field: string, min: number, max: number): Set<number> | null {
  const values = new Set<number>()
  for (const part of field.split(',')) {
    const match = /^(\*|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/.exec(part)
    if (!match) return null
    const [, base, startStr, endStr, stepStr] = match
    let start = min
    let end = max
    if (base !== '*') {
      start = Number(startStr)
      end = endStr !== undefined ? Number(endStr) : stepStr !== undefined ? max : start
    }
    const step = stepStr !== undefined ? Number(stepStr) : 1
    if (start < min || end > max || start > end || step < 1) return null
    for (let v = start; v <= end; v += step) values.add(v)
  }
  return values
}

export function parseCron(expression: string): CronSpec | null {
  const fields = expression.trim().split(/\s+/)
  if (fields.length !== 5) return null
  const sets = fields.map((f, i) => parseField(f, FIELD_RANGES[i][0], FIELD_RANGES[i][1]))
  if (sets.some((s) => s === null)) return null
  const [minute, hour, dom, month, dow] = sets as Set<number>[]
  if (dow.has(7)) dow.add(0)
  return {
    minute,
    hour,
    dom,
    month,
    dow,
    domRestricted: fields[2] !== '*',
    dowRestricted: fields[4] !== '*',
  }
}

function dayMatches(spec: CronSpec, date: Date): boolean {
  const domOk = spec.dom.has(date.getUTCDate())
  const dowOk = spec.dow.has(date.getUTCDay())
  if (spec.domRestricted && spec.dowRestricted) return domOk || dowOk
  if (spec.domRestricted) return domOk
  if (spec.dowRestricted) return dowOk
  return true
}

// Five years covers every satisfiable expression, including Feb 29.
const SEARCH_LIMIT_MS = 5 * 366 * 24 * 3600_000

/** Next fire time strictly after `after`, or null if the expression is invalid or never fires. */
export function nextCronTime(expression: string, after: Date = new Date()): number | null {
  const spec = parseCron(expression)
  if (!spec) return null

  const t = new Date(after.getTime())
  t.setUTCSeconds(0, 0)
  t.setUTCMinutes(t.getUTCMinutes() + 1)
  const limit = after.getTime() + SEARCH_LIMIT_MS

  while (t.getTime() <= limit) {
    if (!spec.month.has(t.getUTCMonth() + 1)) {
      t.setUTCMonth(t.getUTCMonth() + 1, 1)
      t.setUTCHours(0, 0, 0, 0)
      continue
    }
    if (!dayMatches(spec, t)) {
      t.setUTCDate(t.getUTCDate() + 1)
      t.setUTCHours(0, 0, 0, 0)
      continue
    }
    if (!spec.hour.has(t.getUTCHours())) {
      t.setUTCHours(t.getUTCHours() + 1, 0, 0, 0)
      continue
    }
    if (!spec.minute.has(t.getUTCMinutes())) {
      t.setUTCMinutes(t.getUTCMinutes() + 1, 0, 0)
      continue
    }
    return t.getTime()
  }
  return null
}

/** A routine's next run: the next cron slot plus its fixed per-routine stagger. */
export function nextRoutineRunAt(cron: string, staggerSeconds: number, after: Date = new Date()): number | null {
  const next = nextCronTime(cron, after)
  return next === null ? null : next + staggerSeconds * 1000
}
