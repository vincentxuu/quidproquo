import type { Env } from '../config/env'
import { createDiscordChannel } from './channels/discord'
import { createNtfyChannel } from './channels/ntfy'
import { getChannel, registerChannel } from './registry'

/**
 * Registers global notification channels from env secrets (option A).
 * Idempotent: re-registering the same id overwrites the same config.
 * Unset env = no channels = notification dispatch is a silent no-op.
 */
export function ensureGlobalChannels(env: Env): void {
  const siteUrl = typeof env.URL === 'string' ? env.URL : ''

  const webhookUrl = env.NOTIFICATION_DISCORD_WEBHOOK_URL
  if (typeof webhookUrl === 'string' && webhookUrl.length > 0 && !getChannel('global-discord')) {
    registerChannel(createDiscordChannel({ id: 'global-discord', webhookUrl, siteUrl }))
  }

  const topic = env.NOTIFICATION_NTFY_TOPIC
  if (typeof topic === 'string' && topic.length > 0 && !getChannel('global-ntfy')) {
    registerChannel(createNtfyChannel({ id: 'global-ntfy', topic }))
  }
}
