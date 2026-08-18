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
];

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

  return asciiSlug || encodeURIComponent(name).toLowerCase();
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
      return {
        name,
        slug: meta.slug,
        description: meta.descriptions[lang],
        posts: orderedPosts,
        count: orderedPosts.length,
        latestDate: orderedPosts[orderedPosts.length - 1]?.data.date ?? new Date(0),
      };
    })
    .sort((a, b) => b.latestDate.getTime() - a.latestDate.getTime());
}
