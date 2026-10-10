import type { CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/utils';
import { isPublishedPost, type Post } from './content';
import { getPostSeries } from './seriesNav';

type SeriesPost = CollectionEntry<'posts'>;

interface SeriesDefinition {
  slug: string;
  /** 同一個系列在各語言的名稱。文章 frontmatter 寫的是名稱，這裡把兩邊配成一對。 */
  names: Record<Lang, string>;
  descriptions: Record<Lang, string>;
  /** 指定時優先於 inferSeriesCategory 的猜測；登錄的系列都應該寫。 */
  category?: SeriesCategoryId;
}

export interface SeriesSummary {
  name: string;
  slug: string;
  description: string;
  category: SeriesCategoryId;
  /** 只有課程導讀有；系列目錄用它在課程分類下再依學校篩選。 */
  school?: SeriesSchoolId;
  posts: SeriesPost[];
  count: number;
  latestDate: Date;
}

export type SeriesCategoryId =
  | 'courses'
  | 'exams-interviews'
  | 'ai-agents'
  | 'engineering'
  | 'updates'
  | 'other';

export interface SeriesCategoryDefinition {
  id: SeriesCategoryId;
  labels: Record<Lang, string>;
}

// 分類依「讀者帶著什麼目的來找」切，不依主題細分：分類一多，讀者得先猜對分類才找得到系列。
export const SERIES_CATEGORIES: SeriesCategoryDefinition[] = [
  { id: 'courses', labels: { 'zh-TW': '課程導讀', en: 'Course Guides' } },
  { id: 'exams-interviews', labels: { 'zh-TW': '考試與面試', en: 'Exams & Interviews' } },
  { id: 'ai-agents', labels: { 'zh-TW': 'AI 與 Agent', en: 'AI & Agents' } },
  { id: 'engineering', labels: { 'zh-TW': '工程實作', en: 'Engineering Practice' } },
  { id: 'updates', labels: { 'zh-TW': '趨勢與日報', en: 'Updates & Digests' } },
  { id: 'other', labels: { 'zh-TW': '其他主題', en: 'Other Topics' } },
];

export type SeriesSchoolId = 'stanford' | 'mit' | 'cmu' | 'berkeley' | 'harvard' | 'taiwan' | 'cross-school';

export interface SeriesSchoolDefinition {
  id: SeriesSchoolId;
  labels: Record<Lang, string>;
}

export const SERIES_SCHOOLS: SeriesSchoolDefinition[] = [
  { id: 'stanford', labels: { 'zh-TW': 'Stanford', en: 'Stanford' } },
  { id: 'mit', labels: { 'zh-TW': 'MIT', en: 'MIT' } },
  { id: 'cmu', labels: { 'zh-TW': 'CMU', en: 'CMU' } },
  { id: 'berkeley', labels: { 'zh-TW': 'Berkeley', en: 'Berkeley' } },
  { id: 'harvard', labels: { 'zh-TW': 'Harvard', en: 'Harvard' } },
  { id: 'taiwan', labels: { 'zh-TW': '台灣', en: 'Taiwan' } },
  { id: 'cross-school', labels: { 'zh-TW': '跨校', en: 'Cross-school' } },
];

// 課程系列的 slug 都以學校開頭，所以學校可以直接從 slug 讀出來；
// cs230、cs146s 是早期沒帶學校前綴的 Stanford 課，另外列出。
function inferCourseSchool(slug: string): SeriesSchoolId {
  if (/^(?:stanford-|cs230$|cs146s$)/.test(slug)) return 'stanford';
  if (slug.startsWith('mit-')) return 'mit';
  if (slug.startsWith('cmu-')) return 'cmu';
  if (slug.startsWith('berkeley-')) return 'berkeley';
  if (slug.startsWith('harvard-')) return 'harvard';
  if (/^(?:ntu|nthu|nccu)-/.test(slug)) return 'taiwan';
  return 'cross-school';
}

// 只當作沒登記在 SERIES_DEFINITIONS 裡的系列的安全網；已登記的系列一律用
// definition.category 明確指定。考試與面試排在日報前面：面試日練是天天出刊，
// 但讀者是為了準備面試來找它。
function inferSeriesCategory(slug: string, posts: SeriesPost[]): SeriesCategoryId {
  if (/(?:interview|cert-prep|exam)/.test(slug)) return 'exams-interviews';
  if (/(?:daily|digest|changelog|tracker|watch|security-alert|tool-of-the-day|funding|region-focus|weekly-review|arxiv|github)/.test(slug)) {
    return 'updates';
  }
  if (/^(?:stanford-|harvard-|reading-harvard|mit-|reading-mit|berkeley-|cmu-|reading-cmu|ntu-|nthu-|nccu-|cs\d)/.test(slug)) {
    return 'courses';
  }
  if (/(?:cloudflare|self-hosted|private-corpus|search|scraping|document-parsing|browser-automation|agent-cli|looplane|pi-mono|omp-|claude-code)/.test(slug)) {
    return 'engineering';
  }

  const categoryCounts = new Map<string, number>();
  for (const post of posts) {
    categoryCounts.set(post.data.category, (categoryCounts.get(post.data.category) ?? 0) + 1);
  }
  const dominantPostCategory = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0];

  if (dominantPostCategory === 'daily') return 'updates';
  if (dominantPostCategory === 'tech') return 'engineering';
  if (dominantPostCategory === 'ai') return 'ai-agents';
  return 'other';
}

