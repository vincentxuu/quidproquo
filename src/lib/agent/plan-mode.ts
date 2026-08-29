import type { SessionMode } from './mode'
import { buildPlanModeRequest, buildControlRequestEvent } from './control-protocol'
import { waitForApproval } from './approval-queue'
import type { SessionEvent } from './events'

export const PLAN_MODE_SYSTEM_PROMPT = `You are in Plan mode. You may ONLY read files, search, and think.
Do NOT execute any write operations (Bash, Write, Edit) — they will be blocked.
Instead, write your plan as an assistant message. When your plan is ready,
call the ExitPlanMode tool with your plan content to request approval.`

export function isPlanModeExitRequest(toolName: string): boolean {
  return toolName === 'ExitPlanMode'
}

export async function handleExitPlanMode(
  planContent: string,
  emitEvent: (event: SessionEvent) => Promise<void>,
  persistApproval: (req: {
    approvalId: string
    subtype: string
    displayName: string
    inputJson: string
    riskScore: number
  }) => Promise<void>,
): Promise<{ decision: 'accept' | 'accept_auto' | 'reject' }> {
  const req = buildPlanModeRequest(planContent)
  const event = buildControlRequestEvent(req)

  await emitEvent(event)
  await persistApproval({
    approvalId: req.requestId,
    subtype: 'exit_plan_mode',
    displayName: 'Exit Plan Mode',
    inputJson: JSON.stringify({ plan: planContent }),
    riskScore: 0,
  })

  try {
    await waitForApproval(req.requestId)
    return { decision: 'accept' }
  } catch {
    return { decision: 'reject' }
  }
}

export function planModeSystemMessages(): Array<{ role: 'user'; content: string }> {
  return [{ role: 'user' as const, content: PLAN_MODE_SYSTEM_PROMPT }]
}

export function modeAfterPlanApproval(decision: 'accept' | 'accept_auto' | 'reject'): SessionMode {
  switch (decision) {
    case 'accept':
      return 'default'
    case 'accept_auto':
      return 'auto'
    case 'reject':
      return 'plan'
  }
}
