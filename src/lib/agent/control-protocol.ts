import type { ControlRequestEvent, ControlResponseEvent } from './events'
import { scoreRisk } from '@/lib/policy/enforcement/human/risk'

export interface ControlRequest {
  requestId: string
  subtype: 'can_use_tool' | 'exit_plan_mode'
  toolName: string
  displayName: string
  input: unknown
  decisionReason: string
  riskScore: number
  planContent?: string
  options?: string[]
}

export function buildControlRequestEvent(req: ControlRequest): ControlRequestEvent {
  return {
    type: 'control_request',
    subtype: req.subtype,
    payload: {
      requestId: req.requestId,
      toolName: req.toolName,
      displayName: req.displayName,
      input: req.input,
      decisionReason: req.decisionReason,
    },
  }
}

export function buildControlResponseEvent(
  requestId: string,
  behavior: 'allow' | 'deny',
  updatedInput?: unknown,
): ControlResponseEvent {
  return {
    type: 'control_response',
    requestId,
    behavior,
    updatedInput,
  }
}

export function buildToolControlRequest(
  toolName: string,
  input: unknown,
  reason: string,
): ControlRequest {
  return {
    requestId: `appr_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
    subtype: 'can_use_tool',
    toolName,
    displayName: toolName,
    input,
    decisionReason: reason,
    riskScore: scoreRisk({ syscallName: toolName, input }),
  }
}

export function buildPlanModeRequest(
  planContent: string,
): ControlRequest {
  return {
    requestId: `appr_${Date.now()}_plan`,
    subtype: 'exit_plan_mode',
    toolName: 'ExitPlanMode',
    displayName: 'Exit Plan Mode',
    input: { plan: planContent },
    decisionReason: 'Plan complete — review and approve to proceed',
    riskScore: 0,
    planContent,
    options: ['reject', 'accept', 'accept_auto'],
  }
}
