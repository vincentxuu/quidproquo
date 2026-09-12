import { env } from 'cloudflare:workers'

interface GatelaneEnv {
  GATELANE_ENDPOINT?: string
  GATELANE_CAPTURE_TOKEN?: string
}

type GatelaneCapture = typeof import('@lanefoundry/gatelane-sdk/capture').capture

let initialized = false
let captureImpl: GatelaneCapture | null = null

export function initGatelane() {
  if (initialized) return
  initialized = true
  const e = env as unknown as GatelaneEnv
  const endpoint = e.GATELANE_ENDPOINT
  const token = e.GATELANE_CAPTURE_TOKEN
  if (!endpoint || !token) return

  import('@lanefoundry/gatelane-sdk/storage').then(({ setStorage }) =>
    import('@lanefoundry/gatelane-sdk/storage-http').then(({ HttpStorage }) =>
      setStorage(new HttpStorage({ endpoint, token }))
    )
  ).catch(() => {})
}

export async function gatelaneCapture<T>(
  input: { prompt: Array<{ role: string; content: string }>; model?: string; metadata?: Record<string, unknown> },
  call: () => Promise<T>,
): Promise<T> {
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
