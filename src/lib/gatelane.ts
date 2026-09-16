import { env } from 'cloudflare:workers'

interface GatelaneEnv {
  GATELANE_ENDPOINT?: string
  GATELANE_CAPTURE_TOKEN?: string
}

type GatelaneCapture = typeof import('@lanefoundry/gatelane-sdk/capture').capture

let initialized = false
let configured = false
let captureImpl: GatelaneCapture | null = null

export function initGatelane() {
  if (initialized) return
  initialized = true
  const e = env as unknown as GatelaneEnv
  const endpoint = e.GATELANE_ENDPOINT
  const token = e.GATELANE_CAPTURE_TOKEN
  if (!endpoint || !token) return
  configured = true

  import('@lanefoundry/gatelane-sdk/storage').then(({ setStorage }) =>
    import('@lanefoundry/gatelane-sdk/storage-http').then(({ HttpStorage }) =>
      setStorage(new HttpStorage({ endpoint, token }))
    )
  ).catch(() => {})
}

/**
 * GATELANE_ENDPOINT/GATELANE_CAPTURE_TOKEN are unset in production, so
 * initGatelane() always no-ops and setStorage() never runs. The SDK's
 * capture() then falls through to its default StorageAdapter —
 * InMemoryStorage — whose `records` Map has no eviction and is never
 * cleared. Every invokeModel() call from every stage (planner/research/
 * writer/critic, plus deep-research and glossary/explain) funnels through
 * here, so that Map grew unboundedly for the isolate's whole warm lifetime
 * until Workers killed it for exceeding the 128MB memory limit — which is
 * what took down /api/chat. Only route through the SDK when gatelane is
 * actually configured; otherwise call straight through so nothing gets
 * buffered.
 */
export async function gatelaneCapture<T>(
  input: { prompt: Array<{ role: string; content: string }>; model?: string; metadata?: Record<string, unknown> },
  call: () => Promise<T>,
): Promise<T> {
  if (!configured) return call()
  if (!captureImpl) {
    try {
      const mod = await import('@lanefoundry/gatelane-sdk/capture')
      captureImpl = mod.capture
    } catch {
      return call()
    }
  }
  return captureImpl(input, call)
}
