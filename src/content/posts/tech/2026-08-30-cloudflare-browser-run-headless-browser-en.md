---
title: "How to Use Cloudflare Browser Run: Headless Chrome from Workers"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, browser-run, workers, scraping, screenshots, automation, agents]
lang: en
tldr: "Browser Run gives Workers access to Cloudflare-managed headless Chrome. Quick Actions fit one-shot tasks such as screenshots, PDFs, HTML, JSON, and crawls; Browser Sessions fit Puppeteer, Playwright, CDP, and Stagehand automation where you need full control."
description: "A practical guide to Cloudflare Browser Run: Quick Actions, Browser Sessions, Workers bindings, Puppeteer, Playwright, CDP, limits, pricing, and agent browsing in the Edge Platform and AI Stack."
draft: false
series:
  name: "Cloudflare Edge Platform"
  order: 17
additionalSeries:
  - name: "Cloudflare AI Stack"
    order: 9
---

> 🌏 [中文版](/posts/tech/2026-08-30-cloudflare-browser-run-headless-browser)

Most Workers code only needs `fetch()`. Calling APIs, reading JSON, fetching HTML, and handling webhooks do not require a real browser. Some tasks become awkward with HTTP alone: screenshots, PDFs, client-side rendered pages, JavaScript-heavy sites, interactive flow testing, or agents that need to operate a web page.

