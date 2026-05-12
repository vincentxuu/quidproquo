import { useState, useEffect } from 'react'

export default function FloatButton({ onChatClick }: { onChatClick: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'c' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onChatClick()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onChatClick])

  const btnStyle = isExpanded
    ? {
        alignItems: 'center',
        top: 'calc(12px + 1rem)', // 12px bottom margin + 1rem stacking
        transition: 'all 0.3s ease'
      }
    : {
        bottom: 'calc(1rem + 12px)', // 1rem bottom margin + 12px radius
        transition: 'all 0.3s ease'
      }

  return (
    <button
      onClick={onChatClick}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onChatClick()
        }
      }}
      style={{
        position: 'fixed',
        left: '24px',
        zIndex: 50,
        width: '48px',
        height: '48px',
        backgroundColor: 'var(--brand-900)',
        color: 'var(--bg-page)',
        border: 'none',
        borderRadius: '12px',
        fontSize: '20px',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-floating)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...btnStyle
      }}
      aria-label="{isExpanded ? 'Close chat' : 'Open chat'}"
    >
      {isExpanded ? '✕' : '✶'}
    </button>
  )
}
