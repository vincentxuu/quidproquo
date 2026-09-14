import { useCallback, useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Switch } from '@/components/ui/switch'
import { cn } from 'cn'
import {
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
  'groq', 'openai', 'google', 'anthropic', 'gemini', 'cloudflare',
  'nvidia', 'cerebras', 'openrouter', 'ollama_cloud', 'ollama',
]

const PROVIDER_SECRET_FIELDS = [
  'GROQ_API_KEY', 'OPENAI_API_KEY', 'GOOGLE_API_KEY', 'GEMINI_API_KEY',
  'ANTHROPIC_API_KEY', 'OPENROUTER_API_KEY', 'NVIDIA_API_KEY', 'CEREBRAS_API_KEY',
  'CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID',
  'OLLAMA_API_KEY', 'OLLAMA_CLOUD_API_KEY', 'OLLAMA_API_BASE', 'OLLAMA_HOST', 'OLLAMA_URL',
  'JINA_API_KEY', 'JINA_SEARCH_API_KEY', 'TAVILY_API_KEY', 'FIRECRAWL_API_KEY',
  'EXA_API_KEY', 'BRAVE_SEARCH_API_KEY', 'BRAVE_API_KEY', 'SERPER_API_KEY',
  'SERPAPI_API_KEY', 'BOCHA_API_KEY', 'BRIGHT_DATA_API_KEY', 'BRIGHTDATA_API_KEY', 'LINKUP_API_KEY',
]

function StatusText({ text }: { text: string }) {
  if (!text) return null
  return <span className="text-xs text-muted-foreground" aria-live="polite">{text}</span>
}

function SectionHeader({ title, note, status }: { title: string; note?: string; status?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
        {note && <p className="mt-0.5 text-sm text-muted-foreground">{note}</p>}
      </div>
      <StatusText text={status || ''} />
    </div>
  )
}

