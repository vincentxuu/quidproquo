import { useState } from 'react'
import { ChatWidget } from './ChatWidget'
import { chatT } from '@/i18n/chat'
import { defaultLang, type Lang } from '@/i18n/ui'

export function InlineAsk({ lang = defaultLang }: { lang?: Lang }) {
  const t = chatT(lang)
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [pendingMessage, setPendingMessage] = useState<{ id: number; text: string } | undefined>()

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    setOpen(true)
    setPendingMessage({ id: Date.now(), text: trimmed })
    setValue('')
  }

  if (open) {
    return (
      <div className="inline-ask-panel">
        <div className="inline-ask-panel-head">
          <span>{t('chat.title')}</span>
          <button type="button" onClick={() => setOpen(false)} aria-label={t('chat.inline.collapse')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="inline-ask-panel-body">
          <ChatWidget embedded pendingMessage={pendingMessage} lang={lang} />
        </div>

        <style>{`
          .inline-ask-panel {
            display: flex;
            flex-direction: column;
            height: 420px;
            border: 1px solid var(--border);
            border-radius: 12px;
            background: var(--bg-card);
            overflow: hidden;
          }
          .inline-ask-panel-head {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.65rem 0.85rem;
            border-bottom: 1px solid var(--border);
            font-weight: 700;
            font-size: 0.85rem;
          }
          .inline-ask-panel-head button {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            display: flex;
            padding: 0.2rem;
            border-radius: 4px;
          }
          .inline-ask-panel-head button:hover { background: var(--bg-subtle); color: var(--text-primary); }
          .inline-ask-panel-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="inline-ask">
      <span className="inline-ask-icon" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
        </svg>
      </span>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); submit() } }}
        placeholder={t('chat.inline.placeholder')}
        aria-label={t('chat.inline.aria')}
      />
      <button type="button" onClick={submit} disabled={!value.trim()} aria-label={t('chat.inline.send')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>

      <style>{`
        .inline-ask {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.65rem 0.75rem 0.65rem 1rem;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--bg-card);
        }
        .inline-ask-icon { color: var(--brand-500); display: flex; flex-shrink: 0; }
        .inline-ask input {
          flex: 1;
          min-width: 0;
          border: none;
          background: transparent;
          font-size: 0.9rem;
          color: var(--text-primary);
          font-family: inherit;
          outline: none;
        }
        .inline-ask input::placeholder { color: var(--text-muted); }
        .inline-ask button {
          flex-shrink: 0;
          width: 1.9rem;
          height: 1.9rem;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--brand-900);
          color: var(--bg-page);
          cursor: pointer;
        }
        .inline-ask button:disabled {
          background: var(--bg-subtle);
          color: var(--text-muted);
          cursor: default;
        }
      `}</style>
    </div>
  )
}
