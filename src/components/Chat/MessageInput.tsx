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
    <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderTop: '1px solid #eee' }}>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (shouldSubmitMessage(e)) { e.preventDefault(); submit() } }}
        placeholder="問我任何關於部落格的問題..."
        disabled={disabled}
        rows={1}
        style={{ flex: 1, resize: 'none', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', fontSize: '0.95rem', fontFamily: 'inherit' }}
      />
      <button
        onClick={submit}
        disabled={disabled || !value.trim()}
        style={{ padding: '0.5rem 1rem', background: '#333', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', opacity: disabled ? 0.5 : 1 }}
      >
        送出
      </button>
    </div>
  )
}
