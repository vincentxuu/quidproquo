import { createContext, useContext, useCallback, useState, useRef } from 'react'

interface Toast {
  id: string
  kind: 'success' | 'error' | 'info'
  message: string
}

interface ToastContextValue {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counterRef = useRef(0)

  const add = useCallback((kind: Toast['kind'], message: string) => {
    const id = `t${++counterRef.current}`
    setToasts(prev => [...prev, { id, kind, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const success = useCallback((msg: string) => add('success', msg), [add])
  const error = useCallback((msg: string) => add('error', msg), [add])
  const info = useCallback((msg: string) => add('info', msg), [add])

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxWidth: '24rem',
        }}
      >
        {toasts.map(t => (
          <div
            key={t.id}
            role="status"
            data-kind={t.kind}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--corner-md)',
              background: t.kind === 'success' ? 'var(--success)' : t.kind === 'error' ? 'var(--danger)' : 'var(--text-primary)',
              color: t.kind === 'success' || t.kind === 'error' ? 'var(--text-on-solid)' : 'var(--bg-page)',
              fontSize: 'var(--fs-sm)',
              boxShadow: 'var(--shadow-floating)',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
