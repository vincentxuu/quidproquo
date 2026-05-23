// Durable execution via Cloudflare Workflows
// Gated by AGENT_FLOW_DURABLE_EXECUTION flag

export interface DurableRunOpts {
  flowId: string
  input: Record<string, unknown>
  presetId?: string
  parentFlowRunId?: string
}

export async function runFlowDurable(
  env: Record<string, unknown>,
  opts: DurableRunOpts,
): Promise<{ flowRunId: string; status: 'queued' }> {
  const flowRunId = crypto.randomUUID()
  // Cloudflare Workflows binding
  const workflows = (env as Record<string, unknown>).AGENT_FLOW_WORKFLOWS as {
    create(opts: { id: string; params: unknown }): Promise<unknown>
  } | undefined

  if (!workflows) {
    throw new Error('AGENT_FLOW_WORKFLOWS binding not configured')
  }

  await workflows.create({ id: flowRunId, params: opts })
  return { flowRunId, status: 'queued' }
}
