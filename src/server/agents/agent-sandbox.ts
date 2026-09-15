import { Sandbox } from '@cloudflare/sandbox'

interface SandboxEnv {
  R2_AGENT_ARTIFACT: R2Bucket
  SESSION: KVNamespace
}

type OutboundHandler = (request: Request, env: SandboxEnv) => Promise<Response>

export class AgentSandbox extends Sandbox<SandboxEnv> {}

const outboundByHost: Record<string, OutboundHandler> = {
  'r2.artifacts': async (request, env) => {
    const key = decodeURIComponent(new URL(request.url).pathname.slice(1))
    if (!key) return new Response('missing key', { status: 400 })

    if (request.method === 'GET') {
      const obj = await env.R2_AGENT_ARTIFACT.get(key)
      if (!obj) return new Response('not found', { status: 404 })
      return new Response(obj.body, {
        headers: { 'content-type': obj.httpMetadata?.contentType ?? 'application/octet-stream' },
      })
    }
    if (request.method === 'PUT') {
      await env.R2_AGENT_ARTIFACT.put(key, request.body)
      return new Response('ok', { status: 200 })
    }
    if (request.method === 'DELETE') {
      await env.R2_AGENT_ARTIFACT.delete(key)
      return new Response('ok', { status: 200 })
    }
    return new Response('method not allowed', { status: 405 })
  },

  'kv.session': async (request, env) => {
    const key = decodeURIComponent(new URL(request.url).pathname.slice(1))
    if (!key) return new Response('missing key', { status: 400 })

    if (request.method === 'GET') {
      const value = await env.SESSION.get(key)
      if (value === null) return new Response('not found', { status: 404 })
      return new Response(value)
    }
    if (request.method === 'PUT') {
      const body = await request.text()
      await env.SESSION.put(key, body)
      return new Response('ok', { status: 200 })
    }
    return new Response('method not allowed', { status: 405 })
  },
}

;(AgentSandbox as unknown as { outboundByHost: typeof outboundByHost }).outboundByHost = outboundByHost
