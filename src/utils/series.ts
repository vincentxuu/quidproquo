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
}

export interface SeriesSummary {
  name: string;
  slug: string;
  description: string;
  posts: SeriesPost[];
  count: number;
  latestDate: Date;
}

// slug 是系列的身分：zh 與 en 版共用同一個 slug，只差 /en 前綴，中英切換才接得起來。
const SERIES_DEFINITIONS: SeriesDefinition[] = [
  {
    slug: 'private-corpus-pipeline',
    names: { 'zh-TW': '私有語料管線', en: 'Private Corpus Pipeline' },
    descriptions: {
      'zh-TW': '私有資料如何安全且持續地進入索引、通過查詢權限被找到，並在來源更新或刪除後維持一致；重點是資料生命週期，不重複介紹 RAG 檢索技法。',
      en: 'How private data enters indexes safely and continuously, remains subject to query-time authorization, and stays consistent when sources change or disappear—focused on the data lifecycle rather than RAG retrieval techniques.',
    },
  },
  {
    slug: 'claude-code-automation',
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
    names: { 'zh-TW': 'RAG 技法大全', en: 'The RAG Techniques Compendium' },
    descriptions: {
      'zh-TW': '把 RAG 拆成可逐項比較的技法：切塊與索引、稀疏與稠密檢索、排序融合、agentic 與進階模式、生成端控制、真實查詢會踩的坑，以及評估、成本與可觀測性。每篇只談一個決定，讀完能拼成一條自己的 pipeline。',
      en: 'RAG taken apart into techniques you can compare one at a time: chunking and indexing, sparse and dense retrieval, ranking and fusion, agentic and advanced patterns, generation-side control, the failure modes real queries hit, and evaluation, cost and observability. One decision per post, assembled into a pipeline of your own.',
    },
  },
  {
    slug: 'cloudflare-edge-stack',
    names: { 'zh-TW': 'Cloudflare 邊緣技術棧', en: 'The Cloudflare Edge Stack' },
    descriptions: {
      'zh-TW': '把在 Cloudflare 邊緣上蓋一套完整應用需要的元件逐個讀過：Workers 的執行模型，D1、KV、R2 三種儲存各自的適用邊界，Hono 與 OpenNext 這層框架取捨，再到 Workers AI binding 與實際部署時會踩的網域、原生模組問題。',
      en: 'Every piece needed to build a full application on Cloudflare’s edge, read one at a time: the Workers execution model, where D1, KV and R2 each stop being the right answer, the framework layer of Hono and OpenNext, then Workers AI bindings and the domain and native-module problems that show up at deploy time.',
    },
  },
  {
    slug: 'browser-automation-mcp',
    names: { 'zh-TW': '瀏覽器自動化與 MCP', en: 'Browser Automation and MCP' },
    descriptions: {
      'zh-TW': '讓 agent 開瀏覽器的幾條路線：Playwright、Puppeteer、Chrome DevTools 三個 MCP server 的取捨，視覺驅動的 Midscene，以及各家 CLI agent 內建瀏覽器能力的差別。重點在什麼情況下哪條路線會失敗。',
      en: 'The routes for putting a browser in an agent’s hands: the trade-offs between the Playwright, Puppeteer and Chrome DevTools MCP servers, vision-driven Midscene, and how the CLI agents differ in what they can drive natively. Focused on where each route breaks.',
    },
  },
  {
    slug: 'nobodyclimb',
    names: { 'zh-TW': 'NobodyClimb 專案紀實', en: 'Building NobodyClimb' },
    descriptions: {
      'zh-TW': '一個攀岩社群產品從產品定位、為什麼需要 AI、系統架構到 RAG pipeline 的完整紀實。技法層面的坑另外寫在 RAG 技法大全裡，這裡談的是決定怎麼做出來的。',
      en: 'A climbing-community product written up end to end: positioning, why it needed AI at all, the system architecture, and the RAG pipeline. The technique-level potholes live in the RAG compendium; this series is about how the decisions got made.',
    },
  },
  {
    slug: 'aeo-geo',
    names: { 'zh-TW': 'AEO / GEO 與 AI 搜尋', en: 'AEO, GEO, and AI Search' },
    descriptions: {
      'zh-TW': '當讀者換成 AI 之後，內容要怎麼寫才被引用：從傳統 SEO 的底子講到 answer engine optimization，內容結構與 structured data 的實際效果，再到追蹤工具能不能真的量到 AI 搜尋的能見度。',
      en: 'Writing for a reader that is now a model: from the SEO groundwork through answer engine optimization, what content structure and structured data actually buy, and whether the tracking tools can really measure visibility inside AI search.',
    },
  },
  {
    slug: 'document-parsing',
    names: { 'zh-TW': '文件解析實戰', en: 'Document Parsing in Practice' },
    descriptions: {
      'zh-TW': '把文件變成 LLM 可讀內容的三層階梯——轉換、抽取、解析。從選層邏輯到 MarkItDown、anydoc、MinerU 等各層工具的取捨比較。',
      en: 'The three-layer ladder for turning documents into LLM-readable content — conversion, extraction, and parsing. From picking the right layer to comparing MarkItDown, anydoc, MinerU, and the rest.',
    },
  },
  {
    // 文件解析實戰的上游：那個系列從「已經拿到檔案」開始，這個系列談怎麼先把東西弄到手。
    slug: 'search-and-scraping',
    names: { 'zh-TW': '搜尋與爬取實戰', en: 'Search and Scraping in Practice' },
    descriptions: {
      'zh-TW': '把資料從外面弄進來的整條路：搜尋要租雲端 API 還是自己架、爬取工具怎麼選、被反爬擋住怎麼辦，最後怎麼把這些接成一條研究流程。每篇談一個決定，讀完能拼出一套自己的取得管道。',
      en: 'The full path for getting data in from outside: renting a cloud search API versus self-hosting one, choosing among the scraping tools, what to do when anti-bot defenses block you, and how to wire it all into a research pipeline. One decision per post.',
    },
  },
  {
    slug: 'ai-agent-systems',
    names: { 'zh-TW': 'AI Agent 實戰', en: 'AI Agent Systems in Practice' },
    descriptions: {
      'zh-TW': '聚焦 AI Agent 的 context、harness、工作流與組織型協作，整理成一條可複用的工程實戰脈絡。',
      en: 'A practical series on AI agent systems, covering context, harness design, workflows, and multi-agent collaboration.',
    },
  },
  {
    // slug 沿用先前 fallback 產生的 'agent'，改名會動到已發佈的 URL
    slug: 'agent',
    names: { 'zh-TW': 'Agent 生產線', en: 'The Agent Production Line' },
    descriptions: {
      'zh-TW': '把 agent 當成一條生產線來看：概念界線、模型與 harness 的分工、context 與記憶、企業案例、安全、協定層，以及 RAG 的三種形態。',
      en: 'Reading agents as a production line: where the concept ends, how model and harness divide the work, context and memory, enterprise cases, security, the protocol layer, and the three shapes of RAG.',
    },
  },
  {
    slug: 'drone-industry',
    names: { 'zh-TW': '無人機產業拆解', en: "Taiwan's Drone Industry, Taken Apart" },
    descriptions: {
      'zh-TW': '把無人機產業拆成可查證的層：從產業地圖與供應鏈缺口，到續航物理、飛控與遙控鏈路原始碼，再到台灣的法規授權、採購紀錄與反制困境。每一篇都從一手材料算起或讀起。',
      en: 'Taking the drone industry apart into verifiable layers — from the industry map and the supply-chain gap, through endurance physics and flight-controller and radio-link source code, to Taiwan’s regulatory authority, procurement records and counter-drone deadlock. Every post starts from primary material.',
    },
  },
  {
    slug: 'cs230',
    names: { 'zh-TW': 'Stanford CS230 導讀', en: 'Reading Stanford CS230' },
    descriptions: {
      'zh-TW':
        '把 Stanford CS230（2025 秋季）九講逐講讀完：不只記錄課堂講了什麼，也補上課後到現在這領域變了什麼，以及它和站上既有實戰系列的對照。',
      en: 'A lecture-by-lecture reading of Stanford CS230, Autumn 2025 — what was taught, what has changed since, and where it agrees or disagrees with the practice written up elsewhere on this site.',
    },
  },
  {
    slug: 'stanford-cs',
    names: { 'zh-TW': 'Stanford CS 主線課程導讀', en: "Reading Stanford's Main-Line CS Courses" },
    descriptions: {
      'zh-TW': '從學位骨架到 AI、NLP、圖學習與 agent，整理 Stanford CS 主線課程的版本、先修關係與逐課導讀入口。',
      en: 'A map of Stanford CS core courses, from the degree foundations through AI, NLP, graph learning, and agents, with versioned course guides and prerequisites.',
    },
  },
  {
    slug: 'stanford-cs103',
    names: { 'zh-TW': 'Stanford CS103 導讀', en: 'Reading Stanford CS103' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS103：離散數學、邏輯、證明、集合、可計算性，以及它們如何成為後續 CS 課程的共同語言。',
      en: 'A lecture-by-lecture reading of Stanford CS103: discrete mathematics, logic, proofs, sets, computability, and the shared language they provide for later CS courses.',
    },
  },
  {
    slug: 'stanford-cs107',
    names: { 'zh-TW': 'Stanford CS107 導讀', en: 'Reading Stanford CS107' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS107：C、記憶體、組合語言、資料表示與系統除錯，從高階語言一路往機器底層走。',
      en: 'A lecture-by-lecture reading of Stanford CS107: C, memory, assembly, data representation, and systems debugging from high-level code down to the machine.',
    },
  },
  {
    slug: 'stanford-cs109',
    names: { 'zh-TW': 'Stanford CS109 導讀', en: 'Reading Stanford CS109' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS109：機率、隨機變數、推論與模擬，補齊機器學習與資料科學真正會用到的機率底座。',
      en: 'A lecture-by-lecture reading of Stanford CS109: probability, random variables, inference, and simulation as the foundation used by machine learning and data science.',
    },
  },
  {
    slug: 'stanford-cs111',
    names: { 'zh-TW': 'Stanford CS111 導讀', en: 'Reading Stanford CS111' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS111：程序、執行緒、同步、虛擬記憶體、檔案系統與作業系統設計取捨。',
      en: 'A lecture-by-lecture reading of Stanford CS111: processes, threads, synchronization, virtual memory, file systems, and operating-system design trade-offs.',
    },
  },
  {
    slug: 'stanford-cs161',
    names: { 'zh-TW': 'Stanford CS161 導讀', en: 'Reading Stanford CS161' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS161 Winter 2026：演算法設計、正確性證明與複雜度分析，完整對齊十八講公開教材。',
      en: 'A lecture-by-lecture reading of Stanford CS161, Winter 2026: algorithm design, correctness proofs, and complexity analysis across all eighteen public lecture units.',
    },
  },
  {
    slug: 'stanford-cs221',
    names: { 'zh-TW': 'Stanford CS221 導讀', en: 'Reading Stanford CS221' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS221：搜尋、馬可夫決策、機器學習、約束滿足與機率模型，建立人工智慧的共同骨架。',
      en: 'A lecture-by-lecture reading of Stanford CS221: search, Markov decision processes, machine learning, constraint satisfaction, and probabilistic models.',
    },
  },
  {
    slug: 'stanford-cs229',
    names: { 'zh-TW': 'Stanford CS229 導讀', en: 'Reading Stanford CS229' },
    descriptions: {
      'zh-TW': '逐章讀 Stanford CS229 的 2026 官方主講義：從監督式學習與深度學習，走到基礎模型、LLM 推理與強化學習，共二十一章，不假裝對應單一學期的逐講進度。',
      en: 'A chapter-by-chapter reading of Stanford CS229’s official 2026 notes, spanning supervised and deep learning, foundation models, LLM reasoning, and reinforcement learning across twenty-one chapters without pretending to reconstruct a single quarter’s lecture schedule.',
    },
  },
  {
    slug: 'stanford-cs336',
    names: { 'zh-TW': 'Stanford CS336 導讀', en: 'Reading Stanford CS336' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS336：從 tokenizer、資料與 scaling，到訓練、平行化、評估與 alignment，拆開語言模型的完整製作流程。',
      en: 'A lecture-by-lecture reading of Stanford CS336: tokenizers, data, scaling, training, parallelism, evaluation, and alignment across the full language-model pipeline.',
    },
  },
  {
    slug: 'stanford-cs124',
    names: { 'zh-TW': 'Stanford CS124 導讀', en: 'Reading Stanford CS124' },
    descriptions: {
      'zh-TW': '逐週讀 Stanford CS124：從語言模型與文字分類，到資訊抽取、問答與語音，追蹤自然語言處理的完整管線。',
      en: 'A week-by-week reading of Stanford CS124: language models, text classification, information extraction, question answering, speech, and the full NLP pipeline.',
    },
  },
  {
    slug: 'stanford-cs228',
    names: { 'zh-TW': 'Stanford CS228 導讀', en: 'Reading Stanford CS228' },
    descriptions: {
      'zh-TW': '逐週讀一個明確版本的 Stanford CS228：機率圖模型、精確與近似推論、參數學習及結構學習。',
      en: 'A week-by-week reading of one explicitly versioned Stanford CS228 offering: probabilistic graphical models, exact and approximate inference, and parameter and structure learning.',
    },
  },
  {
    slug: 'stanford-cs224n',
    names: { 'zh-TW': 'Stanford CS224N 導讀', en: 'Reading Stanford CS224N' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS224N：從詞向量、序列模型與 Transformer，到大型語言模型、評估與責任議題。',
      en: 'A lecture-by-lecture reading of Stanford CS224N: word vectors, sequence models, Transformers, large language models, evaluation, and responsible NLP.',
    },
  },
  {
    slug: 'stanford-cs224u',
    names: { 'zh-TW': 'Stanford CS224U 導讀', en: 'Reading Stanford CS224U' },
    descriptions: {
      'zh-TW': '逐單元讀 Stanford CS224U：語意表示、自然語言推論、問答與互動式語言系統，明確標示所採歷史學期。',
      en: 'A unit-by-unit reading of a versioned Stanford CS224U offering: semantic representations, natural-language inference, question answering, and interactive language systems.',
    },
  },
  {
    slug: 'stanford-cs224v',
    names: { 'zh-TW': 'Stanford CS224V 導讀', en: 'Reading Stanford CS224V' },
    descriptions: {
      'zh-TW': '逐單元讀 Stanford CS224V 的明確學期版本：對話式虛擬助理的理解、對話管理、生成、評估與部署。',
      en: 'A unit-by-unit reading of one explicitly versioned Stanford CS224V offering: understanding, dialogue management, generation, evaluation, and deployment for conversational assistants.',
    },
  },
  {
    slug: 'stanford-cs224w',
    names: { 'zh-TW': 'Stanford CS224W 導讀', en: 'Reading Stanford CS224W' },
    descriptions: {
      'zh-TW': '逐講讀 Stanford CS224W：圖的表示、網路科學、圖神經網路、知識圖譜與可擴展圖學習。',
      en: 'A lecture-by-lecture reading of Stanford CS224W: graph representation, network science, graph neural networks, knowledge graphs, and scalable graph learning.',
    },
  },
  {
    slug: 'stanford-cs329z',
    names: { 'zh-TW': 'Stanford CS329Z 導讀', en: 'Reading Stanford CS329Z' },
    descriptions: {
      'zh-TW': '逐講追蹤 Stanford CS329Z 的 agent engineering 課程；只在當期官方材料公開後撰寫，不用預告大綱代替實際講授。',
      en: 'A lecture-by-lecture reading of Stanford CS329Z on agent engineering, written only as current official materials appear rather than treating a tentative syllabus as delivered instruction.',
    },
  },
  {
    slug: 'stanford-cs329a',
    names: { 'zh-TW': 'Stanford CS329A 導讀', en: 'Reading Stanford CS329A' },
    descriptions: {
      'zh-TW': '逐講追蹤 Stanford CS329A 的自我改進式 AI 系統；每篇以可對應官方 session 的材料為準，缺料時明列等待。',
      en: 'A lecture-by-lecture reading of Stanford CS329A on self-improving AI systems, grounded in materials attributable to each official session and paused where evidence is missing.',
    },
  },
  {
    slug: 'mit-6s191',
    names: { 'zh-TW': 'MIT 6.S191 導讀', en: 'Reading MIT 6.S191' },
    descriptions: {
      'zh-TW': '依 2026 官方影片、投影片與實驗程式，讀完 MIT 6.S191 的九講與三個實驗，不混用歷史版本。',
      en: 'Reading all nine lectures and three labs of MIT 6.S191 from the official 2026 videos, slides, and lab code without mixing in earlier offerings.',
    },
  },
  {
    slug: 'berkeley-cs188-spring-2026',
    names: { 'zh-TW': 'Berkeley CS188 Spring 2026', en: 'Berkeley CS188 Spring 2026' },
    descriptions: {
      'zh-TW': '以 P0–P5 六個 projects 為主線，讀 Berkeley CS188 Spring 2026 的搜尋、決策、機率推論、強化學習與機器學習。',
      en: 'Reading Berkeley CS188 Spring 2026 through Projects P0–P5, from search and decision making to probabilistic inference, reinforcement learning, and machine learning.',
    },
  },
  {
    slug: 'berkeley-cs288-spring-2026',
    names: { 'zh-TW': 'Berkeley CS288 Spring 2026', en: 'Berkeley CS288 Spring 2026' },
    descriptions: {
      'zh-TW': '依 18 組公開教材與三份作業，讀 Berkeley CS288 Spring 2026 從 n-gram 到 RAG、reasoning 與 agents 的進階 NLP 路線。',
      en: 'Reading Berkeley CS288 Spring 2026 from n-grams through RAG, reasoning, and agents using its 18 public slide units and three assignments.',
    },
  },
  {
    slug: 'berkeley-cs285-spring-2026',
    names: { 'zh-TW': 'Berkeley CS285 Spring 2026 導讀', en: 'Reading Berkeley CS285 Spring 2026' },
    descriptions: {
      'zh-TW': '依 25 講投影片、九組討論與五份作業，讀 Berkeley CS285 Spring 2026 的深度強化學習路線與算力邊界。',
      en: 'Reading Berkeley CS285 Spring 2026 in deep reinforcement learning through 25 lectures, nine discussions, five assignments, and their compute constraints.',
    },
  },
  {
    slug: 'cmu-10301-machine-learning',
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
    names: { 'zh-TW': '品味修煉', en: 'Cultivating Taste' },
    descriptions: {
      'zh-TW': '把品味拆成可以觀察、辯護與反覆校準的判斷力，系統性記錄在 AI 放大執行力之後，如何訓練選擇什麼值得做、怎樣才算做好的能力。',
      en: 'Treating taste as judgment that can be observed, defended, and recalibrated, with a systematic practice for deciding what is worth making and what good work looks like when AI amplifies execution.',
    },
  },
  {
    // 課程專有名詞，兩語同名
    slug: 'learning-how-to-learn',
    names: { 'zh-TW': 'Learning How to Learn', en: 'Learning How to Learn' },
    descriptions: {
      'zh-TW': '把學習科學的證據與生成式 AI 的實際用法擺在一起審視：哪些做法有證據支持、哪些只是流傳，以及數位之外紙筆還剩什麼。',
      en: 'Auditing the evidence behind learning science alongside how generative AI is actually used — which practices hold up, which merely circulate, and what pen and paper still do better.',
    },
  },
  {
    slug: 'openclaw',
    names: { 'zh-TW': 'OpenClaw 文件導讀', en: 'Reading the OpenClaw Docs' },
    descriptions: {
      'zh-TW':
        '把 OpenClaw 這套自架 AI 閘道器的 300+ 份官方文件拆成 32 篇讀完：從安裝與平台、模型供應商、agent 執行核心與記憶，到 24+ 聊天頻道、沙箱與威脅模型、工具與自動化、Gateway 營運、Plugin 與各種介面。',
      en: 'Reading the 300+ official docs of OpenClaw, a self-hosted AI gateway, across 32 posts — installation and platforms, model providers, the agent runtime and memory, 24+ chat channels, sandboxing and threat model, tools and automation, gateway operations, plugins, and the user interfaces.',
    },
  },
  {
    slug: 'cs146s',
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
    names: {
      'zh-TW': 'AI Engineer 面試日練',
      en: 'AI Engineer Interview Daily Drill',
    },
    descriptions: {
      'zh-TW':
        '每日一篇 AI Engineer 面試練習，依星期輪替七個主題——ML 基礎、深度學習、系統設計、LLM 工程、Coding、論文閱讀、行為面試——從網路抓最新面試題與資源。',
      en: 'A daily AI engineer interview drill rotating through seven topics by day of the week — ML fundamentals, deep learning, system design, LLM engineering, coding, paper reading, and behavioral — pulling the latest interview questions and resources from the web.',
    },
  },
  {
    slug: 'product-builder-interview-daily',
    names: {
      'zh-TW': 'Product Builder 面試日練',
      en: 'Product Builder Interview Daily Drill',
    },
    descriptions: {
      'zh-TW':
        '每日一篇 Product Builder 面試練習，依星期輪替七個主題——產品直覺、指標分析、策略執行、AI 產品設計、成長實驗、技術 PM、行為面試——從網路抓最新案例與面試題。',
      en: 'A daily product builder interview drill rotating through seven topics by day of the week — product sense, metrics, strategy, AI product design, growth, technical PM, and behavioral — pulling the latest case studies and interview questions from the web.',
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

export function getSeriesMeta(name: string) {
  const definition = DEFINITION_BY_NAME.get(name);
  return {
    name,
    slug: definition?.slug ?? slugifySeriesName(name),
    descriptions: definition?.descriptions ?? {
      'zh-TW': `${name} 系列文章`,
      en: `Posts in the ${name} series`,
    },
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
  const grouped = new Map<string, SeriesPost[]>();

  for (const post of posts) {
    if (!isPublishedPost(post, now) || post.data.lang !== lang) continue;
    for (const membership of getPostSeries(post)) {
      const seriesPosts = grouped.get(membership.name) ?? [];
      seriesPosts.push(post);
      grouped.set(membership.name, seriesPosts);
    }
  }

  return Array.from(grouped.entries())
    .map(([name, seriesPosts]) => {
      const orderIn = (post: SeriesPost) =>
        getPostSeries(post).find(m => m.name === name)?.order ?? 0;
      const orderedPosts = [...seriesPosts].sort((a, b) => {
        const orderDiff = orderIn(a) - orderIn(b);
        if (orderDiff !== 0) return orderDiff;
        return a.data.date.getTime() - b.data.date.getTime();
      });
      const meta = getSeriesMeta(name);
      const latestDate = orderedPosts.reduce(
        (latest, post) => post.data.date.getTime() > latest.getTime() ? post.data.date : latest,
        new Date(0),
      );
      return {
        name,
        slug: meta.slug,
        description: meta.descriptions[lang],
        posts: orderedPosts,
        count: orderedPosts.length,
        latestDate,
      };
    })
    .sort((a, b) => b.latestDate.getTime() - a.latestDate.getTime());
}
