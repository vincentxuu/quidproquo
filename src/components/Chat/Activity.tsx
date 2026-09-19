import { useState } from 'react'
import { ChevronRightIcon } from 'lucide-react'
import {
  pendingActivity,
  stepDetailWords,
  stepLabel,
  stepMeta,
  summarizeActivity,
  visibleSteps,
} from './steps-reducer'
import { useChatLocale } from './locale'
import type { Step } from './types'

/**
 * 比照 claude.ai：工具活動是一行灰字，展開一層是有邊框的清單，再展開是 Request／Response。
 * 樣式全在 src/styles/chat.css 的 .chat-activity*（公開頁沒有 Tailwind preflight，
 * <button> 要自己 reset）。
 */
export function ActivityLine({ steps, streaming, hasContent }: { steps?: Step[]; streaming: boolean; hasContent: boolean }) {
  const [open, setOpen] = useState(false)
  const { lang, t } = useChatLocale()

  if (streaming && !hasContent) {
    const pending = pendingActivity(steps, lang)
    const label = pending.type === 'tool' ? t('chat.activity.searching') : pending.text
    return (
      <div className="chat-activity" aria-live="polite">
        <ThinkingIndicator label={label} />
        {pending.type === 'tool' && pending.keywords.length > 0 && (
          <span className="chat-activity-pending-detail">
            {pending.label}
            <Keywords words={pending.keywords} />
          </span>
        )}
      </div>
    )
  }

  const summary = summarizeActivity(steps, lang)
  const rows = visibleSteps(steps)
  if (!summary && rows.length === 0) return null

  return (
    <div className="chat-activity" aria-live="polite">
      <button
        type="button"
        className="chat-activity-line"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        disabled={rows.length === 0}
      >
        <span>{summary || t('chat.activity.analysed')}</span>
        {rows.length > 0 && <ChevronRightIcon className="chat-activity-chevron" size={14} aria-hidden="true" />}
      </button>
      {open && rows.length > 0 && <ActivityList steps={rows} />}
    </div>
  )
}

export function ActivityList({ steps }: { steps: Step[] }) {
  return (
    <div className="chat-activity-list" role="list">
      {steps.map((step) => (
        <ActivityRow key={step.id} step={step} />
      ))}
    </div>
  )
}

function ActivityRow({ step }: { step: Step }) {
  const [open, setOpen] = useState(false)
  const { lang } = useChatLocale()
  const keywords = stepDetailWords(step)
  const meta = stepMeta(step, lang)
  const isError = step.status === 'error'
  const hasDetail = Boolean(step.reasoning) || step.kind === 'tool' || isError

  return (
    <div className="chat-activity-row" role="listitem">
      <button
        type="button"
        className={isError ? 'chat-activity-row-head chat-activity-error' : 'chat-activity-row-head'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        disabled={!hasDetail}
      >
        <span className="chat-activity-row-label">
          {stepLabel(step, lang)}
          {step.kind === 'tool' && keywords.length > 0 && <Keywords words={keywords} />}
        </span>
        <span className="chat-activity-row-side">
          {meta && <span className="chat-activity-row-meta">{meta}</span>}
          {hasDetail && <ChevronRightIcon className="chat-activity-chevron" size={14} aria-hidden="true" />}
        </span>
      </button>
      {open && hasDetail && <ActivityDetail step={step} />}
    </div>
  )
}

export function ActivityDetail({ step }: { step: Step }) {
  const { t } = useChatLocale()
  if (step.status === 'error') {
    return (
      <div className="chat-activity-detail">
        <p className="chat-activity-reasoning chat-activity-error">{step.reasoning || t('chat.activity.errorDetail')}</p>
      </div>
    )
  }
  if (step.kind === 'tool') {
    const request = step.input ?? (step.output?.keywords ? { keywords: step.output.keywords } : {})
    const response = step.output ?? {}
    return (
      <div className="chat-activity-detail">
        <div className="chat-activity-detail-label">Request</div>
        <pre className="chat-activity-pre">{JSON.stringify(request, null, 2)}</pre>
        <div className="chat-activity-detail-label">Response</div>
        <pre className="chat-activity-pre">{JSON.stringify(response, null, 2)}</pre>
      </div>
    )
  }
  return (
    <div className="chat-activity-detail">
      <p className="chat-activity-reasoning">{step.reasoning}</p>
    </div>
  )
}

function Keywords({ words }: { words: string[] }) {
  const { lang } = useChatLocale()
  const text = lang === 'en' ? `"${words.join(', ')}"` : `「${words.join('、')}」`
  return <span className="chat-activity-keywords">{text}</span>
}

/** 使用者原本的 loading：軌道 spinner + 標籤 + 三顆跳動小點（樣式在 chat.css）。 */
function ThinkingIndicator({ label }: { label: string }) {
  return (
    <span className="chat-thinking" aria-label={label}>
      <span className="chat-thinking-orbit" aria-hidden="true">
        <span className="chat-thinking-orbit-dot" />
      </span>
      <span className="chat-thinking-label">{label}</span>
      <span className="chat-thinking-dots" aria-hidden="true">
        <span className="chat-thinking-dot" />
        <span className="chat-thinking-dot" />
        <span className="chat-thinking-dot" />
      </span>
    </span>
  )
}
