---
title: "Hyperbrowser Deep Dive: Browser-as-a-Service Infrastructure for Agents"
date: 2026-08-22
category: ai
tags: [hyperbrowser, browser-agent, browser-automation, playwright, web-scraping, ai-agent]
lang: en
type: deep-dive
tldr: "Hyperbrowser packages Chrome sessions, proxies, stealth, profiles, and recordings behind managed Playwright and Puppeteer APIs. It fits agents that need to scale real-browser work quickly, while profile credentials, anti-bot compliance, and proxy bandwidth costs remain application responsibilities."
description: "A lifecycle-based examination of Hyperbrowser: SDKs, sessions, profiles, proxies, stealth, observability, security, pricing, and trade-offs against Browserbase, Steel, and Cloudflare Kitesurf."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-hyperbrowser-browser-infrastructure)

[Hyperbrowser](https://www.hyperbrowser.ai/docs) is Browser-as-a-Service for AI agents and automation. Applications create isolated sessions through an API, then connect Playwright, Puppeteer, or Selenium to remote browsers instead of launching, monitoring, and cleaning up a Chrome fleet. Proxies, stealth, CAPTCHA handling, profiles, live view, and recordings bring work previously split across Kubernetes, browser drivers, and proxy vendors into one control plane.

Hyperbrowser is a Y Combinator S21 company. [YC's company page](https://www.ycombinator.com/companies/hyperbrowser/jobs) also names Accel and SV Angel as backers, but it does not publish a reliably verifiable recent round amount, so this article does not treat third-party database estimates as funding facts. The more useful question is whether an agent needs a programmable real Chrome browser or merely needs page content.

## What layer Browser-as-a-Service solves

A local Playwright script is simple. In production, selectors become the smaller problem: browsers consume memory, crashes leave zombie processes, sessions need isolation, IPs get blocked, and failures have no visual replay. Hyperbrowser turns the browser into a remote resource with a lifecycle:

```text
Agent / automation service
   │ create session (API key)
   ▼
Hyperbrowser control plane
   ├─ isolated Chrome session ── target website
   ├─ proxy / geo routing
   ├─ stealth / CAPTCHA options
   └─ live view / logs / recording
        ▲
        └── Playwright / Puppeteer over CDP
```

This separation preserves existing automation frameworks. An agent can use Hyperbrowser's Browser Use, OpenAI CUA, or HyperAgent integrations. A team with reliable selectors can replace `chromium.launch()` with a Chrome DevTools Protocol connection to `wsEndpoint`. The former buys a higher-level agent loop; the latter buys only browser infrastructure. They should not be collapsed into one purchasing decision.

## A session is the atomic execution unit

A session has three states: `active`, `closed`, and `error`. Creation returns a WebSocket endpoint, live URL, and identifier. A minimal Playwright workflow looks like this:

```ts
import { Hyperbrowser } from '@hyperbrowser/sdk';
import { chromium } from 'playwright-core';

const client = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

const session = await client.sessions.create({
  timeoutMinutes: 10,
  useProxy: false,
  useStealth: false,
  enableLogCapture: true,
});

try {
  const browser = await chromium.connectOverCDP(session.wsEndpoint);
  const context = browser.contexts()[0];
  const page = context.pages()[0];
  await page.goto('https://example.com');
  console.log(await page.title());
  await browser.close();
} finally {
  await client.sessions.stop(session.id);
}
```

Explicitly calling `stop()` matters because sessions are metered by usage; a timeout should not be the cleanup strategy. The lifecycle documentation says a session normally stops when the automation client disconnects. Adding `keepAlive=true` to the CDP URL lets it survive client disconnection until its timeout, although closing every page still ends it.

## Profiles carry login state into the next run

Every session uses a fresh user data directory by default. That is good isolation but forces authenticated agents through MFA or risk checks repeatedly. [Profiles](https://www.hyperbrowser.ai/docs/sessions/profiles) preserve cookies, local storage, session storage, and cache for later sessions. The first write uses `persistChanges: true`; stop cleanly and wait for persistence to complete. Later sessions can keep the default read-only mode to run safely in parallel from a baseline.

A profile is also the most sensitive asset in the system. Cookies may be equivalent to login credentials. Do not expose profile IDs to arbitrary page code, and delete profiles when an account or authorization is removed. Multiple agents writing the same profile can overwrite one another's state. One profile per account and read-only parallel runs are easier defaults to reason about.

## Proxies and stealth provide access, not guarantees

Sessions can use managed residential proxies, select a country, or supply a custom proxy. Proxy use and CAPTCHA solving require paid plans. `useStealth` applies baseline anti-detection behavior; Enterprise adds `useUltraStealth`. These capabilities can support lawful geographic checks, public-data collection, and first-party testing. They do not alter website terms, robots policies, copyright, or privacy obligations.

Stealth is not a reliability API either. A website may change, strengthen challenges, or ban an account. Solving a CAPTCHA does not make the workflow lawful or reproducible. Treating “bypass succeeded” as an SLO creates unbounded retries and proxy bills. Set a success-rate threshold, retry ceiling, and traffic budget per domain; repeated blocking should stop execution for human review.

## Production requires visible failures

Remote browser failures are hard to diagnose because a selector timeout does not reveal that the visible page was a login form, cookie banner, or bot challenge. Hyperbrowser provides a live URL and can capture events, logs, rrweb replays, or MP4 recordings. Its documentation notes that recordings capture visual page state—not server-side changes—and may not reproduce WebGL or canvas animations perfectly.

Recording introduces a governance problem of its own. Login pages, forms, personal data, and internal screens may enter stored artifacts. Public plans currently retain data for 7 or 30 days, with longer Enterprise retention. Decide who may view recordings, how long to keep them, and which jobs must disable them before enabling the feature. “Record everything for debugging” is not a safe production default.

## Pricing: browser hours are cheap; proxy bytes may dominate

[Public pricing in August 2026](https://www.hyperbrowser.ai/pricing) uses credits, with one credit equal to $0.001. Browser sessions cost $0.10 per hour, billed by the second, while proxy traffic costs $10 per GB. Free, Startup, and Scale plans allow 1, 25, and 100 concurrent browsers respectively; Enterprise offers 1,000 or more.

This makes plain UI compute predictable, while image-heavy pages, video, and downloads can shift cost toward proxy bandwidth. Before choosing a provider, run representative tasks and record session seconds, proxy bytes, retry rate, and completed successes. Comparing only the browser-hour price misses the real cost driver.

## Choosing among Browserbase, Steel, and Kitesurf

| Option | Consider it first when | Core trade-off |
|---|---|---|
| [Hyperbrowser](https://www.hyperbrowser.ai/docs) | You want to preserve Playwright or Puppeteer while adding proxies, stealth, profiles, and multiple agent SDKs | Fast feature integration; accepts a managed service, credit model, and vendor retention policy |
| [Browserbase](https://docs.browserbase.com/welcome/introduction) | The team already uses Stagehand, or wants browser, search, fetch, and model access on one platform | Broad agent toolchain; differences from Hyperbrowser require testing target sites, not scoring feature lists |
| [Steel](https://docs.steel.dev/overview/sessions-api/overview) | You need managed sessions but value a Docker self-hosting path | Greater deployment control; proxy capacity, scaling, and operations return to your team when self-hosted |
| [Cloudflare Kitesurf](https://developers.cloudflare.com/browser-run/kitesurf/) | Agents mainly need HTML, DOM, or screenshots and can accept a non-Chromium browser | Lightweight, stateless browser on Workers; still beta in August 2026 and not for pixel-perfect rendering or full extension behavior |

Hyperbrowser fits teams that need real Chrome interactions, authenticated state, and burst concurrency without maintaining a browser fleet. Its poor fits are equally clear: full browsers are wasteful for static HTML; managed sessions conflict with on-premises requirements; and residential-proxy traffic can cost more than compute on media-heavy workloads.

## Conclusion

Hyperbrowser's value is not merely making an agent click buttons. It turns remote Chrome sessions, identity state, network egress, and observability into manageable resources. The right selection unit is not the number of API features but cost per successful task, diagnosability of failures, and the scope of browsing data entrusted to a provider.

A concrete test for tonight: move one existing Playwright workflow to `connectOverCDP()`. Run a baseline with proxy and stealth disabled, then enable each separately while recording completion rate, session seconds, traffic, and recording contents. A production setting earns its place only when it fixes a failure mode you actually observe.

## References

- [Hyperbrowser SDK introduction](https://www.hyperbrowser.ai/docs/sdks/introduction)
- [Hyperbrowser session lifecycle](https://www.hyperbrowser.ai/docs/sessions/lifecycle)
- [Hyperbrowser session parameters](https://www.hyperbrowser.ai/docs/sessions/parameters)
- [Hyperbrowser profiles](https://www.hyperbrowser.ai/docs/sessions/profiles)
- [Hyperbrowser recordings](https://www.hyperbrowser.ai/docs/sessions/recordings)
- [Hyperbrowser pricing](https://www.hyperbrowser.ai/pricing)
- [Y Combinator: Hyperbrowser company page](https://www.ycombinator.com/companies/hyperbrowser/jobs)
- [Browserbase introduction](https://docs.browserbase.com/welcome/introduction)
- [Steel Sessions API overview](https://docs.steel.dev/overview/sessions-api/overview)
- [Steel self-hosting with Docker](https://docs.steel.dev/overview/self-hosting/docker)
- [Cloudflare Kitesurf](https://developers.cloudflare.com/browser-run/kitesurf/)
