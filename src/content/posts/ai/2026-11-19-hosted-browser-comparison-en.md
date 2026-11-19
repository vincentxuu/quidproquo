---
title: "Choosing a Hosted Browser: Browserbase, Browser Run, Steel, Hyperbrowser, Browser Use Cloud, and Kernel Compared, and When to Self-Host"
date: 2026-11-19
category: ai
type: deep-dive
tags: [browserbase, cloudflare-browser-run, steel, hyperbrowser, kernel, browser-automation]
lang: en
tldr: "Hosted browsers sell more than a Chrome in the cloud: concurrency, proxies and CAPTCHA handling, login state you can keep, recordings and live views, and signed identity. Providers that bill by the hour all sit between $0.06 and $0.12; the differences are in how billing works (monthly plans with included usage, pure prepaid, memory-seconds with idle time free, concurrency billed separately), how long a session can live, and which SDK they're tied to. Most latency benchmarks are run by vendors, and their rankings contradict each other. Self-hosting looks cheaper, but scheduling, auth, sandboxing, and versions are all on you; it pays off only at low volume on your own sites or sites that allow crawling."
description: "A comparison of hosted browser services: Browserbase, Cloudflare Browser Run, Steel, Hyperbrowser, Browser Use Cloud, Kernel, and Lightpanda Cloud on billing models, free tiers, concurrency and session length, proxies and CAPTCHA, Web Bot Auth signed identity, and SDK ties; why latency benchmarks contradict each other; and what self-hosting Chromium requires and when it's worth it."
draft: false
series:
  name: "AI Browser Automation"
  order: 19
---

> 🌏 [中文版](/posts/ai/2026-11-19-hosted-browser-comparison)

The [engines post](/posts/ai/2026-11-19-browser-engines-beyond-chromium-en) covered which browser to use; this one covers where it runs. Opening one Chrome locally is easy. Opening two hundred at once, keeping their logins, having someone handle CAPTCHAs, and replaying what happened when something goes wrong is what hosted services sell.

This post answers: **what Browserbase, Cloudflare Browser Run, Steel, Hyperbrowser, Browser Use Cloud, and Kernel each suit, and when to host it yourself.** For details on each, see the single posts in the series: [Browserbase](/posts/ai/2026-08-22-browserbase-browser-infrastructure-en), [Steel](/posts/ai/2026-08-22-steel-browser-infrastructure-en), [Hyperbrowser](/posts/ai/2026-08-22-hyperbrowser-browser-infrastructure-en); Browser Run has its [own post](/posts/ai/2026-11-19-cloudflare-browser-run-en).

## What hosted browsers sell

Every provider gives you a CDP connection URL, so Playwright's `connectOverCDP` or Puppeteer's `connect` plugs right in. The difference isn't whether you can open a browser; it's these five things:

- **Concurrency**: how many you can run at once, and how many new ones per second.
- **Getting into sites**: residential proxies, CAPTCHA handling, anti-detection browser changes, or the reverse, a signature that says who you are.
- **State**: whether cookies and profiles from a login carry over to the next run, and how long a session can stay open.
- **Seeing what happens**: live view, recording and replay, letting a person take over mid-run.
- **Which SDK it's tied to**: some features exist only with a vendor's own SDK on its own cloud.

## Billing: similar hourly prices, very different models

Self-serve plans from each official pricing page as of November 19, 2026:

