import React, { useState, useCallback, useEffect, useRef, type ChangeEvent, type SubmitEvent as ReactSubmitEvent } from 'react'
import './SearchWidget.css'

interface SearchResult {
  title: string
  category: string
  url: string
  slug: string
  evidence: string
  reason: string
}

interface SearchResponse {
  mode: string
  query: string
  results: SearchResult[]
  total?: number
  offset?: number
  limit?: number
  hasMore?: boolean
  error?: string
  message?: string
}

interface Props {
  lang?: 'zh-TW' | 'en'
}

const HISTORY_KEY = 'search-history'
const MAX_HISTORY = 5

const POPULAR_SEARCHES: Record<'zh-TW' | 'en', string[]> = {
  'zh-TW': ['RAG', 'Claude', 'MCP', 'Agent', 'Astro', 'Cloudflare'],
  'en': ['RAG', 'Claude', 'MCP', 'Agent', 'Astro', 'Cloudflare']
}

export function SearchWidget({ lang = 'zh-TW' }: Props) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchAttempted, setSearchAttempted] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const initialUrlSearchRan = useRef(false)
  const currentQueryRef = useRef('')

  const PAGE_SIZE = 20

  const t = {
    placeholder: lang === 'en' ? 'Search posts, topics, questions...' : '搜尋文章、主題、問題...',
    noResults: lang === 'en' ? 'No results found' : '沒有找到結果',
    searching: lang === 'en' ? 'Searching...' : '搜尋中...',
    error: lang === 'en' ? 'Search failed. Please try again.' : '搜尋失敗，請重試。',
    minChars: lang === 'en' ? 'Type at least 2 characters' : '請輸入至少 2 個字元',
    rateLimited: lang === 'en' ? 'Daily search limit reached. Please try again tomorrow.' : '已達每日搜尋上限，請明天再試。',
    recentSearches: lang === 'en' ? 'Recent' : '最近搜尋',
    popularSearches: lang === 'en' ? 'Popular' : '熱門搜尋',
    clearHistory: lang === 'en' ? 'Clear history' : '清除記錄',
    resultsTitle: lang === 'en' ? 'Results' : '搜尋結果',
    loadMore: lang === 'en' ? 'Load more' : '載入更多',
    loadingMore: lang === 'en' ? 'Loading...' : '載入中...',
  }

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      if (stored) {
        setSearchHistory(JSON.parse(stored))
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  const saveToHistory = useCallback((searchQuery: string) => {
    setSearchHistory(currentHistory => {
      const newHistory = [searchQuery, ...currentHistory.filter(h => h !== searchQuery)].slice(0, MAX_HISTORY)
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
      } catch {
        // Ignore localStorage errors
      }
      return newHistory
    })
  }, [])

  const clearHistory = useCallback(() => {
    setSearchHistory([])
    try {
      localStorage.removeItem(HISTORY_KEY)
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  const runSearch = useCallback(async (searchQuery: string, append = false) => {
    if (searchQuery.length < 2) {
      setResults([])
      setTotal(null)
      setHasMore(false)
      setSearchAttempted(false)
      return
    }

    const offset = append ? results.length : 0
    if (append) {
      setIsLoadingMore(true)
    } else {
      setIsLoading(true)
      setResults([])
      setTotal(null)
      setHasMore(false)
    }
    setError(null)
    setSearchAttempted(true)
    setShowSuggestions(false)
    setFocusedIndex(-1)
    currentQueryRef.current = searchQuery

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        mode: 'hybrid',
        lang,
        limit: String(PAGE_SIZE),
        offset: String(offset),
      })
      const res: SearchResponse = await fetch(
        `/api/search?${params.toString()}`
      ).then(r => r.json())

      if (res.error === 'rate_limit') {
        setError(t.rateLimited)
      }

      if (append) {
        setResults(prev => [...prev, ...(res.results || [])])
      } else {
        setResults(res.results || [])
      }
      setTotal(res.total ?? (res.results?.length ?? 0))
      setHasMore(Boolean(res.hasMore))
      if (!append) saveToHistory(searchQuery)
    } catch (err) {
      console.error('Search error:', err)
      setError(t.error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [lang, t.error, t.rateLimited, saveToHistory, results.length])

  useEffect(() => {
    if (initialUrlSearchRan.current) return
    initialUrlSearchRan.current = true

    const params = new URLSearchParams(window.location.search)
    const urlQuery = params.get('q')?.trim() ?? ''
    if (urlQuery.length < 2) return

    setQuery(urlQuery)
    runSearch(urlQuery)
  }, [runSearch])

  const updateSearchUrl = useCallback((searchQuery: string) => {
    const params = new URLSearchParams(window.location.search)
    params.set('q', searchQuery)
    params.delete('mode')
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!searchAttempted || isLoading || results.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex(prev => Math.min(prev + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex(prev => Math.max(prev - 1, -1))
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault()
        const result = results[focusedIndex]
        if (result) {
          window.location.href = result.url
        }
      } else if (e.key === 'Escape') {
        setFocusedIndex(-1)
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchAttempted, isLoading, results, focusedIndex])

  const handleSubmit = (e: ReactSubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (query.trim()) {
      const nextQuery = query.trim()
      updateSearchUrl(nextQuery)
      runSearch(nextQuery)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (e.target.value.length === 0) {
      setShowSuggestions(true)
    }
  }

  const handleFocus = () => {
    if (query.length === 0) {
      setShowSuggestions(true)
    }
  }

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    updateSearchUrl(suggestion)
    runSearch(suggestion)
  }

  const showResults = searchAttempted && !isLoading

  return (
    <div className="search-widget">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={t.placeholder}
            className="search-input"
            aria-label={t.placeholder}
            autoComplete="off"
          />
          {isLoading && <div className="search-spinner" />}
        </div>
      </form>

      {showSuggestions && query.length === 0 && (searchHistory.length > 0 || POPULAR_SEARCHES[lang].length > 0) && (
        <div className="search-suggestions">
          {searchHistory.length > 0 && (
            <div className="suggestion-group">
              <div className="suggestion-header">
                <span>{t.recentSearches}</span>
                <button type="button" className="clear-history-btn" onClick={clearHistory}>
                  {t.clearHistory}
                </button>
              </div>
              <div className="suggestion-tags">
                {searchHistory.map((term, i) => (
                  <button
                    key={`history-${i}`}
                    type="button"
                    className="suggestion-tag"
                    onClick={() => handleSuggestionClick(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="suggestion-group">
            <div className="suggestion-header">
              <span>{t.popularSearches}</span>
            </div>
            <div className="suggestion-tags">
              {POPULAR_SEARCHES[lang].map((term, i) => (
                <button
                  key={`popular-${i}`}
                  type="button"
                  className="suggestion-tag popular"
                  onClick={() => handleSuggestionClick(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && <div className="search-error">{error}</div>}

      {query.length > 0 && query.length < 2 && !isLoading && (
        <div className="search-hint">{t.minChars}</div>
      )}

      {isLoading && query.length >= 2 && (
        <div className="search-results">
          <div className="results-section">
            <div className="skeleton skeleton-title" />
            <div className="results-grid">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </div>
      )}

      {showResults && results.length > 0 && (
        <div className="search-results">
          <section className="results-section">
            <h3 className="section-title">
              {t.resultsTitle}
              <span className="section-count">{total ?? results.length}</span>
            </h3>
            <div className="results-grid">
              {results.map((result, i) => (
                <ResultCard
                  key={`${result.slug}-${i}`}
                  result={result}
                  isFocused={focusedIndex === i}
                />
              ))}
            </div>
            {hasMore && (
              <div className="load-more-wrapper" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="load-more-btn"
                  onClick={() => runSearch(currentQueryRef.current, true)}
                  disabled={isLoadingMore}
                  style={{
                    padding: '0.5rem 1.5rem',
                    borderRadius: '9999px',
                    border: '1px solid var(--color-border, #e5e7eb)',
                    background: 'var(--color-bg, #fff)',
                    cursor: isLoadingMore ? 'not-allowed' : 'pointer',
                    opacity: isLoadingMore ? 0.6 : 1,
                  }}
                >
                  {isLoadingMore ? t.loadingMore : `${t.loadMore} (${results.length}/${total})`}
                </button>
              </div>
            )}
          </section>
        </div>
      )}

      {!isLoading && searchAttempted && results.length === 0 && !error && (
        <div className="search-empty">{t.noResults}</div>
      )}

      {showResults && results.length > 0 && (
        <div className="keyboard-hint">
          <span>↑↓ Navigate</span>
          <span>Enter Open</span>
          <span>Esc Cancel</span>
        </div>
      )}
    </div>
  )
}

function ResultCard({ result, isFocused }: { result: SearchResult; isFocused: boolean }) {
  return (
    <a
      href={result.url}
      className={`result-card${isFocused ? ' focused' : ''}`}
      aria-selected={isFocused}
    >
      <div className="result-meta">
        {result.category && <span className="result-category">{result.category}</span>}
        {result.reason && <span className="result-reason">{result.reason}</span>}
      </div>
      <h4 className="result-title">{result.title}</h4>
      {result.evidence && (
        <p className="result-evidence">{result.evidence}</p>
      )}
    </a>
  )
}

function SkeletonCard() {
  return (
    <div className="result-card skeleton-card">
      <div className="result-meta">
        <div className="skeleton skeleton-badge" />
        <div className="skeleton skeleton-text-short" />
      </div>
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" />
    </div>
  )
}
