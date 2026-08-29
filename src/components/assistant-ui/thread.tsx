import {
  AssistantRuntimeProvider,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  fromThreadMessageLike,
  useExternalStoreRuntime,
  type AppendMessage,
  type ReasoningMessagePartProps,
  type TextMessagePartProps,
  type ThreadMessageLike,
  type ToolCallMessagePartProps,
} from '@assistant-ui/react'
import { ClipboardList, SendHorizontal, Wrench } from 'lucide-react'
import { useCallback } from 'react'

import { MessageContent as MessageBody, MessageLabel, MessageResponse } from '@/components/ai-elements/message'
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/components/ai-elements/reasoning'
import { Tool, ToolCode, ToolContent, ToolHeader } from '@/components/ai-elements/tool'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AssistantThreadProps {
  messages: ThreadMessageLike[]
  running?: boolean
  composer?: boolean
  composerInputId?: string
  composerPlaceholder?: string
  onSend?: (text: string) => Promise<void>
}

export function AssistantThread({
  messages,
  running = false,
  composer = false,
  composerInputId,
  composerPlaceholder = '輸入訊息...',
  onSend,
}: AssistantThreadProps) {
  const handleNew = useCallback(async (message: AppendMessage) => {
    const text = message.content
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text' && typeof part.text === 'string')
      .map(part => part.text)
      .join('\n')
      .trim()
    if (text) await onSend?.(text)
  }, [onSend])

  const runtime = useExternalStoreRuntime<ThreadMessageLike>({
    messages,
    isRunning: running,
    isSendDisabled: running,
    onNew: handleNew,
    convertMessage: message => fromThreadMessageLike(message, message.id || crypto.randomUUID(), { type: 'complete', reason: 'stop' }),
  })

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ThreadPrimitive.Root className="flex min-h-[calc(100vh-22rem)] max-h-[calc(100vh-18rem)] flex-col overflow-hidden rounded-[var(--admin-radius)] border border-[var(--admin-border)] bg-[var(--admin-surface)]">
        <ThreadPrimitive.Viewport autoScroll className="flex-1 overflow-y-auto px-5 py-4">
          <ThreadPrimitive.Empty>
            <p className="py-12 text-center text-sm text-[var(--admin-text-muted)]">連線中...</p>
          </ThreadPrimitive.Empty>
          <ThreadPrimitive.Messages components={{ UserMessage, AssistantMessage, SystemMessage }} />
        </ThreadPrimitive.Viewport>
        {composer ? <AssistantComposer inputId={composerInputId} placeholder={composerPlaceholder} /> : null}
      </ThreadPrimitive.Root>
    </AssistantRuntimeProvider>
  )
}

function AssistantComposer({ inputId, placeholder }: { inputId?: string; placeholder: string }) {
  return (
    <ComposerPrimitive.Root className="flex items-end gap-2 border-t border-[var(--admin-border)] bg-[var(--admin-surface)] p-2">
      <ComposerPrimitive.Input
        id={inputId}
        rows={2}
        submitMode="enter"
        unstable_insertNewlineOnTouchEnter
        placeholder={placeholder}
        className="min-h-14 flex-1 resize-y rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[rgba(47,111,70,0.18)]"
      />
      <ComposerPrimitive.Send asChild>
        <Button type="submit" aria-label="送出">
          <SendHorizontal className="size-4" />
          送出
        </Button>
      </ComposerPrimitive.Send>
    </ComposerPrimitive.Root>
  )
}

function UserMessage() {
  return (
    <MessagePrimitive.Root
      data-role="user"
      className="flex w-full justify-end py-2"
    >
      <MessageBody className="max-w-[min(680px,86%)] border-[var(--brand-200)] bg-[var(--brand-50)]">
        <MessageLabel>User</MessageLabel>
        <MessagePrimitive.Parts components={{ Text: TextPart }} />
      </MessageBody>
    </MessagePrimitive.Root>
  )
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root
      data-role="assistant"
      className="flex w-full justify-start py-2"
    >
      <MessageBody className="max-w-[min(760px,100%)] bg-white">
        <MessageLabel>Assistant</MessageLabel>
        <MessagePrimitive.Parts components={{ Text: TextPart, Reasoning: ReasoningPart, tools: { Fallback: ToolPart } }} />
      </MessageBody>
    </MessagePrimitive.Root>
  )
}

function SystemMessage() {
  return (
    <MessagePrimitive.Root
      data-role="system"
      className="flex w-full justify-center py-1"
    >
      <MessageBody className="max-w-[min(760px,100%)] border-transparent bg-transparent px-0 py-1 shadow-none">
        <MessagePrimitive.Parts components={{ Text: SystemTextPart }} />
      </MessageBody>
    </MessagePrimitive.Root>
  )
}

function TextPart({ text }: TextMessagePartProps) {
  return <MessageResponse>{text}</MessageResponse>
}

function SystemTextPart({ text }: TextMessagePartProps) {
  return <div className="text-sm text-[var(--admin-text-muted)]">{text}</div>
}

function ReasoningPart({ text }: ReasoningMessagePartProps) {
  return (
    <Reasoning>
      <ReasoningTrigger>Thinking</ReasoningTrigger>
      <ReasoningContent>{text}</ReasoningContent>
    </Reasoning>
  )
}

function ToolPart(props: ToolCallMessagePartProps) {
  const state = props.status?.type === 'complete' ? 'success' : props.status?.type === 'incomplete' ? 'error' : 'pending'
  const args = props.argsText || stringify(props.args)
  const result = stringify(props.result)

  return (
    <Tool state={state}>
      <ToolHeader>
        <Wrench className="size-4 shrink-0 text-[var(--admin-text-muted)]" />
        <strong className="text-[var(--admin-text)]">{props.toolName}</strong>
        <span className={cn('text-xs text-[var(--admin-text-muted)]', state === 'pending' && 'ml-auto')}>{state}</span>
      </ToolHeader>
      <ToolContent>
        {args ? <ToolCode>{args}</ToolCode> : null}
        {result ? (
          <div>
            <div className="mb-1 text-xs font-semibold uppercase text-[var(--admin-text-muted)]">Output</div>
            <ToolCode>{result}</ToolCode>
          </div>
        ) : null}
      </ToolContent>
    </Tool>
  )
}

export function AdminSystemMessage({ children }: { children: string }) {
  return (
    <div className="flex w-full justify-center py-1">
      <div className="flex max-w-[min(760px,100%)] items-center gap-2 rounded-full border border-[var(--admin-border)] bg-[var(--admin-color-surface-subtle)] px-3 py-1.5 text-xs text-[var(--admin-text-muted)]">
        <ClipboardList className="size-3.5" />
        {children}
      </div>
    </div>
  )
}

function stringify(value: unknown) {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}
