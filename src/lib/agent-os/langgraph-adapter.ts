import { env as workerEnv } from 'cloudflare:workers'
import type { Env } from '../config/env'
import type { ProviderApiKeys } from '../rag/model'
import type { GraphState } from '../rag/state'
import { createKernel } from './kernel'
import { registerAgentDefinitions } from './registry'

export async function runAgentNode(
  agentId: string,
  state: GraphState,
  options?: { env?: Env; providerApiKeys?: ProviderApiKeys }
): Promise<Partial<GraphState>> {
  const env = options?.env ?? workerEnv as unknown as Env
  const kernel = createKernel(env)
  await registerAgentDefinitions(kernel)
  const { runId } = await kernel.scheduler.dispatchRun({
    agentId,
    trigger: 'sub-agent',
    input: state,
    runtimeOptions: { providerApiKeys: options?.providerApiKeys },
    parentRunId: state.thread_id,
    userId: 'system',
    sessionId: state.thread_id,
  })
  const run = await kernel.storage.runs.get(runId)
  if (!run) throw new Error(`Agent OS run not found: ${runId}`)
  if (run.status === 'failed' || run.status === 'cancelled') {
    throw new Error(`Agent OS ${agentId} run ${run.status}: ${JSON.stringify(run.error ?? null)}`)
  }
  return (run.output ?? {}) as Partial<GraphState>
}
