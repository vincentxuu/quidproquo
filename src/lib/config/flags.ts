import type { Env } from './env'

export interface Flags {
  agentOs: {
    enabled: boolean
    planner: boolean
    research: boolean
    writer: boolean
    critic: boolean
    memory: {
      r2: boolean
    }
    tools: {
      mcpExternal: boolean
    }
    scheduler: {
      queues: boolean
    }
  }
}

function readBoolean(raw: unknown): boolean {
  return typeof raw === 'string' && raw.trim().toLowerCase() === 'true'
}

export function readFlags(env: Env): Flags {
  return {
    agentOs: {
      enabled: readBoolean(env.AGENT_OS_ENABLED),
      planner: readBoolean(env.AGENT_OS_PLANNER),
      research: readBoolean(env.AGENT_OS_RESEARCH),
      writer: readBoolean(env.AGENT_OS_WRITER),
      critic: readBoolean(env.AGENT_OS_CRITIC),
      memory: { r2: readBoolean(env.AGENT_OS_MEMORY_R2) },
      tools: { mcpExternal: readBoolean(env.AGENT_OS_TOOLS_MCP_EXTERNAL) },
      scheduler: { queues: readBoolean(env.AGENT_OS_SCHEDULER_QUEUES) },
    },
  }
}

export const flagReaders = {
  readBoolean,
}
