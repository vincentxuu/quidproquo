import type { StoredEvent } from './events'

export function formatSSE(event: StoredEvent): string {
  const lines = [
    `id: ${event.eventId}`,
    `event: ${event.type}`,
    `data: ${JSON.stringify(event.payload)}`,
    '',
    '',
  ]
  return lines.join('\n')
}

export function keepaliveComment(): string {
  return ': keepalive\n\n'
}
