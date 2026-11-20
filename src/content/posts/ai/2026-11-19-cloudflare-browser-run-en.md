---
title: "Cloudflare Browser Run: One REST Call or a Browser Session, What Workers Integration Buys You, and Where the Limits Are"
date: 2026-11-19
category: ai
type: deep-dive
tags: [cloudflare-browser-run, cloudflare-workers, puppeteer, playwright, browser-automation]
lang: en
tldr: "Browser Run (called Browser Rendering until April 2026) works two ways. Quick Actions trade one HTTP request for one output: HTML, a screenshot, a PDF, Markdown, model-extracted JSON, or an asynchronous crawl of a whole site, billed on browser hours only. Browser Sessions control a browser through Puppeteer, Playwright, or raw CDP, allowing multi-step interaction, kept logins, and a live view a person can take over, with a separate concurrency fee. Inside Workers you need no API token and can reuse sessions with Durable Objects. The limits: sessions close after 60 seconds idle (extendable to 20 minutes), traffic is always labeled a bot, there's no IP change or proxy, and Stagehand inside a Worker is supported only at v2.5."
description: "A deep dive into Cloudflare Browser Run: the Quick Actions endpoints (/markdown, /json, /crawl, and more) and billing; Browser Sessions through the Workers binding, the Puppeteer and Playwright forks, and external CDP; session reuse, Live View, and human handoff; Guardrails and outboundByHost; why only Stagehand v2.5 works inside a Worker; what always being labeled a bot means; and pricing and limits."
draft: false
series:
  name: "AI Browser Automation"
  order: 23
---

> :globe: [中文版](/posts/ai/2026-11-19-cloudflare-browser-run)

