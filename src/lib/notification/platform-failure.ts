import type { PlatformFailure } from './types'
import { listChannels } from './registry'

export async function notifyPlatformFailure(failure: PlatformFailure): Promise<void> {
  const channels = listChannels()
  const results = await Promise.allSettled(
    channels
      .filter((ch) => ch.sendPlatformFailure)
      .map((ch) => ch.sendPlatformFailure!(failure)),
  )
  for (const r of results) {
    if (r.status === 'rejected') {
      console.error('[notification] platform-failure send failed:', r.reason)
    }
  }
}
