/**
 * Human-approval gate surface used by enforcement/human/syscall-gate.ts.
 *
 * The concrete kernel implementation is wired at runtime through the kernel
 * (see agent-os). This module only declares the interface that
 * `wrapSyscallWithGate` consumes so policy enforcement compiles
 * independently of the kernel build.
 */

export interface GateRequest {
  runId: string
  stepId: string
  mode: 'per_step' | 'batch' | 'edit_on_approval'
  syscallName: string
  input: unknown
  kernel: unknown
  ttlSeconds: number
  windowSeconds?: number
  riskThreshold?: number
}

export interface GateDecision {
  decision: 'approve' | 'reject'
  skipped?: boolean
  editedPayload?: unknown
}

export interface PolicyApprovalGates {
  requestGate(request: GateRequest): Promise<GateDecision>
}
