export type TraceScope = 'production' | 'admin' | 'eval'
export type ChatCacheMode = 'default' | 'bypass'

export interface ChatRequestPolicy {
  traceScope: TraceScope
  cacheMode: ChatCacheMode
  bypassSemanticCache: boolean
}

export class ChatRequestPolicyError extends Error {
  readonly status: number
  readonly code: string

  constructor(message: string, status = 403, code = 'cache_bypass_forbidden') {
    super(message)
    this.name = 'ChatRequestPolicyError'
    this.status = status
    this.code = code
  }
}

export function resolveChatRequestPolicy(input: {
  requestedTraceScope?: string
  requestedCacheMode?: string
  isAdmin: boolean
}): ChatRequestPolicy {
  const requestedBypass = input.requestedCacheMode === 'bypass'
  if (requestedBypass && !input.isAdmin) {
    throw new ChatRequestPolicyError('Semantic-cache bypass requires an authenticated admin session')
  }

  const traceScope = input.isAdmin
    ? normalizeAdminTraceScope(input.requestedTraceScope)
    : 'production'

  return {
    traceScope,
    cacheMode: requestedBypass ? 'bypass' : 'default',
    bypassSemanticCache: requestedBypass,
  }
}

function normalizeAdminTraceScope(requestedScope?: string): TraceScope {
  if (requestedScope === 'admin' || requestedScope === 'eval' || requestedScope === 'production') {
    return requestedScope
  }
  return 'admin'
}
