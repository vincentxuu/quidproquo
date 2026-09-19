import '@/styles/chat.css'
import {
  AssistantRuntimeProvider,
  ThreadPrimitive,
  useExternalStoreRuntime,
  type AppendMessage,
  type ThreadMessageLike,
} from '@assistant-ui/react'
import { useCallback, useMemo } from 'react'

import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation'
import { PromptInput, PromptInputTextarea, PromptInputSubmit, type PromptInputMessage } from '@/components/ai-elements/prompt-input'
import type { Message } from './types'
import { ChatMessageRow } from './ChatMessageRow'
import { useChatLocale } from './locale'

interface ChatThreadProps {
  messages: Message[]
  loading: boolean
  onSend: (text: string) => void
}

export function ChatThread({ messages, loading, onSend }: ChatThreadProps) {
  const { t } = useChatLocale()
  const threadMessages: ThreadMessageLike[] = useMemo(
    () =>
      messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content || ' ',
        ...(msg.role === 'assistant' && {
          status: msg.streaming
            ? { type: 'running' as const }
            : { type: 'complete' as const, reason: 'stop' as const },
        }),
      })),
    [messages],
  )

  const handleNew = useCallback(
    async (message: AppendMessage) => {
      const text = message.content
        .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
        .map((p) => p.text)
        .join('\n')
        .trim()
      if (text) onSend(text)
    },
    [onSend],
  )

  const runtime = useExternalStoreRuntime({
    messages: threadMessages,
    isRunning: loading,
    isSendDisabled: loading,
    onNew: handleNew,
    convertMessage: (message, idx) => ({
      ...message,
      id: message.id || `msg-${idx}`,
      ...(message.role === 'assistant' && {
        status: message.status || { type: 'complete', reason: 'stop' },
      }),
      metadata: { custom: {} },
    }),
  })

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      const text = message.text.trim()
      if (text) onSend(text)
    },
    [onSend],
  )

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ThreadPrimitive.Root className="flex flex-1 flex-col overflow-hidden">
        <Conversation className="flex-1" style={{ background: 'var(--bg-subtle)' }}>
          <ConversationContent className="gap-4 p-4">
            {messages.map((msg) => (
              <ChatMessageRow key={msg.id} message={msg} />
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <div className="border-t px-3 py-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              placeholder={t('chat.placeholder')}
              disabled={loading}
              className="min-h-10 max-h-32"
            />
            <PromptInputSubmit
              disabled={loading}
              status={loading ? 'streaming' : 'ready'}
              className="chat-send-btn rounded-full"
              style={{ background: 'var(--brand-900)', color: 'var(--bg-page)' }}
            />
          </PromptInput>
        </div>
      </ThreadPrimitive.Root>
    </AssistantRuntimeProvider>
  )
}
