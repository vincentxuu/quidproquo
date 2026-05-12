export interface GlossaryLink {
  label: string
  url: string
}

export interface GlossaryEntry {
  term: string
  aliases?: string[]
  definition?: string
  advanced?: string
  context?: string
  links?: GlossaryLink[]
}

export const DEFAULT_GLOSSARY_TERMS: GlossaryEntry[] = [
  {
    term: 'RAG',
    aliases: ['Retrieval-Augmented Generation'],
    definition: '先從知識庫找相關資料，再把資料交給模型回答，降低模型只靠記憶亂猜的機率。',
    advanced: 'RAG 通常包含 chunking、embedding、retrieval、reranking、generation 與 citation/grounding 檢查；品質瓶頸多半在檢索與上下文選擇。',
    context: '常出現在 AI 搜尋、知識庫問答、客服與文件助理。',
    links: [{ label: '站內搜尋 RAG 文章', url: '/search?q=RAG&mode=rag' }],
  },
  {
    term: 'embedding',
    aliases: ['embeddings', '向量嵌入'],
    definition: '把文字轉成一串數字向量，讓系統可以用距離判斷兩段文字語意上像不像。',
    advanced: 'Embedding 模型會把 token 序列投影到高維空間；實務上要同時注意模型語言能力、chunk 粒度、metadata filter 與索引更新。',
    context: '常用在語意搜尋、推薦、去重與 RAG 檢索。',
    links: [{ label: '站內搜尋 embedding', url: '/search?q=embedding&mode=rag' }],
  },
  {
    term: 'Vectorize',
    aliases: ['Cloudflare Vectorize'],
    definition: 'Cloudflare 的向量資料庫服務，用來存 embedding 並做相似度搜尋。',
    advanced: 'Vectorize 負責 ANN 類型的近似向量查詢；在 RAG 中通常還會搭配 D1/FTS 做 hybrid search 與 metadata 補全。',
    context: '這個站的 RAG 檢索使用 Vectorize 存文章與文件 chunk 的向量。',
    links: [{ label: '站內搜尋 Vectorize', url: '/search?q=Vectorize&mode=rag' }],
  },
  {
    term: 'Cloudflare D1',
    aliases: ['D1'],
    definition: 'Cloudflare Workers 上的 serverless SQLite 資料庫。',
    advanced: 'D1 適合邊緣應用的小型關聯式資料；要注意 migration、batch 寫入、索引與 Workers 執行時間限制。',
    context: '本站用 D1 存文章索引、聊天紀錄、RAG 設定與觀測資料。',
    links: [{ label: '站內搜尋 D1', url: '/search?q=Cloudflare%20D1&mode=rag' }],
  },
  {
    term: 'FTS5',
    definition: 'SQLite 的全文搜尋功能，可以用關鍵字與 BM25 分數找文字內容。',
    advanced: 'FTS5 適合 lexical retrieval；與 embedding retrieval 融合時，可以補足專有名詞、錯誤碼、精確字串等語意模型容易漏掉的查詢。',
    context: 'Hybrid search 常把 FTS5 結果和向量搜尋結果一起排序。',
    links: [{ label: 'Hybrid Search：BM25 + 向量搜尋', url: '/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf' }],
  },
  {
    term: 'BM25',
    definition: '一種關鍵字搜尋排序演算法，會看詞出現頻率、稀有程度和文件長度。',
    advanced: 'BM25 是 lexical retrieval 的常見 baseline；它不理解語意，但對錯誤碼、API 名稱、命令字串很可靠。',
    context: '在 RAG 系統裡常和向量搜尋互補。',
    links: [{ label: 'Hybrid Search：BM25 + 向量搜尋', url: '/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf' }],
  },
  {
    term: 'reranker',
    aliases: ['Reranker'],
    definition: '第二階段排序器，會重新檢查候選結果，把更相關的內容排前面。',
    advanced: 'Reranker 常用 cross-encoder 或 LLM 對 query-document pair 打分；品質通常更好，但延遲與成本也更高。',
    context: 'RAG 在初步召回很多 chunk 後，會用 reranker 過濾雜訊。',
    links: [{ label: '站內搜尋 reranker', url: '/search?q=reranker&mode=rag' }],
  },
  {
    term: 'MMR',
    aliases: ['Maximal Marginal Relevance'],
    definition: '一種排序方法，會同時考慮相關性和多樣性，避免結果全部長得太像。',
    advanced: 'MMR 會用 lambda 權衡 query relevance 與候選文件之間的相似度；適合多角度問題或容易重複召回的知識庫。',
    context: 'RAG 常用 MMR 讓 Writer 看到更多不同證據。',
    links: [{ label: '站內搜尋 MMR', url: '/search?q=MMR&mode=rag' }],
  },
  {
    term: 'HyDE',
    definition: '先讓模型假想一段可能答案，再用這段答案去搜尋資料。',
    advanced: 'HyDE 可以改善抽象查詢的召回，但也可能把檢索方向帶偏，所以最好用 feature flag 與 eval 控制。',
    context: '常用在使用者問題很短、關鍵字不足或概念性查詢時。',
    links: [{ label: '站內搜尋 HyDE', url: '/search?q=HyDE&mode=rag' }],
  },
  {
    term: 'LangGraph',
    definition: 'LangChain 生態系裡用來編排多步驟 agent / workflow 的框架。',
    advanced: 'LangGraph 把流程表示成 state graph，適合有 planner、research、writer、critic 等節點且需要可觀測狀態轉移的應用。',
    context: '本站聊天系統的 RAG pipeline 支援 LangGraph 與手寫 pipeline 切換。',
    links: [{ label: '站內搜尋 LangGraph', url: '/search?q=LangGraph&mode=rag' }],
  },
  {
    term: 'Astro',
    definition: '一個偏內容網站與多框架整合的前端框架，可以產生靜態頁，也能部署成 server app。',
    advanced: 'Astro 的 islands architecture 讓大部分頁面輸出靜態 HTML，只在需要互動的元件 hydrate JavaScript。',
    context: 'quidproquo.cc 是用 Astro 建的部落格。',
    links: [{ label: '站內搜尋 Astro', url: '/search?q=Astro&mode=rag' }],
  },
  {
    term: 'Cloudflare Workers',
    aliases: ['Workers'],
    definition: 'Cloudflare 的 serverless runtime，可以在邊緣節點執行 JavaScript/TypeScript。',
    advanced: 'Workers 適合低延遲 API、SSR、排程任務與邊緣整合，但要注意 CPU time、binding、streaming 與平台限制。',
    context: '本站的 Astro server output 部署到 Cloudflare Workers。',
    links: [{ label: '站內搜尋 Workers', url: '/search?q=Cloudflare%20Workers&mode=rag' }],
  },
]

export function normalizeGlossaryTerms(entries: GlossaryEntry[]): GlossaryEntry[] {
  const seen = new Set<string>()
  return entries.filter((entry) => {
    const key = entry.term.trim().toLowerCase()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function findDefaultGlossaryEntry(term: string): GlossaryEntry | undefined {
  const normalized = term.trim().toLowerCase()
  return DEFAULT_GLOSSARY_TERMS.find((entry) => {
    if (entry.term.toLowerCase() === normalized) return true
    return entry.aliases?.some((alias) => alias.toLowerCase() === normalized)
  })
}
