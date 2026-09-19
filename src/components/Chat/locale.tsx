import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { chatT, type ChatKey } from '@/i18n/chat'
import { defaultLang, type Lang } from '@/i18n/ui'

interface ChatLocale {
  lang: Lang
  t: (key: ChatKey, vars?: Record<string, string | number>) => string
}

const ChatLocaleContext = createContext<ChatLocale>({ lang: defaultLang, t: chatT(defaultLang) })

/** ChatWidget 從 Astro 拿到 lang 後包一層，底下所有 Chat 元件用 useChatLocale() 取字。 */
export function ChatLocaleProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const value = useMemo<ChatLocale>(() => ({ lang, t: chatT(lang) }), [lang])
  return <ChatLocaleContext.Provider value={value}>{children}</ChatLocaleContext.Provider>
}

export function useChatLocale(): ChatLocale {
  return useContext(ChatLocaleContext)
}
