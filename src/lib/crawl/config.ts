// src/lib/crawl/config.ts

export interface CrawlTarget {
  name: string;                  // 顯示名稱（存入 source_name）
  url: string;                   // 爬取起始 URL
  includePatterns: string[];     // 只爬這些路徑（對應 options.includePatterns）
  limit: number;                 // 最多爬幾頁（對應 API 的 limit 欄位）
  render: boolean;               // 是否需要 JS 渲染（靜態文件設 false）
}

export const CRAWL_TARGETS: CrawlTarget[] = [
  {
    name: 'Cloudflare D1',
    url: 'https://developers.cloudflare.com/d1/',
    includePatterns: ['/d1/**'],
    limit: 50,
    render: false,
  },
  {
    name: 'Cloudflare Workers',
    url: 'https://developers.cloudflare.com/workers/',
    includePatterns: ['/workers/**'],
    limit: 100,
    render: false,
  },
  {
    name: 'Cloudflare Vectorize',
    url: 'https://developers.cloudflare.com/vectorize/',
    includePatterns: ['/vectorize/**'],
    limit: 30,
    render: false,
  },
  {
    name: 'Astro Docs',
    url: 'https://docs.astro.build/',
    includePatterns: ['/en/guides/**', '/en/reference/**'],
    limit: 80,
    render: false,
  },
];

// chunk 大小上限（約 500 tokens ≈ 2000 字元）
export const MAX_CHUNK_CHARS = 2000;