The [hosting comparison](/posts/ai/2026-11-19-hosted-browser-comparison-en) put Browser Run in the "already on Workers, or only need one-shot output" box. This post takes it apart. In April 2026 it was [renamed](https://blog.cloudflare.com/browser-run-for-ai-agents/) from Browser Rendering and gained a CDP endpoint, Live View, human handoff, and recordings, with the concurrency limit raised from 30 to 120 (200 on the Paid plan today).

This post answers: **when one REST call is enough and when you need a browser session; what running it inside Workers buys you, and where the limits are.**

## Two ways to use it

```diagram
title: Browser Run's two modes
desc: Top row, Quick Actions: your code sends one HTTP request to Browser Run and gets one output back; the browser closes when done. Bottom row, Browser Sessions: a Worker or any environment connects through the binding or CDP to a browser that stays open, allowing multi-step work and a live view a person can take over.
caption: Quick Actions bill browser hours only; Browser Sessions add a fee by concurrent browsers. Guardrails, outboundByHost, Live View, and recording exist only on sessions.
---
<svg viewBox="0 0 640 244">
  <text class="dg-tag" x="24" y="32" dominant-baseline="central">QUICK ACTIONS</text>
  <rect class="dg-box" x="24" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="76" text-anchor="middle" dominant-baseline="central">Your code</text>
  <rect class="dg-box" x="244" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="320" y="68" text-anchor="middle" dominant-baseline="central">Browser Run</text>
  <text class="dg-sub" x="320" y="88" text-anchor="middle" dominant-baseline="central">opens, then closes</text>
  <rect class="dg-box" x="464" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="68" text-anchor="middle" dominant-baseline="central">One output</text>
  <text class="dg-sub" x="540" y="88" text-anchor="middle" dominant-baseline="central">HTML, image, JSON</text>
  <path class="dg-line" d="M176 76H240" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M396 76H460" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="210" y="62" text-anchor="middle" dominant-baseline="central">HTTP</text>

  <text class="dg-tag" x="24" y="148" dominant-baseline="central">BROWSER SESSIONS</text>
  <rect class="dg-box dg-box--accent" x="24" y="164" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="184" text-anchor="middle" dominant-baseline="central">Worker or anywhere</text>
  <text class="dg-sub" x="100" y="204" text-anchor="middle" dominant-baseline="central">Puppeteer, Playwright</text>
  <rect class="dg-box" x="244" y="164" width="152" height="56" rx="6"/>
  <text class="dg-label" x="320" y="184" text-anchor="middle" dominant-baseline="central">Browser stays open</text>
  <text class="dg-sub" x="320" y="204" text-anchor="middle" dominant-baseline="central">many steps, state</text>
  <rect class="dg-box" x="464" y="164" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="184" text-anchor="middle" dominant-baseline="central">Live View</text>
  <text class="dg-sub" x="540" y="204" text-anchor="middle" dominant-baseline="central">a person can step in</text>
  <path class="dg-line dg-line--accent" d="M176 192H240" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M396 192H460" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="210" y="178" text-anchor="middle" dominant-baseline="central">CDP</text>
</svg>
```

## Quick Actions: one request, one output

[Quick Actions](https://developers.cloudflare.com/browser-run/quick-actions/) are a set of REST endpoints: Browser Run opens a browser, loads the page, runs its JavaScript, and returns one kind of result:

| Endpoint | Returns |
|---|---|
| `/content` | The full HTML after JavaScript runs |
| `/screenshot`, `/pdf` | A screenshot, a PDF |
| `/markdown` | The page as Markdown |
| `/snapshot` | Several formats at once (at least two) |
| `/accessibilityTree` | The accessibility tree |
| `/scrape`, `/links` | Content of chosen elements, every link on the page |
| `/json` | Structured data extracted by a model from a prompt or JSON schema |
| `/crawl` | A crawl of a whole site from one URL, asynchronously |

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/browser-run/markdown" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

Inside a Worker you skip the API token and call the binding: `await env.BROWSER.quickAction("content", { url })` (the Worker's compatibility date, which pins the Workers runtime version, must be 2026-03-24 or later; `/crawl` is REST only).

Details worth knowing:

- **`/json` defaults to Llama 3.3 70B on [Workers AI](https://developers.cloudflare.com/browser-run/quick-actions/json-endpoint/)**, billed separately as Workers AI usage; you can list your own models and keys in `custom_ai`, with several models as fallbacks.
- **`/crawl` is an asynchronous job.** You get a job id back and then query results or subscribe to events; it [crawls up to 100,000 pages](https://developers.cloudflare.com/browser-run/quick-actions/crawl-endpoint/) over up to 7 days, and results are kept for 14 days. It honors robots.txt and `crawl-delay`, its User-Agent is fixed at `CloudflareBrowserRenderingCrawler/1.0`, and if a site's Content Signals (its declared allowed uses, such as search or AI training) reject your declared purposes, the request gets a 400. `render: false` (no JavaScript) isn't billed during the beta.
- **You can pass login details.** Cookies, HTTP Basic auth, and custom headers all work, but only to load a page; there's no clicking or multi-step interaction.
- **Billing is browser hours only**, requests that fail with `waitForTimeout` aren't charged, and results are cached for 5 seconds by default.

If you just need some representation of a page, or a crawl of a site that allows crawling, Quick Actions are enough.

## Browser Sessions: interaction and kept state

To click, fill forms, or keep a login across requests, you open a session. Three ways to connect:

- **Cloudflare's forks inside a Worker.** [`@cloudflare/puppeteer`](https://developers.cloudflare.com/browser-run/puppeteer/) (2.0, based on Puppeteer 25.10) and [`@cloudflare/playwright`](https://developers.cloudflare.com/browser-run/playwright/) (1.4, based on Playwright 1.62) are modified to connect to Browser Run. The Puppeteer fork's docs say XPath selectors aren't supported inside a Worker and `page.evaluate()` returns only primitive types; the Playwright fork doesn't support Firefox, Playwright Test (beyond assertions), or video recording, and the docs say that list isn't exhaustive.
- **The binding directly inside a Worker.** Since September 2026 the [binding](https://developers.cloudflare.com/browser-run/reference/browser-binding-api/) has methods like `acquire()`, `connectSession()`, and `getLiveView()`, so you can send CDP without any fork.
- **CDP from anywhere.** Since April 2026 there's an [external CDP endpoint](https://developers.cloudflare.com/browser-run/cdp/) reachable from your laptop, your own servers, or CI; with Playwright, plain `playwright-core` plus `connectOverCDP` and an Authorization header is all it takes, no fork needed. CDP scripts already running against self-hosted Chrome move over by changing one connection URL.

### Sessions get closed

By default a session closes after 60 seconds idle, extendable with `keep_alive` to at most 20 minutes. That's idle time: as long as something keeps happening there's no total lifetime cap, but sessions also close when Browser Run ships a new release. A new browser has none of the previous run's cookies.

The common pattern is [reusing sessions](https://developers.cloudflare.com/browser-run/features/reuse-sessions/): several requests connect to the same browser, each in its own browser context; or a [Durable Object](https://developers.cloudflare.com/browser-run/how-to/browser-run-with-do/) (a long-lived, stateful object in Workers) holds the session, keeps it alive with an alarm, and stores login state in KV, Workers' key-value store. Reuse skips the cold start: in a third-party test on example.com, a new browser had a median of 997 ms and a reused one 242 ms (by [Gologin](https://gologin.com/blog/cloudflare-browser-rendering/), which sells a competing product).

### Features that exist only on sessions

- **[Live View](https://developers.cloudflare.com/browser-run/features/live-view/) and [human handoff](https://developers.cloudflare.com/browser-run/features/human-in-the-loop/).** Open a URL to see the browser and step in if needed; a script can send `Cloudflare.handoff` to ask a person for help and wait for `Cloudflare.handoffComplete` before continuing. A Live View URL carries a signature, so anyone with the full URL can connect (you can also generate read-only links); don't leak it.
- **Recording.** `recording: true` captures DOM changes and input events for replay with rrweb.
- **[Guardrails](https://developers.cloudflare.com/browser-run/features/guardrails/).** Restrict a session's HTTP and HTTPS requests to allowed hostnames (up to 50 listed directly, plus predefined domain sets); the policy is fixed for the session's lifetime, and neither Quick Actions nor Kitesurf supports it.
- **[outboundByHost](https://developers.cloudflare.com/browser-run/features/outbound-workers/).** Route the browser's requests for chosen hostnames to your own Worker, to reach an internal service or add authentication. It works for `http://` only; HTTPS requests don't go through it.

## Why only Stagehand v2.5 works inside a Worker

This closes a thread the series opened in the [Stagehand v4 post](/posts/ai/2026-11-18-stagehand-v4-en). From the [official docs](https://developers.cloudflare.com/browser-run/stagehand/):

> Browser Run currently supports `@browserbasehq/stagehand` `v2.5.x` only. Stagehand `v3` and later are not supported because they are not Playwright-based.

Using Stagehand inside a Worker relies on swapping `playwright` for the `@cloudflare/playwright` fork, which handles how Workers connect. Stagehand v2 was built on Playwright, so that worked; from v3, Stagehand writes its own CDP layer (why is in the [driver post](/posts/ai/2026-11-18-cdp-vs-playwright-driver-en)), and swapping Playwright no longer helps. Stagehand's issues pin down the specifics: v3 connects to CDP with Node's `ws` package, which Workers doesn't support ([#1381](https://github.com/browserbase/stagehand/issues/1381)); after 3.2 it also uses `AsyncLocalStorage.enterWith()`, which Workers deliberately doesn't implement ([#2055](https://github.com/browserbase/stagehand/issues/2055)). The Stagehand maintainers replied that they'd rather Workers support `ws` than change the library; as of November 2026, the PR fixing #2055 hasn't been merged and Cloudflare's docs mention no v3 support.

The docs' restriction is about integration inside a Worker. Whether running v3 or later in Node outside a Worker and connecting through the CDP endpoint is supported, the docs don't say.

For coding agents, Cloudflare has a [fork of Playwright MCP](https://developers.cloudflare.com/browser-run/playwright/playwright-mcp/), currently synced to upstream 0.0.30 and far behind upstream; you can also point Google's chrome-devtools-mcp at the CDP endpoint with `--wsEndpoint` ([setup](https://developers.cloudflare.com/browser-run/cdp/mcp-clients/)).

## Always a bot

Browser Run doesn't hide. Every request carries identifying headers that can't be removed, including Web Bot Auth signatures (`Signature-agent`, `Signature`); the [FAQ](https://developers.cloudflare.com/browser-run/faq/) states "Browser Run requests are always identified as bot traffic by Cloudflare", and the [`/crawl` docs](https://developers.cloudflare.com/browser-run/quick-actions/crawl-endpoint/) state it doesn't bypass CAPTCHA or Turnstile (Cloudflare's own human check). Requests come from Cloudflare's IP ranges with no IP rotation, and in a third-party test setting a proxy on a browser context was [rejected](https://gologin.com/blog/cloudflare-browser-rendering/).

That directly decides where it's usable: your own sites, partner sites, and sites that already allow bots. A common criticism [on Hacker News](https://news.ycombinator.com/item?id=47329557) is that in practice it only crawls sites that already let you crawl; that's accurate, and it's simply the design. Even allowlisting Browser Run on your own site, the [FAQ](https://developers.cloudflare.com/browser-run/faq/) says, requires an Enterprise plan to write rules against the Bot Management fields.

## Pricing and limits

From the [limits page](https://developers.cloudflare.com/browser-run/limits/) and [pricing page](https://developers.cloudflare.com/browser-run/pricing/) as of November 2026:

| | Workers Free | Workers Paid |
|---|---|---|
| Browser hours | 10 minutes a day | 10 hours a month, then $0.09 an hour |
| Concurrent browsers (sessions only) | 3 | 200; $2 per browser above an average of 10 |
| New browsers | 1 every 20 seconds | 3 per second |
| Quick Actions requests | 1 every 10 seconds | 30 per second |
| `/crawl` | 5 jobs a day, up to 100 pages each | — |

The concurrency fee is based on the monthly average of your daily peak concurrency. The Kitesurf engine is currently in beta and free, with per-account limits; details are in the [Kitesurf post](/posts/ai/2026-08-22-cloudflare-kitesurf-browser-infrastructure-en).

Local development differs too: under `wrangler dev`, [`/json`](https://developers.cloudflare.com/browser-run/quick-actions/json-endpoint/) returns placeholder data shaped like your schema because Workers AI isn't available locally; test in a remote environment before going live.

## Which to use when

- **You need a page's HTML, screenshot, PDF, Markdown, or JSON extraction**: Quick Actions, one request.
- **You need to crawl a whole site that allows crawling**: `/crawl`. It only follows links and has no click or scroll parameters, so sites that load content behind a "show more" button need a session.
- **You need logins, multi-step work, or a person to step in**: Browser Sessions, reusing the session through a Durable Object and keeping login state in KV.
- **You already have Puppeteer or Playwright scripts running elsewhere**: the external CDP endpoint, changing one connection URL.
- **You need Stagehand v3 or v4, or Firefox**: not inside a Worker.
- **You need to get into protected sites, use proxies, or change IPs**: Browser Run isn't a fit; see the [hosting comparison](/posts/ai/2026-11-19-hosted-browser-comparison-en).

## Going deeper

Besides the default Chromium, Browser Run has an engine Cloudflare wrote itself, Kitesurf: not Chromium, far lighter on resources, but able to do less. Its architecture and trade-offs are the subject of the series' final post, [Kitesurf](/posts/ai/2026-08-22-cloudflare-kitesurf-browser-infrastructure-en).

## References

- [Cloudflare blog: Browser Run for AI agents](https://blog.cloudflare.com/browser-run-for-ai-agents/)
- [Cloudflare Browser Run documentation](https://developers.cloudflare.com/browser-run/)
- [Browser Run: Quick Actions](https://developers.cloudflare.com/browser-run/quick-actions/)
- [Browser Run: /json endpoint](https://developers.cloudflare.com/browser-run/quick-actions/json-endpoint/)
- [Browser Run: /crawl endpoint](https://developers.cloudflare.com/browser-run/quick-actions/crawl-endpoint/)
- [Browser Run: Puppeteer](https://developers.cloudflare.com/browser-run/puppeteer/)
- [Browser Run: Playwright](https://developers.cloudflare.com/browser-run/playwright/)
- [Browser Run: CDP](https://developers.cloudflare.com/browser-run/cdp/)
- [Browser Run: Reuse sessions](https://developers.cloudflare.com/browser-run/features/reuse-sessions/)
- [Browser Run: Browser Run with Durable Objects](https://developers.cloudflare.com/browser-run/how-to/browser-run-with-do/)
- [Browser Run: Live View](https://developers.cloudflare.com/browser-run/features/live-view/)
- [Browser Run: Human in the Loop](https://developers.cloudflare.com/browser-run/features/human-in-the-loop/)
- [Browser Run: Guardrails](https://developers.cloudflare.com/browser-run/features/guardrails/)
- [Browser Run: Outbound Workers](https://developers.cloudflare.com/browser-run/features/outbound-workers/)
- [Browser Run: Stagehand](https://developers.cloudflare.com/browser-run/stagehand/)
- [Browser Run: Playwright MCP](https://developers.cloudflare.com/browser-run/playwright/playwright-mcp/)
- [Browser Run: FAQ](https://developers.cloudflare.com/browser-run/faq/)
- [Browser Run: Limits](https://developers.cloudflare.com/browser-run/limits/)
- [Browser Run: Pricing](https://developers.cloudflare.com/browser-run/pricing/)
- [browserbase/stagehand issue #1381](https://github.com/browserbase/stagehand/issues/1381)
- [browserbase/stagehand issue #2055](https://github.com/browserbase/stagehand/issues/2055)
- [Gologin: Cloudflare Browser Rendering review](https://gologin.com/blog/cloudflare-browser-rendering/)
- [Browser Run: Browser binding API](https://developers.cloudflare.com/browser-run/reference/browser-binding-api/)
- [Browser Run: MCP clients](https://developers.cloudflare.com/browser-run/cdp/mcp-clients/)
- [Hacker News: Cloudflare crawl endpoint discussion](https://news.ycombinator.com/item?id=47329557)