// slug 是系列的身分：zh 與 en 版共用同一個 slug，只差 /en 前綴，中英切換才接得起來。
const SERIES_DEFINITIONS: SeriesDefinition[] = [
  {
    slug: 'statistics-ml-ai',
    category: 'exams-interviews',
    names: { 'zh-TW': '從考試到 ML/AI 的統計學導讀', en: 'Statistics from Exams to ML/AI' },
    descriptions: {
      'zh-TW': '從台大資管統計備考出發，補齊基礎統計、統計推論與應用建模，並在每一篇說明它如何接到 ML/AI 的訓練、評估、實驗與資料工作流。',
      en: 'A statistics learning path that starts from NTU IM exam preparation, builds through statistical inference and applied modeling, and connects each topic to ML/AI training, evaluation, experiments, and data workflows.',
    },
  },
  {
    slug: 'private-corpus-pipeline',
    category: 'engineering',
    names: { 'zh-TW': '私有語料管線', en: 'Private Corpus Pipeline' },
    descriptions: {
      'zh-TW': '私有資料如何安全且持續地進入索引、通過查詢權限被找到，並在來源更新或刪除後維持一致；重點是資料生命週期，不重複介紹 RAG 檢索技法。',
      en: 'How private data enters indexes safely and continuously, remains subject to query-time authorization, and stays consistent when sources change or disappear—focused on the data lifecycle rather than RAG retrieval techniques.',
    },
  },
  {
    slug: 'claude-code-automation',
    category: 'engineering',
    names: { 'zh-TW': 'Claude Code 自動化指南', en: 'Claude Code Automation Guide' },
    descriptions: {
      'zh-TW': '把 Claude Code 的 hooks、skills、remote agent、Routines 與團隊協作能力整理成可直接上手的實戰系列。',
      en: 'A practical series on Claude Code workflows, including hooks, skills, remote agents, routines, and team-scale automation.',
    },
  },
  {
    // 併吞自舊的 'rag-systems' 系列（只有 6 篇，和同期未收錄的三十幾篇技法文重疊）。
    // 舊 slug 在 astro.config 留 301。
    slug: 'rag-techniques',
    category: 'ai-agents',
    names: { 'zh-TW': 'RAG 技法大全', en: 'The RAG Techniques Compendium' },
    descriptions: {
      'zh-TW': '把 RAG 拆成可逐項比較的技法：切塊與索引、稀疏與稠密檢索、排序融合、agentic 與進階模式、生成端控制、真實查詢會踩的坑，以及評估、成本與可觀測性。每篇只談一個決定，讀完能拼成一條自己的 pipeline。',
      en: 'RAG taken apart into techniques you can compare one at a time: chunking and indexing, sparse and dense retrieval, ranking and fusion, agentic and advanced patterns, generation-side control, the failure modes real queries hit, and evaluation, cost and observability. One decision per post, assembled into a pipeline of your own.',
    },
  },
  {
    slug: 'ask-ai-practice',
    category: 'ai-agents',
    names: { 'zh-TW': 'Ask AI 實戰', en: 'Ask AI in Practice' },
    descriptions: {
      'zh-TW': '沿著 quidproquo Ask AI 的真實資料流，從索引、混合檢索、Writer 與來源門檻走到串流、快取、事故鑑識與可重跑評估；每篇只追一條責任與它能證明的邊界。',
      en: 'Follow the real quidproquo Ask AI data path from indexing, hybrid retrieval, writing, and source gates through streaming, caching, incident analysis, and reproducible evaluation. Each post traces one responsibility and the boundary of what its evidence can prove.',
    },
  },
  {
    slug: 'cloudflare-edge-stack',
    category: 'engineering',
    names: { 'zh-TW': 'Cloudflare 邊緣技術棧', en: 'The Cloudflare Edge Stack' },
    descriptions: {
      'zh-TW': '把在 Cloudflare 邊緣上蓋一套完整應用需要的元件逐個讀過：Workers 的執行模型，D1、KV、R2 三種儲存各自的適用邊界，Hono 與 OpenNext 這層框架取捨，再到 Workers AI binding 與實際部署時會踩的網域、原生模組問題。',
      en: 'Every piece needed to build a full application on Cloudflare’s edge, read one at a time: the Workers execution model, where D1, KV and R2 each stop being the right answer, the framework layer of Hono and OpenNext, then Workers AI bindings and the domain and native-module problems that show up at deploy time.',
    },
  },
  {
    slug: 'browser-automation-mcp',
    category: 'engineering',
    names: { 'zh-TW': '瀏覽器自動化與 MCP', en: 'Browser Automation and MCP' },
    descriptions: {
      'zh-TW': '讓 agent 開瀏覽器的幾條路線：Playwright、Puppeteer、Chrome DevTools 三個 MCP server 的取捨，視覺驅動的 Midscene，以及各家 CLI agent 內建瀏覽器能力的差別。重點在什麼情況下哪條路線會失敗。',
      en: 'The routes for putting a browser in an agent’s hands: the trade-offs between the Playwright, Puppeteer and Chrome DevTools MCP servers, vision-driven Midscene, and how the CLI agents differ in what they can drive natively. Focused on where each route breaks.',
    },
  },
  {
    slug: 'nobodyclimb',
    category: 'other',
    names: { 'zh-TW': 'NobodyClimb 專案紀實', en: 'Building NobodyClimb' },
    descriptions: {
      'zh-TW': '一個攀岩社群產品從產品定位、為什麼需要 AI、系統架構到 RAG pipeline 的完整紀實。技法層面的坑另外寫在 RAG 技法大全裡，這裡談的是決定怎麼做出來的。',
      en: 'A climbing-community product written up end to end: positioning, why it needed AI at all, the system architecture, and the RAG pipeline. The technique-level potholes live in the RAG compendium; this series is about how the decisions got made.',
    },
  },
  {
    slug: 'aeo-geo',
    category: 'ai-agents',
    names: { 'zh-TW': 'AEO / GEO 與 AI 搜尋', en: 'AEO, GEO, and AI Search' },
    descriptions: {
      'zh-TW': '當讀者換成 AI 之後，內容要怎麼寫才被引用：從傳統 SEO 的底子講到 answer engine optimization，內容結構與 structured data 的實際效果，再到追蹤工具能不能真的量到 AI 搜尋的能見度。',
      en: 'Writing for a reader that is now a model: from the SEO groundwork through answer engine optimization, what content structure and structured data actually buy, and whether the tracking tools can really measure visibility inside AI search.',
    },
  },
  {
    slug: 'document-parsing',
    category: 'engineering',
    names: { 'zh-TW': '文件解析實戰', en: 'Document Parsing in Practice' },
    descriptions: {
      'zh-TW': '把文件變成 LLM 可讀內容的三層階梯——轉換、抽取、解析。從選層邏輯到 MarkItDown、anydoc、MinerU 等各層工具的取捨比較。',
      en: 'The three-layer ladder for turning documents into LLM-readable content — conversion, extraction, and parsing. From picking the right layer to comparing MarkItDown, anydoc, MinerU, and the rest.',
    },
  },
  {
    // 文件解析實戰的上游：那個系列從「已經拿到檔案」開始，這個系列談怎麼先把東西弄到手。
    slug: 'search-and-scraping',
    category: 'engineering',
    names: { 'zh-TW': '搜尋與爬取實戰', en: 'Search and Scraping in Practice' },
    descriptions: {
      'zh-TW': '把資料從外面弄進來的整條路：搜尋要租雲端 API 還是自己架、爬取工具怎麼選、被反爬擋住怎麼辦，最後怎麼把這些接成一條研究流程。每篇談一個決定，讀完能拼出一套自己的取得管道。',
      en: 'The full path for getting data in from outside: renting a cloud search API versus self-hosting one, choosing among the scraping tools, what to do when anti-bot defenses block you, and how to wire it all into a research pipeline. One decision per post.',
    },
  },
  {
    slug: 'ai-agent-systems',
    category: 'ai-agents',
    names: { 'zh-TW': 'AI Agent 實戰', en: 'AI Agent Systems in Practice' },
    descriptions: {
      'zh-TW': '聚焦 AI Agent 的 context、harness、工作流與組織型協作，整理成一條可複用的工程實戰脈絡。',
      en: 'A practical series on AI agent systems, covering context, harness design, workflows, and multi-agent collaboration.',
    },
  },
  {
    slug: 'looplane',
    category: 'engineering',
    names: { 'zh-TW': 'Looplane 架構拆解', en: 'Looplane Architecture Notes' },
    descriptions: {
      'zh-TW': '沿著一次 coding-agent 任務的實際路徑拆解 Looplane：從 TUI、disposable workspace、prompt 與兩條 runtime lane，走到工具權限、state/event lifecycle、MCP、subagents、SDK/IDE，最後把同一套邊界延伸到 Cloudflare 遠端執行。每篇只追一條 data flow、failure boundary 與測試證據。',
      en: 'Follow one coding-agent task through Looplane: from the TUI, disposable workspace, prompt, and two runtime lanes through tool authority, the state/event lifecycle, MCP, subagents, SDK/IDE integrations, and finally Cloudflare remote execution. Each article traces one data flow, failure boundary, and test surface.',
    },
  },
  {
    slug: 'coding-agent',
    category: 'engineering',
    names: { 'zh-TW': '跟成熟 coding agent 學設計', en: 'Learning Coding-Agent Design from Mature Systems' },
    descriptions: {
      'zh-TW': '以 Looplane 為實作載體，逐題對照 pi、OMP、OpenCode、Codex CLI 與 Claude Code：從 loop、workspace、approval 與 verification，一路追到已落地 baseline 的 memory、compaction、MCP、sandbox、subagents、replay、LSP、cost tracking 與 Agent as a Service，並保留 production validation 與跨 runtime parity 的真實缺口。',
      en: 'A Looplane-driven comparison of pi, OMP, OpenCode, Codex CLI, and Claude Code, from loops, workspaces, approvals, and verification through shipped baselines for memory, compaction, MCP, sandboxing, subagents, replay, LSP, cost tracking, and Agent as a Service, with production validation and runtime-parity gaps kept explicit.',
    },
  },
  {
    slug: 'ai',
    category: 'ai-agents',
    names: { 'zh-TW': 'AI 模型家族', en: 'AI Model Families' },
    descriptions: {
      'zh-TW': '從演化脈絡、架構、授權陷阱到版本選型，逐一拆開 Qwen、DeepSeek、Claude、GPT、Gemini、Llama、Mistral、GLM、Kimi 等主流模型家族，並附 Agent 開發者的選型建議。',
      en: 'Tracing the evolution, architecture, licensing traps, and version selection of mainstream model families — Qwen, DeepSeek, Claude, GPT, Gemini, Llama, Mistral, GLM, Kimi — with pick guidance for agent developers.',
    },
  },
  {
    slug: 'ai-era-tech-choices',
    category: 'ai-agents',
    names: { 'zh-TW': 'AI 時代的技術選擇', en: 'Technology Choices in the AI Era' },
    descriptions: {
      'zh-TW': '以採用度為主判準，輔以 AI 時代新增的五條判準（文件機器可讀性、型別、原始碼在不在 repo、資料骨架、機器可呼叫性），整理從前端到後端、從雲端到自架的技術選型。',
      en: 'Adoption remains the primary criterion, augmented by five AI-era criteria — machine-readable docs, types, source-in-repo, data skeleton, and machine-callability — from frontend to backend, cloud to self-hosted.',
    },
  },
  {
    slug: 'ai-top-conferences',
    category: 'ai-agents',
    names: { 'zh-TW': 'AI 頂會導讀', en: 'Reading AI Top Conferences' },
    descriptions: {
      'zh-TW': '拆解「AI 頂會」怎麼被認定、投稿與審稿如何運作，以及各領域頂會的定位與爭議。',
      en: 'How AI top conferences are recognized, how submissions and review work, and how the flagship venues differ.',
    },
  },
  {
    slug: 'ai-daily',
    category: 'updates',
    names: { 'zh-TW': 'AI 日報', en: 'AI Daily' },
    descriptions: {
      'zh-TW': '每日 AI 動態速覽。',
      en: 'A daily digest of AI developments.',
    },
  },
  {
    // slug 沿用先前 fallback 產生的 'agent'，改名會動到已發佈的 URL
    slug: 'agent',
    category: 'ai-agents',
    names: { 'zh-TW': 'Agent 生產線', en: 'The Agent Production Line' },
    descriptions: {
      'zh-TW': '把 agent 當成一條生產線來看：概念界線、模型與 harness 的分工、context 與記憶、企業案例、安全、協定層，以及 RAG 的三種形態。',
      en: 'Reading agents as a production line: where the concept ends, how model and harness divide the work, context and memory, enterprise cases, security, the protocol layer, and the three shapes of RAG.',
    },
  },
  {
    slug: 'drone-industry',
    category: 'other',
    names: { 'zh-TW': '無人機產業拆解', en: "Taiwan's Drone Industry, Taken Apart" },
    descriptions: {
      'zh-TW': '把無人機產業拆成可查證的層：從產業地圖與供應鏈缺口，到續航物理、飛控與遙控鏈路原始碼，再到台灣的法規授權、採購紀錄與反制困境。每一篇都從一手材料算起或讀起。',
      en: 'Taking the drone industry apart into verifiable layers — from the industry map and the supply-chain gap, through endurance physics and flight-controller and radio-link source code, to Taiwan’s regulatory authority, procurement records and counter-drone deadlock. Every post starts from primary material.',
    },
  },
  {
    slug: 'cs230',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS230 導讀', en: 'Reading Stanford CS230' },
    descriptions: {
      'zh-TW':
        '把 Stanford CS230（2025 秋季）九講逐講讀完：不只記錄課堂講了什麼，也補上課後到現在這領域變了什麼，以及它和站上既有實戰系列的對照。',
      en: 'A lecture-by-lecture reading of Stanford CS230, Autumn 2025 — what was taught, what has changed since, and where it agrees or disagrees with the practice written up elsewhere on this site.',
    },
  },
  {
    slug: 'global-ai-cs-course-map',
    category: 'courses',
    names: { 'zh-TW': '世界名校 AI／CS 課程地圖', en: 'Global AI/CS Course Map' },
    descriptions: {
      'zh-TW':
        '以 2025–2026 官方課程網站、課表與教材入口為依據，整理 Stanford、CMU、MIT、UC Berkeley 的 AI／CS 課程地圖，說明哪些能完整自學、哪些只有講義或歷史影片。',
      en: 'A 2025–2026 guide to AI and CS course access at Stanford, CMU, MIT, and UC Berkeley, distinguishing complete self-study courses from public syllabi, partial materials, and historical videos.',
    },
  },
  {
    slug: 'stanford-cs',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS 主線課程導讀', en: "Reading Stanford's Main-Line CS Courses" },
    descriptions: {
      'zh-TW': '從學位骨架到 AI、NLP、圖學習與 agent，整理 Stanford CS 主線課程的版本、先修關係與逐課導讀入口。',
      en: 'A map of Stanford CS core courses, from the degree foundations through AI, NLP, graph learning, and agents, with versioned course guides and prerequisites.',
    },
  },
  {
    slug: 'stanford-cs103',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS103 導讀', en: 'Reading Stanford CS103' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS103：離散數學、邏輯、證明、集合、可計算性，以及它們如何成為後續 CS 課程的共同語言。',
      en: 'A lecture-by-lecture reading of Stanford CS103: discrete mathematics, logic, proofs, sets, computability, and the shared language they provide for later CS courses.',
    },
  },
  {
    slug: 'stanford-cs107',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS107 導讀', en: 'Reading Stanford CS107' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS107：C、記憶體、組合語言、資料表示與系統除錯，從高階語言一路往機器底層走。',
      en: 'A lecture-by-lecture reading of Stanford CS107: C, memory, assembly, data representation, and systems debugging from high-level code down to the machine.',
    },
  },
  {
    slug: 'stanford-cs109',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS109 導讀', en: 'Reading Stanford CS109' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS109：機率、隨機變數、推論與模擬，補齊機器學習與資料科學真正會用到的機率底座。',
      en: 'A lecture-by-lecture reading of Stanford CS109: probability, random variables, inference, and simulation as the foundation used by machine learning and data science.',
    },
  },
  {
    slug: 'stanford-cs111',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS111 導讀', en: 'Reading Stanford CS111' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS111：程序、執行緒、同步、虛擬記憶體、檔案系統與作業系統設計取捨。',
      en: 'A lecture-by-lecture reading of Stanford CS111: processes, threads, synchronization, virtual memory, file systems, and operating-system design trade-offs.',
    },
  },
  {
    slug: 'stanford-cs161',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS161 導讀', en: 'Reading Stanford CS161' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS161 Winter 2026：演算法設計、正確性證明與複雜度分析，完整對齊十八講公開教材。',
      en: 'A lecture-by-lecture reading of Stanford CS161, Winter 2026: algorithm design, correctness proofs, and complexity analysis across all eighteen public lecture units.',
    },
  },
  {
    slug: 'stanford-cs221',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS221 導讀', en: 'Reading Stanford CS221' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS221：搜尋、馬可夫決策、機器學習、約束滿足與機率模型，建立人工智慧的共同骨架。',
      en: 'A lecture-by-lecture reading of Stanford CS221: search, Markov decision processes, machine learning, constraint satisfaction, and probabilistic models.',
    },
  },
  {
    slug: 'stanford-cs229',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS229 導讀', en: 'Reading Stanford CS229' },
    descriptions: {
      'zh-TW': '逐章讀 Stanford CS229 的 2026 官方主講義：從監督式學習與深度學習，走到基礎模型、LLM 推理與強化學習，共二十一章，不假裝對應單一學期的逐講進度。',
      en: 'A chapter-by-chapter reading of Stanford CS229’s official 2026 notes, spanning supervised and deep learning, foundation models, LLM reasoning, and reinforcement learning across twenty-one chapters without pretending to reconstruct a single quarter’s lecture schedule.',
    },
  },
  {
    slug: 'stanford-cs336',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS336 導讀', en: 'Reading Stanford CS336' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS336：從 tokenizer、資料與 scaling，到訓練、平行化、評估與 alignment，拆開語言模型的完整製作流程。',
      en: 'A lecture-by-lecture reading of Stanford CS336: tokenizers, data, scaling, training, parallelism, evaluation, and alignment across the full language-model pipeline.',
    },
  },
  {
    slug: 'stanford-cs124',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS124 導讀', en: 'Reading Stanford CS124' },
    descriptions: {
      'zh-TW': '逐週讀 Stanford CS124：從語言模型與文字分類，到資訊抽取、問答與語音，追蹤自然語言處理的完整管線。',
      en: 'A week-by-week reading of Stanford CS124: language models, text classification, information extraction, question answering, speech, and the full NLP pipeline.',
    },
  },
  {
    slug: 'stanford-cs228',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS228 導讀', en: 'Reading Stanford CS228' },
    descriptions: {
      'zh-TW': '逐週讀一個明確版本的 Stanford CS228：機率圖模型、精確與近似推論、參數學習及結構學習。',
      en: 'A week-by-week reading of one explicitly versioned Stanford CS228 offering: probabilistic graphical models, exact and approximate inference, and parameter and structure learning.',
    },
  },
  {
    slug: 'stanford-cs224n',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS224N 導讀', en: 'Reading Stanford CS224N' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS224N：從詞向量、序列模型與 Transformer，到大型語言模型、評估與責任議題。',
      en: 'A lecture-by-lecture reading of Stanford CS224N: word vectors, sequence models, Transformers, large language models, evaluation, and responsible NLP.',
    },
  },
  {
    slug: 'stanford-cs224u',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS224U 導讀', en: 'Reading Stanford CS224U' },
    descriptions: {
      'zh-TW': '逐單元讀 Stanford CS224U：語意表示、自然語言推論、問答與互動式語言系統，明確標示所採歷史學期。',
      en: 'A unit-by-unit reading of a versioned Stanford CS224U offering: semantic representations, natural-language inference, question answering, and interactive language systems.',
    },
  },
  {
    slug: 'stanford-cs224v',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS224V 導讀', en: 'Reading Stanford CS224V' },
    descriptions: {
      'zh-TW': '逐單元讀 Stanford CS224V 的明確學期版本：對話式虛擬助理的理解、對話管理、生成、評估與部署。',
      en: 'A unit-by-unit reading of one explicitly versioned Stanford CS224V offering: understanding, dialogue management, generation, evaluation, and deployment for conversational assistants.',
    },
  },
  {
    slug: 'stanford-cs224w',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS224W 導讀', en: 'Reading Stanford CS224W' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS224W：圖的表示、網路科學、圖神經網路、知識圖譜與可擴展圖學習。',
      en: 'A lecture-by-lecture reading of Stanford CS224W: graph representation, network science, graph neural networks, knowledge graphs, and scalable graph learning.',
    },
  },
  {
    slug: 'stanford-cs329z',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS329Z 導讀', en: 'Reading Stanford CS329Z' },
    descriptions: {
      'zh-TW': '追蹤 Stanford CS329Z Fall 2026：前五堂官方投影片與 HW1 起始碼、資料及公開測試已釋出；各週指定閱讀另附導讀。',
      en: 'Following Stanford CS329Z Fall 2026: the first five official slide decks and the HW1 starter, datasets, and public tests are available, alongside weekly reading guides.',
    },
  },
  {
    slug: 'stanford-cs329a',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS329A 導讀', en: 'Reading Stanford CS329A' },
    descriptions: {
      'zh-TW': '逐講追蹤 Stanford CS329A 的自我改進式 AI 系統；每篇以可對應官方 session 的材料為準，缺料時明列等待。',
      en: 'A lecture-by-lecture reading of Stanford CS329A on self-improving AI systems, grounded in materials attributable to each official session and paused where evidence is missing.',
    },
  },
  {
    slug: 'mit-6s191',
    category: 'courses',
    names: { 'zh-TW': 'MIT 6.S191 導讀', en: 'Reading MIT 6.S191' },
    descriptions: {
      'zh-TW': '依 2026 官方影片、投影片與實驗程式，讀完 MIT 6.S191 的九講與三個實驗，不混用歷史版本。',
      en: 'Reading all nine lectures and three labs of MIT 6.S191 from the official 2026 videos, slides, and lab code without mixing in earlier offerings.',
    },
  },
  {
    slug: 'mit-6-7960-fall-2024-ocw',
    category: 'courses',
    names: { 'zh-TW': 'MIT 6.7960 導讀 (Fall 2024 OCW)', en: 'MIT 6.7960 導讀 (Fall 2024 OCW)' },
    descriptions: {
      'zh-TW': '逐講讀 MIT 6.7960（Fall 2024 OCW）：深度學習的優化、正則化、CNN、Transformer、生成模型與表示學習。',
      en: 'A lecture-by-lecture reading of MIT 6.7960 (Fall 2024 OCW): optimization, regularization, CNNs, Transformers, generative models, and representation learning in deep learning.',
    },
  },
  {
    slug: 'berkeley-cs188-spring-2026',
    category: 'courses',
    names: { 'zh-TW': 'Berkeley CS188 Spring 2026', en: 'Berkeley CS188 Spring 2026' },
    descriptions: {
      'zh-TW': '以 P0–P5 六個 projects 為主線，讀 Berkeley CS188 Spring 2026 的搜尋、決策、機率推論、強化學習與機器學習。',
      en: 'Reading Berkeley CS188 Spring 2026 through Projects P0–P5, from search and decision making to probabilistic inference, reinforcement learning, and machine learning.',
    },
  },
  {
    slug: 'berkeley-cs288-spring-2026',
    category: 'courses',
    names: { 'zh-TW': 'Berkeley CS288 Spring 2026', en: 'Berkeley CS288 Spring 2026' },
    descriptions: {
      'zh-TW': '依 18 組公開教材與三份作業，讀 Berkeley CS288 Spring 2026 從 n-gram 到 RAG、reasoning 與 agents 的進階 NLP 路線。',
      en: 'Reading Berkeley CS288 Spring 2026 from n-grams through RAG, reasoning, and agents using its 18 public slide units and three assignments.',
    },
  },
  {
    slug: 'berkeley-cs285-spring-2026',
    category: 'courses',
    names: { 'zh-TW': 'Berkeley CS285 Spring 2026 導讀', en: 'Reading Berkeley CS285 Spring 2026' },
    descriptions: {
      'zh-TW': '依 25 講投影片、九組討論與五份作業，讀 Berkeley CS285 Spring 2026 的深度強化學習路線與算力邊界。',
      en: 'Reading Berkeley CS285 Spring 2026 in deep reinforcement learning through 25 lectures, nine discussions, five assignments, and their compute constraints.',
    },
  },
  {
    slug: 'cmu-10301-machine-learning',
    category: 'courses',
    names: {
      'zh-TW': 'CMU 10-301 機器學習完整課程導讀',
      en: 'Reading CMU 10-301 Machine Learning',
    },
    descriptions: {
      'zh-TW': '以 Spring 2026 九份公開作業為主線，讀 CMU 10-301／601 的 27 講機器學習內容與校外實作邊界。',
      en: 'Reading the 27 lectures of CMU 10-301/601 through its nine public Spring 2026 homework bundles and the practical limits for independent learners.',
    },
  },
  {
    slug: 'cmu-11785-deep-learning',
    category: 'courses',
    names: {
      'zh-TW': 'CMU 11-785 深度學習完整課程導讀',
      en: 'Reading CMU 11-785 Deep Learning',
    },
    descriptions: {
      'zh-TW': '逐講讀 CMU 11-785 Spring 2026 的 28 講深度學習教材，並清楚區分公開講授鏈與受限的正式作業鏈。',
      en: 'A lecture-by-lecture reading of CMU 11-785 Spring 2026 that separates its public 28-lecture teaching sequence from the restricted assignment workflow.',
    },
  },
  {
    slug: 'taste-cultivation',
    category: 'other',
    names: { 'zh-TW': '品味修煉', en: 'Cultivating Taste' },
    descriptions: {
      'zh-TW': '把品味拆成可以觀察、辯護與反覆校準的判斷力，系統性記錄在 AI 放大執行力之後，如何訓練選擇什麼值得做、怎樣才算做好的能力。',
      en: 'Treating taste as judgment that can be observed, defended, and recalibrated, with a systematic practice for deciding what is worth making and what good work looks like when AI amplifies execution.',
    },
  },
  {
    // 課程專有名詞，兩語同名
    slug: 'learning-how-to-learn',
    category: 'other',
    names: { 'zh-TW': 'Learning How to Learn', en: 'Learning How to Learn' },
    descriptions: {
      'zh-TW': '把學習科學的證據與生成式 AI 的實際用法擺在一起審視：哪些做法有證據支持、哪些只是流傳，以及數位之外紙筆還剩什麼。',
      en: 'Auditing the evidence behind learning science alongside how generative AI is actually used — which practices hold up, which merely circulate, and what pen and paper still do better.',
    },
  },
  {
    slug: 'openclaw',
    category: 'ai-agents',
    names: { 'zh-TW': 'OpenClaw 文件導讀', en: 'Reading the OpenClaw Docs' },
    descriptions: {
      'zh-TW':
        '把 OpenClaw 這套自架 AI 閘道器的 300+ 份官方文件拆成 32 篇讀完：從安裝與平台、模型供應商、agent 執行核心與記憶，到 24+ 聊天頻道、沙箱與威脅模型、工具與自動化、Gateway 營運、Plugin 與各種介面。',
      en: 'Reading the 300+ official docs of OpenClaw, a self-hosted AI gateway, across 32 posts — installation and platforms, model providers, the agent runtime and memory, 24+ chat channels, sandboxing and threat model, tools and automation, gateway operations, plugins, and the user interfaces.',
    },
  },
  {
    slug: 'cs146s',
    category: 'courses',
    names: {
      'zh-TW': 'CS146S：AI 原生開發十週',
      en: 'CS146S: Ten Weeks of AI-Native Development',
    },
    descriptions: {
      'zh-TW':
        '照 Stanford CS146S「The Modern Software Developer」的十週大綱逐週讀：從 agent 內部構造、context 工程、skills 與客製，到 codebase 就緒度、code review、安全、背景 agent、團隊化與 software factory。每篇對照課程指定材料與可查證的一手來源。',
      en: 'Reading Stanford CS146S "The Modern Software Developer" week by week — agent internals, context engineering, skills and customization, codebase readiness, code review, security, background agents, team-scale adoption, and the software factory. Each post is grounded in the course material and verifiable primary sources.',
    },
  },
  {
    slug: 'hermes-agent',
    category: 'ai-agents',
    names: {
      'zh-TW': 'Hermes Agent 文件導讀',
      en: 'Hermes Agent Documentation Guide',
    },
    descriptions: {
      'zh-TW':
        '對照 Nous Research 官方文件讀 Hermes Agent：安裝與升級、模型供應商與 Nous Portal、Tool Gateway、七種終端後端、記憶與技能、工具與 plugin、Gateway 與排程、安全模型，以及從 OpenClaw 遷移。每篇只留取捨與失敗點，指令細節交還官方文件。',
      en: 'Reading Hermes Agent against the official Nous Research docs: install and upgrade, model providers and Nous Portal, the Tool Gateway, seven terminal backends, memory and skills, tools and plugins, the gateway and scheduling, the security model, and migrating from OpenClaw. Each post keeps the trade-offs and failure modes and leaves command details to the docs.',
    },
  },
  {
    slug: 'agent-cli',
    category: 'engineering',
    names: {
      'zh-TW': 'Agent CLI 選型指南',
      en: 'Choosing an Agent CLI',
    },
    descriptions: {
      'zh-TW':
        '把終端 agent 這一類工具攤開來比：Claude Code、Codex、Gemini CLI（已轉為 Antigravity CLI）、OpenCode、Pi、Cursor CLI、Kiro，各自的設計取捨、方案與計費，最後收在跨工具的訂閱比較與多模型路由。價格與模型名稱半衰期極短，每篇都標了查證日期並把易腐段落交還官方頁面。',
      en: "A comparison of terminal agents — Claude Code, Codex, Gemini CLI (now transitioned to Antigravity CLI), OpenCode, Pi, Cursor CLI, and Kiro — covering each one's design trade-offs, plans, and billing, closing with a cross-tool subscription comparison and multi-model routing. Pricing and model names rot fast, so every post carries its verification date and defers the perishable details to official pages.",
    },
  },
  {
    slug: 'ai-cert-prep',
    category: 'exams-interviews',
    names: {
      'zh-TW': 'AI 證照備考',
      en: 'AI Certification Prep',
    },
    descriptions: {
      'zh-TW':
        '以官方 exam guide 的章節權重為骨架，一張證照一篇備考路徑：考什麼、配哪些官方材料、練什麼，時程換算的依據也寫出來。所有內容取自官方考綱與認證頁，不含應考實錄，也不含考古題。',
      en: 'One preparation path per certification, built on the official exam guides: what each domain tests, which official material covers it, what to build, and the reasoning behind every schedule. Everything comes from official exam guides and certification pages — no exam-day accounts, no leaked questions.',
    },
  },
  {
    slug: 'ai-engineer-interview',
    category: 'exams-interviews',
    names: {
      'zh-TW': 'AI Engineer 面試準備',
      en: 'AI Engineer Interview Prep',
    },
    descriptions: {
      'zh-TW':
        '從 ML 基礎、系統設計、LLM 應用架構到行為面試，拆成十個主題逐篇準備。每篇聚焦一個面試環節，整理核心概念、常見題型與實戰策略。',
      en: 'Preparing for AI engineer interviews across ten topics — ML fundamentals, system design, LLM application architecture, coding, paper reading, and behavioral. Each post focuses on one interview dimension with core concepts, common question patterns, and practical strategies.',
    },
  },
  {
    slug: 'product-builder-interview',
    category: 'exams-interviews',
    names: {
      'zh-TW': 'Product Builder 面試準備',
      en: 'Product Builder Interview Prep',
    },
    descriptions: {
      'zh-TW':
        '從產品直覺、指標設計、策略思維到 AI 產品設計，拆成十個主題準備 Product Builder 面試。每篇聚焦一個面試環節，整理框架、案例與答題策略。',
      en: 'Preparing for product builder interviews across ten topics — product sense, metrics, strategy, execution, technical PM, growth, and AI product design. Each post focuses on one interview dimension with frameworks, case studies, and answer strategies.',
    },
  },
  {
    slug: 'ai-engineer-interview-daily',
    category: 'exams-interviews',
    names: {
      'zh-TW': 'AI Engineer 面試日練',
      en: 'AI Engineer Interview Daily',
    },
    descriptions: {
      'zh-TW':
        '每日一篇 AI Engineer 面試練習，依星期輪替七個主題——ML 基礎、深度學習、系統設計、LLM 工程、Coding、論文閱讀、行為面試——從網路抓最新面試題與資源。',
      en: 'A daily AI engineer interview drill rotating through seven topics by day of the week — ML fundamentals, deep learning, system design, LLM engineering, coding, paper reading, and behavioral — pulling the latest interview questions and resources from the web.',
    },
  },
  {
    slug: 'product-builder-interview-daily',
    category: 'exams-interviews',
    names: {
      'zh-TW': 'Product Builder 面試日練',
      en: 'Product Builder Interview Daily',
    },
    descriptions: {
      'zh-TW':
        '每日一篇 Product Builder 面試練習，依星期輪替七個主題——產品直覺、指標分析、策略執行、AI 產品設計、成長實驗、技術 PM、行為面試——從網路抓最新案例與面試題。',
      en: 'A daily product builder interview drill rotating through seven topics by day of the week — product sense, metrics, strategy, AI product design, growth, technical PM, and behavioral — pulling the latest case studies and interview questions from the web.',
    },
  },
  {
    slug: 'cmu-07-280',
    category: 'courses',
    names: { 'zh-TW': 'CMU 07-280 完整課程導讀', en: 'Reading CMU 07-280' },
    descriptions: {
      'zh-TW': '逐講讀 CMU AI 核心改制後的 07-280：從 linear regression、MLE 到 N-gram、attention/transformer 與 Q-learning，對照官方 Spring 2026 教材。',
      en: 'A lecture-by-lecture reading of CMU 07-280, the first half of CMU’s redesigned AI core: linear regression, MLE, N-grams, attention/transformers, and Q-learning, against the official Spring 2026 materials.',
    },
  },
  {
    slug: 'cmu-07-380',
    category: 'courses',
    names: { 'zh-TW': 'CMU 07-380 完整課程導讀', en: 'Reading CMU 07-380' },
    descriptions: {
      'zh-TW': '接續 07-280，逐講讀 CMU 07-380 首開學期的 26 講：從邏輯與規劃到擴散模型，並標明 HW 與 Project 的公開進度。',
      en: 'Continuing from 07-280, a lecture-by-lecture reading of CMU 07-380’s first-offering 26 lectures — from logic and planning through diffusion models — with the release status of homework and project materials noted throughout.',
    },
  },
  {
    slug: 'harvard-cs50-ai',
    category: 'courses',
    names: { 'zh-TW': 'Harvard CS50 AI 導讀', en: 'Reading Harvard CS50 AI' },
    descriptions: {
      'zh-TW': '逐講讀 Harvard CS50 AI with Python：搜尋、知識表示、機率、機器學習、神經網路與語言模型的公開教材與作業。',
      en: 'A lecture-by-lecture reading of Harvard CS50’s AI with Python: search, knowledge representation, probability, machine learning, neural networks, and language, based on the public course materials and assignments.',
    },
  },
  {
    slug: 'harvard-cs181',
    category: 'courses',
    names: { 'zh-TW': 'Harvard CS181 逐週導讀', en: 'Harvard CS181 Weekly Guides' },
    descriptions: {
      'zh-TW': '逐週讀 Harvard CS181（Machine Learning）：線性代數、微積分與機率的補課，到線性迴歸與後續模型的公開作業。',
      en: 'A week-by-week reading of Harvard CS181 (Machine Learning): the linear algebra, calculus, and probability refreshers, then linear regression and the models that follow, based on public homework.',
    },
  },
  {
    slug: 'berkeley-cs189-spring-2025',
    category: 'courses',
    names: { 'zh-TW': 'Berkeley CS189 導讀', en: 'Reading Berkeley CS189' },
    descriptions: {
      'zh-TW': '逐講、逐份作業讀 Berkeley CS189（Introduction to Machine Learning）的公開教材，每篇標明採用學期，補齊 CS188 之後更完整的 ML 數學基礎。',
      en: 'A lecture-by-lecture, homework-by-homework reading of the public materials of Berkeley CS189 (Introduction to Machine Learning), with the term stated in every post, filling in the fuller mathematical foundations of ML after CS188.',
    },
  },
  {
    slug: 'ntu-ml-2026-spring',
    category: 'courses',
    names: { 'zh-TW': '台大李宏毅 機器學習 2026 Spring 導讀', en: 'Reading NTU Hung-yi Lee Machine Learning 2026 Spring' },
    descriptions: {
      'zh-TW': '依官方 8 講投影片與錄影、10 份作業與 Colab，讀台大李宏毅機器學習 2026 Spring：從解剖 OpenClaw、Context Engineering，到 Flash Attention、KV Cache、位置編碼、Harness Engineering、自我修正與 AI 自我成長。',
      en: 'Reading NTU Hung-yi Lee\'s Machine Learning 2026 Spring through its 8 lecture decks and recordings plus 10 homework Colabs: an OpenClaw teardown, context engineering, Flash Attention, KV cache, positional embedding, harness engineering, self-correction, and self-improving AI.',
    },
  },
  {
    slug: 'mit-6s184',
    category: 'courses',
    names: { 'zh-TW': 'MIT 6.S184 導讀', en: 'Reading MIT 6.S184' },
    descriptions: {
      'zh-TW': '依 IAP 2026 官方講義、投影片、錄影與三個 lab（含官方解答），逐講讀 MIT 6.S184：從 ODE／SDE、flow matching、score matching、classifier-free guidance、DiT 與 latent space，一路到離散擴散。',
      en: 'A lecture-by-lecture reading of MIT 6.S184 (IAP 2026) from the official lecture notes, slides, recordings, and three labs with solutions: ODEs/SDEs, flow matching, score matching, classifier-free guidance, DiT and latent spaces, and discrete diffusion.',
    },
  },
  {
    slug: 'stanford-cs231n',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS231N 導讀', en: 'Reading Stanford CS231N' },
    descriptions: {
      'zh-TW': 'Stanford CS231N 電腦視覺深度學習導讀：依 Spring 2026 投影片與 A1–A3 作業，錄影部分對照 Spring 2025 YouTube 公開版。從影像分類、反向傳播、CNN、Transformer，一路走到偵測分割、自監督、生成模型、視覺語言與 3D。',
      en: 'A guided reading of Stanford CS231N (Deep Learning for Computer Vision), based on the Spring 2026 slides and assignments A1–A3, with the public Spring 2025 YouTube lectures for video. It runs from image classification, backprop, CNNs and Transformers through detection and segmentation, self-supervised learning, generative models, vision-language and 3D.',
    },
  },
  {
    slug: 'cmu-11-868-llm-systems',
    category: 'courses',
    names: { 'zh-TW': 'CMU 11-868 LLM Systems 導讀', en: 'Reading CMU 11-868 LLM Systems' },
    descriptions: {
      'zh-TW': '依 Spring 2026 的 28 份公開講義與 7 份 MiniTorch 作業，逐講讀 CMU 11-868 LLM Systems：從 CUDA kernel、自製框架、分散式訓練到 serving 與 RLHF，並標明沒有錄影、需要 GPU 的自學邊界。',
      en: 'A lecture-by-lecture reading of CMU 11-868 LLM Systems (Spring 2026) through its 28 public slide decks and seven MiniTorch assignments, from CUDA kernels and a homemade framework to distributed training, serving, and RLHF, with the no-video, GPU-required limits for self-learners noted throughout.',
    },
  },
  {
    slug: 'ntu-adl-2025-fall',
    category: 'courses',
    names: { 'zh-TW': '台大陳縕儂 深度學習之應用 2025 Fall 導讀', en: 'Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall' },
    descriptions: {
      'zh-TW': '依官方 17 份講義、77 支錄影、助教課與 HW1 規格，讀台大陳縕儂深度學習之應用（ADL）Fall 2025：從神經網路、RNN、Transformer、BERT，到預訓練、RLHF、LoRA、RAG、生成解碼、安全對齊、Language Agents 與 Reasoning。',
      en: 'Reading NTU Yun-Nung (Vivian) Chen\'s Applied Deep Learning (ADL) Fall 2025 through its 17 lecture decks, 77-video playlist, TA recitations and the HW1 spec: neural nets, RNNs, Transformers, BERT, pretraining, RLHF, LoRA, RAG, decoding, safety and alignment, language agents, and reasoning.',
    },
  },
  {
    slug: 'ntu-htlin-ml',
    category: 'courses',
    names: { 'zh-TW': '台大林軒田 機器學習基石與技法 導讀', en: 'Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques' },
    descriptions: {
      'zh-TW': '依林軒田「機器學習基石」與「機器學習技法」兩門 MOOC（32 講、130 支 YouTube 影片、全套 handout 投影片）逐主題導讀，從 PLA、VC 維度、線性模型、正則化與驗證，一路讀到 SVM、kernel、aggregation、樹模型與神經網路，並用公開的 Fall 2024 HW0–HW7 與期末專題當練習；Fall 2026 的課另外對照。',
      en: 'A topic-by-topic guide to Hsuan-Tien Lin\'s Machine Learning Foundations and Techniques MOOCs (32 lectures, 130 YouTube videos, all handout slides). It runs from PLA, VC dimension, linear models, regularization, and validation to SVMs, kernels, aggregation, tree models, and neural networks. The public Fall 2024 HW0–HW7 and final project serve as exercises, and the in-progress Fall 2026 offering is cross-referenced.',
    },
  },
  {
    slug: 'nthu-nlp',
    category: 'courses',
    names: { 'zh-TW': '清大高宏宇 自然語言處理 導讀', en: 'Reading NTHU Hung-Yu Kao Natural Language Processing' },
    descriptions: {
      'zh-TW': '依 IKMLab 官方 GitHub 的 Fall 2025 完整教材（講課投影片、W1–W16 共 36 支公開錄影、HW1–HW4 題目與 notebook、PyTorch／Hugging Face／LLM API／RAG 助教課），讀清大高宏宇的 TAICA 中文 NLP 課：從傳統文字處理、詞向量、seq2seq、Transformer、BERT 家族、解碼與評估，一路讀到 RLHF、PEFT、RAG 與 Reasoning，最後整理 Fall 2026 的改版。',
      en: 'Reading NTHU Prof. Hung-Yu Kao\'s Mandarin TAICA NLP course through its complete Fall 2025 materials on the official IKMLab GitHub: lecture slides, 36 public W1–W16 recordings, HW1–HW4 specs and notebooks, and TA tutorials on PyTorch, Hugging Face, LLM APIs and RAG. The series moves from classic text processing, word embeddings, seq2seq, Transformers and the BERT family through decoding and evaluation to RLHF, PEFT, RAG and reasoning, and ends with what changes in Fall 2026.',
    },
  },
  {
    slug: 'nccu-generative-ai',
    category: 'courses',
    names: { 'zh-TW': '政大蔡炎龍 生成式AI 導讀', en: 'Reading NCCU Yen-Lung Tsai Generative AI' },
    descriptions: {
      'zh-TW': '依 Spring 2025（1132）的 14 支錄影、14 份投影片、12 份作業說明與 Colab notebook，逐講讀政大蔡炎龍的 TAICA 課程「生成式 AI：文字與圖像生成的原理與實務」：從神經網路、GAN、LLM 與 Transformer，到對話機器人、RAG、AI Agents，再到 VAE、Stable Diffusion、ControlNet／Fooocus。適合初學者。',
      en: 'A lecture-by-lecture reading of NCCU Yen-Lung Tsai\'s TAICA course "Generative AI: Text and Image Synthesis Principles and Practice", based on the Spring 2025 (1132) term: 14 recordings, 14 slide decks, 12 homework specs, and Colab notebooks. It runs from neural nets, GANs, LLMs and Transformers through chatbots, RAG and AI agents to VAEs, Stable Diffusion, and ControlNet/Fooocus, and is written for beginners.',
    },
  },
  {
    slug: 'stanford-cs224r',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS224R 導讀', en: 'Reading Stanford CS224R' },
    descriptions: {
      'zh-TW': '依 Spring 2026 的 17 份投影片、三份作業與 default project，讀 Stanford CS224R 從模仿學習、策略梯度、offline RL，到 RLHF、LLM 推理與機器人 VLA 的深度強化學習路線；Spring 2025 公開錄影當補充。',
      en: 'A reading of Stanford CS224R Spring 2026 through its 17 slide decks, three homeworks, and default project. It covers deep RL from imitation learning, policy gradients, and offline RL to RLHF, LLM reasoning, and robot VLAs, with the public Spring 2025 videos as a labeled supplement.',
    },
  },
  {
    slug: 'mit-6-5940',
    category: 'courses',
    names: { 'zh-TW': 'MIT 6.5940 導讀', en: 'Reading MIT 6.5940' },
    descriptions: {
      'zh-TW': '以最近一屆完整的 Fall 2024 為主幹，逐講讀 MIT 6.5940 TinyML 與高效深度學習：pruning、quantization、NAS、蒸餾、MCU 部署、LLM 推論與後訓練、長上下文、diffusion、分散式與裝置端訓練，並對照進行中的 Fall 2026。',
      en: 'A lecture-by-lecture reading of MIT 6.5940 TinyML and Efficient Deep Learning Computing, based on the latest complete edition (Fall 2024): pruning, quantization, NAS, distillation, microcontroller deployment, LLM inference and post-training, long context, diffusion, and distributed and on-device training, cross-referenced with the in-progress Fall 2026 offering.',
    },
  },
  {
    slug: 'cmu-10-423-generative-ai',
    category: 'courses',
    names: { 'zh-TW': 'CMU 10-423 導讀', en: 'Reading CMU 10-423' },
    descriptions: {
      'zh-TW': '以 Spring 2026 的 26 講投影片、HW1–HW4 起始碼與練習考卷為主線，讀 CMU 10-423/623/723 生成式 AI 從語言模型到擴散模型、多模態與規模化的路線。',
      en: 'Reading CMU 10-423/623/723 Generative AI through the Spring 2026 edition: 26 lecture decks, HW1–HW4 starter code, and the practice exam, from language models to diffusion, multimodal models and scaling.',
    },
  },
  {
    slug: 'stanford-cs149',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS149 導讀', en: 'Reading Stanford CS149' },
    descriptions: {
      'zh-TW': '依 Stanford CS149 Fall 2025 官方投影片、5 個程式作業與 4 份書面作業，逐講導讀平行計算：多核與 SIMD、工作分配與 locality、GPU/CUDA、DNN 與 AI 加速器（Trainium2）、資料中心 AI、AI 驅動最佳化，到 cache coherence、lock-free 與 transactional memory；錄影以 2023 公開版補充。',
      en: 'A lecture-by-lecture reading of Stanford CS149 Parallel Computing (Fall 2025) using its official slides, five programming assignments, and four written assignments: multi-core and SIMD, work distribution and locality, GPUs and CUDA, DNNs and AI accelerators (Trainium2), datacenter AI, AI-driven optimization, then cache coherence, lock-free programming, and transactional memory, with the public 2023 videos as a labeled supplement.',
    },
  },
  {
    slug: 'stanford-cs234',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CS234 導讀', en: 'Reading Stanford CS234' },
    descriptions: {
      'zh-TW': '依 Winter 2026 的 14 講投影片、三份作業與起始碼，對照 Spring 2024 公開錄影，讀 Stanford CS234 的強化學習路線：MDP 規劃、無模型評估與控制、策略梯度與 PPO、模仿學習與 RLHF／DPO、bandit 探索理論、MCTS 與價值對齊。',
      en: 'Reading Stanford CS234 Reinforcement Learning through the Winter 2026 slides for 14 lectures and three assignments with starter code, alongside the public Spring 2024 videos: MDP planning, model-free evaluation and control, policy gradients and PPO, imitation learning and RLHF/DPO, exploration theory with bandits, MCTS, and value alignment.',
    },
  },
  {
    slug: 'harvard-cs2881r',
    category: 'courses',
    names: { 'zh-TW': 'Harvard CS2881R 導讀', en: 'Reading Harvard CS2881R' },
    descriptions: {
      'zh-TW': '逐講讀 Harvard CS 2881R AI Safety（Boaz Barak，Fall 2025）：從 emergent misalignment 的 HW0 出發，經過安全訓練、jailbreak 與 prompt injection、model spec 與內容政策、scheming 與可解釋性，到遞迴自我改進、能力量測、經濟與心理健康衝擊，以及學生的重現與期末研究。依據公開錄影、閱讀清單、投影片與作業規格。',
      en: 'A lecture-by-lecture reading of Harvard CS 2881R AI Safety (Boaz Barak, Fall 2025). It starts from the emergent-misalignment HW0, then covers safety training, jailbreaks and prompt injection, model specs and content policies, scheming and interpretability, recursive self-improvement, capability measurement, and the economic and mental-health impacts, ending with the students\' reproduction and final research projects. It is based on the public recordings, reading lists, slides and assignment specs.',
    },
  },
  {
    slug: 'claude-code-deep-dives',
    category: 'engineering',
    names: { 'zh-TW': 'Claude Code 深入介紹', en: 'Claude Code Deep Dives' },
    descriptions: {
      'zh-TW': '拆開 Claude Code 本體的設計：從 CLI 架構、權限模型到內部機制，補齊「Claude Code 自動化指南」沒談的產品內部細節。',
      en: 'Taking apart Claude Code itself — CLI architecture, the permission model, and internal mechanics — filling in the product-internals detail that the automation guide series does not cover.',
    },
  },
  {
    slug: 'pi-mono-deep-dive',
    category: 'engineering',
    names: { 'zh-TW': 'pi-mono 深度導讀', en: 'pi-mono Deep Dive' },
    descriptions: {
      'zh-TW': '逐段讀 pi-mono 原始碼：agent loop、工具呼叫、審批與 session 管理的實作方式，作為跟成熟 coding agent 學設計的對照案例之一。',
      en: 'A close reading of the pi-mono source: how it implements the agent loop, tool calls, approvals, and session management — one of the reference implementations in the mature-coding-agent-design comparison.',
    },
  },
  {
    slug: 'omp-internals-deep-dive',
    category: 'engineering',
    names: { 'zh-TW': 'OMP 內部設計導讀', en: 'OMP Internals Deep Dive' },
    descriptions: {
      'zh-TW': '逐段讀 oh-my-pi（OMP）原始碼：streaming、rulebook、slash/custom tools、memory 與 task hub 等內部設計。',
      en: 'A close reading of oh-my-pi (OMP) source: streaming internals, the rulebook and TTSR, slash and custom tools, memory, and the task hub/advisor design.',
    },
  },
  {
    slug: 'cloudflare-ai-stack',
    category: 'engineering',
    names: { 'zh-TW': 'Cloudflare AI Stack', en: 'Cloudflare AI Stack' },
    descriptions: {
      'zh-TW': '把 Cloudflare 上的 AI 元件單獨拆出來讀：Workers AI、Vectorize、AI Gateway 等 binding 的能力邊界與實際取捨。',
      en: 'The AI-specific pieces of Cloudflare’s platform, read on their own: Workers AI, Vectorize, AI Gateway, and the trade-offs of building on these bindings.',
    },
  },
  {
    slug: 'cloudflare-edge-platform',
    category: 'engineering',
    names: { 'zh-TW': 'Cloudflare Edge Platform', en: 'Cloudflare Edge Platform' },
    descriptions: {
      'zh-TW': '持續追蹤 Cloudflare 邊緣平台的元件與服務更新，作為「Cloudflare 邊緣技術棧」系列之後的延伸紀錄。',
      en: 'An ongoing record of updates to Cloudflare’s edge platform components and services, extending past where "The Cloudflare Edge Stack" series left off.',
    },
  },
  {
    slug: 'self-hosted-inference',
    category: 'engineering',
    names: { 'zh-TW': '自架推論服務', en: 'Self-Hosted Inference' },
    descriptions: {
      'zh-TW': '自己架推論服務要考慮的取捨：硬體、模型 serving 框架、成本與維運，對照直接呼叫雲端 API 的分界點。',
      en: 'The trade-offs of running your own inference service: hardware, model-serving frameworks, cost, and operations, weighed against just calling a cloud API.',
    },
  },
  {
    slug: 'groundlane',
    category: 'engineering',
    names: { 'zh-TW': 'Groundlane 實戰系列', en: 'Groundlane 實戰系列' },
    descriptions: {
      'zh-TW': '記錄 Groundlane 這個自架研究/爬取工具的設計與實戰使用心得，作為搜尋與爬取實戰系列的延伸案例。',
      en: 'Notes on designing and using Groundlane, a self-hosted research and scraping tool — a companion case study to the search-and-scraping series.',
    },
  },
  {
    slug: 'security-cert-prep',
    category: 'exams-interviews',
    names: { 'zh-TW': '資安證照攻略', en: '資安證照攻略' },
    descriptions: {
      'zh-TW': '以官方考綱為主軸的資安證照備考路徑：考什麼、配哪些官方材料、練什麼。',
      en: 'Preparation paths for security certifications built on official exam guides: what each domain tests, which official material covers it, and what to practice.',
    },
  },
  {
    slug: 'solo-media-company',
    category: 'other',
    names: { 'zh-TW': '一個人的媒體公司', en: '一個人的媒體公司' },
    descriptions: {
      'zh-TW': '一個人經營內容/媒體事業的實務紀錄：定位、產出節奏、變現與 AI 工具怎麼放進流程。',
      en: 'A practical record of running a one-person media business: positioning, output cadence, monetization, and where AI tools fit into the workflow.',
    },
  },
  {
    slug: 'llm-from-scratch',
    category: 'ai-agents',
    names: { 'zh-TW': '從零訓練一個 LLM', en: '從零訓練一個 LLM' },
    descriptions: {
      'zh-TW': '從零開始訓練一個語言模型的實作紀錄：資料、tokenizer、架構、訓練與評估的每一個決定。',
      en: 'A hands-on record of training a language model from scratch: every decision across data, tokenizer, architecture, training, and evaluation.',
    },
  },
  {
    slug: 'meta-harness-agent',
    category: 'ai-agents',
    names: { 'zh-TW': 'Meta-Harness 與 Agent 治理', en: 'Meta-Harness 與 Agent 治理' },
    descriptions: {
      'zh-TW': '當 agent 本身也要被治理：meta-harness 的設計、多 agent 協作的規則與邊界。',
      en: 'When the agent itself needs governing: meta-harness design, and the rules and boundaries for multi-agent collaboration.',
    },
  },
  {
    slug: 'understanding-ai-models',
    category: 'ai-agents',
    names: { 'zh-TW': '認識 AI 模型', en: '認識 AI 模型' },
    descriptions: {
      'zh-TW': '給還不熟 AI 模型的讀者的入門系列：概念、名詞與怎麼挑一個模型來用。',
      en: 'An introductory series for readers still new to AI models: concepts, terminology, and how to pick one to use.',
    },
  },
  {
    slug: 'ai-native-sdlc-playbook',
    category: 'ai-agents',
    names: { 'zh-TW': 'AI-Native SDLC Playbook', en: 'AI-Native SDLC Playbook' },
    descriptions: {
      'zh-TW': '把 AI 放進軟體開發生命週期各階段的實作手冊：需求、設計、開發、測試、維運怎麼分別導入 agent。',
      en: 'A playbook for putting AI into every stage of the software development lifecycle: how agents fit into requirements, design, development, testing, and operations.',
    },
  },
  // 以下七個原本走 slugifySeriesName fallback：中英混合的名稱會被截成 `ai`、`ai-agent`
  // 這種泛用 slug，跟其他系列搶同一條路由。舊路由在 astro.config 留 301。
  {
    slug: 'ai-search-content-business',
    category: 'other',
    names: { 'zh-TW': 'AI 搜尋正在重寫內容生意', en: 'AI Search Is Rewriting the Content Business' },
    descriptions: {
      'zh-TW': '從 Google、Pew 與 Cloudflare 的資料拆解 AI 摘要如何重畫內容、引用、點擊與轉換路徑，以及封鎖、授權、訴訟與自有資產各自能保護內容生意的哪一段。',
      en: 'How AI summaries redraw the path from content to citation, click, and conversion, drawing on data from Google, Pew, and Cloudflare, and which part of the content business blocking, licensing, lawsuits, and owned assets each protect.',
    },
  },
  // 內容販售系列群：一個入口系列加三個子系列。登錄前中英文各走自己的 fallback slug，語言切換接不起來。
  {
    slug: 'content-selling-business-models',
    category: 'other',
    names: { 'zh-TW': '內容販售商業模式拆解', en: 'Content Selling Business Models' },
    descriptions: {
      'zh-TW': '內容販售系列群的入口：先問誰付錢、付錢是為了完成什麼工作，再比較 B2B 情報、個人媒體、創作者平台與免費內容四種模式，並導向各子系列。',
      en: 'The entry point to the content-selling series: it asks who pays and what job the payment gets done, compares B2B intelligence, independent media, creator platforms, and free content, and routes to each sub-series.',
    },
  },
  {
    slug: 'enterprise-intelligence-business',
    category: 'other',
    names: { 'zh-TW': '情報如何成為一門企業生意', en: 'How Intelligence Becomes an Enterprise Business' },
    descriptions: {
      'zh-TW': '拆解 DIGITIMES、The Information、Seeking Alpha、CB Insights、PitchBook 與 Gartner 如何把資訊取得、驗證與研究做成企業願意續約的產品，最後檢查台灣還能不能長出垂直情報公司。',
      en: 'How DIGITIMES, The Information, Seeking Alpha, CB Insights, PitchBook, and Gartner turn access, verification, and research into products enterprises renew, ending with whether Taiwan can still build a vertical intelligence company.',
    },
  },
  {
    slug: 'creator-reader-relationship',
    category: 'other',
    names: { 'zh-TW': '誰掌握創作者與讀者的關係', en: 'Who Controls the Creator-Reader Relationship' },
    descriptions: {
      'zh-TW': '比較 Medium、Vocus、Substack、Patreon、Ghost 與 Beehiiv 各自拿走與留給創作者的東西：流量、會員資料、付款關係與搬家成本，並整理台灣創作者的平台選擇。',
      en: 'What Medium, Vocus, Substack, Patreon, Ghost, and Beehiiv each take from and leave to creators—reach, member data, payment relationships, and migration cost—plus a platform-choice guide for creators in Taiwan.',
    },
  },
  {
    slug: 'free-content-acquisition',
    category: 'other',
    names: { 'zh-TW': '免費內容如何替別的生意獲客', en: 'How Free Content Acquires Customers for Another Business' },
    descriptions: {
      'zh-TW': '免費內容怎麼連到廣告、工具訂閱、券商合作與聯盟收入：用鉅亨網、CMoney、BigGo Finance、Fugle 等案例拆解轉換路徑、單位經濟與 AI 搜尋帶來的風險。',
      en: 'How free content leads to ads, tool subscriptions, brokerage partnerships, and affiliate revenue, using cases such as cnYES, CMoney, BigGo Finance, and Fugle to map conversion paths, unit economics, and AI-search risk.',
    },
  },
  {
    slug: 'ai-agent-memory',
    category: 'ai-agents',
    names: { 'zh-TW': 'AI Agent 記憶工程', en: 'AI Agent Memory Engineering' },
    descriptions: {
      'zh-TW': '為什麼記憶是 agent 工程的核心難題：從 context 滿了怎麼辦到開源記憶框架選型，十篇各自解決一個記憶問題。',
      en: 'Why memory is the core hard problem of agent engineering: ten posts, each tackling one memory problem, from a full context window to choosing an open-source memory framework.',
    },
  },
  {
    slug: 'ai-agent-weekly-review',
    category: 'updates',
    names: { 'zh-TW': 'AI Agent 週回顧', en: 'AI Agent Weekly Review' },
    descriptions: {
      'zh-TW': '每週整理 AI Agent 領域的重要發布、論文與工具變化。',
      en: 'A weekly roundup of notable releases, papers, and tooling changes in the AI agent space.',
    },
  },
  {
    slug: 'deep-research',
    category: 'ai-agents',
    names: { 'zh-TW': 'Deep Research 前沿', en: 'Deep Research Frontier' },
    descriptions: {
      'zh-TW': '梳理 80+ 個 Deep Research 實作：三階段能力路線、規劃／獲取／記憶／生成四個核心組件、prompting／SFT／RL 三種優化範式，以及評估與開源工具全景。',
      en: 'A survey of 80+ Deep Research systems: the three-stage capability roadmap, four core components (planning, acquisition, memory, generation), three optimization paradigms (prompting, SFT, RL), evaluation, and the open-source tool landscape.',
    },
  },
  {
    slug: 'multi-agent',
    category: 'ai-agents',
    names: { 'zh-TW': 'Multi-Agent 系統實戰', en: 'Multi-Agent Systems in Practice' },
    descriptions: {
      'zh-TW': '比較 Claude Code、Codex、Antigravity、Cursor、Windsurf、Devin、LangGraph、CrewAI 的 subagent 模型、編排模式與通訊機制，附能力矩陣與設計哲學光譜。',
      en: 'Comparing the subagent models, orchestration patterns, and communication mechanisms of Claude Code, Codex, Antigravity, Cursor, Windsurf, Devin, LangGraph, and CrewAI, with a capability matrix and a spectrum of design philosophies.',
    },
  },
  {
    slug: 'stanford-cme295',
    category: 'courses',
    names: { 'zh-TW': 'Stanford CME295 導讀', en: 'Reading Stanford CME295' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CME295: Transformers & Large Language Models：從 Transformer 架構一路走到 LLM 評估與 AI agent，並對照 CS224N、CS336 的分工。',
      en: 'A lecture-by-lecture reading of Stanford CME295: Transformers & Large Language Models, from the Transformer architecture to LLM evaluation and AI agents, and how it divides the ground with CS224N and CS336.',
    },
  },
  {
    slug: 'cmu-11-768-ai-agents',
    category: 'courses',
    names: { 'zh-TW': 'CMU 11-768 AI Agents 導讀', en: 'Reading CMU 11-768 AI Agents' },
    descriptions: {
      'zh-TW': '逐講讀 CMU 11-768 AI Agents（Fall 2026）：從 agent 迴圈、工具使用到 RL 訓練、credit assignment 與 reward hacking，依官方課序整理。',
      en: 'A lecture-by-lecture reading of CMU 11-768 AI Agents (Fall 2026), from the agent loop and tool use to RL training, credit assignment, and reward hacking, following the official course order.',
    },
  },
];

