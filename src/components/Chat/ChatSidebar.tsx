import { useState, useEffect, useCallback } from 'react'
import { ChatWidget, type ChatPage } from './ChatWidget'
import { chatT } from '@/i18n/chat'
import { defaultLang, type Lang } from '@/i18n/ui'

const SIDEBAR_WIDTH = 380
const BODY_CLASS = 'has-chat-sidebar'

export function ChatSidebar({ lang = defaultLang, page }: { lang?: Lang; page?: ChatPage }) {
  const t = chatT(lang)
  const [open, setOpen] = useState(false)
  const [pendingMessage, setPendingMessage] = useState<{ id: number; text: string } | undefined>()

  useEffect(() => {
    document.body.classList.toggle(BODY_CLASS, open)
    return () => { document.body.classList.remove(BODY_CLASS) }
  }, [open])

  const sendQuick = useCallback((text: string) => {
    setOpen(true)
    setPendingMessage({ id: Date.now(), text })
  }, [])

  return (
    <>
      {/* Trigger button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="chat-sidebar-trigger"
          aria-label={t('chat.sidebar.open')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
          </svg>
          Ask AI
        </button>
      )}

      {/* Sidebar panel */}
      {open && (
        <aside
          className="chat-sidebar-panel"
          style={{ width: SIDEBAR_WIDTH }}
          aria-label={t('chat.sidebar.subtitle')}
        >
          <ChatWidget
            embedded
            pendingMessage={pendingMessage}
            onClose={() => setOpen(false)}
            lang={lang}
            page={page}
          />
        </aside>
      )}

      {/* Quick actions — only when sidebar is closed and on desktop */}
      {!open && page && (
        <div className="chat-sidebar-quick-actions">
          <button type="button" onClick={() => sendQuick(t('chat.page.q.summary'))}>
            <SummaryIcon />
            {t('chat.sidebar.q.summary')}
          </button>
          <button type="button" onClick={() => sendQuick(t('chat.page.q.related'))}>
            <RelatedIcon />
            {t('chat.sidebar.q.related')}
          </button>
        </div>
      )}
    </>
  )
}

function SummaryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="14" y2="12" />
      <line x1="4" y1="18" x2="18" y2="18" />
    </svg>
  )
}

function RelatedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}
