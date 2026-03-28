// src/lib/crawl/browser-rendering.ts
// /crawl API 是非同步的：POST 取得 job_id → 輪詢 GET 直到完成

import type { CrawlTarget } from './config';

export interface CrawledPage {
  url: string;
  markdown: string;
  title?: string;
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
  result: {
    id: string;
    status: 'running' | 'completed' | 'cancelled_due_to_timeout' | 'cancelled_due_to_limits' | 'cancelled_by_user' | 'errored';
    pages?: BRJobPage[];
  };
}

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000; // 5 分鐘上限
const MAX_RETRIES = 3;

async function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = MAX_RETRIES
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, options);

    // 成功或 4xx 非 429/403 → 不重試
    if (res.ok || (res.status >= 400 && res.status < 500 && res.status !== 429 && res.status !== 403)) {
      return res;
    }

    // 可重試的錯誤 (403, 429, 5xx)
    if (attempt < retries) {
      const backoff = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      console.warn(`[crawl] HTTP ${res.status} - retrying in ${backoff}ms (attempt ${attempt + 1}/${retries})`);
      await sleep(backoff);
    } else {
      return res; // 最後一次直接回傳讓呼叫端處理
    }
  }

  // 不會到這裡，但 TypeScript 需要
  throw new Error('Unreachable');
}

function extractSuccessfulPages(pages: BRJobPage[]): { successful: CrawledPage[]; failedCount: number } {
  let failedCount = 0;
  const successful: CrawledPage[] = [];

  for (const p of pages) {
    const statusCode = p.metadata?.status_code;

    // 過濾掉 HTTP 錯誤頁面（403、404、5xx 等）
    if (statusCode && statusCode >= 400) {
      failedCount++;
      console.warn(`[crawl] Page ${p.url} returned HTTP ${statusCode}, skipping`);
      continue;
    }

    if (p.markdown && p.markdown.trim().length > 0) {
      successful.push({
        url: p.url,
        markdown: p.markdown,
        title: p.metadata?.title,
      });
    }
  }

  return { successful, failedCount };
}

export async function crawlTarget(
  target: CrawlTarget,
  accountId: string,
  apiToken: string
): Promise<CrawledPage[]> {
  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/browser-rendering`;
  const headers = {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
  };

  // Step 1: 送出 crawl job（優先用 render 設定，失敗時用 render=true 重試）
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

  const submitRes = await fetchWithRetry(`${baseUrl}/crawl`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!submitRes.ok) {
    const text = await submitRes.text();
    throw new Error(`Crawl submit error ${submitRes.status}: ${text}`);
  }

  const submitData = (await submitRes.json()) as { success: boolean; result: string };
  if (!submitData.success) throw new Error(`Crawl submit failed`);

  const jobId = submitData.result;
  console.log(`[crawl] Job submitted: ${jobId} (render=${body.render})`);

  // Step 2: 輪詢直到完成
  const pages = await pollJob(baseUrl, headers, jobId);

  const { successful, failedCount } = extractSuccessfulPages(pages);

  if (failedCount > 0) {
    console.warn(`[crawl] ${target.name}: ${failedCount} pages returned HTTP errors (403/4xx/5xx)`);
  }

  // 如果成功頁面太少且原本沒開 render，用 render=true 重試
  if (successful.length === 0 && !target.render) {
    console.warn(`[crawl] ${target.name}: 0 successful pages, retrying with render=true`);

    const retryBody = { ...body, render: true };
    const retrySubmitRes = await fetchWithRetry(`${baseUrl}/crawl`, {
      method: 'POST',
      headers,
      body: JSON.stringify(retryBody),
    });

    if (!retrySubmitRes.ok) {
      const text = await retrySubmitRes.text();
      throw new Error(`Crawl retry submit error ${retrySubmitRes.status}: ${text}`);
    }

    const retrySubmitData = (await retrySubmitRes.json()) as { success: boolean; result: string };
    if (!retrySubmitData.success) throw new Error(`Crawl retry submit failed`);

    const retryJobId = retrySubmitData.result;
    console.log(`[crawl] Retry job submitted: ${retryJobId} (render=true)`);

    const retryPages = await pollJob(baseUrl, headers, retryJobId);
    const retryResult = extractSuccessfulPages(retryPages);

    if (retryResult.failedCount > 0) {
      console.warn(`[crawl] ${target.name} (retry): ${retryResult.failedCount} pages still returned HTTP errors`);
    }

    return retryResult.successful;
  }

  return successful;
}

async function pollJob(
  baseUrl: string,
  headers: Record<string, string>,
  jobId: string
): Promise<BRJobPage[]> {
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);

    const statusRes = await fetchWithRetry(`${baseUrl}/crawl/${jobId}`, { headers });
    if (!statusRes.ok) {
      const text = await statusRes.text();
      throw new Error(`Crawl status error ${statusRes.status}: ${text}`);
    }

    const statusData = (await statusRes.json()) as BRJobStatusResponse;
    const { status, pages } = statusData.result;

    if (status === 'completed') {
      return pages ?? [];
    }

    if (status !== 'running') {
      throw new Error(`Crawl job ended with status: ${status}`);
    }

    console.log(`[crawl] Job ${jobId} still running...`);
  }

  throw new Error(`Crawl job ${jobId} timed out after ${POLL_TIMEOUT_MS / 1000}s`);
}
