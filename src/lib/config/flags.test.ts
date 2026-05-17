import { describe, expect, it } from 'vitest'
import type { Env } from './env'
import { flagReaders, readFlags } from './flags'

describe('readFlags', () => {
  it('defaults agent-os flags to false', () => {
    expect(readFlags({} as Env)).toEqual({
      agentOs: {
        enabled: false,
        planner: false,
        research: false,
        writer: false,
        critic: false,
        memory: { r2: false },
        tools: { mcpExternal: false },
        scheduler: { queues: false },
      },
    })
  })

  it('parses enabled agent-os flags', () => {
    expect(readFlags({
      AGENT_OS_ENABLED: 'true',
      AGENT_OS_PLANNER: 'true',
      AGENT_OS_RESEARCH: 'true',
      AGENT_OS_WRITER: 'true',
      AGENT_OS_CRITIC: 'true',
      AGENT_OS_MEMORY_R2: 'true',
      AGENT_OS_TOOLS_MCP_EXTERNAL: 'true',
      AGENT_OS_SCHEDULER_QUEUES: 'true',
    } as Env).agentOs).toEqual({
      enabled: true,
      planner: true,
      research: true,
      writer: true,
      critic: true,
      memory: { r2: true },
      tools: { mcpExternal: true },
      scheduler: { queues: true },
    })
  })

  it('parses only the true string as enabled', () => {
    expect(flagReaders.readBoolean('true')).toBe(true)
    expect(flagReaders.readBoolean(' TRUE ')).toBe(true)
    expect(flagReaders.readBoolean('1')).toBe(false)
    expect(flagReaders.readBoolean('yes')).toBe(false)
    expect(flagReaders.readBoolean(undefined)).toBe(false)
  })
})
