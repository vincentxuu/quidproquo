import { describe, it, expect } from 'vitest'
import { scan, redact } from './scanner'
import { intersectGrants } from './tool-allowlist'
import { wireSecurityEnforcement } from './wire'

describe('security enforcement — scanner', () => {
  it('detects email patterns in text', () => {
    const matches = scan('Contact user@example.com for details', ['email'])
    expect(matches).toHaveLength(1)
    expect(matches[0]).toMatchObject({ kind: 'email', value: 'user@example.com' })
  })

  it('returns empty matches when no pattern found', () => {
    const matches = scan('No sensitive data here', ['email'])
    expect(matches).toHaveLength(0)
  })

  it('detects multiple emails', () => {
    const matches = scan('From a@x.com to b@y.com', ['email'])
    expect(matches).toHaveLength(2)
  })
})

describe('security enforcement — redact', () => {
  it('redacts email from output with indexed placeholder', () => {
    const text = 'Contact user@example.com for details'
    const matches = scan(text, ['email'])
    const { redacted, redactionMap } = redact(text, matches)

    expect(redacted).not.toContain('user@example.com')
    expect(redacted).toContain('[REDACTED_EMAIL_1]')
    expect(redactionMap['[REDACTED_EMAIL_1]']).toBe('user@example.com')
  })

  it('redacts multiple emails with incrementing counters', () => {
    const text = 'From a@x.com to b@y.com'
    const matches = scan(text, ['email'])
    const { redacted } = redact(text, matches)

    expect(redacted).toContain('[REDACTED_EMAIL_1]')
    expect(redacted).toContain('[REDACTED_EMAIL_2]')
    expect(redacted).not.toContain('@')
  })

  it('returns unchanged text when no matches', () => {
    const text = 'Nothing sensitive here'
    const { redacted, redactionMap } = redact(text, [])
    expect(redacted).toBe(text)
    expect(Object.keys(redactionMap)).toHaveLength(0)
  })
})

describe('security enforcement — intersectGrants', () => {
  it('allows all syscalls when no policy tool_allowlist', () => {
    const result = intersectGrants(['search.posts', 'search.external'], undefined)
    expect(result.effective).toEqual(['search.posts', 'search.external'])
    expect(result.denied).toEqual([])
  })

  it('blocks syscalls not in tool_allowlist', () => {
    const result = intersectGrants(['search.posts', 'search.external'], ['search.posts'])
    expect(result.effective).toEqual(['search.posts'])
    expect(result.denied).toEqual(['search.external'])
  })

  it('returns empty effective when no syscalls match allowlist', () => {
    const result = intersectGrants(['search.external'], ['search.posts'])
    expect(result.effective).toEqual([])
    expect(result.denied).toEqual(['search.external'])
  })

  it('handles empty agent syscall list', () => {
    const result = intersectGrants([], ['search.posts'])
    expect(result.effective).toEqual([])
    expect(result.denied).toEqual([])
  })
})

describe('security enforcement — wireSecurityEnforcement', () => {
  it('allows all calls when no security policy', () => {
    const wire = wireSecurityEnforcement(undefined)
    const result = wire.checkBeforeCall('search.external', {}, ['search.external'])
    expect(result.allowed).toBe(true)
    expect(result.violations).toHaveLength(0)
  })

  it('blocks syscall not in tool_allowlist', () => {
    const wire = wireSecurityEnforcement({ tool_allowlist: ['search.posts'] })
    const result = wire.checkBeforeCall('search.external', {}, ['search.external'])
    expect(result.allowed).toBe(false)
    expect(result.violations).toContain("syscall 'search.external' not in tool_allowlist")
  })

  it('allows syscall in tool_allowlist', () => {
    const wire = wireSecurityEnforcement({ tool_allowlist: ['search.posts'] })
    const result = wire.checkBeforeCall('search.posts', {}, ['search.posts'])
    expect(result.allowed).toBe(true)
    expect(result.violations).toHaveLength(0)
  })

  it('redacts email from output when sensitive_data_redaction configured', () => {
    const wire = wireSecurityEnforcement({
      sensitive_data_redaction: {
        patterns: [{ name: 'email', pattern: '', action: 'redact', kind: 'email' } as never],
        action: 'redact',
      },
    })
    const result = wire.checkAfterCall('search.posts', 'Contact user@example.com for details')
    expect(result.redactedOutput).not.toContain('user@example.com')
    expect(result.violations).toContain('email detected')
  })

  it('returns no violations when output has no sensitive data', () => {
    const wire = wireSecurityEnforcement({
      sensitive_data_redaction: {
        patterns: [{ name: 'email', pattern: '', action: 'redact', kind: 'email' } as never],
        action: 'redact',
      },
    })
    const result = wire.checkAfterCall('search.posts', 'Nothing sensitive here')
    expect(result.violations).toHaveLength(0)
    expect(result.redactedOutput).toBeUndefined()
  })
})
