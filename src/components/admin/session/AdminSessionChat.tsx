import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  Archive,
  Check,
  Cpu,
  FileDiff,
  Loader2,
  MoreHorizontal,
  Pencil,
  Share2,
  Square,
  Trash2,
  X,
} from 'lucide-react'

import { AssistantThread, AdminSystemMessage } from '@/components/assistant-ui/thread'
import { ToolCode } from '@/components/ai-elements/tool'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  EVENT_TYPES,
  PROV_STEPS,
  STEP_LABELS,
  asString,
  eventsToThreadMessages,
  stringify,
  truncate,
  type DiffPayload,
  type EventRow,
  type SessionEventPayload,
  type SessionEventType,
  type SessionPayload,
  type SessionStatus,
  type StatusIndicatorState,
} from '@/lib/admin/session-thread-adapter'
import { cn } from '@/lib/utils'

interface AdminSessionChatProps {
  sessionId: string
  initialSession?: SessionPayload
  initialEvents?: EventRow[]
  disableLiveUpdates?: boolean
}


function badgeVariant(status: SessionStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'done':
      return 'default'
    case 'failed':
      return 'destructive'
    case 'running':
      return 'secondary'
    case 'cancelled':
      return 'outline'
    default:
      return 'secondary'
  }
}

function isRunningStatus(status: SessionStatus) {
  return status === 'running' || status === 'queued' || status === 'pending' || status === 'paused'
}

function normalizeSessionStatus(status?: string): SessionStatus | undefined {
  if (!status) return undefined
  if (status === 'waiting') return 'paused'
  return status
}

function eventFingerprint(type: SessionEventType, payload: Record<string, unknown>) {
  if (type === 'assistant') {
    return `${type}:${asString(payload.content)}:${asString(payload.stopReason || payload.stop_reason)}`
  }
  if (type === 'user' || type === 'result') {
    return `${type}:${asString(payload.content)}`
  }
  if (type === 'system/init') {
    return `${type}:${asString(payload.sessionId || payload.session_id)}:${asString(payload.model)}:${asString(payload.mode)}`
  }
  if (type === 'tool_use') {
    return `${type}:${asString(payload.toolCallId || payload.tool_call_id)}:${asString(payload.toolName || payload.tool_name)}:${stringify(payload.input)}`
  }
  if (type === 'control_request') {
    const nested = (payload.payload && typeof payload.payload === 'object' ? payload.payload : payload) as Record<string, unknown>
    return `${type}:${asString(nested.requestId || nested.id)}:${asString(nested.toolName || nested.tool_name)}`
  }
  return `${type}:${stringify(payload)}`
}

function StatusIndicator({ state, message }: { state: StatusIndicatorState; message?: string }) {
  if (!state) return null
  if (state === 'finished') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-[var(--admin-text-muted)]">
        <Check className="size-3 text-[var(--admin-success)]" />
        {message || 'Agent finished'}
      </span>
    )
  }
  const tone =
    state === 'error'
      ? 'bg-[var(--admin-danger)]'
      : state === 'waiting_approval'
        ? 'bg-[var(--admin-warning)]'
        : 'bg-[var(--brand-500)]'
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--admin-text-muted)]">
      <span className={cn('size-2 rounded-full', tone, state !== 'error' && 'animate-pulse')} />
      {message || (state === 'waiting_approval' ? 'Waiting for approval' : 'Agent is working...')}
    </span>
  )
}

