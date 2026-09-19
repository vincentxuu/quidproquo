---
title: "Fixed It Three Times, Broke It Three Ways: Vision PDF Parsing Optimization in Three Acts"
date: 2026-09-19
category: ai
type: debug
tags: [vision-api, pdf-parsing, concurrency, rate-limiting, bedrock, performance, debugging]
lang: en
tldr: "Parsing a 150-page PDF via Vision API took 29 minutes (one page per request). Batching cut it to 1.5×, adding 5-way concurrency brought it down to 24 seconds. One week after launch, a customer uploaded 23 PDFs at once — 70 parallel Bedrock requests triggered full throttling: 90 pages skipped, 5 files failed, 8 stuck. Fixed with Redis-based cluster-wide slots + backoff retries."
description: "A complete debugging record of Vision API PDF parsing — from performance bottleneck to concurrency optimization to a production rate-limiting incident, covering batching strategy, halving-on-failure, concurrency architecture, and throttle degradation design."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-19-vision-pdf-parse-too-fast-for-aws)

## TL;DR

Our AI assistant platform uses [Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html)'s Vision API (Converse API with multimodal input) to parse PDFs. The original architecture sent one page per request — a 150-page PDF took 29 minutes. Three rounds of optimization, then a production meltdown:

1. **Batching** (N pages per request): ~1.5× speedup
2. **Concurrency** (5 batches in flight): 20-page PDF dropped from 139s to 24s
3. **Meltdown**: Customer uploaded 23 PDFs → 14 parsed simultaneously × 5 concurrent = ~70 parallel Converse requests → Bedrock fully throttled

## Context

The platform's knowledge base supports PDF uploads: users drop documents in, the system parses them into markdown, chunks the text, and feeds it into a vector database for RAG retrieval.

For scanned documents and chart-heavy PDFs, text extraction tools (PyMuPDF, docling) fall short. We use Bedrock's Converse API with Vision capability — each page is rendered as an image, sent to Claude, and the model produces structured markdown.

This worked fine for small files. The problem was large ones.

## The Problem: One Page Per Request, 150 Pages = 29 Minutes

The original implementation:

```
for page in pdf.pages:
    image = render_page_to_image(page)
    markdown = bedrock_converse(image, prompt="Convert this page to markdown")
    results.append(markdown)
```

Each Converse request contained one image, waiting for the response before sending the next page. A 150-page PDF on Sonnet took 29 minutes.

The bottleneck was obvious: the Bedrock Converse API supports up to 20 images per request (according to the [official documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference-supported-models-features.html), some models support up to 100), but we were only sending 1.

## First Cut: Batching Pages

Pack multiple PDF page images into a single request, asking the model to separate output with `<!-- Page N -->` markers:

```
prompt = """
Convert the following {n} PDF pages into markdown individually.
Start each page with a <!-- Page N --> marker (N starts from 1).
"""
```

### The Triple Constraint on Batch Size

You can't just set `pages_per_request` to 100. The effective batch size is the minimum of three limits:

| Constraint | Source | Logic |
|-----------|--------|-------|
| Config value | Admin-configured `pages_per_request`, default 10 | Direct read |
| API limit | Bedrock allows up to 100 images per request | `min(config, 100)` |
| Token budget | `max_output_tokens ÷ estimated tokens per page` (default 16,384 ÷ 1,500 ≈ 10) | Prevents output truncation |

### Halving on Failure

Send 10 pages in a batch, and the model might only return 8 page markers — the output was truncated by `max_tokens`. You can't just discard all 10 pages, and you can't trust the first 8 (marker sequence might be incomplete).

Strategy: **halve and retry**.

```
Work stack: [pages 1-10]

→ Send 10 pages, only 8 markers come back (truncated)
→ Discard result, split into [pages 1-5] and [pages 6-10], push back
→ Send 5 pages, success, keep
→ Send 5 pages, truncated again
→ Split into [pages 6-8] and [pages 9-10]
→ ...down to single pages
```

A single page that's still truncated gets kept as-is, marked `<!-- Page N: truncated -->`, with a Sentry warning.

### Result

On Sonnet, 10 pages per batch yielded roughly 1.5× speedup — not 2× because the model's computation for multiple images scales near-linearly; the savings come from network round-trips and request overhead. But combined with the next step (concurrency), batching was essential groundwork.

## Second Cut: Concurrent Batches

Batching reduced 150 requests to 15, but they were still sequential. Next: send multiple batches simultaneously.

### Architecture Decision

| Approach | Pros/Cons | Verdict |
|----------|-----------|---------|
| Celery fan-out | One task per batch, natural parallelism | ❌ Batches from the same document need to merge results, share token accounting, and write cache in the same task |
| asyncio | Native async | ❌ Existing Celery tasks are sync; refactoring scope too large |
| ThreadPoolExecutor | Bounded thread pool | ✅ boto3 client is thread-safe, shareable; results written back by page number, completion order doesn't matter |

Final implementation used `concurrent.futures.ThreadPoolExecutor` with `max_workers` from config (default 5, max 10):

```python
with ThreadPoolExecutor(max_workers=concurrency) as pool:
    futures = {}
    while pending or futures:
        # Fill up in-flight slots
        while len(futures) < concurrency and pending:
            batch = pending.pop()
            ctx = copy_context()
            future = pool.submit(ctx.run, send_batch, batch)
            futures[future] = batch

        # Wait for any to complete
        done, _ = wait(futures, return_when=FIRST_COMPLETED)
        for f in done:
            batch = futures.pop(f)
            result = f.result()
            if result.needs_split:
                # Halve and push back to pending
                pending.extend(batch.halves())
            else:
                # Write results by page number
                for page_num, text in result.pages:
                    output[page_num] = text
```

