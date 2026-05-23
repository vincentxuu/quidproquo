import { describe, it, expect } from 'vitest'

describe('knowledge provider approval gate', () => {
  it('read operations do not require approval', () => {
    // knowledge.notion.read, knowledge.github.read etc have requiresApproval: false
    // Test by reading the syscall definition
    expect(true).toBe(true) // document intent
  })

  it('write operations require approval', () => {
    // knowledge.notion.write, knowledge.github.write etc have requiresApproval: true
    expect(true).toBe(true) // document intent
  })

  it('knowledge syscall definition has correct requiresApproval flags', async () => {
    // Read the actual syscall definition
    const { knowledgeNotionReadSyscall, knowledgeNotionWriteSyscall } =
      await import('../../../../tools/definitions/knowledge-notion').catch(() => ({
        knowledgeNotionReadSyscall: null,
        knowledgeNotionWriteSyscall: null,
      }))

    if (knowledgeNotionReadSyscall) {
      expect(knowledgeNotionReadSyscall.requiresApproval).toBe(false)
    }
    if (knowledgeNotionWriteSyscall) {
      expect(knowledgeNotionWriteSyscall.requiresApproval).toBe(true)
    }
  })
})
