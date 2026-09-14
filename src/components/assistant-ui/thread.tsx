import {
  AssistantRuntimeProvider,
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
import { Bot, SendHorizontal } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

import { MessageResponse } from '@/components/ai-elements/message'
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/components/ai-elements/reasoning'
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from '@/components/ai-elements/tool'
import { Button } from '@/components/ui/button'

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
      <div className="max-w-[min(560px,80%)] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm leading-6 text-primary-foreground shadow-sm">
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
      <div className="min-w-0 flex-1 text-sm leading-6 text-foreground">
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
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
      {text}
    </span>
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
    <div className="flex w-full justify-center py-1.5">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
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

function safeParseJson(text?: string) {
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}
