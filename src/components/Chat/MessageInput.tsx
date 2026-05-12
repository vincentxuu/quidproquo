import { useState } from 'react'
import { shouldSubmitMessage } from './keyboard'

interface Props {
  onSend: (text: string) => void
  disabled?: boolean
}

export function MessageInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  return (
    <div style={{ display: 'flex', gap: '0.55rem', padding: '0.75rem', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (shouldSubmitMessage(e)) { e.preventDefault(); submit() } }}
        placeholder="問我任何關於部落格的問題..."
        disabled={disabled}
        rows={1}
        aria-label="輸入問題"
        style={{
          flex: 1,
          minHeight: '2.5rem',
          maxHeight: '8rem',
          resize: 'vertical',
          padding: '0.65rem 0.75rem',
          borderRadius: 8,
          border: '1px solid var(--border)',
          fontSize: '0.95rem',
          lineHeight: 1.5,
          fontFamily: 'inherit',
          color: 'var(--text-primary)',
          background: disabled ? 'var(--bg-subtle)' : 'var(--bg-page)',
          outlineColor: 'var(--brand-500)',
        }}
      />
      <button
        onClick={submit}
        disabled={disabled || !value.trim()}
        style={{
          alignSelf: 'stretch',
          minWidth: '4.5rem',
          padding: '0.5rem 0.9rem',
          background: 'var(--brand-900)',
          color: 'var(--bg-page)',
          border: 'none',
          borderRadius: 8,
          cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
          opacity: disabled || !value.trim() ? 0.45 : 1,
          fontWeight: 700,
        }}
      >
        送出
      </button>
    </div>
  )
}
