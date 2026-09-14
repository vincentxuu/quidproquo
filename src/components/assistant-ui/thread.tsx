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
import { Bot, SendHorizontal, Wrench } from 'lucide-react'
import { useCallback } from 'react'

import { MessageResponse } from '@/components/ai-elements/message'
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
      <ThreadPrimitive.Root className="flex flex-1 flex-col overflow-hidden">
        <ThreadPrimitive.Viewport autoScroll className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <ThreadPrimitive.Empty>
            <p className="py-12 text-center text-sm text-[var(--admin-text-muted)]">連線中...</p>
          </ThreadPrimitive.Empty>
          <div className="mx-auto max-w-[760px]">
            <ThreadPrimitive.Messages components={{ UserMessage, AssistantMessage, SystemMessage }} />
          </div>
        </ThreadPrimitive.Viewport>
        {composer ? <AssistantComposer inputId={composerInputId} placeholder={composerPlaceholder} /> : null}
      </ThreadPrimitive.Root>
    </AssistantRuntimeProvider>
  )
}

function AssistantComposer({ inputId, placeholder }: { inputId?: string; placeholder: string }) {
  return (
    <ComposerPrimitive.Root className="mx-auto flex w-full max-w-[760px] items-end gap-2 border-t border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3 sm:px-6">
      <ComposerPrimitive.Input
        id={inputId}
        rows={2}
        submitMode="enter"
        unstable_insertNewlineOnTouchEnter
        placeholder={placeholder}
        className="min-h-11 flex-1 resize-y rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-2.5 text-sm text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[rgba(47,111,70,0.18)]"
      />
      <ComposerPrimitive.Send asChild>
        <Button type="submit" size="icon" className="size-10 shrink-0 rounded-xl" aria-label="送出">
          <SendHorizontal className="size-4" />
        </Button>
      </ComposerPrimitive.Send>
    </ComposerPrimitive.Root>
  )
}

function UserMessage() {
  return (
    <MessagePrimitive.Root className="flex w-full justify-end py-2">
      <div className="max-w-[min(560px,80%)] rounded-2xl rounded-br-md bg-[var(--brand-500)] px-4 py-2.5 text-sm leading-6 text-white shadow-sm">
        <MessagePrimitive.Parts components={{ Text: UserTextPart }} />
      </div>
    </MessagePrimitive.Root>
  )
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="flex w-full items-start gap-3 py-2">
      <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--admin-color-surface-subtle)]">
        <Bot className="size-4 text-[var(--admin-text-muted)]" />
      </div>
      <div className="min-w-0 flex-1 text-sm leading-6 text-[var(--admin-text)]">
        <MessagePrimitive.Parts components={{ Text: TextPart, Reasoning: ReasoningPart, tools: { Fallback: ToolPart } }} />
      </div>
    </MessagePrimitive.Root>
  )
}

function SystemMessage() {
  return (
    <MessagePrimitive.Root className="flex w-full justify-center py-1.5">
      <MessagePrimitive.Parts components={{ Text: SystemTextPart }} />
    </MessagePrimitive.Root>
  )
}

function UserTextPart({ text }: TextMessagePartProps) {
  return <span className="whitespace-pre-wrap break-words">{text}</span>
}

function TextPart({ text }: TextMessagePartProps) {
  return <MessageResponse>{text}</MessageResponse>
}

function SystemTextPart({ text }: TextMessagePartProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--admin-color-surface-subtle)] px-3 py-1 text-xs text-[var(--admin-text-muted)]">
      {text}
    </span>
  )
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
    <div className="flex w-full justify-center py-1.5">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--admin-color-surface-subtle)] px-3 py-1 text-xs text-[var(--admin-text-muted)]">
        {children}
      </span>
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
