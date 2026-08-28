type Status = 'draft' | 'approved' | 'rejected' | 'published'
type TransitionResult = { ok: true } | { ok: false; reason: string }

const ALLOWED: Record<string, Status[]> = {
  draft: ['approved', 'rejected'],
  approved: ['published', 'draft'],
  published: ['published'],
  rejected: [],
}

export function transition(from: Status, to: Status): TransitionResult {
  if (ALLOWED[from]?.includes(to)) return { ok: true }
  return { ok: false, reason: `illegal_transition: ${from} → ${to}` }
}
