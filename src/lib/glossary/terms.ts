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
  {
    term: 'LLM',
    aliases: ['Large Language Model', '大型語言模型'],
    definition: '能理解與生成文字的 AI 模型，常用來回答問題、摘要、改寫與產生內容。',
    advanced: 'LLM 的輸出品質會受到 prompt、context window、訓練資料、推理設定與外部工具結果影響；在產品中通常要搭配檢索、評估與觀測。',
    context: '本站常討論 LLM 在內容系統、RAG、agent workflow 與產品設計中的用法。',
    links: [{ label: '站內搜尋 LLM', url: '/search?q=LLM&mode=rag' }],
  },
  {
    term: 'AI Agent',
    aliases: ['agent', 'agents', 'AI agents'],
    definition: '能根據目標自主拆解步驟、使用工具並持續推進任務的 AI 系統。',
    advanced: 'Agent 通常包含 planner、tool use、memory、reflection 或 evaluator；實務重點是邊界、觀測、權限與失敗時的人工接管。',
    context: '本站用它討論內容生產、研究流程、RAG 管線與多代理協作。',
    links: [{ label: '站內搜尋 AI Agent', url: '/search?q=AI%20Agent&mode=rag' }],
  },
  {
    term: 'token',
    aliases: ['tokens'],
    definition: '模型讀寫文字時使用的基本單位，可以是一個字、一段字或標點。',
    advanced: 'Token 數會影響成本、延遲與可放入 context window 的資訊量；不同模型與 tokenizer 對同一段文字的切分可能不同。',
    context: '討論 LLM 成本、上下文長度、RAG chunk 與 prompt 設計時常會用到。',
    links: [{ label: '站內搜尋 token', url: '/search?q=token&mode=rag' }],
  },
  {
    term: 'context window',
    aliases: ['上下文視窗'],
    definition: '模型一次能讀進去的文字容量上限。',
    advanced: 'Context window 越大不代表品質一定越好；長上下文仍需要選材、排序、摘要與去雜訊，否則模型可能忽略關鍵證據。',
    context: '常用來討論 RAG 要塞多少資料、agent 要保留多少歷史，以及長文處理策略。',
    links: [{ label: '站內搜尋 context window', url: '/search?q=context%20window&mode=rag' }],
  },
  {
    term: 'eval',
    aliases: ['evaluation', '評估'],
    definition: '用固定問題、資料與指標檢查系統改動是否真的變好。',
    advanced: 'RAG 與 agent eval 常看 retrieval recall、answer faithfulness、citation accuracy、latency 與成本；好的 eval 會先針對觀察到的失敗案例設計。',
    context: '本站強調 RAG 與 AI 功能要用 eval 驗證，而不是只靠主觀試用。',
    links: [{ label: '站內搜尋 eval', url: '/search?q=eval&mode=rag' }],
  },
  {
    term: 'pipeline',
    aliases: ['workflow'],
    definition: '把一連串處理步驟串起來，讓資料或任務可以穩定地從輸入走到輸出。',
    advanced: 'AI pipeline 常包含資料清理、檢索、模型呼叫、後處理、評估與觀測；每個節點都應該能被單獨測試與替換。',
    context: '本站常用 pipeline 描述內容生產、搜尋索引、RAG 與 agent 編排。',
    links: [{ label: '站內搜尋 pipeline', url: '/search?q=pipeline&mode=rag' }],
  },
  {
    term: 'metadata',
    aliases: ['frontmatter'],
    definition: '描述內容的結構化資料，例如標題、日期、標籤、分類或語言。',
    advanced: 'Metadata 能支援篩選、排序、SEO、推薦與 RAG 檢索；品質不穩會讓搜尋、索引與內容營運流程變脆弱。',
    context: '本站文章用 frontmatter 管理 metadata，並把它同步到搜尋與內容工具。',
    links: [{ label: '站內搜尋 metadata', url: '/search?q=metadata&mode=rag' }],
  },
  {
    term: 'Pagefind',
    definition: '一個靜態網站全文搜尋工具，會在 build 後建立前端可查詢的搜尋索引。',
    advanced: 'Pagefind 適合內容站的低維運搜尋；和 RAG 相比，它更穩定、便宜，也更適合精確關鍵字查詢。',
    context: '本站用 Pagefind 提供傳統全文搜尋，和 RAG 搜尋互補。',
    links: [{ label: '站內搜尋 Pagefind', url: '/search?q=Pagefind&mode=rag' }],
  },
  {
    term: 'AEO',
    aliases: ['Answer Engine Optimization'],
    definition: '讓內容更容易被 AI 搜尋或答案引擎理解、引用與回答的內容優化方法。',
    advanced: 'AEO 會重視清楚問題、直接答案、結構化段落、可信來源與可引用語句；它和 SEO 重疊，但更偏向答案抽取。',
    context: '本站的行銷文章會用 AEO 討論 AI 搜尋時代的內容策略。',
    links: [{ label: '站內搜尋 AEO', url: '/search?q=AEO&mode=rag' }],
  },
  {
    term: 'GEO',
    aliases: ['Generative Engine Optimization'],
    definition: '針對生成式搜尋與 AI 回答系統設計內容，讓品牌或觀點更容易被生成答案採用。',
    advanced: 'GEO 通常關注實體一致性、權威訊號、引用友善內容、跨平台提及與答案覆蓋率追蹤。',
    context: '本站用 GEO 討論 AI 搜尋環境下的內容與品牌能見度。',
    links: [{ label: '站內搜尋 GEO', url: '/search?q=GEO&mode=rag' }],
  },
  {
    term: 'Docker',
    aliases: ['docker compose', 'Compose'],
    definition: '把應用程式和它需要的環境包成容器，讓本機、伺服器和 CI 更容易跑出一致結果。',
    advanced: 'Docker 的關鍵取捨在 image 建置、volume、network、DNS、權限與安全掃描；Compose 則常用來管理多容器開發或小型部署。',
    context: '本站的技術文章常用 Docker 說明部署、nginx、502 與容器網路問題。',
    links: [{ label: '站內搜尋 Docker', url: '/search?q=Docker&mode=rag' }],
  },
  {
    term: 'nginx',
    aliases: ['reverse proxy'],
    definition: '常見的網頁伺服器與反向代理，可以把外部請求轉發到不同後端服務。',
    advanced: 'nginx 常見設定包含 upstream、server block、location、proxy headers、TLS、reload 與 syntax check；反向代理問題常出在 DNS、port、container network 或 header。',
    context: '本站多篇 debug 文章用 nginx 分析 502、conf.d 拆分與多服務代理。',
    links: [{ label: '站內搜尋 nginx', url: '/search?q=nginx&mode=rag' }],
  },
  {
    term: 'DNS',
    aliases: ['domain name system'],
    definition: '把網域名稱轉成機器能連線的位址或服務名稱。',
    advanced: '在 Docker 與 nginx 場景中，DNS 可能指向容器名稱、network alias 或外部網域；解析範圍和網路邊界錯了就會造成 502 或連線失敗。',
    context: '本站用 DNS 說明跨 Compose 專案、Cloudflare origin 與 reverse proxy 的排錯。',
    links: [{ label: '站內搜尋 DNS', url: '/search?q=DNS&mode=rag' }],
  },
  {
    term: 'Git',
    aliases: ['Git Conditional Includes', 'conditional includes'],
    definition: '分散式版本控制工具，用來追蹤程式碼變更與協作。',
    advanced: 'Git Conditional Includes 可以依照 repository 路徑載入不同設定，適合分開管理個人與工作帳號、簽章或 SSH identity。',
    context: '本站用 Git 討論多帳號設定、工作流程與專案管理。',
    links: [{ label: '站內搜尋 Git', url: '/search?q=Git&mode=rag' }],
  },
  {
    term: 'MCP',
    aliases: ['Model Context Protocol', 'MCP Server'],
    definition: '一種讓 AI 工具連接外部資料、工具與服務的協定。',
    advanced: 'MCP 把 tool、resource、prompt 等能力用標準介面暴露給 client；安全上要注意權限、資料外流、工具副作用與審計。',
    context: '本站用 MCP 討論 Claude Code 與外部工具整合。',
    links: [{ label: '站內搜尋 MCP', url: '/search?q=MCP&mode=rag' }],
  },
  {
    term: 'React Hook Form',
    aliases: ['Zod', 'validation'],
    definition: 'React Hook Form 管理表單狀態，Zod 負責用 schema 驗證資料。',
    advanced: '兩者搭配時可以把 runtime validation 和 TypeScript 型別推導接起來，降低前後端表單規則漂移；但 schema 共用仍要注意資料邊界與錯誤訊息設計。',
    context: '本站用它說明表單處理、型別安全與 monorepo schema 共用。',
    links: [{ label: '站內搜尋 React Hook Form', url: '/search?q=React%20Hook%20Form&mode=rag' }],
  },
  {
    term: 'ClickHouse',
    aliases: ['OLAP', 'OLTP'],
    definition: 'ClickHouse 是偏分析查詢的欄導向資料庫，適合大量事件、日誌與指標聚合。',
    advanced: 'ClickHouse 用欄導向儲存、壓縮、向量化執行與 MergeTree engine 提升聚合查詢效率；常和 PostgreSQL 這類 OLTP 資料庫分工。',
    context: '本站用 ClickHouse 說明產品分析、事件資料與 AI 推薦特徵工程。',
    links: [{ label: '站內搜尋 ClickHouse', url: '/search?q=ClickHouse&mode=rag' }],
  },
  {
    term: 'Prisma',
    aliases: ['Prisma ORM', 'ORM'],
    definition: 'Prisma 是 TypeScript 專案常用的 ORM，能用 schema 產生型別安全的資料庫 client。',
    advanced: 'Prisma 把 schema、migration 與 query client 串在一起，降低手寫 SQL 與型別維護成本；代價是需要理解抽象層與複雜查詢限制。',
    context: '本站用 Prisma 討論 TypeScript 後端、資料庫 migration 與 schema-first 開發。',
    links: [{ label: '站內搜尋 Prisma', url: '/search?q=Prisma&mode=rag' }],
  },
  {
    term: 'TanStack Query',
    aliases: ['React Query', 'server state'],
    definition: 'React 生態中管理 server state 的工具，負責資料 fetch、快取、重新驗證與 loading/error 狀態。',
    advanced: 'TanStack Query 把 query key、cache invalidation、mutation、background refetch 與 request dedupe 包成一致模型，適合取代手寫 useEffect fetching。',
    context: '本站用 TanStack Query 說明前端資料取得、快取與 UI state 的分工。',
    links: [{ label: '站內搜尋 TanStack Query', url: '/search?q=TanStack%20Query&mode=rag' }],
  },
  {
    term: 'Slack',
    aliases: ['Slack integration'],
    definition: '團隊溝通工具，也常被拿來接收系統通知或觸發工作流程。',
    advanced: 'Slack integration 通常包含 app、bot token、webhook、OAuth scope 與事件訂閱；導入 AI 工具時要特別注意權限與訊息可見範圍。',
    context: '本站用 Slack 討論 Claude Code 遠端控制、通知與團隊工作流整合。',
    links: [{ label: '站內搜尋 Slack', url: '/search?q=Slack&mode=rag' }],
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
