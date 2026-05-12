import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
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
  metrics?: {
    searches: number
    bm25_short_circuits: number
    average_bm25_ms: number
    average_vector_ms: number | null
  }
  error?: string
  message?: string
}

interface Props {
  lang?: 'zh-TW' | 'en'
}

const HISTORY_KEY = 'search-history'
const MAX_HISTORY = 5

// Popular/trending search suggestions
const POPULAR_SEARCHES: Record<'zh-TW' | 'en', string[]> = {
  'zh-TW': ['RAG', 'Claude', 'MCP', 'Agent', 'Astro', 'Cloudflare'],
  'en': ['RAG', 'Claude', 'MCP', 'Agent', 'Astro', 'Cloudflare']
}

export function SearchWidget({ lang = 'zh-TW' }: Props) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rawKeywordResults, setRawKeywordResults] = useState<SearchResult[]>([])
  const [rawHybridResults, setRawHybridResults] = useState<SearchResult[]>([])
  const [rawRagResults, setRawRagResults] = useState<SearchResult[]>([])
  const [ragAnswer, setRagAnswer] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [searchAttempted, setSearchAttempted] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const t = {
    placeholder: lang === 'en' ? 'Search posts, topics, questions...' : '搜尋文章、主題、問題...',
    keywordSection: lang === 'en' ? 'Keyword Matches' : '關鍵字匹配',
    hybridSection: lang === 'en' ? 'Semantic Results' : '語意相關',
    ragSection: lang === 'en' ? 'AI Recommendations' : 'AI 問答',
    noResults: lang === 'en' ? 'No results found' : '沒有找到結果',
    noKeywordResults: lang === 'en' ? 'No keyword matches' : '沒有關鍵字匹配',
    noSemanticResults: lang === 'en' ? 'No semantic matches' : '沒有語意相關結果',
    noAiResults: lang === 'en' ? 'No AI recommendations' : '沒有 AI 推薦',
    searching: lang === 'en' ? 'Searching...' : '搜尋中...',
    error: lang === 'en' ? 'Search failed. Please try again.' : '搜尋失敗，請重試。',
    minChars: lang === 'en' ? 'Type at least 2 characters' : '請輸入至少 2 個字元',
    rateLimited: lang === 'en' ? 'Daily search limit reached. Please try again tomorrow.' : '已達每日搜尋上限，請明天再試。',
    recentSearches: lang === 'en' ? 'Recent' : '最近搜尋',
    popularSearches: lang === 'en' ? 'Popular' : '熱門搜尋',
    clearHistory: lang === 'en' ? 'Clear history' : '清除記錄',
  }

  // Load search history from localStorage
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

  // Save search to history
  const saveToHistory = useCallback((searchQuery: string) => {
    const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, MAX_HISTORY)
    setSearchHistory(newHistory)
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
    } catch {
      // Ignore localStorage errors
    }
  }, [searchHistory])

  // Clear history
  const clearHistory = useCallback(() => {
    setSearchHistory([])
    try {
      localStorage.removeItem(HISTORY_KEY)
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Deduplicate results: track which slugs have been shown
  const { keywordResults, hybridResults, ragResults } = useMemo(() => {
    const seenSlugs = new Set<string>()

    // Keyword results are always shown first
    const keyword = rawKeywordResults.filter(result => {
      if (seenSlugs.has(result.slug)) return false
      seenSlugs.add(result.slug)
      return true
    })

    // Hybrid results: exclude any already shown in keyword
    const hybrid = rawHybridResults.filter(result => {
      if (seenSlugs.has(result.slug)) return false
      seenSlugs.add(result.slug)
      return true
    })

    // RAG results: exclude any already shown in keyword or hybrid
    const rag = rawRagResults.filter(result => {
      if (seenSlugs.has(result.slug)) return false
      seenSlugs.add(result.slug)
      return true
    })

    return { keywordResults: keyword, hybridResults: hybrid, ragResults: rag }
  }, [rawKeywordResults, rawHybridResults, rawRagResults])

  // Flatten all results for keyboard navigation
  const allResults = useMemo(() => [
    ...keywordResults,
    ...hybridResults,
    ...ragResults
  ], [keywordResults, hybridResults, ragResults])

  // Computed values for rendering
  const hasAnyResults = keywordResults.length > 0 || hybridResults.length > 0 || ragResults.length > 0
  const showResults = searchAttempted && !isLoading

  const runSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setRawKeywordResults([])
      setRawHybridResults([])
      setRawRagResults([])
      setRagAnswer('')
      setSearchAttempted(false)
      return
    }

    setIsLoading(true)
    setError(null)
    setSearchAttempted(true)
    setShowSuggestions(false)
    setFocusedIndex(-1)

    try {
      // Run all three searches in parallel
      const [keywordRes, hybridRes, ragRes] = await Promise.all([
        fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&mode=keyword&limit=6`).then(r => r.json()) as Promise<SearchResponse>,
        fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&mode=hybrid&limit=6`).then(r => r.json()) as Promise<SearchResponse>,
        fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&mode=rag&limit=6`).then(r => r.json()) as Promise<SearchResponse>,
      ])

      // Check for rate limit or other errors
      if (hybridRes.error === 'rate_limit' || ragRes.error === 'rate_limit') {
        setError(t.rateLimited)
      }

      setRawKeywordResults(keywordRes.results || [])
      setRawHybridResults(hybridRes.results || [])
      setRawRagResults(ragRes.results || [])

      // Save successful search to history
      saveToHistory(searchQuery)
    } catch (err) {
      console.error('Search error:', err)
      setError(t.error)
    } finally {
      setIsLoading(false)
    }
  }, [t.error, t.rateLimited, saveToHistory])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showResults || allResults.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex(prev => Math.min(prev + 1, allResults.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex(prev => Math.max(prev - 1, -1))
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault()
        const result = allResults[focusedIndex]
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
  }, [showResults, allResults, focusedIndex])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      runSearch(query.trim())
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    // Delay to allow clicking on suggestions
    setTimeout(() => setShowSuggestions(false), 200)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    runSearch(suggestion)
  }

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

      {/* Search suggestions */}
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

      {/* Loading skeleton */}
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

      {/* Actual results */}
      {showResults && (
        <div className="search-results">
          <ResultsSection
            title={t.keywordSection}
            results={keywordResults}
            emptyMessage={t.noKeywordResults}
            showEmpty={true}
            focusedIndex={focusedIndex}
            startIndex={0}
          />

          <ResultsSection
            title={t.hybridSection}
            results={hybridResults}
            emptyMessage={t.noSemanticResults}
            showEmpty={searchAttempted}
            focusedIndex={focusedIndex}
            startIndex={keywordResults.length}
          />

          <ResultsSection
            title={t.ragSection}
            results={ragResults}
            emptyMessage={t.noAiResults}
            showEmpty={searchAttempted}
            ragAnswer={ragAnswer}
            focusedIndex={focusedIndex}
            startIndex={keywordResults.length + hybridResults.length}
          />
        </div>
      )}

      {!isLoading && searchAttempted && !hasAnyResults && !error && (
        <div className="search-empty">{t.noResults}</div>
      )}

      {/* Keyboard navigation hint */}
      {showResults && allResults.length > 0 && (
        <div className="keyboard-hint">
          <span>↑↓ Navigate</span>
          <span>Enter Open</span>
          <span>Esc Cancel</span>
        </div>
      )}
    </div>
  )
}

function ResultsSection({
  title,
  icon,
  results,
  emptyMessage,
  showEmpty,
  ragAnswer,
  focusedIndex,
  startIndex
}: {
  title: string
  icon: string
  results: SearchResult[]
  emptyMessage: string
  showEmpty: boolean
  ragAnswer?: string
  focusedIndex: number
  startIndex: number
}) {
  if (results.length === 0 && !showEmpty) return null

  return (
    <section className="results-section">
      <h3 className="section-title">
        <span className="section-icon">{icon}</span>
        {title}
        <span className="section-count">{results.length}</span>
      </h3>
      {ragAnswer && (
        <div className="rag-answer">
          <ReactMarkdown>{ragAnswer}</ReactMarkdown>
        </div>
      )}
      {results.length > 0 ? (
        <div className="results-grid">
          {results.map((result, i) => (
            <ResultCard
              key={result.slug}
              result={result}
              isFocused={focusedIndex === startIndex + i}
            />
          ))}
        </div>
      ) : (
        <div className="empty-section">{emptyMessage}</div>
      )}
    </section>
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
