export function withNotice(url: string, type: 'success' | 'error', message: string): string {
  const base = url.startsWith('http') ? url : `http://internal${url.startsWith('/') ? '' : '/'}${url}`
  const next = new URL(base)
  next.searchParams.set(type === 'success' ? 'rbac_success' : 'rbac_error', message)
  return `${next.pathname}${next.search}${next.hash}`
}

export function redirectWithNotice(url: string, type: 'success' | 'error', message: string): Response {
  return new Response(null, {
    status: 303,
    headers: { Location: withNotice(url, type, message) },
  })
}
