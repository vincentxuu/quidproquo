import { describe, expect, it } from 'vitest'
import { redirectWithNotice, withNotice } from './redirect'

describe('withNotice', () => {
  it('adds success notice while preserving existing tab query', () => {
    expect(withNotice('/admin/console/rbac?tab=users', 'success', 'ok')).toBe(
      '/admin/console/rbac?tab=users&rbac_success=ok',
    )
  })

  it('adds error notice to relative paths without an existing query', () => {
    expect(withNotice('/admin/console/rbac', 'error', 'bad role')).toBe(
      '/admin/console/rbac?rbac_error=bad+role',
    )
  })

  it('redirects to relative admin paths without requiring an absolute URL', () => {
    const response = redirectWithNotice('/admin/console/rbac?tab=roles', 'success', 'ok')
    expect(response.status).toBe(303)
    expect(response.headers.get('Location')).toBe('/admin/console/rbac?tab=roles&rbac_success=ok')
  })
})
