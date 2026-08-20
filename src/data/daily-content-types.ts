export type DailyChannelGroup = 'briefings' | 'sources' | 'watch' | 'prep';

export interface DailyChannel {
  id: string;
  group: DailyChannelGroup;
  label: string;
  labelEn: string;
  seriesNames: readonly string[];
  tags: readonly string[];
}

export const DAILY_CHANNELS = [
  {
    id: 'daily',
    group: 'briefings',
    label: '綜合日報',
    labelEn: 'Daily report',
    seriesNames: ['AI 日報', 'AI Agent Daily'],
    tags: [],
  },
  {
    id: 'weekly',
    group: 'briefings',
    label: '週回顧',
    labelEn: 'Weekly review',
    seriesNames: ['AI Agent 週回顧', 'AI Agent Weekly Review'],
    tags: ['weekly'],
  },
  {
    id: 'region',
    group: 'briefings',
    label: '區域專題',
    labelEn: 'Regional focus',
    seriesNames: ['AI Region Focus'],
    tags: ['region'],
  },
  {
    id: 'arxiv',
    group: 'sources',
    label: 'Arxiv 論文',
    labelEn: 'Arxiv papers',
    seriesNames: ['AI Agent Arxiv Digest'],
    tags: ['arxiv'],
  },
  {
    id: 'github',
    group: 'sources',
    label: 'GitHub 趨勢',
    labelEn: 'GitHub trends',
    seriesNames: ['AI Agent GitHub Digest'],
    tags: ['github'],
  },
  {
    id: 'model-card',
    group: 'watch',
    label: '模型動態',
    labelEn: 'Model releases',
    seriesNames: ['AI Model Tracker'],
    tags: ['model-release'],
  },
  {
    id: 'security',
    group: 'watch',
    label: '資安警報',
    labelEn: 'Security alerts',
    seriesNames: ['AI Security Alert'],
    tags: ['security'],
  },
  {
    id: 'benchmark',
    group: 'watch',
    label: 'Benchmark',
    labelEn: 'Benchmarks',
    seriesNames: ['AI Benchmark Watch'],
    tags: ['benchmark'],
  },
  {
    id: 'framework',
    group: 'watch',
    label: '框架更新',
    labelEn: 'Frameworks',
    seriesNames: ['AI Framework Changelog'],
    tags: ['framework'],
  },
  {
    id: 'tool',
    group: 'watch',
    label: '工具推薦',
    labelEn: 'Tools',
    seriesNames: ['AI Tool of the Day'],
    tags: ['tool'],
  },
  {
    id: 'funding',
    group: 'watch',
    label: '融資動態',
    labelEn: 'Funding',
    seriesNames: ['AI Agent Funding'],
    tags: ['funding'],
  },
  {
    id: 'pricing',
    group: 'watch',
    label: '定價追蹤',
    labelEn: 'Pricing',
    seriesNames: ['AI Pricing Watch'],
    tags: ['pricing'],
  },
  {
    id: 'ai-interview',
    group: 'prep',
    label: 'AI Engineer 面試',
    labelEn: 'AI Engineer Interview',
    seriesNames: ['AI Engineer 面試日練', 'AI Engineer Interview Daily Drill'],
    tags: ['ai-engineer-interview'],
  },
  {
    id: 'product-interview',
    group: 'prep',
    label: 'Product Builder 面試',
    labelEn: 'Product Builder Interview',
    seriesNames: ['Product Builder 面試日練', 'Product Builder Interview Daily Drill'],
    tags: ['product-builder-interview'],
  },
] as const satisfies readonly DailyChannel[];

export type DailyChannelId = (typeof DAILY_CHANNELS)[number]['id'];

const SERIES_TO_CHANNEL = new Map<string, DailyChannelId>(
  DAILY_CHANNELS.flatMap(channel =>
    channel.seriesNames.map(seriesName => [seriesName.toLocaleLowerCase(), channel.id] as const)
  )
);

export function getDailyChannelId(
  seriesName?: string,
  tags: readonly string[] = []
): DailyChannelId {
  const normalizedSeries = seriesName?.trim().toLocaleLowerCase();
  if (normalizedSeries) {
    const exactMatch = SERIES_TO_CHANNEL.get(normalizedSeries);
    if (exactMatch) return exactMatch;
  }

  const normalizedTags = new Set(tags.map(tag => tag.toLocaleLowerCase()));
  const tagMatch = DAILY_CHANNELS.find(channel =>
    channel.tags.some(tag => normalizedTags.has(tag))
  );

  return tagMatch?.id ?? 'daily';
}

export function countDailyChannels(
  posts: ReadonlyArray<{ seriesName?: string; tags?: readonly string[] }>
): Record<DailyChannelId, number> {
  const counts = Object.fromEntries(
    DAILY_CHANNELS.map(channel => [channel.id, 0])
  ) as Record<DailyChannelId, number>;

  for (const post of posts) {
    counts[getDailyChannelId(post.seriesName, post.tags)] += 1;
  }

  return counts;
}
