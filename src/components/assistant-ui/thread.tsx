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
import { Bot, SendHorizontal } from 'lucide-react'
import { useCallback } from 'react'

import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message'
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
        {composer ? <AssistantComposer inputId={composerInputId} placeholder={composerPlaceholder} /> : null}
      </ThreadPrimitive.Root>
    </AssistantRuntimeProvider>
  )
}

function AssistantComposer({ inputId, placeholder }: { inputId?: string; placeholder: string }) {
  return (
    <ComposerPrimitive.Root className="mx-auto flex w-full max-w-[760px] items-end gap-2 border-t border-border bg-background px-4 py-3 sm:px-6">
      <ComposerPrimitive.Input
        id={inputId}
        rows={2}
        submitMode="enter"
        unstable_insertNewlineOnTouchEnter
        placeholder={placeholder}
        className="min-h-11 flex-1 resize-y rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
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
    <Message from="user">
      <MessageContent>
        <MessagePrimitive.Parts components={{ Text: UserTextPart }} />
      </MessageContent>
    </Message>
  )
}

function AssistantMessage() {
  return (
    <Message from="assistant">
      <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
        <Bot className="size-4 text-muted-foreground" />
      </div>
      <MessageContent>
        <MessagePrimitive.Parts components={{ Text: TextPart, Reasoning: ReasoningPart, tools: { Fallback: ToolPart } }} />
      </MessageContent>
    </Message>
  )
}

function SystemMessage() {
  return (
    <Message from="system">
      <MessagePrimitive.Parts components={{ Text: SystemTextPart }} />
    </Message>
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
