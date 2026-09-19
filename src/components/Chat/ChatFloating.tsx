import { useState } from 'react'
import { ChatWidget } from './ChatWidget'

export function ChatFloating() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      {open && (
        <div style={{
          position: 'fixed',
          ...(expanded
            ? { inset: '1rem', bottom: '1rem', width: 'auto', height: 'auto' }
            : {
                bottom: '5rem',
                right: '1.5rem',
                width: 'min(520px, calc(100vw - 2rem))',
                height: 'min(680px, calc(100vh - 8rem))',
              }
          ),
          zIndex: 1000,
          borderRadius: 14,
          boxShadow: 'var(--shadow-floating)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          animation: 'chat-pop-in 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          <ChatWidget
            embedded
            onClose={() => setOpen(false)}
            onExpandToggle={() => setExpanded(v => !v)}
            isExpanded={expanded}
          />
        </div>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? '關閉 AI 對話' : '開啟 AI 對話'}
        className={open ? 'chat-float-button is-open' : 'chat-float-button'}
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
        {open ? <span className="chat-float-close" aria-hidden="true" /> : 'AI'}
      </button>

      <style>{`
        @keyframes chat-pop-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .chat-float-close {
          position: relative;
          width: 1.05rem;
          height: 1.05rem;
          display: block;
        }

        .chat-float-close::before,
        .chat-float-close::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 1.05rem;
          height: 2px;
          border-radius: 999px;
          background: currentColor;
          transform-origin: center;
        }

        .chat-float-close::before {
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .chat-float-close::after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }
      `}</style>
    </>
  )
}
