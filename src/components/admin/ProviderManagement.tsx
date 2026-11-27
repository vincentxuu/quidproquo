import { useCallback, useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Loader2,
  RefreshCw,
  Trash2,
} from 'lucide-react'

interface CatalogModel {
  provider: string
  model: string
  displayName?: string
  notes?: string
  enabled: boolean
}

interface ProviderSecret {
  envKey: string
  provider?: string
  hasEnv?: boolean
  hasDb?: boolean
  configured?: boolean
  source?: string
}

interface RagSettings {
  rag_pipeline_engine?: string
  rag_default_provider?: string
  rag_default_model?: string
  rag_fallback_provider?: string
  rag_fallback_model?: string
  rag_flag_hyde?: string
  rag_flag_multi_query?: string
  rag_flag_reranker?: string
  rag_flag_critic?: string
}

export interface ProviderMessages {
  [key: string]: string
}

const DEFAULT_PROVIDERS = [
  'openai', 'google', 'anthropic', 'gemini', 'cloudflare',
  'nvidia', 'openrouter', 'opencode',
]

const PROVIDER_SECRET_FIELDS = [
  'OPENAI_API_KEY', 'GOOGLE_API_KEY', 'GEMINI_API_KEY',
  'ANTHROPIC_API_KEY', 'OPENROUTER_API_KEY', 'NVIDIA_API_KEY', 'OPENCODE_API_KEY',
  'CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID',
  'JINA_API_KEY', 'JINA_SEARCH_API_KEY', 'TAVILY_API_KEY', 'FIRECRAWL_API_KEY',
  'EXA_API_KEY', 'BRAVE_SEARCH_API_KEY', 'BRAVE_API_KEY', 'SERPER_API_KEY',
  'SERPAPI_API_KEY', 'BOCHA_API_KEY', 'BRIGHT_DATA_API_KEY', 'BRIGHTDATA_API_KEY', 'LINKUP_API_KEY',
]

/** 一次操作的回饋：顯示在觸發它的按鈕旁。成功訊息自動消失，失敗訊息留到下一次操作。 */
interface Feedback {
  kind: 'pending' | 'success' | 'error'
  text: string
  /** 成功訊息本身是結果（例如測試耗時）時不自動消失 */
  sticky?: boolean
}

const SUCCESS_VISIBLE_MS = 4000

type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; data: Record<string, unknown> }

/** 呼叫 admin API；失敗時帶回伺服器的 `error` 字串，沒有就用 HTTP 狀態碼，連線失敗用 networkError。 */
async function requestJson<T = Record<string, unknown>>(url: string, init: RequestInit, networkError: string): Promise<ApiResult<T>> {
  let res: Response
  try {
    res = await fetch(url, init)
  } catch {
    return { ok: false, error: networkError, data: {} }
  }
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok) {
    const reason = typeof data.error === 'string' && data.error ? data.error : `HTTP ${res.status}`
    return { ok: false, error: reason, data }
  }
  return { ok: true, data: data as T }
}

function fmt(template: string | undefined, vars: Record<string, string | number | undefined>): string {
  return Object.entries(vars).reduce((text, [k, v]) => text.replaceAll(`{${k}}`, String(v ?? '')), template || '')
}

function useFeedback() {
  const [feedback, setFeedbackMap] = useState<Record<string, Feedback>>({})
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const setFeedback = useCallback((key: string, next: Feedback | null) => {
    clearTimeout(timers.current[key])
    delete timers.current[key]
    setFeedbackMap(prev => {
      const n = { ...prev }
      if (next) n[key] = next
      else delete n[key]
      return n
    })
    if (next?.kind === 'success' && !next.sticky) {
      timers.current[key] = setTimeout(() => setFeedback(key, null), SUCCESS_VISIBLE_MS)
    }
  }, [])

  useEffect(() => () => { Object.values(timers.current).forEach(clearTimeout) }, [])

  return [feedback, setFeedback] as const
}

