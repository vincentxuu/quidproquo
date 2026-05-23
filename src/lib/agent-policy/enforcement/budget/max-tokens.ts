export function check(observed: number, limit: number): { breached: boolean } {
  return { breached: observed > limit }
}
