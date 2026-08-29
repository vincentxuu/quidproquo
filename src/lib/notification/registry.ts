import type { NotificationChannel, RoutineSummary } from './types'

const channels = new Map<string, NotificationChannel>()

export function registerChannel(channel: NotificationChannel): void {
  channels.set(channel.id, channel)
}

export function getChannel(id: string): NotificationChannel | undefined {
  return channels.get(id)
}

export function listChannels(): NotificationChannel[] {
  return [...channels.values()]
}

export async function notifyAll(
  summary: RoutineSummary,
  channelIds: string[],
): Promise<void> {
  const results = await Promise.allSettled(
    channelIds
      .map((id) => channels.get(id))
      .filter(Boolean)
      .map((ch) => ch!.send(summary)),
  )
  for (const r of results) {
    if (r.status === 'rejected') {
      console.error('[notification] channel send failed:', r.reason)
    }
  }
}