function ProvisionBar({ steps }: { steps: Record<string, string> }) {
  const hasActivity = Object.values(steps).some(status => status !== 'pending')
  if (!hasActivity) return null

  return (
    <div className="flex items-center overflow-x-auto border-b border-[var(--admin-border)] bg-[var(--admin-color-surface-subtle)] px-4 py-2">
      {PROV_STEPS.map((step, index) => {
        const status = steps[step] || 'pending'
        return (
          <div className="flex shrink-0 items-center" key={step}>
            {index > 0 && <div className="mx-2 h-px w-6 bg-[var(--admin-border)]" />}
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded px-1.5 py-1 text-xs',
                status === 'pending' && 'text-[var(--admin-text-muted)] opacity-50',
                status === 'started' && 'font-medium text-[var(--admin-color-info)]',
                status === 'completed' && 'text-[var(--admin-success)]',
                status === 'failed' && 'text-[var(--admin-danger)]',
                status === 'skipped' && 'text-[var(--admin-text-muted)] line-through opacity-60',
              )}
            >
              {status === 'started' ? (
                <Loader2 className="size-3 animate-spin" />
              ) : status === 'completed' ? (
                <Check className="size-3" />
              ) : status === 'failed' ? (
                <X className="size-3" />
              ) : (
                <span className="size-2 rounded-full border border-current" />
              )}
              {STEP_LABELS[step]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function ApprovalRow({
  payload,
  onApprove,
}: {
  payload: Record<string, unknown>
  onApprove: (approvalId: string, behavior: string) => void
}) {
  const nested = (payload.payload && typeof payload.payload === 'object' ? payload.payload : payload) as Record<string, unknown>
  const requestId = asString(nested.requestId || nested.id)
  const isExitPlan = payload.subtype === 'exit_plan_mode'
  const displayName = asString(nested.displayName || nested.display_name || nested.toolName)
  const reason = asString(nested.decisionReason || nested.decision_reason, 'Permission request')
  const input = nested.input && typeof nested.input === 'object' ? (nested.input as Record<string, unknown>) : {}
  const plan = asString(input.plan)

  return (
    <div className="rounded-xl border border-[var(--admin-color-warning)] bg-[var(--admin-color-warning-soft)] p-3">
      <div className="flex items-start gap-2 text-sm font-medium text-[var(--admin-text)]">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--admin-warning)]" />
        <span>
          {displayName} <span className="font-normal text-[var(--admin-text-muted)]">{reason}</span>
        </span>
      </div>
      {isExitPlan && plan ? <ToolCode>{truncate(plan, 2000)}</ToolCode> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {isExitPlan ? (
          <>
            <Button type="button" size="sm" variant="outline" onClick={() => onApprove(requestId, 'accept')}>
              接受
            </Button>
            <Button type="button" size="sm" onClick={() => onApprove(requestId, 'accept_auto')}>
              接受 + Auto mode
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={() => onApprove(requestId, 'reject')}>
              拒絕
            </Button>
          </>
        ) : (
          <>
            <Button type="button" size="sm" onClick={() => onApprove(requestId, 'allow')}>
              允許
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={() => onApprove(requestId, 'deny')}>
              拒絕
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

function PendingAdminEvents({
  events,
  onApprove,
  onUseSuggestion,
}: {
  events: EventRow[]
  onApprove: (approvalId: string, behavior: string) => void
  onUseSuggestion: (value: string) => void
}) {
  const pending = events.filter(row => row.type === 'control_request' || row.type === 'prompt_suggestion')
  if (!pending.length) return null

  return (
    <div className="border-t border-[var(--admin-border)] px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-[760px] space-y-2">
        {pending.map(row => {
          if (row.type === 'control_request') {
            return <ApprovalRow key={row.id} payload={row.payload} onApprove={onApprove} />
          }
          const suggestions = Array.isArray(row.payload.suggestions) ? row.payload.suggestions.filter((item): item is string => typeof item === 'string') : []
          if (!suggestions.length) return null
          return (
            <div key={row.id} className="flex flex-wrap gap-2">
              {suggestions.map(item => (
                <Button key={item} type="button" size="sm" variant="outline" onClick={() => onUseSuggestion(item)}>
                  {item}
                </Button>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AdminSessionChat({
  sessionId,
  initialSession,
  initialEvents = [],
  disableLiveUpdates = false,
}: AdminSessionChatProps) {
  const [sessionName, setSessionName] = useState(initialSession?.name || initialSession?.instruction?.slice(0, 80) || '載入中...')
  const [sessionModel, setSessionModel] = useState(initialSession?.model || '')
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>(initialSession?.status || 'unknown')
  const [statusIndicator, setStatusIndicator] = useState<{ state: StatusIndicatorState; message?: string }>({ state: null })
  const [events, setEvents] = useState<EventRow[]>(initialEvents)
  const [diffOpen, setDiffOpen] = useState(false)
  const [diff, setDiff] = useState<DiffPayload | null>(null)
  const [diffLoading, setDiffLoading] = useState(false)
  const [provisionSteps, setProvisionSteps] = useState<Record<string, string>>(() =>
    Object.fromEntries(PROV_STEPS.map(step => [step, 'pending'])),
  )
  const eventSourceRef = useRef<EventSource | null>(null)
  const lastEventIdRef = useRef<string | null>(null)
  const sessionStatusRef = useRef<SessionStatus>(initialSession?.status || 'unknown')
  const seenEventIdsRef = useRef(new Set(initialEvents.map(event => event.id)))
  const seenEventFingerprintsRef = useRef(new Set(initialEvents.map(event => eventFingerprint(event.type, event.payload))))
  const rowCounterRef = useRef(0)

  const running = isRunningStatus(sessionStatus)
  const showComposer = sessionStatus !== 'unknown' && !running
  const threadMessages = useMemo(() => eventsToThreadMessages(events), [events])
  const visibleThreadMessages = useMemo(() => {
    if (!running) return threadMessages
    const runningText = statusIndicator.message || (sessionStatus === 'queued' || sessionStatus === 'pending' ? '等待執行器啟動...' : 'Agent 正在處理...')
    return [
      ...threadMessages,
      {
        id: 'session-running-indicator',
        role: 'system' as const,
        content: runningText,
        metadata: { custom: { eventType: 'system/status' } },
      },
    ]
  }, [running, sessionStatus, statusIndicator.message, threadMessages])

  const updateStatus = useCallback((status?: SessionStatus) => {
    const normalized = normalizeSessionStatus(status)
    if (!normalized) return
    sessionStatusRef.current = normalized
    setSessionStatus(normalized)
  }, [])

  const appendEvent = useCallback((type: SessionEventType, payload: Record<string, unknown>, eventId?: string, fallbackKey?: string) => {
    const key = eventId || fallbackKey || `local-${++rowCounterRef.current}`
    if (seenEventIdsRef.current.has(key)) return
    seenEventIdsRef.current.add(key)
    if (eventId) lastEventIdRef.current = eventId
    const fingerprint = eventFingerprint(type, payload)
    if (seenEventFingerprintsRef.current.has(fingerprint)) return
    seenEventFingerprintsRef.current.add(fingerprint)

    if (type === 'system/status') {
      setStatusIndicator({
        state: asString(payload.state) as StatusIndicatorState,
        message: asString(payload.message) || undefined,
      })
      return
    }
    if (type === 'system/post_turn_summary') {
      updateStatus(asString(payload.statusCategory || payload.status_category))
      setStatusIndicator({
        state: 'finished',
        message: asString(payload.statusDetail || payload.status_detail) || undefined,
      })
    }
    if (type === 'system/init') {
      setStatusIndicator({ state: 'working', message: 'Starting...' })
      const model = asString(payload.model)
      if (model) setSessionModel(model)
    }
    if (type === 'assistant') setStatusIndicator({ state: 'working', message: '回覆已更新' })
    if (type === 'result') {
      updateStatus('done')
      setStatusIndicator({ state: 'finished', message: asString(payload.content, 'Session complete') })
    }
    if (type === 'control_request') {
      updateStatus('paused')
      const nested = (payload.payload && typeof payload.payload === 'object' ? payload.payload : payload) as Record<string, unknown>
      setStatusIndicator({ state: 'waiting_approval', message: asString(nested.displayName || nested.display_name || nested.toolName) })
    }
    if (type === 'control_response') {
      updateStatus('running')
      setStatusIndicator({ state: 'working' })
    }
    if (type === 'env_manager_log') {
      const step = asString(payload.step)
      const status = asString(payload.status)
      if (step && status) setProvisionSteps(prev => ({ ...prev, [step]: status }))
    }
    setEvents(prev => [...prev, { id: key, type, payload }])
  }, [updateStatus])

  const loadSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/sessions/${encodeURIComponent(sessionId)}`)
      if (!res.ok) return
      const data = await res.json() as { events?: SessionEventPayload[]; session?: SessionPayload } & SessionPayload
      const session = data.session || data
      setSessionName(session.name || session.instruction?.slice(0, 80) || sessionId.slice(0, 8))
      if (session.model) setSessionModel(session.model)
      updateStatus(session.status)
      if (Array.isArray(data.events)) {
        for (const row of data.events) {
          const type = asString(row.type)
          if (!EVENT_TYPES.includes(type as SessionEventType)) continue
          try {
            appendEvent(
              type as SessionEventType,
              JSON.parse(String(row.payload_json || '{}')) as Record<string, unknown>,
              row.event_id,
              `${type}:${row.seq ?? row.payload_json ?? ++rowCounterRef.current}`,
            )
          } catch {
            appendEvent('system/status', { state: 'error', message: `Invalid ${type} history payload` })
          }
        }
      }
    } catch {
      setStatusIndicator({ state: 'error', message: 'Session load failed' })
    }
  }, [appendEvent, sessionId, updateStatus])

  const connectSSE = useCallback(() => {
    eventSourceRef.current?.close()
    const resumeToken = lastEventIdRef.current ? `?resume_token=${encodeURIComponent(lastEventIdRef.current)}` : ''
    const source = new EventSource(`/api/admin/sessions/${encodeURIComponent(sessionId)}/watch${resumeToken}`)
    eventSourceRef.current = source

    for (const type of EVENT_TYPES) {
      source.addEventListener(type, event => {
        const messageEvent = event as MessageEvent<string>
        try {
          appendEvent(
            type,
            JSON.parse(messageEvent.data) as Record<string, unknown>,
            messageEvent.lastEventId || undefined,
            `${type}:${messageEvent.data}`,
          )
        } catch {
          appendEvent('system/status', { state: 'error', message: `Invalid ${type} payload` })
        }
      })
    }

    source.onerror = () => {
      source.close()
      void loadSession()
      if (isRunningStatus(sessionStatusRef.current)) {
        setStatusIndicator({ state: 'working', message: '重新連線中...' })
        window.setTimeout(connectSSE, 2000)
      }
    }
  }, [appendEvent, loadSession, sessionId])

  useEffect(() => {
    if (disableLiveUpdates) return undefined
    let cancelled = false
    void loadSession().finally(() => {
      if (!cancelled) connectSSE()
    })
    return () => {
      cancelled = true
      eventSourceRef.current?.close()
    }
  }, [connectSSE, disableLiveUpdates, loadSession])

  const handleDiff = useCallback(async () => {
    setDiffOpen(true)
    setDiffLoading(true)
    setDiff(null)
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 10_000)
    try {
      const res = await fetch(`/api/admin/sessions/${encodeURIComponent(sessionId)}/diff`, { signal: controller.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setDiff(await res.json() as DiffPayload)
    } catch (error) {
      setDiff({
        available: false,
        reason: error instanceof DOMException && error.name === 'AbortError'
          ? '請求逾時，可以關閉後重試。'
          : `載入失敗${error instanceof Error ? `: ${error.message}` : ''}`,
      })
    } finally {
      window.clearTimeout(timeout)
      setDiffLoading(false)
    }
  }, [sessionId])

  const handleApproval = useCallback(async (approvalId: string, behavior: string) => {
    try {
      await fetch(`/api/admin/sessions/${encodeURIComponent(sessionId)}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approval_id: approvalId, behavior }),
      })
    } catch {
      setStatusIndicator({ state: 'error', message: 'Approval failed' })
    }
  }, [sessionId])

  const handleResume = useCallback(async (messageText: string) => {
    const message = messageText.trim()
    if (!message) return
    try {
      await fetch(`/api/admin/sessions/${encodeURIComponent(sessionId)}/resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      updateStatus('running')
      connectSSE()
    } catch {
      setStatusIndicator({ state: 'error', message: 'Resume failed' })
    }
  }, [connectSSE, sessionId, updateStatus])

  const actions = useMemo(() => ({
    stop: async () => {
      try {
        await fetch(`/api/admin/sessions/${encodeURIComponent(sessionId)}/stop`, { method: 'POST' })
        updateStatus('cancelled')
      } catch {
        setStatusIndicator({ state: 'error', message: 'Stop failed' })
      }
    },
    rename: async () => {
      const name = window.prompt('新名稱：')
      if (!name) return
      try {
        await fetch(`/api/admin/sessions/${encodeURIComponent(sessionId)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        })
        setSessionName(name)
      } catch {
        setStatusIndicator({ state: 'error', message: 'Rename failed' })
      }
    },
    archive: async () => {
      try {
        await fetch(`/api/admin/sessions/${encodeURIComponent(sessionId)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ archived: true }),
        })
        window.alert('已封存')
      } catch {
        setStatusIndicator({ state: 'error', message: 'Archive failed' })
      }
    },
    share: async () => {
      try {
        const res = await fetch(`/api/admin/sessions/${encodeURIComponent(sessionId)}/share`, { method: 'POST' })
        const data = await res.json() as { url?: string }
        if (data.url) {
          await navigator.clipboard?.writeText(data.url).catch(() => undefined)
          window.alert(`分享連結已複製：${data.url}`)
        }
      } catch {
        setStatusIndicator({ state: 'error', message: 'Share failed' })
      }
    },
    delete: async () => {
      if (!window.confirm('確定刪除此 Session？')) return
      try {
        await fetch(`/api/admin/sessions/${encodeURIComponent(sessionId)}`, { method: 'DELETE' })
        window.location.href = '/admin/sessions'
      } catch {
        setStatusIndicator({ state: 'error', message: 'Delete failed' })
      }
    },
  }), [sessionId, updateStatus])

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[var(--admin-surface)]">
      {/* Compact header */}
      <div className="flex items-center gap-3 border-b border-[var(--admin-border)] px-4 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <h2 className="truncate text-sm font-semibold text-[var(--admin-text)]">{sessionName}</h2>
          <Badge variant={badgeVariant(sessionStatus)} className="shrink-0">{sessionStatus}</Badge>
          {sessionModel ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[var(--admin-color-surface-subtle)] px-2 py-0.5 text-xs text-[var(--admin-text-muted)]">
              <Cpu className="size-3" />
              {sessionModel.includes(':') ? sessionModel.split(':').pop() : sessionModel}
            </span>
          ) : null}
          <StatusIndicator state={statusIndicator.state} message={statusIndicator.message} />
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {running ? (
            <Button type="button" variant="outline" size="sm" onClick={actions.stop}>
              <Square className="size-3.5" />
              停止
            </Button>
          ) : null}
          <Button type="button" variant="ghost" size="sm" onClick={handleDiff}>
            <FileDiff className="size-3.5" />
            Diff
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={actions.rename}>
                <Pencil />
                重新命名
              </DropdownMenuItem>
              <DropdownMenuItem onClick={actions.share}>
                <Share2 />
                分享
              </DropdownMenuItem>
              {!running ? (
                <DropdownMenuItem onClick={actions.archive}>
                  <Archive />
                  封存
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={actions.delete}>
                <Trash2 />
                刪除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ProvisionBar steps={provisionSteps} />

      <AssistantThread
        messages={visibleThreadMessages}
        running={running}
        composer={showComposer}
        composerInputId="resume-input"
        composerPlaceholder="輸入續聊訊息..."
        onSend={handleResume}
      />

      <PendingAdminEvents
        events={events}
        onApprove={handleApproval}
        onUseSuggestion={value => void handleResume(value)}
      />

      {events.length === 0 && statusIndicator.state ? (
        <AdminSystemMessage>{statusIndicator.message || 'Starting...'}</AdminSystemMessage>
      ) : null}

      <Sheet open={diffOpen} onOpenChange={setDiffOpen}>
        <SheetContent side="right" className="w-[min(400px,90vw)]">
          <SheetHeader>
            <SheetTitle>Diff</SheetTitle>
            <SheetDescription>Session 的檔案變更摘要</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {diffLoading ? <p className="text-sm text-muted-foreground">載入中...</p> : null}
            {!diffLoading && diff && !diff.available ? <p className="text-sm text-muted-foreground">{diff.reason || '尚無 Diff'}</p> : null}
            {!diffLoading && diff?.available ? (
              <>
                <p className="mb-3 text-sm text-muted-foreground">{diff.summary || ''}</p>
                <div className="space-y-1">
                  {(diff.files || []).map(file => (
                    <div key={file.name} className="flex items-center gap-2 rounded px-2 py-1 font-mono text-xs hover:bg-accent">
                      <span className="min-w-0 flex-1 truncate">{file.name}</span>
                      <span className="min-w-10 text-right font-semibold text-green-600">+{file.additions || 0}</span>
                      <span className="min-w-10 text-right font-semibold text-red-600">-{file.deletions || 0}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
