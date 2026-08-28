export interface WeightedCandidate {
  providerId: string
  costProxy: number       // relative cost (1.0 = baseline)
  successRate: number     // 0–1
  observedP50Ms: number
  latencyBaselineMs: number
  staticWeight?: number
}

export function chooseWithWeights(candidates: WeightedCandidate[]): string | null {
  if (candidates.length === 0) return null

  const weights = candidates.map((c) => {
    const base = (1 / c.costProxy) * c.successRate * (c.latencyBaselineMs / c.observedP50Ms)
    return c.staticWeight !== undefined ? base * c.staticWeight : base
  })

  const total = weights.reduce((sum, w) => sum + w, 0)
  if (total <= 0) return candidates[0].providerId

  // Weighted random selection using crypto.getRandomValues
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  let threshold = (buf[0] / 0xffffffff) * total

  for (let i = 0; i < candidates.length; i++) {
    threshold -= weights[i]
    if (threshold <= 0) return candidates[i].providerId
  }

  return candidates[candidates.length - 1].providerId
}
