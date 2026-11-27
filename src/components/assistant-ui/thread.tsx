import {
  AssistantRuntimeProvider,
  MessagePrimitive,
  ThreadPrimitive,
  useExternalStoreRuntime,
  type AppendMessage,
  type ReasoningMessagePartProps,
  type TextMessagePartProps,
  type ThreadMessageLike,
  type ToolCallMessagePartProps,
} from '@assistant-ui/react'
import { Bot, CircleAlert, SendHorizontal } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

import { MessageResponse } from '@/components/ai-elements/message'
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/components/ai-elements/reasoning'
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from '@/components/ai-elements/tool'
import { Button } from '@/components/ui/button'
import { isFailedResultText } from '@/lib/admin/session-thread-adapter'
import { summarizeFailure } from '@/lib/agent/failure-summary'

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
    convertMessage: (message, idx) => ({
      ...message,
      id: message.id || `message-${idx}`,
      ...(message.role === 'assistant' && {
        status: message.status || { type: 'complete', reason: 'stop' },
      }),
      metadata: message.metadata
        ? {
            ...message.metadata,
            custom: message.metadata.custom || {},
          }
        : {
            custom: {},
          },
    }),
  })

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ThreadPrimitive.Root className="flex flex-1 flex-col overflow-hidden">
        <ThreadPrimitive.Viewport autoScroll className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <ThreadPrimitive.Empty>
            <p className="py-12 text-center text-sm text-muted-foreground">連線中...</p>
          </ThreadPrimitive.Empty>
          <div className="mx-auto max-w-[760px]">
            <ThreadPrimitive.Messages components={{ UserMessage, AssistantMessage, SystemMessage }} />
          </div>
        </ThreadPrimitive.Viewport>
        {composer ? <ResumeComposer inputId={composerInputId} placeholder={composerPlaceholder} onSend={onSend} /> : null}
      </ThreadPrimitive.Root>
    </AssistantRuntimeProvider>
  )
}

function ResumeComposer({ inputId, placeholder, onSend }: { inputId?: string; placeholder: string; onSend?: (text: string) => Promise<void> }) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback(async () => {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    setSending(true)
    try {
      await onSend?.(trimmed)
      setText('')
    } finally {
      setSending(false)
    }
  }, [text, sending, onSend])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  return (
    <div className="mx-auto flex w-full max-w-[760px] items-end gap-2 border-t border-border bg-background px-4 py-3 sm:px-6">
      <textarea
        ref={inputRef}
        id={inputId}
        rows={1}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={sending}
        className="min-h-11 flex-1 resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-50"
      />
      <Button
        type="button"
        size="icon"
        className="size-10 shrink-0 rounded-xl"
        aria-label="送出"
        disabled={sending || !text.trim()}
        onClick={handleSubmit}
      >
        <SendHorizontal className="size-4" />
      </Button>
    </div>
  )
}

function UserMessage() {
  return (
    <MessagePrimitive.Root className="flex w-full justify-end py-2">
      <div className="max-w-[min(560px,80%)] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm leading-6 text-primary-foreground shadow-sm [overflow-wrap:anywhere]">
        <MessagePrimitive.Parts components={{ Text: UserTextPart }} />
      </div>
    </MessagePrimitive.Root>
  )
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="flex w-full items-start gap-3 py-2">
      <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
        <Bot className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1 text-sm leading-6 text-foreground [overflow-wrap:anywhere]">
        <MessagePrimitive.Parts components={{ Text: TextPart, Reasoning: ReasoningPart, tools: { Fallback: ToolPart } }} />
      </div>
    </MessagePrimitive.Root>
  )
}

function SystemMessage() {
  return (
    <MessagePrimitive.Root className="flex w-full min-w-0 justify-center py-1.5">
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
  return <SystemNotice text={text} />
}

/** 短句（單行、不超過 80 字）用膠囊；多行或長文字用區塊，長網址會斷行，不撐破版面。 */
function isShortNotice(text: string) {
  return text.length <= 80 && !text.includes('\n')
}

function SystemNotice({ text }: { text: string }) {
  if (isFailedResultText(text)) return <FailureNotice raw={text} />
  if (isShortNotice(text)) {
    return (
      <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground [overflow-wrap:anywhere]">
        {text}
      </span>
    )
  }
  return (
    <div className="w-full max-w-[min(720px,100%)] whitespace-pre-wrap rounded-md border border-border bg-muted px-3 py-2 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
      {text}
    </div>
  )
}

/** 執行失敗：先講發生什麼、下一步做什麼，原始錯誤收進可展開區塊。 */
function FailureNotice({ raw }: { raw: string }) {
  const summary = summarizeFailure(raw)
  return (
    <div role="alert" className="w-full max-w-[min(720px,100%)] rounded-md border border-[color-mix(in_srgb,var(--danger)_35%,transparent)] bg-[var(--danger-bg)] px-3 py-2.5 text-sm">
      <p className="flex items-start gap-2 font-semibold text-[var(--danger)]">
        <CircleAlert className="mt-0.5 size-4 shrink-0" />
        <span>執行失敗：{summary.message}</span>
      </p>
      <p className="mt-1 pl-6 text-xs text-[var(--text-secondary)]">
        {summary.action.href ? <a href={summary.action.href} className="text-[var(--brand-700)] underline underline-offset-2">{summary.action.label}</a> : summary.action.label}
      </p>
      <details className="mt-2 pl-6">
        <summary className="cursor-pointer text-xs text-[var(--text-secondary)]">原始錯誤</summary>
        <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded bg-[var(--bg-card)] p-2 font-mono text-xs leading-5 text-[var(--text-secondary)] [overflow-wrap:anywhere]">{raw}</pre>
      </details>
    </div>
  )
}

function ReasoningPart({ text }: ReasoningMessagePartProps) {
  return (
    <Reasoning>
      <ReasoningTrigger />
      <ReasoningContent>{text}</ReasoningContent>
    </Reasoning>
  )
}

function ToolPart(props: ToolCallMessagePartProps) {
  const isComplete = props.status?.type === 'complete'
  const isError = props.status?.type === 'incomplete'
  const state = isComplete ? 'output-available' : isError ? 'output-error' : 'input-available'
  const input = typeof props.args === 'object' ? props.args : safeParseJson(props.argsText)
  const output = props.result
  const errorText = isError ? stringify(props.result) : undefined

  return (
    <Tool>
      <ToolHeader
        type="dynamic-tool"
        state={state as 'output-available'}
        toolName={props.toolName}
      />
      <ToolContent>
        {input ? <ToolInput input={input} /> : null}
        {isComplete || isError ? (
          <ToolOutput output={output} errorText={errorText} />
        ) : null}
      </ToolContent>
    </Tool>
  )
}

export function AdminSystemMessage({ children }: { children: string }) {
  return (
    <div className="flex w-full justify-center px-4 py-1.5">
      <SystemNotice text={children} />
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

function safeParseJson(text?: string) {
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}
