export interface ContextMessage {
  role: string
  content: string
}

export interface PruneResult {
  messages: ContextMessage[]
  dropped: number
  summary: string
}

export function estimateTokens(messages: ContextMessage[]): number {
  return Math.ceil(messages.reduce((total, message) => total + message.content.length, 0) / 4)
}

export function defaultPrune(messages: ContextMessage[], maxTokens: number, keepRecent = 8): PruneResult {
  if (estimateTokens(messages) <= maxTokens) {
    return { messages, dropped: 0, summary: '' }
  }
  const system = messages.find((message) => message.role === 'system')
  const recent = messages.slice(-keepRecent)
  const droppedMessages = messages.filter((message) => message !== system && !recent.includes(message))
  const summary = droppedMessages.map((message) => `${message.role}: ${message.content}`).join('\n').slice(0, 4000)
  const pruned = [
    ...(system ? [system] : []),
    { role: 'system', content: `Earlier context summary:\n${summary}` },
    ...recent,
  ]
  return { messages: pruned, dropped: droppedMessages.length, summary }
}