export function validateSeriesDefinitions(
  definitions: ReadonlyArray<Pick<SeriesDefinition, 'slug' | 'names'>> = SERIES_DEFINITIONS,
): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();
  const slugByName = new Map<string, string>();

  for (const definition of definitions) {
    if (slugs.has(definition.slug)) errors.push(`Duplicate series slug: ${definition.slug}`);
    slugs.add(definition.slug);

    for (const name of Object.values(definition.names)) {
      const existingSlug = slugByName.get(name);
      if (slugByName.has(name) && existingSlug !== definition.slug) {
        errors.push(`Duplicate series name: ${name}`);
      }
      slugByName.set(name, definition.slug);
    }
  }

  return errors;
}

const definitionErrors = validateSeriesDefinitions();
if (definitionErrors.length > 0) {
  throw new Error(`Invalid series registry:\n${definitionErrors.join('\n')}`);
}

const DEFINITION_BY_NAME = new Map<string, SeriesDefinition>();
for (const definition of SERIES_DEFINITIONS) {
  for (const name of Object.values(definition.names)) {
    DEFINITION_BY_NAME.set(name, definition);
  }
}

function slugifySeriesName(name: string): string {
  const asciiSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Dynamic-route params must stay decoded. Astro serializes the segment when
  // it builds the URL; pre-encoding here turns `%` into `%25` and produces a
  // static path that cannot match the browser's decoded request path.
  return asciiSlug || name.toLowerCase();
}

