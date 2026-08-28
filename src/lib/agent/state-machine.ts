import type { AgentRunStatus } from './storage/types'

const allowedTransitions: Record<AgentRunStatus, AgentRunStatus[]> = {
  pending: ['running', 'cancelled', 'failed'],
  running: ['paused', 'done', 'failed', 'cancelled'],
  paused: ['running', 'failed', 'cancelled'],
  done: [],
  failed: [],
  cancelled: [],
}

export function canTransition(from: AgentRunStatus, to: AgentRunStatus): boolean {
  return allowedTransitions[from]?.includes(to) ?? false
}

export function assertTransition(from: AgentRunStatus, to: AgentRunStatus): void {
  if (!canTransition(from, to)) {
    throw new Error(`Illegal agent run transition: ${from} -> ${to}`)
  }
}

export function isTerminalStatus(status: AgentRunStatus): boolean {
  return status === 'done' || status === 'failed' || status === 'cancelled'
}
