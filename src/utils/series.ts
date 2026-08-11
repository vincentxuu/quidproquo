import type { CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/utils';
import { isPublishedPost, type Post } from './content';

type SeriesPost = CollectionEntry<'posts'>;

interface SeriesDefinition {
  slug: string;
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

const SERIES_DEFINITIONS: Record<string, SeriesDefinition> = {
  'Claude Code 自動化指南': {
    slug: 'claude-code-automation',
    descriptions: {
      'zh-TW': '把 Claude Code 的 hooks、skills、remote agent、Routines 與團隊協作能力整理成可直接上手的實戰系列。',
      en: 'A practical series on Claude Code workflows, including hooks, skills, remote agents, routines, and team-scale automation.',
    },
  },
  'RAG 系統實戰': {
    slug: 'rag-systems',
    descriptions: {
      'zh-TW': '從失敗模式、檢索排序到 multi-agent orchestration，整理一條可落地的 RAG 系統設計路線。',
      en: 'A structured path through production RAG design, from failure modes and ranking to multi-agent orchestration.',
    },
  },
  '文件解析實戰': {
    slug: 'document-parsing',
    descriptions: {
      'zh-TW': '把文件變成 LLM 可讀內容的三層階梯——轉換、抽取、解析。從選層邏輯到 MarkItDown、anydoc、MinerU 等各層工具的取捨比較。',
      en: 'The three-layer ladder for turning documents into LLM-readable content — conversion, extraction, and parsing. From picking the right layer to comparing MarkItDown, anydoc, MinerU, and the rest.',
    },
  },
  'AI Agent 實戰': {
    slug: 'ai-agent-systems',
    descriptions: {
      'zh-TW': '聚焦 AI Agent 的 context、harness、工作流與組織型協作，整理成一條可複用的工程實戰脈絡。',
      en: 'A practical series on AI agent systems, covering context, harness design, workflows, and multi-agent collaboration.',
    },
  },
  '無人機拆解': {
    slug: 'drone-teardown',
    descriptions: {
      'zh-TW': '把無人機拆成可查證的層：從產業地圖與供應鏈缺口，到續航物理、飛控與遙控鏈路原始碼，再到台灣的法規授權、採購紀錄與反制困境。每一篇都從一手材料算起或讀起。',
      en: 'Taking drones apart into verifiable layers — from the industry map and supply-chain gap, through endurance physics and flight-controller and radio-link source code, to Taiwan’s regulatory authority, procurement records and counter-drone deadlock. Every post starts from primary material.',
    },
  },
  'Drone Teardown': {
    slug: 'drone-teardown-en',
    descriptions: {
      'zh-TW': '「無人機拆解」系列的英文版。',
      en: 'Taking drones apart into verifiable layers — from the industry map and supply-chain gap, through endurance physics and flight-controller and radio-link source code, to Taiwan’s regulatory authority, procurement records and counter-drone deadlock. Every post starts from primary material.',
    },
  },
  'Agent 生產線': {
    // slug 沿用先前 fallback 產生的 'agent'，改名會動到已發佈的 URL
    slug: 'agent',
    descriptions: {
      'zh-TW': '把 agent 當成一條生產線來看：概念界線、模型與 harness 的分工、context 與記憶、企業案例、安全、協定層，以及 RAG 的三種形態。',
      en: 'Reading agents as a production line: where the concept ends, how model and harness divide the work, context and memory, enterprise cases, security, the protocol layer, and the three shapes of RAG.',
    },
  },
  'Learning How to Learn': {
    slug: 'learning-how-to-learn',
    descriptions: {
      'zh-TW': '把學習科學的證據與生成式 AI 的實際用法擺在一起審視：哪些做法有證據支持、哪些只是流傳，以及數位之外紙筆還剩什麼。',
      en: 'Auditing the evidence behind learning science alongside how generative AI is actually used — which practices hold up, which merely circulate, and what pen and paper still do better.',
    },
  },
  'Claude Code Automation Guide': {
    slug: 'claude-code-automation-guide',
    descriptions: {
      'zh-TW': '「Claude Code 自動化指南」系列的英文版。',
      en: 'A practical series on Claude Code workflows, including hooks, skills, remote agents, routines, and team-scale automation.',
    },
  },
};

function slugifySeriesName(name: string): string {
  const asciiSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return asciiSlug || encodeURIComponent(name).toLowerCase();
}

export function getSeriesMeta(name: string) {
  const definition = SERIES_DEFINITIONS[name];
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
  const matchedEntry = Object.entries(SERIES_DEFINITIONS).find(([, definition]) => definition.slug === slug);
  if (matchedEntry) {
    const [name] = matchedEntry;
    return getSeriesMeta(name);
  }

  return undefined;
}

export function getSeriesHref(name: string, lang: Lang): string {
  const { slug } = getSeriesMeta(name);
  return `${lang === 'en' ? '/en' : ''}/series/${slug}`;
}

export function getSeriesSummaries(posts: Post[], lang: Lang, now = new Date()): SeriesSummary[] {
  const grouped = new Map<string, SeriesPost[]>();

  for (const post of posts) {
    if (!isPublishedPost(post, now) || post.data.lang !== lang || !post.data.series) continue;
    const seriesPosts = grouped.get(post.data.series.name) ?? [];
    seriesPosts.push(post);
    grouped.set(post.data.series.name, seriesPosts);
  }

  return Array.from(grouped.entries())
    .map(([name, seriesPosts]) => {
      const orderedPosts = [...seriesPosts].sort((a, b) => {
        const orderDiff = (a.data.series?.order ?? 0) - (b.data.series?.order ?? 0);
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
