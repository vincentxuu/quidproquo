---
title: "Apify Complete Guide: How Actors, Tasks, Schedules, and Datasets Form a Scraping Platform"
date: 2026-08-21
category: ai
type: guide
tags: [apify, web-scraping, browser-automation, data-pipeline, python]
lang: en
tldr: "Apify is not a single crawler. It packages scraping programs as Actors, saves reusable configurations as Tasks, triggers them with Schedules, and delivers results through Datasets. It fits teams that do not want to operate queues, schedulers, and workers, but Actor fees, compute, proxies, storage, and transfer all draw from the same platform budget."
description: "A practical guide to Apify Actors, Tasks, Schedules, Datasets, Request Queues, and the Python API, including free-plan limits, cost boundaries, error handling, and when Crawl4AI, Scrapy, or self-hosted workers are a better fit."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-apify-actor-platform-guide)

[Apify](https://docs.apify.com/actors) is neither a new CSS selector system nor merely a cloud crawler. It is a scraping and automation execution platform: code becomes an Actor, reusable inputs become Tasks, Schedules trigger runs, and results flow into Datasets or other built-in stores.

The useful question is therefore not just “can it retrieve this page?” It is “should execution, scheduling, result storage, proxies, and failure notifications move onto one platform?” If you only need to read one known URL locally, start with the [Crawl4AI guide](/posts/ai/2026-08-21-crawl4ai-complete-guide-en). Apify becomes valuable when a scraping job needs to become a repeatable service.

This article reflects official documentation and public pricing checked on August 21, 2026. It does not claim results from rented Actors or a large production crawl.

## An Actor is a cloud program with an input and output contract

Apify defines an [Actor](https://docs.apify.com/actors) as a serverless cloud program that accepts structured JSON, performs work, and may produce structured output. An Actor can be a crawler, browser automation job, transformation service, or an orchestrator that calls other Actors.

An Actor is more than source code. It can include a Dockerfile, README, input and output schemas, version metadata, and access to platform storage. The schemas let Apify Console render a form and tell API callers which fields the program expects.

There are two common ways to obtain one:

- Use an Actor published in Apify Store for fast validation.
- Build your own with JavaScript, Python, Crawlee, or a custom Docker image when code and output contracts must remain under your control.

Store Actor quality and pricing are controlled by each publisher. Store convenience does not guarantee that an output schema, maintenance cadence, or target site's policies will remain stable. Before putting one behind an agent, pin the Actor version, keep a test input, and validate the output fields.

## Actors, Tasks, and Schedules have different responsibilities

It is easy to treat all three as “the scraper.” Their actual roles differ:

| Component | What it preserves | Best use |
|---|---|---|
| Actor | Code, schemas, and versions | Define what a job can do |
| Task | Fixed input and run options for an Actor | Reuse configurations per site or customer |
| Schedule | Cron, timezone, and the Actor or Task to trigger | Run an already-tested job periodically |

An [Actor Task](https://docs.apify.com/actors/running/tasks) does not copy the program. It stores input, timeout, memory, and related run settings. One product crawler can therefore have separate “Taiwan daily pricing” and “Japan weekly inventory” Tasks without forking the Actor.

A [Schedule](https://docs.apify.com/actors/running/schedules) triggers the Task. It supports cron expressions, timezones, and daylight-saving transitions. The official documentation also warns that system load can delay a run, so this is periodic automation rather than a hard real-time guarantee.

The control plane looks like this:

```text
Actor version
    └── Task: fixed input, memory, timeout
            └── Schedule: cron, timezone
                    └── Run: one execution
                            ├── Dataset: tabular results
                            ├── Key-value store: files and arbitrary values
                            └── Request queue: pending URLs
```

## Run an Actor and retrieve its Dataset with Python

The official Python client provides synchronous and asynchronous interfaces and uses exponential backoff for failed or rate-limited requests. Install it with:

```bash
pip install apify-client
```

Keep the token in an environment variable rather than frontend code or a commit:

```bash
export APIFY_TOKEN="apify_api_..."
```

This example starts an Actor, waits for completion, and reads the run's default Dataset:

```python
import os
from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

actor = client.actor("username/actor-name")
run = actor.call(
    run_input={
        "startUrls": [{"url": "https://example.com"}],
        "maxPagesPerCrawl": 20,
    },
    memory_mbytes=1024,
    timeout_secs=600,
)

if run is None:
    raise RuntimeError("Actor did not return a completed run")

dataset = client.dataset(run.default_dataset_id)
items = dataset.list_items(clean=True).items

for item in items:
    print(item)
```

`actor.call()` waits synchronously. An interactive API should not remain blocked indefinitely. Start the job asynchronously, persist the run ID, and collect the result through a webhook or status polling. Apify webhooks expose run events such as `SUCCEEDED`, `FAILED`, `ABORTED`, and `TIMED-OUT`; the receiver should process each run ID idempotently.

The `run_input` above demonstrates the payload shape only. Actual fields come from the selected Actor's input schema and are not portable across all Store Actors.

## Do not collapse the three storage types into one

[Apify Storage](https://docs.apify.com/storage) provides three structures:

| Storage | Good for | Poor fit for |
|---|---|---|
| Dataset | One structured record per row, exported as JSON, CSV, or Excel | Arbitrary large binaries or a crawl frontier |
| Key-value store | JSON, HTML, images, files, and checkpoints | Large result sets that need row-oriented access |
| Request queue | URLs, HTTP methods, unique keys, and crawl metadata | Final analytical output |

Every run receives default stores. Unnamed stores follow retention policies; use named storage or export downstream when results must persist. Official documentation says named stores are retained indefinitely, although storage and operation charges still apply.

Datasets and key-value stores permit concurrent writers, and write order is not guaranteed. If order or versions matter downstream, include `source_url`, `retrieved_at`, `run_id`, and a content hash in each record instead of treating Dataset row order as event order.

## A Schedule is a trigger, not a freshness strategy

Setting `@daily` only means the job starts daily. It does not prove that the source was updated. A production workflow still needs to:

1. Limit pages, time, and allowed domains in the Task.
2. Validate expected Dataset fields and record counts after a success webhook.
3. Classify failure events instead of retrying permanent `401` or `403` responses forever.
4. Upsert by canonical URL and content hash, with tombstones for removed pages.

A concrete first step is to run the Task manually and preserve one known-good output. Enable its Schedule only after schema validation passes. Apify's scheduling documentation similarly requires an Actor or Task to be prepared and tested first.

When the real question is which page deserves a recrawl, add sitemap, RSS, webhook, or change-detection signals. Apify supplies execution infrastructure; it does not define the freshness SLA for your data.

## Actor price is only one part of cost

According to [Apify's public pricing](https://apify.com/pricing), the Free plan included USD 5 of monthly prepaid usage on the verification date and required no credit card. Service stops until the next billing cycle after that budget is exhausted, and unused usage does not roll over. Paid plans can incur overage after prepaid usage is consumed, so configure a spending limit in Billing.

A run may charge several layers:

- The Actor's pay-per-event or pay-per-usage model.
- Compute units derived from memory and run duration.
- Residential, datacenter, or SERP proxies.
- Dataset, key-value store, and request-queue storage operations.
- Internal and external data transfer.
- Waste caused by timeouts, retries, or broken extraction rules.

Do not divide “USD 5 per month” by an estimated page count and present it as a cost guarantee. Run a representative Task at small scale, then inspect the compute, proxy, storage, and transfer breakdown in Billing. Different site types can produce very different totals.

## When Apify fits

It fits when:

- You want a ready-made scraper plus an API, scheduling, and result storage.
- You have crawler code but do not want to operate workers, cron, queues, and run history.
- Multiple Tasks share one Actor while isolating per-site or per-customer input.
- Completion webhooks should feed a warehouse or agent pipeline.

It is a poor fit when:

- A few known URLs can be handled locally or by one worker.
- Data cannot leave infrastructure you control.
- You need complete control over proxies, browser versions, or network behavior.
- Third-party Store maintenance and layered pricing are unacceptable.

Apify's tradeoff is straightforward: it productizes the unglamorous infrastructure around a crawler. The saved work is not selector authoring but deployment, scheduling, storage, notifications, and billing integration. The cost is platform dependency and the need to understand several billing layers at once.

## References

- [Apify Actors](https://docs.apify.com/actors)
- [Apify Actor tasks](https://docs.apify.com/actors/running/tasks)
- [Apify Actor and task schedules](https://docs.apify.com/actors/running/schedules)
- [Apify Storage](https://docs.apify.com/storage)
- [Apify API client for Python](https://docs.apify.com/api/client/python/docs)
- [Apify pricing](https://apify.com/pricing)
- [On this site: AI web scraping tools landscape](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape-en)
- [On this site: Choosing free search and scraping tools](/posts/ai/2026-08-21-free-search-scraping-tools-en)
- [On this site: Crawl4AI complete guide](/posts/ai/2026-08-21-crawl4ai-complete-guide-en)
