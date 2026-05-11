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
  'AI Agent 實戰': {
    slug: 'ai-agent-systems',
    descriptions: {
      'zh-TW': '聚焦 AI Agent 的 context、harness、工作流與組織型協作，整理成一條可複用的工程實戰脈絡。',
      en: 'A practical series on AI agent systems, covering context, harness design, workflows, and multi-agent collaboration.',
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
