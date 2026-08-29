import type { NotificationChannel, RoutineSummary, PlatformFailure } from './types'
import { createDiscordChannel } from './channels/discord'
import { createNtfyChannel } from './channels/ntfy'

interface ChannelConfig {
  type: string
  webhook_url?: string
  topic?: string
}

interface NotificationRouterDeps {
  siteUrl: string
  discordWebhookUrl?: string
  ntfyTopic?: string
}

export function createNotificationRouter(deps: NotificationRouterDeps) {
  function buildGlobalChannels(): NotificationChannel[] {
    const channels: NotificationChannel[] = []
    if (deps.discordWebhookUrl) {
      channels.push(createDiscordChannel({ id: 'global-discord', webhookUrl: deps.discordWebhookUrl, siteUrl: deps.siteUrl }))
    }
    if (deps.ntfyTopic) {
      channels.push(createNtfyChannel({ id: 'global-ntfy', topic: deps.ntfyTopic }))
    }
    return channels
  }

  function buildRoutineChannels(channelsJson: string | null): NotificationChannel[] {
    if (!channelsJson) return []
    try {
      const configs = JSON.parse(channelsJson) as ChannelConfig[]
      return configs
        .map((c, i) => {
          if (c.type === 'discord' && c.webhook_url) return createDiscordChannel({ id: `routine-discord-${i}`, webhookUrl: c.webhook_url, siteUrl: deps.siteUrl })
          if (c.type === 'ntfy' && c.topic) return createNtfyChannel({ id: `routine-ntfy-${i}`, topic: c.topic })
          return null
        })
        .filter((c): c is NotificationChannel => c !== null)
    } catch {
      return []
    }
  }

  return {
    async notify(summary: RoutineSummary, routineChannelsJson: string | null, notificationEnabled: boolean): Promise<void> {
      if (!notificationEnabled) return

      const channels = [
        ...buildGlobalChannels(),
        ...buildRoutineChannels(routineChannelsJson),
      ]
      const seen = new Set<string>()
      for (const ch of channels) {
        if (seen.has(ch.id)) continue
        seen.add(ch.id)
        try { await ch.send(summary) } catch { /* best effort */ }
      }
    },

    async notifyPlatformFailure(failure: PlatformFailure): Promise<void> {
      const channels = buildGlobalChannels()
      for (const ch of channels) {
        try { await ch.sendPlatformFailure?.(failure) } catch { /* best effort */ }
      }
    },
  }
}