export default function ProviderManagement({ messages: m }: { messages: ProviderMessages }) {
  const [providers, setProviders] = useState<string[]>(DEFAULT_PROVIDERS)
  const [catalog, setCatalog] = useState<CatalogModel[]>([])
  const [secrets, setSecrets] = useState<ProviderSecret[]>([])
  const [ragSettings, setRagSettings] = useState<RagSettings>({})
  const [routingStatus, setRoutingStatus] = useState('')
  const [catalogStatus, setCatalogStatus] = useState('')
  const [secretStatus, setSecretStatus] = useState('')
  const [testStatus, setTestStatus] = useState('')
  const [testResult, setTestResult] = useState(m.notTested || 'Not tested')
  const [syncingProviders, setSyncingProviders] = useState<Set<string>>(new Set())
  const [syncMessages, setSyncMessages] = useState<Record<string, { text: string; type: string }>>({})

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

  // Secret inputs
  const secretInputs = useRef<Record<string, string>>({})

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

  async function loadCatalog() {
    try {
      const res = await fetch('/api/admin/settings/models')
      if (!res.ok) return
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
    } catch { /* silent */ }
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
      setRouteProvider(s.rag_default_provider || 'groq')
      setRouteModel(s.rag_default_model || '')
      setRouteFallbackProvider(s.rag_fallback_provider || '')
      setRouteFallbackModel(s.rag_fallback_model || '')

      setRagCards([
        {
          title: 'Chat / Answer',
          rows: [
            ['Provider', s.rag_default_provider || 'groq'],
            ['Model', s.rag_default_model || 'llama-3.3-70b-versatile'],
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

  async function saveCatalog(models: CatalogModel[]) {
    setCatalogStatus(m.saving)
    const res = await fetch('/api/admin/settings/models', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ models }),
    })
    if (!res.ok) { setCatalogStatus(m.saveFailed); return }
    setCatalogStatus(m.saved)
    await loadCatalog()
    setTimeout(() => setCatalogStatus(''), 2400)
  }

  async function handleAddModel(e: React.FormEvent) {
    e.preventDefault()
    if (!addProvider || !addModel.trim()) { setCatalogStatus(m.modelRequired); return }
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
    await saveCatalog(updated)
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

  async function toggleModel(model: CatalogModel) {
    const updated = catalog.map(x =>
      x.provider === model.provider && x.model === model.model
        ? { ...x, enabled: !x.enabled }
        : x
    )
    await saveCatalog(updated)
  }

  async function deleteModel(model: CatalogModel) {
    const updated = catalog.filter(x => x !== model)
    await saveCatalog(updated)
  }

  async function syncProvider(provider: string) {
    setSyncingProviders(prev => new Set(prev).add(provider))
    setSyncMessages(prev => ({ ...prev, [provider]: { text: m.syncing, type: 'info' } }))
    try {
      const res = await fetch(`/api/admin/settings/models/sync/${encodeURIComponent(provider)}`, { method: 'POST' })
      const data = (await res.json().catch(() => ({}))) as { error?: string; added?: number; existing?: number; total?: number }
      if (!res.ok) {
        setSyncMessages(prev => ({ ...prev, [provider]: { text: data.error || m.syncFailed, type: 'error' } }))
      } else {
        setSyncMessages(prev => ({
          ...prev,
          [provider]: {
            text: (m.syncDone || '').replace('{added}', String(data.added)).replace('{existing}', String(data.existing)).replace('{total}', String(data.total)),
            type: 'success',
          },
        }))
        await loadCatalog()
      }
    } catch {
      setSyncMessages(prev => ({ ...prev, [provider]: { text: m.syncFailedRetry, type: 'error' } }))
    } finally {
      setSyncingProviders(prev => { const n = new Set(prev); n.delete(provider); return n })
      setTimeout(() => setSyncMessages(prev => { const n = { ...prev }; delete n[provider]; return n }), 5000)
    }
  }

  async function saveRouting() {
    setRoutingStatus(m.saving)
    const settings = {
      ...ragSettings,
      rag_pipeline_engine: routeEngine,
      rag_default_provider: routeProvider,
      rag_default_model: routeModel,
      rag_fallback_provider: routeFallbackProvider,
      rag_fallback_model: routeFallbackModel,
    }
    const res = await fetch('/api/admin/site/rag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    })
    if (!res.ok) { setRoutingStatus(m.saveFailed); return }
    setRoutingStatus(m.saved)
    await loadRag()
    setTimeout(() => setRoutingStatus(''), 2400)
  }

  async function runTest() {
    setTestStatus(m.testing)
    setTestResult(m.waitingModel)
    const res = await fetch('/api/admin/settings/models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: testProvider,
        model: testModel,
        prompt: testPrompt,
        title: testTitle,
        maxTokens: testMaxTokens,
      }),
    })
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      setTestStatus(m.testFailed)
      setTestResult(JSON.stringify(data, null, 2))
      return
    }
    setTestStatus((m.successMs || '').replace('{ms}', String(data.duration_ms)))
    if (testTitle.trim()) data.testTitle = testTitle.trim()
    setTestResult(JSON.stringify(data, null, 2))
  }

  async function saveSecret(key: string) {
    const value = secretInputs.current[key]?.trim()
    if (!value) { setSecretStatus(m.secretRequired); return }
    setSecretStatus(m.saving)
    const res = await fetch('/api/admin/settings/models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save-provider-key', key, value }),
    })
    if (!res.ok) { setSecretStatus(m.saveFailed); return }
    await loadCatalog()
    setSecretStatus(m.saved)
    setTimeout(() => setSecretStatus(''), 1800)
  }

  async function deleteSecret(key: string) {
    setSecretStatus(m.deleting)
    const res = await fetch('/api/admin/settings/models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete-provider-key', key }),
    })
    if (!res.ok) { setSecretStatus(m.deleteFailed); return }
    await loadCatalog()
    setSecretStatus(m.deleted)
    setTimeout(() => setSecretStatus(''), 1800)
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
        <SectionHeader title={m.routingTitle} note={m.routingNote} status={routingStatus} />
        <div className="grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-3">
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.engine}
            <select value={routeEngine} onChange={e => setRouteEngine(e.target.value)} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground">
              <option value="langgraph">langgraph</option>
              <option value="manual">manual</option>
              <option value="llamaindex">llamaindex</option>
            </select>
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.defaultProvider}
            <select value={routeProvider} onChange={e => { setRouteProvider(e.target.value); setRouteModel('') }} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground">
              {providers.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.defaultModel}
            <select value={routeModel} onChange={e => setRouteModel(e.target.value)} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground">
              {modelsForProvider(routeProvider).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.fallbackProvider}
            <select value={routeFallbackProvider} onChange={e => { setRouteFallbackProvider(e.target.value); setRouteFallbackModel('') }} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground">
              <option value="">none</option>
              {providers.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.fallbackModel}
            <select value={routeFallbackModel} onChange={e => setRouteFallbackModel(e.target.value)} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground">
              {modelsForProvider(routeFallbackProvider, true).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <div className="flex items-end">
            <Button onClick={saveRouting} size="sm">{m.saveRouting}</Button>
          </div>
        </div>
      </section>

      {/* ── Catalog ── */}
      <section>
        <SectionHeader title={m.catalogTitle} note={m.catalogNote} status={catalogStatus} />

        <div className="mb-3 flex gap-2">
          <Button variant="outline" size="xs" onClick={() => setOpenProviders(new Set(providers))}>{m.expandAll}</Button>
          <Button variant="outline" size="xs" onClick={() => setOpenProviders(new Set())}>{m.collapseAll}</Button>
        </div>

        <form onSubmit={handleAddModel} className="mb-4 grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-3 lg:grid-cols-6">
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.provider}
            <select value={addProvider} onChange={e => setAddProvider(e.target.value)} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground">
              {providers.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {m.modelName}
            <input value={addModel} onChange={e => setAddModel(e.target.value)} placeholder="llama-3.3-70b-versatile" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
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
            <Button type="submit" size="sm">{m.addUpdate}</Button>
          </div>
        </form>

        <div className="space-y-2">
          {providers.map(provider => {
            const models = grouped[provider] || []
            const activeCount = models.filter(x => x.enabled).length
            const isOpen = openProviders.has(provider)
            const sync = syncMessages[provider]

            return (
              <Collapsible key={provider} open={isOpen} onOpenChange={(open) => setOpenProviders(prev => { const n = new Set(prev); if (open) { n.add(provider) } else { n.delete(provider) } return n })}>
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn('size-4 text-muted-foreground transition-transform', isOpen && 'rotate-90')} />
                        <strong className="text-sm">{provider}</strong>
                        <span className="text-xs text-muted-foreground">
                          {(m.modelsEnabled || '').replace('{active}', String(activeCount)).replace('{total}', String(models.length))}
                        </span>
                      </div>
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        {sync && (
                          <span className={cn('text-xs', sync.type === 'error' ? 'text-destructive' : sync.type === 'success' ? 'text-[var(--admin-success)]' : 'text-muted-foreground')}>
                            {sync.text}
                          </span>
                        )}
                        <Button
                          variant="outline" size="xs"
                          disabled={syncingProviders.has(provider)}
                          onClick={() => syncProvider(provider)}
                        >
                          {syncingProviders.has(provider) ? <Loader2 className="size-3 animate-spin" /> : <RefreshCw className="size-3" />}
                          {m.syncModels}
                        </Button>
                      </div>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-border">
                      {models.length ? models.map(model => (
                        <div key={`${model.provider}:${model.model}`} className="flex items-center gap-3 border-t border-border px-4 py-2 first:border-t-0">
                          <button type="button" className="min-w-0 flex-1 text-left" onClick={() => editModel(model)}>
                            <span className="block truncate text-sm font-medium">{model.displayName || model.model}</span>
                            <span className="block truncate text-xs font-mono text-muted-foreground">{model.model}</span>
                            {model.notes && <span className="block truncate text-xs text-muted-foreground">{model.notes}</span>}
                          </button>
                          <Badge variant={model.enabled ? 'default' : 'secondary'} className="cursor-pointer shrink-0" onClick={() => toggleModel(model)}>
                            {model.enabled ? m.active : m.inactive}
                          </Badge>
                          <Button variant="ghost" size="icon-xs" onClick={() => deleteModel(model)} className="shrink-0 text-destructive hover:text-destructive">
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      )) : (
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
        <SectionHeader title={m.testTitle} note={m.testNote} status={testStatus} />
        <div className="grid gap-3 rounded-lg border border-border bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-xs text-muted-foreground">
              {m.provider}
              <select value={testProvider} onChange={e => { setTestProvider(e.target.value); setTestModel('') }} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground">
                {providers.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-xs text-muted-foreground">
              {m.modelName}
              <select value={testModel} onChange={e => setTestModel(e.target.value)} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground">
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
          <Button onClick={runTest} size="sm" className="w-fit">{m.runTest}</Button>
          <pre className="min-h-[130px] overflow-auto rounded-lg bg-[#0f172a] p-3 text-xs text-[#e2e8f0]">{testResult}</pre>
        </div>
      </section>

      {/* ── Secrets ── */}
      <section>
        <SectionHeader title={m.secretsTitle} note={m.secretsNote} status={secretStatus} />
        <div className="grid gap-2 sm:grid-cols-2">
          {PROVIDER_SECRET_FIELDS.map(key => {
            const item = secretsByKey.get(key) || { envKey: key, source: 'missing', configured: false, hasDb: false }
            const sl = statusLabel(item)
            return (
              <div key={key} className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-mono">{key}</span>
                </div>
                <Badge variant={sl === 'missing' ? 'destructive' : 'secondary'} className="shrink-0 text-[0.65rem]">{sl}</Badge>
                <input
                  type="text"
                  placeholder={item.configured ? m.secretConfiguredPlaceholder : m.secretEmptyPlaceholder}
                  onChange={e => { secretInputs.current[key] = e.target.value }}
                  className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                />
                <div className="flex gap-1">
                  <Button variant="outline" size="xs" onClick={() => saveSecret(key)}>{m.saveSecret}</Button>
                  <Button variant="outline" size="xs" disabled={!item.hasDb} onClick={() => deleteSecret(key)} className="text-destructive">{m.deleteAdmin}</Button>
                </div>
              </div>
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
              <div key={s.name} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2">
                <span className="text-sm font-mono">{s.name}</span>
                <Badge variant={s.status === 'missing' ? 'destructive' : 'default'}>{s.status}</Badge>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
