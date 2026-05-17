export type CostModel =
  | { kind: 'token'; inputPerKToken: number; outputPerKToken: number }
  | { kind: 'request'; perCallUsd: number }
  | { kind: 'free' }