[Cloudflare Browser Run](https://developers.cloudflare.com/browser-run/) fills that gap. It lets you control headless Chrome on Cloudflare's global network for browser automation, web scraping, testing, and content generation. It was formerly called Browser Rendering, but Browser Run is a better name: it can render pages, and it can also run Puppeteer, Playwright, CDP, or Stagehand workflows.

In the Edge Platform, Browser Run is the managed browser you reach for when HTTP is not enough. In the AI Stack, it becomes an agent tool: when `fetch()` cannot reach the state you need, or when a task requires clicking, logging in, waiting for UI, or extracting structured data, a real browser becomes useful.

## Choose First: Quick Actions or Browser Sessions

Browser Run has two integration styles.

| Method | What it does | Fit |
|---|---|---|
| Quick Actions | Runs one stateless browser task through REST API or Worker binding | Screenshots, PDFs, HTML, Markdown, links, JSON extraction, crawls |
| Browser Sessions | Controls a browser with Puppeteer, Playwright, CDP, or Stagehand | Complex automation, login flows, tests, agent browsing, reusable sessions |

This choice affects cost, code, and risk. Quick Actions feel like sending a URL in and getting a result back. Browser Sessions give you a real browser, which means you own closing it, reusing it, isolating it, and handling errors.

For a screenshot or PDF, I would start with Quick Actions. For multi-step interaction, cookies, UI clicks, or LLM/agent-driven browsing, I would move to Browser Sessions.

## Quick Actions: One-Shot Browser Tasks

Quick Actions can be called through the REST API. A screenshot request looks like this:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/<accountId>/browser-rendering/screenshot" \
  -H "Authorization: Bearer <apiToken>" \
  -H "Content-Type: application/json" \
  -d '{ "url": "https://example.com" }' \
  --output screenshot.png
```

They can also be used from a Worker with a browser binding:

```jsonc
{
  "browser": {
    "binding": "BROWSER"
  }
}
```

The Worker calls `quickAction()`:

```ts
interface Env {
  BROWSER: BrowserRun;
}

export default {
  async fetch(request, env): Promise<Response> {
    return await env.BROWSER.quickAction("screenshot", {
      url: "https://example.com",
    });
  },
} satisfies ExportedHandler<Env>;
```

The official docs note that `.quickAction()` requires a `compatibility_date` of `2026-03-24` or later. Local development with a real headless browser also uses a remote binding.

Quick Actions are straightforward:

- Generate scheduled website screenshots.
- Turn invoices, reports, or dashboards into PDFs.
- Convert JavaScript-rendered pages into Markdown or HTML.
- Extract links, elements, or structured JSON.
- Crawl a site and feed the results into another pipeline.

I would usually put Quick Actions behind [Queues](/en/posts/tech/2026-08-22-cloudflare-queues-en), instead of making a user request wait directly on a browser. Browser startup and rendering are naturally slower than a normal API call, so background processing is sturdier.

## Browser Sessions: Full Browser Control

Browser Sessions fit more complex automation. Cloudflare supports Puppeteer, Playwright, CDP, and Stagehand. A typical Worker uses a browser binding and Cloudflare's Puppeteer package:

```ts
import puppeteer from "@cloudflare/puppeteer";

interface Env {
  MYBROWSER: Fetcher;
}

export default {
  async fetch(request, env): Promise<Response> {
    const browser = await puppeteer.launch(env.MYBROWSER);

    try {
      const page = await browser.newPage();
      await page.goto("https://example.com");
      const title = await page.title();
      return Response.json({ title });
    } finally {
      await browser.close();
    }
  },
} satisfies ExportedHandler<Env>;
```

The `finally` block matters. The Browser Run limits page explicitly warns that sessions not closed with `browser.close()` keep consuming browser time until idle timeout. The default idle timeout is 60 seconds, and `keep_alive` can extend it up to 10 minutes.

If a browser session should be reused across requests, pair it with [Durable Objects](/en/posts/tech/2026-08-22-cloudflare-durable-objects-en). Durable Objects can store session state, queue operations, and keep one browser from being hit by too many requests. This is also one difference between Browser Run and Containers: Browser Run gives you managed headless Chrome, not an arbitrary Linux runtime.

## Limits: Plan for Browser Time and Concurrency

Browser Run limits are tied to the Workers plan.

Workers Free:

- Browser hours: 10 minutes per day.
- Browser Sessions concurrent browsers: 3 per account.
- Browser Sessions new browser instance rate: 1 every 20 seconds.
- Browser timeout: 60 seconds.
- Quick Actions total requests: 1 every 10 seconds.
- `/crawl` endpoint: 5 crawl jobs per day, up to 100 pages per crawl.

Workers Paid:

- Browser hours: no fixed limit, priced by usage.
- Browser Sessions concurrent browsers: default 200 per account, with higher limits by request.
- Browser Sessions new browser instances: 3 per second.
- Browser timeout: 60 seconds.
- Quick Actions total requests: 30 per second.

Those limits shape the architecture. If a product generates many screenshots, each user request should not launch a new browser. A more stable shape is: Queue receives the job, Durable Object controls concurrency, R2 stores output, and KV or Cache Rules prevents repeated renders.

## Pricing: Quick Actions and Sessions Cost Differently

Browser Run is available on Free and Paid plans. The pricing page splits cost into two dimensions:

- Quick Actions: charged for browser hours only.
- Browser Sessions: charged for browser hours and concurrent browsers.

Workers Free includes 10 minutes of browser hours per day. Workers Paid includes 10 hours per month, then $0.09 per additional hour. Browser Sessions on Paid include 10 concurrent browsers, then $2.00 per additional browser, calculated from the monthly average of daily peak usage.

Quick Actions responses include an `X-Browser-Ms-Used` header. That is useful for cost estimation and for writing usage events into Analytics Engine, so you can see which URL, customer, or task type is consuming browser time.

## Security and Abuse Boundaries

Browser Run can easily become an open proxy. An endpoint that accepts `?url=` invites SSRF, internal network probing, abusive scraping, account misuse, cookie leakage, and cost spikes.

I would start with these controls:

- URL allowlist or domain allowlist.
- Block private IPs, localhost, and metadata endpoints.
- Rate limit by tenant and user.
- Add queue job timeout and retry caps.
- Store screenshot and PDF outputs in R2, not logs.
- Never share authenticated sessions across tenants.
- Always close Browser Sessions in `try/finally`.

For agent browsing, tool permissions need to be explicit: which sites can be read, whether clicks are allowed, whether form submissions are allowed, whether downloads are allowed, and which outputs need human review. Browser Run gives an agent eyes and hands; the product still has to draw the boundary.

## Difference from Containers

Browser Run answers: "I need a managed browser." [Containers](https://developers.cloudflare.com/containers/) answers: "Workers runtime is not enough; I need my own Linux userspace." Both are escape hatches, but in different directions.

Use Browser Run for page rendering, screenshots, PDFs, and Playwright automation.  
Use Containers for ffmpeg, custom binaries, long-running services, or custom runtimes.

That line prevents Browser Run from becoming generic compute. Browsers are heavy, priced by browser time, and constrained by concurrency and time limits. If `fetch()` is enough, do not open Chrome. If Quick Actions are enough, do not manage a session.

## References

- [Cloudflare Browser Run](https://developers.cloudflare.com/browser-run/)
- [Browser Run get started](https://developers.cloudflare.com/browser-run/get-started/)
- [Browser Run limits](https://developers.cloudflare.com/browser-run/limits/)
- [Browser Run pricing](https://developers.cloudflare.com/browser-run/pricing/)
- [Browser Run Quick Actions](https://developers.cloudflare.com/browser-run/quick-actions/)
- [Browser Run Playwright](https://developers.cloudflare.com/browser-run/playwright/)
- [Browser Run with Durable Objects](https://developers.cloudflare.com/browser-run/how-to/browser-run-with-do/)
