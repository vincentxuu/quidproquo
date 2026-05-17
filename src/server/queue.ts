import type { AgentQueueMessage, Env } from '@/lib/config/env'
import { readFlags } from '@/lib/config/flags'
import { createKernel } from '@/lib/agent-os/kernel'
import { registerAgentDefinitions } from '@/lib/agent-os/registry'
import { createBackends } from '@/lib/agent-os/storage'
import { nowMs } from '@/lib/utils/dates'

// Queue entrypoint adapter for Agent OS.
// Astro's Cloudflare adapter emits the HTTP Worker entry, while queue() needs Worker-level
// glue. scripts/create-cron-entry.mjs generates the deploy entry that calls this handler.

interface QueueMessage<T> {
  id?: string
  body: T
  ack(): void
  retry(options?: { delaySeconds?: number }): void
}

interface QueueBatch<T> {
  messages: QueueMessage<T>[]
}

export async function handleQueueBatch(
  batch: QueueBatch<AgentQueueMessage>,
  env: Env,
  _ctx: ExecutionContext
): Promise<void> {
  const flags = readFlags(env)
  const backends = createBackends(env)
  const kernel = createKernel(env, backends)
  await registerAgentDefinitions(kernel)

  if (!flags.agentOs.scheduler.queues) {
    for (const msg of batch.messages) {
      await recordDeniedQueueMessage(backends, msg.body, 'queues_disabled')
      msg.ack()
    }
    return
  }

  for (const msg of batch.messages) {
    const payload = msg.body
    if (!payload?.agentId) {
      console.warn('[agent-os] Dropping invalid queue message', payload)
      msg.ack()
      continue
    }

    try {
      await kernel.scheduler.dispatchRun({
        agentId: payload.agentId,
        trigger: 'queue',
        input: payload.input ?? {},
        parentRunId: payload.parentRunId,
        userId: 'system',
      })
      msg.ack()
    } catch {
      msg.retry({ delaySeconds: 30 })
    }
  }
}

async function recordDeniedQueueMessage(
  backends: ReturnType<typeof createBackends>,
  payload: AgentQueueMessage,
  reason: 'queues_disabled'
): Promise<void> {
  if (!payload?.agentId) {
    console.warn('[agent-os] Dropping invalid queue message while queues disabled', payload)
    return
  }

  const process = await backends.processes.get(payload.agentId)
  if (!process) {
    console.warn('[agent-os] Dropping queue message for unknown agent while queues disabled', payload.agentId)
    return
  }

  const at = nowMs()
  const runId = crypto.randomUUID()
  await backends.runs.create({
    runId,
    agentId: payload.agentId,
    agentVersion: process.version,
    status: 'cancelled',
    trigger: 'queue',
    parentRunId: payload.parentRunId,
    input: payload.input ?? {},
    error: { reason },
    cancelSignal: false,
    startedAt: at,
    finishedAt: at,
    totalTokens: 0,
    totalCostUsd: 0,
    totalToolCalls: 0,
  })
  await backends.events.record({
    runId,
    kind: 'denied',
    payload: { reason, message: payload },
    at,
  })
}