function seriesBasePath(lang: Lang): string {
  return lang === 'en' ? '/en/series' : '/series';
}

/**
 * 找出會讓兩個不同系列搶同一條 /series/<slug> 路由的名稱。只有沒登錄的系列會撞：
 * slugifySeriesName 會丟掉非 ASCII 字元，`AI 搜尋…` 與 `AI 模型家族` 的 fallback 都是 `ai`。
 * 中英混合的名稱一律要求登錄；純中文名稱的 fallback 就是名稱本身，不會截斷。
 */
export function findSeriesSlugConflicts(names: Iterable<string>): string[] {
  const errors: string[] = [];
  const registeredSlugs = new Set(SERIES_DEFINITIONS.map(definition => definition.slug));
  const fallbackOwner = new Map<string, string>();

  for (const name of new Set(names)) {
    if (DEFINITION_BY_NAME.has(name)) continue;
    const slug = slugifySeriesName(name);
    if (slug !== name.toLowerCase() && [...name].some(ch => ch.charCodeAt(0) > 0x7f)) {
      errors.push(`Series "${name}" mixes ASCII and non-ASCII text; register it in SERIES_DEFINITIONS (fallback slug would be "${slug}")`);
    }
    if (registeredSlugs.has(slug)) {
      errors.push(`Unregistered series "${name}" falls back to slug "${slug}", which a registered series already owns`);
    }
    const owner = fallbackOwner.get(slug);
    if (owner !== undefined && owner !== name) {
      errors.push(`Unregistered series "${name}" and "${owner}" both fall back to slug "${slug}"`);
    }
    fallbackOwner.set(slug, name);
  }

  return errors;
}

