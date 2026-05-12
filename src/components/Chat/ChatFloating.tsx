import { useState } from 'react'
import { ChatWidget } from './ChatWidget'

export function ChatFloating() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '5rem',
          right: '1.5rem',
          width: 'min(420px, calc(100vw - 2rem))',
          height: 'min(560px, calc(100vh - 8rem))',
          zIndex: 1000,
          borderRadius: '8px',
          boxShadow: 'var(--shadow-floating)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          animation: 'chat-pop-in 0.18s ease',
        }}>
          <div style={{
            padding: '0.85rem 1rem',
            borderBottom: '1px solid var(--border)',
            fontWeight: 700,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-card)',
          }}>
            <span>Ask AI</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="關閉"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                padding: '0.25rem',
                lineHeight: 1,
                fontSize: '1.1rem',
              }}
            >✕</button>
          </div>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <ChatWidget embedded />
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? '關閉 AI 對話' : '開啟 AI 對話'}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          background: 'var(--brand-900)',
          color: 'var(--bg-page)',
          border: 'none',
          cursor: 'pointer',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-floating)',
          transition: 'transform 0.15s, box-shadow 0.15s',
          fontSize: '0.82rem',
          fontWeight: 800,
          letterSpacing: 0,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
      >
        {open ? '關' : 'AI'}
      </button>

      <style>{`
        @keyframes chat-pop-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  )
}
