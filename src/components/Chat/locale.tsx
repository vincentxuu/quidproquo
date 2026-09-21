import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { chatT, type ChatKey } from '@/i18n/chat'
import { defaultLang, type Lang } from '@/i18n/ui'

interface ChatLocale {
  lang: Lang
  t: (key: ChatKey, vars?: Record<string, string | number>) => string
  /** 讀者正在看的文章（D1 slug）；來源清單用它標出「目前文章」。沒帶文章脈絡時為 undefined。 */
  pageSlug?: string
}

const ChatLocaleContext = createContext<ChatLocale>({ lang: defaultLang, t: chatT(defaultLang) })

/** ChatWidget 從 Astro 拿到 lang 後包一層，底下所有 Chat 元件用 useChatLocale() 取字。 */
export function ChatLocaleProvider({ lang, pageSlug, children }: { lang: Lang; pageSlug?: string; children: ReactNode }) {
  const value = useMemo<ChatLocale>(() => ({ lang, t: chatT(lang), pageSlug }), [lang, pageSlug])
  return <ChatLocaleContext.Provider value={value}>{children}</ChatLocaleContext.Provider>
}

export function useChatLocale(): ChatLocale {
  return useContext(ChatLocaleContext)
}
