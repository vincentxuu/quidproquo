// src/lib/crawl/browser-rendering.ts
// /crawl API 是非同步的：POST 取得 job_id → 輪詢 GET 直到完成

import type { CrawlTarget } from './config';

export interface CrawledPage {
  url: string;
  markdown: string;
  title?: string;
  status?: string;
  statusCode?: number;
}

export interface CrawlRunResult {
  jobId: string;
  pages: CrawledPage[];
  statusCounts: Record<string, number>;
  skippedPages: number;
}

export interface CrawlTargetOptions {
  modifiedSince?: number;
}

interface BRCrawlRequest {
  url: string;
  formats: string[];
  limit: number;
  render: boolean;
  source: string;
  maxAge: number;
  options: {
    includePatterns: string[];
  };
  modifiedSince?: number;
}

interface BRJobPage {
  url: string;
  status: string;
  markdown?: string;
  metadata?: {
    title?: string;
    status_code?: number;
  };
}

interface BRJobStatusResponse {
  success: boolean;
  errors?: Array<{ message?: string; code?: number }>;
  result: {
    id: string;
    status: 'running' | 'completed' | 'cancelled_due_to_timeout' | 'cancelled_due_to_limits' | 'cancelled_by_user' | 'errored';
    pages?: BRJobPage[];
  };
}

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000; // 5 分鐘上限

function formatCloudflareErrors(errors: Array<{ message?: string; code?: number }> | undefined): string {
  if (!errors || errors.length === 0) return 'unknown Cloudflare API error';
  return errors.map(error => error.message ?? `Cloudflare error ${error.code ?? 'unknown'}`).join('; ');
}

export function createCrawlRequest(target: CrawlTarget, options: CrawlTargetOptions = {}): BRCrawlRequest {
  const body: BRCrawlRequest = {
    url: target.url,
    formats: ['markdown'],
    limit: target.limit,
    render: target.render,
    source: 'sitemaps',
    maxAge: 604800, // 7 天快取
    options: {
      includePatterns: target.includePatterns,
    },
  };

  if (options.modifiedSince !== undefined) {
    body.modifiedSince = options.modifiedSince;
  }

  return body;
}

function countStatuses(pages: BRJobPage[] = []): Record<string, number> {
  return pages.reduce<Record<string, number>>((counts, page) => {
    const status = page.status || 'unknown';
    counts[status] = (counts[status] ?? 0) + 1;
    return counts;
  }, {});
}

async function getSkippedPageCount(baseUrl: string, jobId: string, headers: Record<string, string>): Promise<number> {
  try {
    const res = await fetch(`${baseUrl}/crawl/${jobId}?status=skipped`, { headers });
    if (!res.ok) return 0;
    const data = (await res.json()) as BRJobStatusResponse;
    return data.result.pages?.length ?? 0;
  } catch {
    return 0;
  }
}

export async function crawlTarget(
  target: CrawlTarget,
  accountId: string,
  apiToken: string,
  options: CrawlTargetOptions = {}
): Promise<CrawlRunResult> {
  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/browser-rendering`;
  const headers = {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
  };

  // Step 1: 送出 crawl job
  const body = createCrawlRequest(target, options);

  const submitRes = await fetch(`${baseUrl}/crawl`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!submitRes.ok) {
    const text = await submitRes.text();
    throw new Error(`Crawl submit error ${submitRes.status}: ${text}`);
  }

  const submitData = (await submitRes.json()) as {
    success: boolean;
    result: string | { id?: string };
    errors?: Array<{ message?: string; code?: number }>;
  };
  if (!submitData.success) throw new Error(`Crawl submit failed: ${formatCloudflareErrors(submitData.errors)}`);

  const jobId = typeof submitData.result === 'string' ? submitData.result : submitData.result.id;
  if (!jobId) throw new Error('Crawl submit failed: missing job id');

  console.log(`[crawl] Job submitted: ${jobId}`);

  // Step 2: 輪詢直到完成
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));

    const statusRes = await fetch(`${baseUrl}/crawl/${jobId}`, { headers });
    if (!statusRes.ok) {
      const text = await statusRes.text();
      throw new Error(`Crawl status error ${statusRes.status}: ${text}`);
    }

    const statusData = (await statusRes.json()) as BRJobStatusResponse;
    if (!statusData.success) {
      throw new Error(`Crawl status failed: ${formatCloudflareErrors(statusData.errors)}`);
    }

    const { status, pages } = statusData.result;

    if (status === 'completed') {
      const skippedPages = await getSkippedPageCount(baseUrl, jobId, headers);
      const completedPages = (pages ?? [])
        .filter(p => p.markdown && p.markdown.trim().length > 0)
        .map(p => ({
          url: p.url,
          markdown: p.markdown!,
          title: p.metadata?.title,
          status: p.status,
          statusCode: p.metadata?.status_code,
        }));

      return {
        jobId,
        pages: completedPages,
        statusCounts: countStatuses(pages),
        skippedPages,
      };
    }

    if (status !== 'running') {
      throw new Error(`Crawl job ended with status: ${status}`);
    }

    console.log(`[crawl] Job ${jobId} still running...`);
  }

  throw new Error(`Crawl job ${jobId} timed out after ${POLL_TIMEOUT_MS / 1000}s`);
}
