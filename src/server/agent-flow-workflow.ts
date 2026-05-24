// Cloudflare Workflows entrypoint for agent-flow durable execution.
// Requires `cloudflare:workers` runtime types — this file is only loaded in the Worker runtime.
// Wrangler binding: { "binding": "AGENT_FLOW_WORKFLOWS", "name": "agent-flow-durable", "class_name": "AgentFlowWorkflow" }

// @ts-ignore — cloudflare:workers types are runtime-only; not available during tsc checks
import { WorkflowEntrypoint } from 'cloudflare:workers'
import type { WorkflowEvent, WorkflowStep } from 'cloudflare:workers'
import type { Env } from '../lib/config/env'
import { runFlowInWorker } from '../lib/agent-flow/runtime/run'

interface FlowWorkflowParams {
  flowId: string
  input: Record<string, unknown>
  flowRunId: number
}

export class AgentFlowWorkflow extends WorkflowEntrypoint<Env, FlowWorkflowParams> {
  async run(event: WorkflowEvent<FlowWorkflowParams>, step: WorkflowStep): Promise<void> {
    const { flowId, input, flowRunId } = event.payload

    // Each major step delegates to the in-Worker executor with Workflow checkpointing
    await step.do('flow-execute', {
      retries: { limit: 3, backoff: 'exponential', delay: '5 seconds' },
    }, async () => {
      await runFlowInWorker({
        flowId: Number(flowId),
        flowRunId: String(flowRunId),
        input,
      } as Parameters<typeof runFlowInWorker>[0])
    })
  }
}
