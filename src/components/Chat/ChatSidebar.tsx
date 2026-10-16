import { useState, useEffect, useCallback, useRef } from 'react'
import { ChatWidget, type ChatPage } from './ChatWidget'
import { chatT } from '@/i18n/chat'
import { defaultLang, type Lang } from '@/i18n/ui'

const SIDEBAR_WIDTH = 380
const BODY_CLASS = 'has-chat-sidebar'
const STORAGE_KEY = 'chat_sidebar_open' // sessionStorage：關標籤即忘，不跨階段殘留

export function ChatSidebar({ lang = defaultLang, page }: { lang?: Lang; page?: ChatPage }) {
  const t = chatT(lang)
  const [open, setOpen] = useState(false)
  const [pendingMessage, setPendingMessage] = useState<{ id: number; text: string } | undefined>()
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  // ── 狀態管理：sessionStorage 持久化、切換文章重置 ──
  useEffect(() => {
    // 頁面載入時從 sessionStorage 回復開關狀態（同一分頁只記一次）
    const stored = readStorage()
    if (stored !== null) setOpen(stored)
  }, [])

  useEffect(() => {
    // 切換文章時強制關閉面板並重置，避免殘留上一篇的狀態
    setOpen(false)
  }, [page?.slug])

  // 開關時同步 body 類名與 sessionStorage
  useEffect(() => {
    document.body.classList.toggle(BODY_CLASS, open)
    try {
      sessionStorage.setItem(STORAGE_KEY, open ? '1' : '0')
    } catch {
      /* private mode: ignore */
    }
    return () => { document.body.classList.remove(BODY_CLASS) }
  }, [open])

  // ── 鍵盤：Esc 關閉 ──
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // ── 點擊面板外關閉（排除觸發按鈕與面板內部）──
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node | null
      if (triggerRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const sendQuick = useCallback((text: string) => {
    setOpen(true)
    setPendingMessage({ id: Date.now(), text })
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    // 關閉時焦點回到觸發鈕，避免鍵盤使用者「丟失」焦點
    triggerRef.current?.focus()
  }, [])

  return (
    <>
      {/* Trigger button */}
      {!open && (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="chat-sidebar-trigger"
          aria-expanded={false}
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
          ref={panelRef}
          className="chat-sidebar-panel"
          style={{ width: SIDEBAR_WIDTH }}
          aria-label={t('chat.sidebar.subtitle')}
        >
          <ChatWidget
            embedded
            pendingMessage={pendingMessage}
            onClose={close}
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

  function readStorage(): boolean | null {
    try {
      const stored = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(STORAGE_KEY) : null
      return stored === null ? null : stored === '1'
    } catch {
      return null
    }
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
}
