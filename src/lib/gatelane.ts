import { setStorage } from '@lanefoundry/gatelane-sdk/storage'
import { HttpStorage } from '@lanefoundry/gatelane-sdk/storage-http'
import { env } from 'cloudflare:workers'

interface GatelaneEnv {
  GATELANE_ENDPOINT?: string
  GATELANE_CAPTURE_TOKEN?: string
}

let initialized = false

export function initGatelane() {
  if (initialized) return
  initialized = true
  const e = env as unknown as GatelaneEnv
  const endpoint = e.GATELANE_ENDPOINT
  const token = e.GATELANE_CAPTURE_TOKEN
  if (!endpoint || !token) return
  setStorage(new HttpStorage({ endpoint, token }))
}