| | Free tier | Per browser-hour | Proxy per GB | Top self-serve concurrency | Longest session |
|---|---|---|---|---|---|
| [Browserbase](https://www.browserbase.com/pricing) | 1 hour, 3 concurrent | $0.12 (Startup $0.10) | $12 ($10) | 100 | 6 hours (15 minutes free) |
| [Browser Run](https://developers.cloudflare.com/browser-run/pricing/) | 10 minutes a day, 3 concurrent | $0.09 | No hosted proxy in the docs | 200 | No limit, but closes after 60 s idle |
| [Steel](https://steel.dev/pricing) | One-time $30 credit | $0.10 (Scale $0.08) | $10 ($6) | 100 | 15 minutes to 1 hour (24 hours enterprise) |
| [Hyperbrowser](https://www.hyperbrowser.ai/pricing) | 5,000 credits, 1 concurrent | $0.10 | $10 | 100 | No limit stated in the docs |
| [Browser Use Cloud](https://browser-use.com/pricing) | One-time $1 credit | $0.06 | Residential $5 | Unlocked by total paid, up to 1,000 | 240 minutes |
| [Kernel](https://www.kernel.sh/pricing) | $5 credit a month, 5 concurrent | By memory-second, idle is free | Included in the rate | 150 | No total limit stated; idle browsers kept up to 72 hours |
| [Lightpanda Cloud](https://lightpanda.io/pricing) | 10 hours a month, 5 concurrent | $0.08 overage | Bring your own | 30 | — |

Billing differences the table can't hold:

- **Monthly plan with included usage, then overage**: Browserbase ($20, $99), Steel ($250), Hyperbrowser ($30, $100), and Lightpanda ($19). Hyperbrowser's credits are shared across browsers, sandboxes, data extraction, and agents.
- **Pure prepaid**: Browser Use Cloud says "No subscription. No concurrency fees. Credits never expire.", and its concurrency cap rises with total payments; for example, $100 paid in total unlocks 50.
- **Memory-seconds, idle is free**: Kernel's browsers enter standby after 10 seconds idle, and standby "incurs zero usage costs", though it still counts toward concurrency. Its headless rate works out to about $0.06 an hour, and headful (with a screen) to about $0.48.
- **Hours plus a concurrency fee**: Browser Run's Quick Actions bill hours only; sessions add a concurrency fee based on "the monthly average of your daily peak usage", $2 per browser above 10.

Hourly prices are close, and when you crawl many pages, proxy traffic easily becomes the bulk of the bill: the third-party test cited in the [engines post](/posts/ai/2026-11-19-browser-engines-beyond-chromium-en) used about 1.6 to 2 GB per thousand pages, which is $16 to $20 on a $10/GB proxy.

## Identity: hide, or give your name

There are two opposite ways to get an agent into a site. This series doesn't teach evading detection; it only lists what each provider offers.

**Anti-detection and proxies.** Browser Use Cloud defaults to a modified Chromium with residential proxies and includes CAPTCHA handling, while stating "Access to every site is not guaranteed". Browserbase's Verified browsers, Steel's Stealth Browser, and Hyperbrowser's Ultra stealth are all top-tier-only.

**Signed identity (Web Bot Auth).** The agent adds a cryptographic signature to each request so the site knows which provider's agent it is, and the site decides whether to let it in. Cloudflare Browser Run adds these headers automatically and they [can't be removed](https://developers.cloudflare.com/browser-run/reference/automatic-request-headers/); Browserbase has it in beta, [Hyperbrowser](https://hyperbrowser.ai/docs/sessions/web-bot-auth) enables it on request, and [Kernel](https://www.kernel.sh/docs/browsers/bot-detection/web-bot-auth) enables it on request for Start-Up and Enterprise plans only. Browserbase's [docs](https://docs.browserbase.com/platform/identity/overview) note: "A valid signature doesn't grant access or sign your agent into a user account." A signature only identifies you; the site can still refuse.

The trade-off is direct: getting into sites that never meant to let bots in only works the first way, and raises terms-of-service questions; for your own sites, partner sites, or sites that already allow crawling, signed identity is cleaner. Browser Run is the extreme of the latter: always labeled a bot, no IP changes, no proxies.

## Where SDKs are tied in

Every provider works over plain CDP, but some features only exist in particular pairings:

- **Stagehand ↔ Browserbase.** Stagehand v4's server-side cache works only on Browserbase; see the [Stagehand v4 post](/posts/ai/2026-11-18-stagehand-v4-en). Hyperbrowser also offers an integration for moving Browserbase + Stagehand projects over.
- **Browser Use ↔ Browser Use Cloud.** In Browser Use 1.0, `Browser()` defaults to its cloud browser; see the [Browser Use post](/posts/ai/2026-08-21-browser-use-complete-guide-en).
- **HyperAgent ↔ Hyperbrowser.** HyperAgent can use Hyperbrowser as its browser source, but [HyperAgent](https://github.com/hyperbrowserai/HyperAgent) itself hasn't been updated since May 2026.
- **Browser Run** uses Cloudflare's own forks of Puppeteer and Playwright, and supports Stagehand only up to v2.5; why is in the [Browser Run post](/posts/ai/2026-11-19-cloudflare-browser-run-en).
- **Steel, Kernel, and Lightpanda Cloud** lead with a generic CDP interface and aren't tied to a particular SDK.

## Latency benchmarks contradict each other

Every provider has a "we're fastest" benchmark, mostly run by themselves, and the rankings clash. They all measure the time to create a browser, connect, and open one page:

| Who ran it | Method | Browserbase's result | Fastest |
|---|---|---|---|
| [Steel](https://github.com/steel-dev/browserbench) (one of the providers tested) | us-east-1, 5,000 runs | Median 2,888 ms | Kernel 776 ms, Steel second |
| [Ritza](https://techstackups.com/comparisons/hosted-browser-benchmarks/) | Helsinki, 10 runs per provider | Mean about 11.9 s | Steel 1,441 ms |
| [Notte](https://www.notte.cc/compare/benchmarks) (a competitor of those tested) | Mostly us-east-1, 100 runs | Median 714 ms (cross-region: us-east-1 to us-west-2) | Tilion 206 ms, Kernel second |
| [ComputeSDK](https://www.computesdk.com/benchmarks/browsers/lifecycle) | Periodic, 100 runs | About 0.88 s | Tilion about 0.11 s (pre-release), Kernel second |

The same provider differs more than tenfold across benchmarks, mainly because of where the runner sits, which region the browser opens in, warm-up, and whether the SDK retries automatically. These numbers describe setup time for opening one page, not reliability over long flows, and there's no third-party evaluation free of conflicts that measures reliability and anti-detection together. Browser Use's own anti-detection benchmark ranks itself first and deserves the same discount.

In practice: from your server's region, against your target sites, run each provider a few dozen times and compare.

## When to self-host

Self-hosting Chromium looks like a `docker run`, but everything a hosted service does for you, you now add yourself:

- **Security.** Playwright's own [Docker docs](https://playwright.dev/docs/docker) say the image is "intended to be used for testing and development purposes only"; running as root by default disables Chromium's sandbox, and for untrusted sites you should switch users and apply seccomp.
- **Stability.** Add `--ipc=host` or Chromium may run out of memory and crash; deal with zombie processes; keep your Playwright version matched to the browser in the container.
- **Scheduling and auth.** The open-source [Steel Browser](https://steel.dev/docs/llms-full/self-hosting.txt) "runs one browser, so it has one session at a time" and "does not check an API key", so concurrency and auth are yours to add in front. Kitesurf's README likewise says not to deploy it without authentication.
- **Licensing.** Common self-host options differ: [Steel Browser](https://github.com/steel-dev/steel-browser), Kernel's [kernel-images](https://github.com/kernel/kernel-images), and [Kitesurf](https://github.com/cloudflare/kitesurf) are Apache-2.0; [browserless](https://github.com/browserless/browserless) is SSPL or a commercial license; Lightpanda is AGPL, with a [commercial license for sale](https://lightpanda.io/pricing).
- **Proxies, recording, and live view** are all yours to wire up.

There's a counterexample too: the healthcare team mentioned in the [hybrid SDK comparison](/posts/ai/2026-11-19-ai-browser-sdk-comparison-en) used to self-host on GCP Cloud Run, capturing screenshots and structured logs on failure; after moving to Kernel and Browserbase, their [observation](https://dev.to/michael_kronovet_261e3cc1/what-we-learned-building-healthcare-integrations-for-the-past-year-4n94) was "Has seemed to make scripts a lot more flaky though". It's one team's report with no stated cause, but it's a reminder that moving to hosted isn't automatically more stable.

Self-hosting pays off at low volume, on your own or internal sites, with no need for proxies or CAPTCHA handling, or when data can't leave your environment. If volume spikes, you need to get into protected sites, or you need recordings for people to review, go hosted.

## How to choose

- **You use Stagehand and want caching, recordings, and enterprise features**: Browserbase.
- **You use Browser Use and want residential proxies and CAPTCHA handling out of the box**: Browser Use Cloud, with no monthly fee.
- **Sessions are long and mostly waiting**: Kernel; idle time is free and idle browsers are kept for up to 72 hours.
- **You're already on Cloudflare Workers, or only need one-shot output like screenshots, PDFs, or Markdown**: Browser Run; see the [Browser Run post](/posts/ai/2026-11-19-cloudflare-browser-run-en).
- **You want the same thing available to self-host, or a predictable monthly fee**: Steel; the self-hosted version runs a single session, so production usually means Cloud.
- **Bulk extraction of text pages**: Lightpanda Cloud; see the [engines post](/posts/ai/2026-11-19-browser-engines-beyond-chromium-en).

Prices, concurrency, and features change every few months; check each pricing page and the docs before going live.

## Going deeper

- [Cloudflare Browser Run](/posts/ai/2026-11-19-cloudflare-browser-run-en): choosing between Quick Actions and Browser Sessions, and why it supports only Stagehand v2.5.
- Single posts: [Browserbase](/posts/ai/2026-08-22-browserbase-browser-infrastructure-en), [Steel](/posts/ai/2026-08-22-steel-browser-infrastructure-en), [Hyperbrowser](/posts/ai/2026-08-22-hyperbrowser-browser-infrastructure-en), [Cloudflare Kitesurf](/posts/ai/2026-08-22-cloudflare-kitesurf-browser-infrastructure-en).

## References

- [Browserbase Pricing](https://www.browserbase.com/pricing)
- [Browserbase: Plans and billing](https://docs.browserbase.com/account/billing/plans)
- [Browserbase: Web Bot Auth](https://docs.browserbase.com/platform/identity/web-bot-auth)
- [Browserbase: Identity overview](https://docs.browserbase.com/platform/identity/overview)
- [Kernel: Web Bot Auth](https://www.kernel.sh/docs/browsers/bot-detection/web-bot-auth)
- [browserless/browserless](https://github.com/browserless/browserless)
- [kernel/kernel-images](https://github.com/kernel/kernel-images)
- [Cloudflare Browser Run: Pricing](https://developers.cloudflare.com/browser-run/pricing/)
- [Cloudflare Browser Run: Limits](https://developers.cloudflare.com/browser-run/limits/)
- [Cloudflare Browser Run: Automatic request headers](https://developers.cloudflare.com/browser-run/reference/automatic-request-headers/)
- [Steel Pricing](https://steel.dev/pricing)
- [Steel: Self-hosting](https://steel.dev/docs/llms-full/self-hosting.txt)
- [Hyperbrowser Pricing](https://www.hyperbrowser.ai/pricing)
- [Hyperbrowser: Web Bot Auth](https://hyperbrowser.ai/docs/sessions/web-bot-auth)
- [Browser Use Pricing](https://browser-use.com/pricing)
- [Browser Use Cloud: Stealth](https://docs.browser-use.com/cloud/browser/stealth)
- [Kernel Pricing](https://www.kernel.sh/pricing)
- [Kernel: Standby](https://www.kernel.sh/docs/browsers/standby)
- [Lightpanda Pricing](https://lightpanda.io/pricing)
- [Playwright: Docker](https://playwright.dev/docs/docker)
- [steel-dev/browserbench](https://github.com/steel-dev/browserbench)
- [Tech Stackups: Hosted browser benchmarks](https://techstackups.com/comparisons/hosted-browser-benchmarks/)
- [Notte: BrowserArena](https://www.notte.cc/compare/benchmarks)
- [ComputeSDK: Browser lifecycle benchmark](https://www.computesdk.com/benchmarks/browsers/lifecycle)
- [Browser Use: Stealth benchmark](https://browser-use.com/posts/stealth-benchmark)
- [Michael Kronovet: What we learned building healthcare integrations for the past year](https://dev.to/michael_kronovet_261e3cc1/what-we-learned-building-healthcare-integrations-for-the-past-year-4n94)
