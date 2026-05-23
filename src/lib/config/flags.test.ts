import { describe, expect, it } from 'vitest'
import type { Env } from './env'
import { flagReaders, readFlags } from './flags'

describe('readFlags', () => {
  it('defaults agent-os flags to false', () => {
    const flags = readFlags({} as Env)
    expect(flags.agentOs).toEqual({
      enabled: false,
      planner: false,
      research: false,
      writer: false,
      critic: false,
      memory: { r2: false },
      tools: { mcpExternal: false },
      scheduler: { queues: false },
    })
  })

  it('defaults pipelinesUnify flags correctly', () => {
    const flags = readFlags({} as Env)
    expect(flags.pipelinesUnify.portedToFlow).toBe(false)
    expect(flags.pipelinesUnify.adminRedirect).toBe(false)
    expect(flags.pipelinesUnify.adminJobsWritesEnabled).toBe(true)
    expect(flags.pipelinesUnify.useFlow('research-brief')).toBe(false)
  })

  it('parses pipelinesUnify useFlow per pipeline flag', () => {
    const flags = readFlags({ PIPELINE_RESEARCH_BRIEF_USE_FLOW: 'true' } as Env)
    expect(flags.pipelinesUnify.useFlow('research-brief')).toBe(true)
    expect(flags.pipelinesUnify.useFlow('translation')).toBe(false)
    expect(flags.pipelinesUnify.useFlow('unknown-pipeline')).toBe(false)
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