/** 常駐的 live region：先掛上空的節點，內容變動時螢幕閱讀器才會唸出來。 */
function InlineStatus({ feedback, id, className }: { feedback?: Feedback; id?: string; className?: string }) {
  return (
    <span
      id={id}
      role="status"
      aria-live="polite"
      className={cn(
        'inline-flex min-w-0 items-center gap-1 text-xs',
        feedback?.kind === 'error' ? 'text-destructive' : feedback?.kind === 'success' ? 'text-[var(--success)]' : 'text-muted-foreground',
        className,
      )}
    >
      {feedback?.kind === 'pending' && <Loader2 className="size-3 shrink-0 animate-spin" aria-hidden />}
      {feedback?.kind === 'success' && <CheckCircle2 className="size-3 shrink-0" aria-hidden />}
      {feedback?.kind === 'error' && <AlertCircle className="size-3 shrink-0" aria-hidden />}
      {feedback && <span className="min-w-0 [overflow-wrap:anywhere]">{feedback.text}</span>}
    </span>
  )
}

function SectionHeader({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {note && <p className="mt-0.5 text-sm text-muted-foreground">{note}</p>}
    </div>
  )
}

export default function ProviderManagement({ messages: m }: { messages: ProviderMessages }) {
  const [providers, setProviders] = useState<string[]>(DEFAULT_PROVIDERS)
  const [catalog, setCatalog] = useState<CatalogModel[]>([])
  const [secrets, setSecrets] = useState<ProviderSecret[]>([])
  const [ragSettings, setRagSettings] = useState<RagSettings>({})
  // 回饋 key：routing、catalog-form、test、provider:<p>、model:<p>:<model>、secret:<envKey>
  const [feedback, setFeedback] = useFeedback()
  const [testResult, setTestResult] = useState(m.notTested || 'Not tested')
  // 模型清單是整包 PUT，同時送兩次會互相覆蓋，所以一次只允許一個清單寫入
  const [catalogBusy, setCatalogBusy] = useState(false)
  const isPending = (key: string) => feedback[key]?.kind === 'pending'
  const failed = (action: string | undefined, reason: string) =>
    fmt(m.failedReason || '{action}: {reason}', { action: (action || '').replace(/[。.]$/, ''), reason })

  const [openProviders, setOpenProviders] = useState<Set<string>>(new Set())

  // Routing form
  const [routeEngine, setRouteEngine] = useState('langgraph')
  const [routeProvider, setRouteProvider] = useState('')
  const [routeModel, setRouteModel] = useState('')
  const [routeFallbackProvider, setRouteFallbackProvider] = useState('')
  const [routeFallbackModel, setRouteFallbackModel] = useState('')

  // Add model form
  const [addProvider, setAddProvider] = useState('')
  const [addModel, setAddModel] = useState('')
  const [addDisplayName, setAddDisplayName] = useState('')
  const [addNotes, setAddNotes] = useState('')
  const [addEnabled, setAddEnabled] = useState(true)

  // Test form
  const [testProvider, setTestProvider] = useState('')
  const [testModel, setTestModel] = useState('')
  const [testMaxTokens, setTestMaxTokens] = useState(96)
  const [testTitle, setTestTitle] = useState('')
  const [testPrompt, setTestPrompt] = useState('Say hello in one sentence.')

  // Secret inputs（受控，儲存成功後清空）
  const [secretDrafts, setSecretDrafts] = useState<Record<string, string>>({})

  // RAG pipeline / embed status
  const [ragCards, setRagCards] = useState<{ title: string; rows: [string, string][]; flags?: [string, boolean][] }[]>([])
  const [embedCards, setEmbedCards] = useState<{ title: string; status: boolean; rows: [string, string][] }[]>([])
  const [systemSecrets, setSystemSecrets] = useState<{ name: string; status: string }[]>([])

  const enabledModels = useCallback((provider: string) => catalog.filter(m => m.provider === provider && m.enabled), [catalog])

  const modelsForProvider = useCallback((provider: string, allowNone = false): { value: string; label: string }[] => {
    const models = enabledModels(provider)
    const options = models.map(m => ({ value: m.model, label: m.displayName || m.model }))
    if (allowNone) return [{ value: '', label: 'none' }, ...options]
    if (!options.length) return [{ value: '', label: m.noEnabledModels || 'No enabled models' }]
    return options
  }, [enabledModels, m])

  async function loadAll() {
    await Promise.all([loadCatalog(), loadRag(), loadEmbed(), loadSecretsStatus()])
  }

  async function loadCatalog(): Promise<ProviderSecret[] | undefined> {
    try {
      const res = await fetch('/api/admin/settings/models')
      if (!res.ok) return undefined
      const data = (await res.json()) as {
        providers?: string[]
        catalog?: { models?: CatalogModel[] }
        providerKeys?: ProviderSecret[]
      }
      const p = data.providers || DEFAULT_PROVIDERS
      const models = data.catalog?.models || []
      setProviders(p)
      setCatalog(models)
      setSecrets(data.providerKeys || [])
      if (!addProvider && p.length) setAddProvider(p[0])
      if (!testProvider && p.length) setTestProvider(p[0])
      return data.providerKeys || []
    } catch {
      return undefined
    }
  }

  async function loadRag() {
    try {
      const res = await fetch('/api/admin/site/rag')
      if (!res.ok) return
      const data = (await res.json()) as { settings?: { key: string; value: string }[] }
      const s: Record<string, string> = {}
      for (const row of data.settings || []) s[row.key] = row.value
      setRagSettings(s as RagSettings)
      setRouteEngine(s.rag_pipeline_engine || 'langgraph')
      setRouteProvider(s.rag_default_provider || 'cloudflare')
      setRouteModel(s.rag_default_model || '')
      setRouteFallbackProvider(s.rag_fallback_provider || '')
      setRouteFallbackModel(s.rag_fallback_model || '')

      setRagCards([
        {
          title: 'Chat / Answer',
          rows: [
            ['Provider', s.rag_default_provider || 'cloudflare'],
            ['Model', s.rag_default_model || '@cf/meta/llama-4-scout-17b-16e-instruct'],
            ['Engine', s.rag_pipeline_engine || 'langgraph'],
          ],
        },
        {
          title: 'Fallback',
          rows: [
            ['Provider', s.rag_fallback_provider || 'none'],
            ['Model', s.rag_fallback_model || 'none'],
          ],
        },
        {
          title: 'Feature Flags',
          rows: [],
          flags: [
            ['HyDE', s.rag_flag_hyde === '1'],
            ['Multi-Query', s.rag_flag_multi_query === '1'],
            ['Reranker', s.rag_flag_reranker === '1'],
            ['Critic', s.rag_flag_critic === '1'],
          ],
        },
      ])
    } catch { /* silent */ }
  }

  async function loadEmbed() {
    try {
      const res = await fetch('/api/admin/site/status')
      if (!res.ok) return
      const data = (await res.json()) as {
        statuses?: { name: string; ok: boolean }[]
        index?: { embeddingModel?: string; postChunks?: number; docChunks?: number }
      }
      const wai = data.statuses?.find(s => s.name === 'Workers AI')?.ok ?? false
      const vec = data.statuses?.find(s => s.name === 'Vectorize Index')?.ok ?? false
      setEmbedCards([
        {
          title: 'Workers AI', status: wai,
          rows: [
            ['Embedding Model', data.index?.embeddingModel ?? 'Unknown'],
            ['Post Chunks', String(data.index?.postChunks ?? 0)],
            ['Doc Chunks', String(data.index?.docChunks ?? 0)],
          ],
        },
        { title: 'Vectorize', status: vec, rows: [['Index', 'quidproquo-embeddings']] },
      ])
    } catch { /* silent */ }
  }

  async function loadSecretsStatus() {
    try {
      const res = await fetch('/api/admin/site/status')
      if (!res.ok) return
      const data = (await res.json()) as { statuses?: { name: string; ok: boolean }[] }
      setSystemSecrets([
        { name: 'ADMIN_PASSWORD', status: 'configured' },
        { name: 'CRAWL_SECRET', status: 'configured' },
        { name: 'Workers AI Binding', status: data.statuses?.find(s => s.name === 'Workers AI')?.ok ? 'ready' : 'missing' },
      ])
    } catch { /* silent */ }
  }

  useEffect(() => { loadAll() }, [])

  const API = '/api/admin/settings/models'
  const jsonInit = (method: string, body: unknown): RequestInit => ({
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  /** 整包寫回模型清單；回饋（進行中／失敗）掛在 key 對應的那一列，成功由呼叫端決定要顯示什麼。 */
  async function saveCatalog(models: CatalogModel[], key: string): Promise<boolean> {
    if (catalogBusy) { setFeedback(key, { kind: 'error', text: m.catalogBusy }); return false }
    setCatalogBusy(true)
    setFeedback(key, { kind: 'pending', text: m.saving })
    try {
      const r = await requestJson(API, jsonInit('PUT', { models }), m.networkError)
      if (!r.ok) { setFeedback(key, { kind: 'error', text: failed(m.saveFailed, r.error) }); return false }
      await loadCatalog()
      setFeedback(key, null)
      return true
    } finally {
      setCatalogBusy(false)
    }
  }

  async function handleAddModel(e: { preventDefault: () => void }) {
    e.preventDefault()
    const key = 'catalog-form'
    if (!addProvider || !addModel.trim()) { setFeedback(key, { kind: 'error', text: m.modelRequired }); return }
    const next: CatalogModel = {
      provider: addProvider,
      model: addModel.trim(),
      displayName: addDisplayName.trim(),
      notes: addNotes.trim(),
      enabled: addEnabled,
    }
    const updated = [
      ...catalog.filter(x => x.provider !== next.provider || x.model !== next.model),
      next,
    ].sort((a, b) => a.provider.localeCompare(b.provider) || a.model.localeCompare(b.model))
    // 失敗時保留表單內容，讓使用者修正後重送
    if (!(await saveCatalog(updated, key))) return
    setFeedback(key, { kind: 'success', text: m.saved })
    setAddModel('')
    setAddDisplayName('')
    setAddNotes('')
    setAddEnabled(true)
  }

  function editModel(model: CatalogModel) {
    setAddProvider(model.provider)
    setAddModel(model.model)
    setAddDisplayName(model.displayName || '')
    setAddNotes(model.notes || '')
    setAddEnabled(model.enabled)
  }

  const modelKey = (model: CatalogModel) => `model:${model.provider}:${model.model}`

  async function toggleModel(model: CatalogModel) {
    const updated = catalog.map(x =>
      x.provider === model.provider && x.model === model.model
        ? { ...x, enabled: !x.enabled }
        : x
    )
    // 成功的訊號就是徽章翻面，不另外顯示文字
    await saveCatalog(updated, modelKey(model))
  }

  async function deleteModel(model: CatalogModel) {
    const updated = catalog.filter(x => x !== model)
    // 刪掉後該列會消失，成功訊息改掛在 provider 標題列
    if (await saveCatalog(updated, modelKey(model))) {
      setFeedback(`provider:${model.provider}`, { kind: 'success', text: fmt(m.modelDeletedName, { model: model.displayName || model.model }) })
    }
  }

  async function syncProvider(provider: string) {
    const key = `provider:${provider}`
    setFeedback(key, { kind: 'pending', text: m.syncing })
    const r = await requestJson<{ added?: number; existing?: number; total?: number }>(
      `${API}/sync/${encodeURIComponent(provider)}`, { method: 'POST' }, m.networkError,
    )
    if (!r.ok) { setFeedback(key, { kind: 'error', text: failed(m.syncFailed, r.error) }); return }
    await loadCatalog()
    setFeedback(key, { kind: 'success', text: fmt(m.syncDone, { added: r.data.added, existing: r.data.existing, total: r.data.total }) })
  }

  async function saveRouting() {
    const key = 'routing'
    setFeedback(key, { kind: 'pending', text: m.saving })
    const settings = {
      ...ragSettings,
      rag_pipeline_engine: routeEngine,
      rag_default_provider: routeProvider,
      rag_default_model: routeModel,
      rag_fallback_provider: routeFallbackProvider,
      rag_fallback_model: routeFallbackModel,
    }
    const r = await requestJson('/api/admin/site/rag', jsonInit('POST', { settings }), m.networkError)
    if (!r.ok) { setFeedback(key, { kind: 'error', text: failed(m.saveFailed, r.error) }); return }
    await loadRag()
    setFeedback(key, { kind: 'success', text: m.saved })
  }

  async function runTest() {
    const key = 'test'
    setFeedback(key, { kind: 'pending', text: m.testing })
    setTestResult(m.waitingModel)
    const r = await requestJson<Record<string, unknown>>(API, jsonInit('POST', {
      provider: testProvider,
      model: testModel,
      prompt: testPrompt,
      title: testTitle,
      maxTokens: testMaxTokens,
    }), m.networkError)
    if (!r.ok) {
      setFeedback(key, { kind: 'error', text: failed(m.testFailed, r.error) })
      setTestResult(Object.keys(r.data).length ? JSON.stringify(r.data, null, 2) : r.error)
      return
    }
    setFeedback(key, { kind: 'success', text: fmt(m.successMs, { ms: String(r.data.duration_ms) }), sticky: true })
    const data = { ...r.data }
    if (testTitle.trim()) data.testTitle = testTitle.trim()
    setTestResult(JSON.stringify(data, null, 2))
  }

  function currentSource(list: ProviderSecret[] | undefined, key: string, assumed: string): string {
    const item = list?.find(s => s.envKey === key)
    return item ? statusLabel(item) : assumed
  }

  async function saveSecret(key: string) {
    const fk = `secret:${key}`
    const value = secretDrafts[key]?.trim()
    if (!value) { setFeedback(fk, { kind: 'error', text: m.secretRequired }); return }
    setFeedback(fk, { kind: 'pending', text: m.saving })
    const r = await requestJson(API, jsonInit('POST', { action: 'save-provider-key', key, value }), m.networkError)
    if (!r.ok) { setFeedback(fk, { kind: 'error', text: failed(m.saveFailed, r.error) }); return }
    setSecretDrafts(prev => { const n = { ...prev }; delete n[key]; return n })
    const list = await loadCatalog()
    setFeedback(fk, { kind: 'success', text: fmt(m.secretSavedKey, { key, source: currentSource(list, key, 'admin') }) })
  }

  async function deleteSecret(key: string) {
    const fk = `secret:${key}`
    setFeedback(fk, { kind: 'pending', text: m.deleting })
    const r = await requestJson(API, jsonInit('POST', { action: 'delete-provider-key', key }), m.networkError)
    if (!r.ok) { setFeedback(fk, { kind: 'error', text: failed(m.deleteFailed, r.error) }); return }
    const list = await loadCatalog()
    setFeedback(fk, { kind: 'success', text: fmt(m.secretDeletedKey, { key, source: currentSource(list, key, 'missing') }) })
  }

  function statusLabel(secret: ProviderSecret) {
    if (secret.source === 'env') return 'env'
    if (secret.source === 'both') return 'env+admin'
    if (secret.source === 'admin') return 'admin'
    return 'missing'
  }

  const grouped = providers.reduce<Record<string, CatalogModel[]>>((acc, p) => {
    acc[p] = catalog.filter(x => x.provider === p)
    return acc
  }, {})

  const secretsByKey = new Map(secrets.map(s => [s.envKey, s]))

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">{m.description}</p>

      {/* ── Routing ── */}
      <section>
        <SectionHeader title={m.routingTitle} note={m.routingNote} />
        <div className="grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-3">
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.engine}
            <select value={routeEngine} onChange={e => setRouteEngine(e.target.value)} className="w-full min-w-0 rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground">
              <option value="langgraph">langgraph</option>
              <option value="manual">manual</option>
              <option value="llamaindex">llamaindex</option>
            </select>
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.defaultProvider}
            <select value={routeProvider} onChange={e => { setRouteProvider(e.target.value); setRouteModel('') }} className="w-full min-w-0 rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground">
              {providers.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.defaultModel}
            <select value={routeModel} onChange={e => setRouteModel(e.target.value)} className="w-full min-w-0 rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground">
              {modelsForProvider(routeProvider).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.fallbackProvider}
            <select value={routeFallbackProvider} onChange={e => { setRouteFallbackProvider(e.target.value); setRouteFallbackModel('') }} className="w-full min-w-0 rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground">
              <option value="">none</option>
              {providers.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.fallbackModel}
            <select value={routeFallbackModel} onChange={e => setRouteFallbackModel(e.target.value)} className="w-full min-w-0 rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground">
              {modelsForProvider(routeFallbackProvider, true).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <div className="flex flex-wrap items-end gap-2">
            <Button onClick={saveRouting} size="sm" disabled={isPending('routing')} aria-describedby="routing-status">
              {isPending('routing') && <Loader2 className="size-3 animate-spin" aria-hidden />}
              {m.saveRouting}
            </Button>
            <InlineStatus id="routing-status" feedback={feedback.routing} className="pb-1.5" />
          </div>
        </div>
      </section>

      {/* ── Catalog ── */}
      <section>
        <SectionHeader title={m.catalogTitle} note={m.catalogNote} />

        <div className="mb-3 flex gap-2">
          <Button variant="outline" size="xs" onClick={() => setOpenProviders(new Set(providers))}>{m.expandAll}</Button>
          <Button variant="outline" size="xs" onClick={() => setOpenProviders(new Set())}>{m.collapseAll}</Button>
        </div>

        <form onSubmit={handleAddModel} className="mb-4 grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-3 lg:grid-cols-6">
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.provider}
            <select value={addProvider} onChange={e => setAddProvider(e.target.value)} className="w-full min-w-0 rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground">
              {providers.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.modelName}
            <input value={addModel} onChange={e => setAddModel(e.target.value)} placeholder="@cf/meta/llama-4-scout-17b-16e-instruct" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.displayName}
            <input value={addDisplayName} onChange={e => setAddDisplayName(e.target.value)} placeholder="Llama 3.3 70B" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.notes}
            <input value={addNotes} onChange={e => setAddNotes(e.target.value)} placeholder={m.notesPlaceholder} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
          </label>
          <label className="flex items-end gap-2 text-xs text-muted-foreground">
            <Switch checked={addEnabled} onCheckedChange={setAddEnabled} />
            <span>{addEnabled ? 'Enabled' : 'Disabled'}</span>
          </label>
          <div className="flex items-end">
            <Button type="submit" size="sm" disabled={catalogBusy} aria-describedby="catalog-form-status">
              {isPending('catalog-form') && <Loader2 className="size-3 animate-spin" aria-hidden />}
              {m.addUpdate}
            </Button>
          </div>
          <InlineStatus id="catalog-form-status" feedback={feedback['catalog-form']} className="sm:col-span-3 lg:col-span-6" />
        </form>

        <div className="space-y-2">
          {providers.map(provider => {
            const models = grouped[provider] || []
            const activeCount = models.filter(x => x.enabled).length
            const isOpen = openProviders.has(provider)
            const providerFeedback = feedback[`provider:${provider}`]
            const syncing = providerFeedback?.kind === 'pending'

            return (
              <Collapsible key={provider} open={isOpen} onOpenChange={(open: boolean) => setOpenProviders(prev => { const n = new Set(prev); if (open) { n.add(provider) } else { n.delete(provider) } return n })}>
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-muted/50">
                      <div className="flex min-w-0 items-center gap-2">
                        <ChevronRight className={cn('size-4 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-90')} />
                        <strong className="truncate text-sm">{provider}</strong>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {(m.modelsEnabled || '').replace('{active}', String(activeCount)).replace('{total}', String(models.length))}
                        </span>
                      </div>
                      <div className="flex min-w-0 items-center gap-2" onClick={e => e.stopPropagation()}>
                        <InlineStatus feedback={providerFeedback} />
                        <Button
                          variant="outline" size="xs"
                          disabled={syncing}
                          onClick={() => syncProvider(provider)}
                        >
                          {syncing ? <Loader2 className="size-3 animate-spin" aria-hidden /> : <RefreshCw className="size-3" aria-hidden />}
                          {m.syncModels}
                        </Button>
                      </div>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-border">
                      {models.length ? models.map(model => {
                        const rowFeedback = feedback[modelKey(model)]
                        const rowPending = rowFeedback?.kind === 'pending'
                        return (
                          <div key={`${model.provider}:${model.model}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border px-4 py-2 first:border-t-0">
                            <button type="button" className="min-w-0 flex-1 text-left" onClick={() => editModel(model)}>
                              <span className="block truncate text-sm font-medium">{model.displayName || model.model}</span>
                              <span className="block truncate text-xs font-mono text-muted-foreground">{model.model}</span>
                              {model.notes && <span className="block truncate text-xs text-muted-foreground">{model.notes}</span>}
                            </button>
                            <InlineStatus feedback={rowFeedback} />
                            <Badge asChild variant={model.enabled ? 'default' : 'secondary'} className="shrink-0">
                              <button
                                type="button"
                                disabled={catalogBusy}
                                aria-pressed={model.enabled}
                                onClick={() => toggleModel(model)}
                                className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {rowPending && <Loader2 className="animate-spin" aria-hidden />}
                                {model.enabled ? m.active : m.inactive}
                              </button>
                            </Badge>
                            <Button
                              variant="ghost" size="icon-xs"
                              disabled={catalogBusy}
                              onClick={() => deleteModel(model)}
                              aria-label={`${m.delete} ${model.model}`}
                              className="shrink-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-3" aria-hidden />
                            </Button>
                          </div>
                        )
                      }) : (
                        <p className="px-4 py-3 text-sm text-muted-foreground">{m.noModels}</p>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )
          })}
        </div>
      </section>

      {/* ── Test ── */}
      <section>
        <SectionHeader title={m.testTitle} note={m.testNote} />
        <div className="grid gap-3 rounded-lg border border-border bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-xs text-muted-foreground">
              {m.provider}
              <select value={testProvider} onChange={e => { setTestProvider(e.target.value); setTestModel('') }} className="w-full min-w-0 rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground">
                {providers.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-xs text-muted-foreground">
              {m.modelName}
              <select value={testModel} onChange={e => setTestModel(e.target.value)} className="w-full min-w-0 rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground">
                {modelsForProvider(testProvider).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-xs text-muted-foreground">
              {m.maxTokens}
              <input type="number" min={16} max={512} value={testMaxTokens} onChange={e => setTestMaxTokens(Number(e.target.value))} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
            </label>
          </div>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.testName}
            <input value={testTitle} onChange={e => setTestTitle(e.target.value)} placeholder={m.testNamePlaceholder} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.prompt}
            <textarea value={testPrompt} onChange={e => setTestPrompt(e.target.value)} rows={3} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm resize-y" />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={runTest} size="sm" className="w-fit" disabled={isPending('test')} aria-describedby="test-status">
              {isPending('test') && <Loader2 className="size-3 animate-spin" aria-hidden />}
              {m.runTest}
            </Button>
            <InlineStatus id="test-status" feedback={feedback.test} />
          </div>
          <pre className="min-h-[130px] overflow-auto rounded-lg bg-[var(--bg-code)] p-3 text-xs text-[var(--code-text)]">{testResult}</pre>
        </div>
      </section>

      {/* ── Secrets ── */}
      <section>
        <SectionHeader title={m.secretsTitle} note={m.secretsNote} />
        <div className="grid gap-2 sm:grid-cols-2">
          {PROVIDER_SECRET_FIELDS.map(key => {
            const item = secretsByKey.get(key) || { envKey: key, source: 'missing', configured: false, hasDb: false }
            const sl = statusLabel(item)
            const fk = `secret:${key}`
            const rowFeedback = feedback[fk]
            const rowPending = rowFeedback?.kind === 'pending'
            const inputId = `secret-input-${key}`
            const statusId = `secret-status-${key}`
            return (
              <form
                key={key}
                onSubmit={e => { e.preventDefault(); if (!rowPending) saveSecret(key) }}
                className={cn(
                  'flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3 transition-colors',
                  rowFeedback?.kind === 'success' ? 'border-[var(--success)]'
                    : rowFeedback?.kind === 'error' ? 'border-destructive' : 'border-border',
                )}
              >
                <label htmlFor={inputId} className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-mono">{key}</span>
                  <span className="sr-only">{fmt(m.secretInputLabel, { key })}</span>
                </label>
                <Badge variant={sl === 'missing' ? 'destructive' : 'secondary'} className="shrink-0 text-(length:--fs-2xs)">{sl}</Badge>
                <input
                  id={inputId}
                  type="password"
                  value={secretDrafts[key] ?? ''}
                  placeholder={item.configured ? m.secretConfiguredPlaceholder : m.secretEmptyPlaceholder}
                  onChange={e => { const v = e.target.value; setSecretDrafts(prev => ({ ...prev, [key]: v })) }}
                  disabled={rowPending}
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={rowFeedback?.kind === 'error' || undefined}
                  aria-describedby={statusId}
                  className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs disabled:opacity-60"
                />
                <div className="flex gap-1">
                  <Button type="submit" variant="outline" size="xs" disabled={rowPending}>
                    {rowPending && <Loader2 className="size-3 animate-spin" aria-hidden />}
                    {m.saveSecret}
                  </Button>
                  <Button type="button" variant="outline" size="xs" disabled={!item.hasDb || rowPending} onClick={() => deleteSecret(key)} className="text-destructive">{m.deleteAdmin}</Button>
                </div>
                <InlineStatus id={statusId} feedback={rowFeedback} className="w-full" />
              </form>
            )
          })}
        </div>
      </section>

      {/* ── RAG Pipeline + Embedding + Secrets Status ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{m.ragPipeline}</h2>
          <div className="space-y-3">
            {ragCards.map(card => (
              <div key={card.title} className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-2 text-sm font-semibold">{card.title}</h3>
                {card.rows.map(([label, value]) => (
                  <div key={label} className="flex gap-2 text-sm">
                    <span className="min-w-[100px] text-muted-foreground">{label}:</span>
                    <span className="font-mono truncate">{value}</span>
                  </div>
                ))}
                {card.flags && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {card.flags.map(([label, on]) => (
                      <Badge key={label} variant={on ? 'default' : 'secondary'}>{label}</Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{m.embedding}</h2>
          <div className="space-y-3">
            {embedCards.map(card => (
              <div key={card.title} className="rounded-lg border border-border bg-card p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{card.title}</h3>
                  <Badge variant={card.status ? 'default' : 'destructive'}>{card.status ? 'Active' : 'Error'}</Badge>
                </div>
                {card.rows.map(([label, value]) => (
                  <div key={label} className="flex gap-2 text-sm">
                    <span className="min-w-[100px] text-muted-foreground">{label}:</span>
                    <span className="font-mono truncate">{value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{m.secretsStatus}</h2>
          <div className="space-y-2">
            {systemSecrets.map(s => (
              <div key={s.name} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-2">
                <span className="min-w-0 truncate font-mono text-sm" title={s.name}>{s.name}</span>
                <Badge variant={s.status === 'missing' ? 'destructive' : 'default'}>{s.status}</Badge>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
