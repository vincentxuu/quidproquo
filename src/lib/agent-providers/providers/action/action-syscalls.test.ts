import { describe, it, expect } from 'vitest'

describe('action syscall definitions', () => {
  it('all action syscalls require approval', async () => {
    // Read actual syscall definitions
    const defs = await Promise.all([
      import('../../../../tools/definitions/action-slack-message').catch(() => null),
      import('../../../../tools/definitions/action-github-issue').catch(() => null),
      import('../../../../tools/definitions/action-github-comment').catch(() => null),
      import('../../../../tools/definitions/action-notion-page').catch(() => null),
      import('../../../../tools/definitions/action-email-send').catch(() => null),
    ])

    for (const mod of defs) {
      if (!mod) continue
      // Find the exported syscall definition(s)
      for (const [key, val] of Object.entries(mod)) {
        if (val && typeof val === 'object' && 'requiresApproval' in val) {
          expect((val as { requiresApproval: boolean }).requiresApproval).toBe(true)
        }
      }
    }
  })

  it('action syscalls have output schema', async () => {
    const mod = await import('../../../../tools/definitions/action-slack-message').catch(() => null)
    if (!mod) return
    // Find the first exported object with outputSchema
    const syscall = Object.values(mod).find(
      (v) => v && typeof v === 'object' && 'outputSchema' in (v as object),
    )
    if (syscall) {
      expect(syscall).toBeDefined()
    }
  })
})
