import { nowMs } from '../utils/dates'
import { createAccessManager, type AgentDefinition } from './access'
import { AgentRegistrationError } from './errors'
import { createScheduler } from './scheduler'
import type { AgentOsBackends } from './storage'
import { createBackends } from './storage'
import type { Env } from '../config/env'
import { readFlags } from '../config/flags'
import { registerDefaultSyscalls } from './tools/register-defaults'
import { createSyscallHelper } from './tools/syscall'
import { registerDefaultLlmProviders } from '../agent-providers/providers/llm/register-defaults'
import { registerDefaultSearchProviders } from '../agent-providers/providers/search/register-defaults'
import { registerDefaultReaderProviders } from '../agent-providers/providers/reader/register-defaults'
import { listAll } from '../agent-providers/registry'

export function createKernel(env: Env, providedBackends?: AgentOsBackends) {
  registerDefaultSyscalls()

  const flags = readFlags(env)
  if (flags.providers.enabled) {
    registerDefaultLlmProviders()
    registerDefaultSearchProviders()
    registerDefaultReaderProviders()
    const ids = listAll().map((p) => p.providerId)
    console.log('[kernel] registered providers:', ids.join(', '))
  }
  const backends = providedBackends ?? createBackends(env)
  const registry = new Map<string, AgentDefinition<any, any>>()
  const access = createAccessManager(backends)
  const syscall = createSyscallHelper({
    backends,
    getRun: (runId) => backends.runs.get(runId),
    getProcess: (agentId) => backends.processes.get(agentId),
    checkSyscall: access.checkSyscall,
    checkOutboundDomain: access.checkOutboundDomain,
    requestApproval: access.requestApproval,
  })
  const scheduler = createScheduler({ backends, registry, syscall })

  return {
    scheduler,
    context: {},
    memory: {},
    storage: backends,
    tools: { syscall },
    access,
    async defineAgent(definition: AgentDefinition<any, any>) {
      if (registry.has(definition.id)) {
        throw new AgentRegistrationError(`Duplicate agent id: ${definition.id}`)
      }
      registry.set(definition.id, definition)
      const now = nowMs()
      await backends.processes.upsert({
        agentId: definition.id,
        version: definition.version,
        displayName: definition.displayName ?? definition.id,
        description: definition.description,
        schedule: definition.schedule,
        toolCallLimit: definition.toolCallLimit,
        timeoutSeconds: definition.timeoutSeconds,
        maxConcurrent: definition.maxConcurrent ?? 1,
        approvalTtlSeconds: definition.approvalTtlSeconds ?? 86400,
        createdAt: now,
        updatedAt: now,
      })
      await access.mirrorPermissions(definition)
      return definition
    },
    syscall,
    listAgents() {
      return [...registry.values()].map((agent) => ({
        id: agent.id,
        version: agent.version,
        displayName: agent.displayName ?? agent.id,
        description: agent.description,
      }))
    },
  }
}

export type AgentOsKernel = ReturnType<typeof createKernel>