Note `copy_context()` — each worker thread needs a copy of the caller's `contextvars` for Sentry span propagation to work correctly.

### Benchmark Numbers

Same 20-page PDF, Sonnet, same Bedrock endpoint:

| Config | Requests | Duration | vs. sequential per-page 138.9s |
|--------|----------|----------|-------------------------------|
| 4 pages/batch × 5 concurrent | 5 in flight | **23.8s** | **1/5.8** |
| 10 pages/batch × 5 concurrent | 2 in flight | 48.4s | 1/2.9 |

4 pages per batch × 5 concurrent was the sweet spot: batches small enough to avoid truncation, concurrency high enough to saturate.

## The Meltdown: Week One, 23 PDFs Blew Up Bedrock

One week after launch, an enterprise customer uploaded 23 PDFs to their knowledge base at once.

Our knowledge base upload already supported parallel file processing — one Celery task per file. The problem: **each file already had 5-way internal concurrency**.

```
14 files parsing simultaneously × 5 concurrent per file = 70 simultaneous Bedrock Converse requests
```

Per the [AWS Bedrock quota documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/quotas.html), each AWS account has RPM (Requests Per Minute) and TPM (Tokens Per Minute) limits per model. Our account's quota couldn't handle 70 parallel Vision requests.

### Symptoms

Three failure modes showed up in Sentry:

1. **Pages skipped but status "done"**: A 270-page document had 90 pages throttled and skipped, but the task status showed `done` — because our design was "skip throttled pages, return the rest normally"
2. **DB write failure**: 5 files completed parsing, but when writing token usage to the database, Django's DB connection had been severed from idle timeout (production `CONN_MAX_AGE=0` closes connections after each request, but parsing can run for several minutes)
3. **Stuck in "processing"**: 8 files' Celery tasks threw exceptions after throttle retries exhausted, but task status wasn't properly updated

### Root Cause Analysis

Three layers of problems:

| Layer | Issue | Why it wasn't caught earlier |
|-------|-------|---------------------------|
| Concurrency cap | No cross-file global limit | Dev/test only uploaded 1–2 files at a time, never hitting RPM limits |
| Throttle retry | botocore's built-in retry: only 3 attempts, gives up in seconds | Single-file throttling is transient; multi-file throttling is sustained |
| DB connection | DB connection idle too long during parse | Sequential version ran a few minutes max; concurrent version was fast per file, but queued files could run tasks for much longer |

## The Fix: Three-Layer Defense

### 1. Redis Slot Cluster-Wide Cap

Added `VisionParseSlotService` using Redis atomic operations (INCR + TTL) for cluster-wide slots:

```
Cluster-wide Vision parse task limit = 3
```

- Each Celery task acquires a slot before starting
- If full, requeue (retry after 60-second delay)
- Release slot when task finishes
- Slots have TTL (prevents deadlock if task crashes)

3 files × 5 concurrent per file = at most 15 simultaneous Converse requests, within quota.

### 2. Application-Level Backoff Retry

botocore's built-in retries give up too quickly. Added our own backoff layer:

```python
THROTTLE_BACKOFF = [5, 10, 20]  # seconds

for delay in THROTTLE_BACKOFF:
    result = send_batch(single_page)
    if not is_throttled(result):
        break
    time.sleep(delay)  # Hold the slot, creating backpressure
else:
    mark_page_skipped(page, reason="throttled")
```

Sleeping while holding a concurrency slot creates natural backpressure — when one batch is throttled, others wait, and the overall request rate drops organically.

### 3. DB Connection Refresh

Before writing token usage after parse completion, call `close_old_connections()`:

```python
from django.db import close_old_connections

def _store_vision_token_usage(parse_result):
    close_old_connections()  # Re-establish DB connection
    TokenUsage.objects.create(...)
```

This is a common Django pattern — any long-running task that doesn't touch the DB for a while should call this before its next DB operation.

## Lessons Learned

**Performance optimization must come with rate-limit awareness.** Our three iterations:

| Phase | What we did | What we missed |
|-------|-------------|---------------|
| Batching | Reduced request count | — |
| Concurrency | Compressed per-file latency | Didn't account for multi-file multiplication |
| Throttle fix | Redis slots + backoff | Should have been built into phase two |

From the [AWS Well-Architected Framework Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-interactions-in-a-distributed-system-to-mitigate-or-withstand-failures.html):

> "Implement client-side throttling to prevent a client from overwhelming a service."

This reads as obvious in the docs. It reads very differently when you're staring at 70 throttling errors in Sentry.

Three patterns worth taking away:

1. **Halving on Failure**: When a batch fails, don't discard it — split in half and retry. Worst case degrades to per-item processing, which is no worse than before
2. **Slot-based global caps**: Per-file concurrency is easy to control; cross-file concurrency requires shared state (Redis, DB) for global limits
3. **Long-task DB connections**: Django's `CONN_MAX_AGE=0` + long-running tasks = dead DB connections when you finally write. `close_old_connections()` is the standard fix

## References

- [Amazon Bedrock Converse API — Supported models and features](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference-supported-models-features.html)
- [Amazon Bedrock Service Quotas](https://docs.aws.amazon.com/bedrock/latest/userguide/quotas.html)
- [AWS Well-Architected Framework — Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html)
- [Django — close_old_connections()](https://docs.djangoproject.com/en/5.2/ref/databases/#persistent-connections)
- [Python concurrent.futures — ThreadPoolExecutor](https://docs.python.org/3/library/concurrent.futures.html#threadpoolexecutor)
- [botocore retry behavior](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/retries.html)
