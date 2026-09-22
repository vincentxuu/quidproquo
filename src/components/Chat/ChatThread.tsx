import '@/styles/chat.css'
import {
  AssistantRuntimeProvider,
  ThreadPrimitive,
  useExternalStoreRuntime,
  type AppendMessage,
  type ThreadMessageLike,
} from '@assistant-ui/react'
import { type KeyboardEvent, type ReactNode, useCallback, useMemo } from 'react'

import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation'
import { PromptInput, PromptInputTextarea, PromptInputSubmit, type PromptInputMessage } from '@/components/ai-elements/prompt-input'
import type { Message } from './types'
import { ChatMessageRow } from './ChatMessageRow'
import { useChatLocale } from './locale'

interface ChatThreadProps {
  messages: Message[]
  loading: boolean
  onSend: (text: string) => void
  onStop?: () => void
  onRetry?: (assistantId: string) => void
  /** 貼在輸入框正上方（建議問題） */
  beforeComposer?: ReactNode
  /** 輸入框下方一行小字（免責、額度） */
  footerNote?: ReactNode
}

export function ChatThread({ messages, loading, onSend, onStop, onRetry, beforeComposer, footerNote }: ChatThreadProps) {
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
      if (text && !loading) onSend(text)
    },
    [onSend, loading],
  )

  // 回答中可以先打下一題，但 Enter 不送出：PromptInput 送出前會清空 textarea，放行會把字吃掉
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (loading && e.key === 'Enter' && !e.shiftKey) e.preventDefault()
    },
    [loading],
  )

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ThreadPrimitive.Root className="flex flex-1 flex-col overflow-hidden">
        <Conversation className="flex-1" style={{ background: 'var(--bg-subtle)' }} aria-label={t('chat.log.aria')}>
          {/* scrollClassName 靜態給 overflow-y-auto：use-stick-to-bottom 要到 hydration 後的
              effect 才補 overflow:auto，在那之前 scrollbar-gutter 不生效，傳統捲軸的瀏覽器
              會看到內容左右跳 15px（視覺回歸也因此偶發紅燈）。 */}
          <ConversationContent className="gap-4 p-4" scrollClassName="overflow-y-auto">
            {messages.map((msg) => (
              <ChatMessageRow
                key={msg.id}
                message={msg}
                onRetry={msg.error && onRetry && !loading ? () => onRetry(msg.id) : undefined}
              />
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        {beforeComposer}
        <div className="border-t px-3 pt-2 pb-1.5" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              placeholder={t('chat.placeholder')}
              onKeyDown={handleKeyDown}
              enterKeyHint="send"
              // 字級不覆寫：InputGroupTextarea 本來就是 text-base + md:text-sm，
              // 手機維持 16px，iOS Safari 聚焦才不會整頁放大
              className="min-h-10 max-h-32"
            />
            <PromptInputSubmit
              status={loading ? 'streaming' : 'ready'}
              onStop={onStop}
              aria-label={loading ? t('chat.action.stop') : t('chat.action.send')}
              className="chat-send-btn rounded-full"
              style={{ background: 'var(--brand-900)', color: 'var(--bg-page)' }}
            />
          </PromptInput>
          {footerNote && (
            <div className="mt-1.5 flex items-center gap-3 px-1 text-xs leading-4" style={{ color: 'var(--text-muted)' }}>
              {footerNote}
            </div>
          )}
        </div>
      </ThreadPrimitive.Root>
    </AssistantRuntimeProvider>
  )
}