export function getSeriesMeta(name: string) {
  const definition = DEFINITION_BY_NAME.get(name);
  return {
    name,
    slug: definition?.slug ?? slugifySeriesName(name),
    descriptions: definition?.descriptions ?? {
      'zh-TW': `${name} 系列文章`,
      en: `Posts in the ${name} series`,
    },
    category: definition?.category,
  };
}

export function getSeriesMetaBySlug(slug: string) {
  const definition = SERIES_DEFINITIONS.find(entry => entry.slug === slug);
  if (!definition) return undefined;
  return { slug: definition.slug, names: definition.names, descriptions: definition.descriptions };
}

export function getSeriesHref(name: string, lang: Lang): string {
  const { slug } = getSeriesMeta(name);
  return `${seriesBasePath(lang)}/${slug}`;
}

export function getSeriesSummaries(posts: Post[], lang: Lang, now = new Date()): SeriesSummary[] {
  // 依 slug 分組而不是依名稱：en 文章的 frontmatter 有時寫中文系列名稱（或反過來），
  // 依名稱分組會把同一個系列拆成兩份、產生兩條相同的路由，其中一半的文章從系列頁消失。
  const grouped = new Map<string, { names: Set<string>; posts: SeriesPost[] }>();
  const seenNames: string[] = [];

  for (const post of posts) {
    if (!isPublishedPost(post, now) || post.data.lang !== lang) continue;
    for (const membership of getPostSeries(post)) {
      seenNames.push(membership.name);
      const slug = getSeriesMeta(membership.name).slug;
      const group = grouped.get(slug) ?? { names: new Set<string>(), posts: [] };
      group.names.add(membership.name);
      group.posts.push(post);
      grouped.set(slug, group);
    }
  }

  const conflicts = findSeriesSlugConflicts(seenNames);
  if (conflicts.length > 0) {
    throw new Error(`Series slug conflicts:\n${conflicts.join('\n')}`);
  }

  return Array.from(grouped.entries())
    .map(([slug, group]) => {
      const orderIn = (post: SeriesPost) =>
        getPostSeries(post).find(m => getSeriesMeta(m.name).slug === slug)?.order ?? 0;
      const orderedPosts = [...group.posts].sort((a, b) => {
        const orderDiff = orderIn(a) - orderIn(b);
        if (orderDiff !== 0) return orderDiff;
        return a.data.date.getTime() - b.data.date.getTime();
      });
      const [firstName] = group.names;
      const definition = DEFINITION_BY_NAME.get(firstName);
      const name = definition?.names[lang] ?? firstName;
      const meta = getSeriesMeta(name);
      const category = meta.category ?? inferSeriesCategory(slug, orderedPosts);
      const latestDate = orderedPosts.reduce(
        (latest, post) => post.data.date.getTime() > latest.getTime() ? post.data.date : latest,
        new Date(0),
      );
      return {
        name,
        slug,
        description: meta.descriptions[lang],
        category,
        school: category === 'courses' ? inferCourseSchool(slug) : undefined,
        posts: orderedPosts,
        count: orderedPosts.length,
        latestDate,
      };
    })
    .sort((a, b) => b.latestDate.getTime() - a.latestDate.getTime());
}
