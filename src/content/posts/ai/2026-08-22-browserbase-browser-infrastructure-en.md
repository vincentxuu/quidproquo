---
title: "Browserbase: Turning Agent Browsers into Operable Infrastructure"
date: 2026-08-22
category: ai
type: deep-dive
tags: [browserbase, browser-agent, browser-automation, playwright, stagehand, infrastructure]
lang: en
tldr: "Browserbase combines remote Chromium, persistent Contexts, proxies, and a Session Inspector in one control plane. It operates browser fleets; it does not decide an agent's next action. As of August 2026, the company reports more than 35 million monthly browser sessions and over 10,000 customers."
description: "A component-by-component guide to Browserbase sessions, contexts, proxies, observability, browser identity, its boundary with Stagehand, and its position relative to Steel, Hyperbrowser, and Cloudflare Kitesurf."
draft: false
---

🌏 [中文版](/posts/ai/2026-08-22-browserbase-browser-infrastructure)

[Browserbase](https://docs.browserbase.com/platform/browser/getting-started/create-browser-session) is managed browser infrastructure. An application creates an isolated cloud Chromium instance through an API, then connects with Playwright, Puppeteer, Selenium, or the Chrome DevTools Protocol (CDP). Browserbase is not another agent that sees a page and plans what to do. It takes over the operational layer that teams routinely underestimate: browser provisioning and cleanup, login-state persistence, network identity, and replayable execution records.

As of August 2026, Browserbase reports more than 35 million monthly browser sessions and over 10,000 customers on its [official evaluations page](https://www.browserbase.com/evaluations). The company announced a [$40 million Series B led by Notable Capital](https://www.browserbase.com/blog/series-b-and-beyond) in June 2025. Those figures are scale signals, not evidence that a particular target site will work. The selection question is whether the following four components replace enough of your own browser platform.

## 1. Sessions turn browsers into short-lived compute units

A Browserbase **session** is one remote browser instance. Creating one returns a WebSocket `connectUrl`, so existing automation does not need to be rewritten in a proprietary DSL. The [Create Session API](https://docs.browserbase.com/reference/api/create-a-session) accepts region, timeout, viewport, proxy, and context settings; timeouts range from 60 seconds to six hours.

Here is a minimal executable TypeScript example:

```bash
pnpm add @browserbasehq/sdk playwright-core
```

```ts
import { Browserbase } from "@browserbasehq/sdk";
import { chromium } from "playwright-core";

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });
const session = await bb.sessions.create({ region: "ap-southeast-1" });
const browser = await chromium.connectOverCDP(session.connectUrl);
const page = browser.contexts()[0].pages()[0];

await page.goto("https://example.com");
console.log(await page.title());
await browser.close();
```

The important property is not the line count. “One clean browser per job” becomes a metered resource with explicit limits. Browserbase's [enterprise security documentation](https://docs.browserbase.com/account/enterprise/security) says that every browser runs in a dedicated VM and subnet, and that its VM is destroyed after the session rather than returned to a pool after cookie cleanup. The tradeoff is less direct control over local Chrome's disk, processes, and network. CDP compatibility also does not guarantee identical low-level behavior.

## 2. Contexts let sessions die without discarding every login

Perfect session isolation would force every run through login again. A Browserbase **context** persists a Chromium user data directory as a separate durable object. It contains cookies, localStorage, IndexedDB, session storage, service workers, and browser preferences. The [Contexts documentation](https://docs.browserbase.com/platform/browser/core-features/contexts) explicitly excludes the HTTP cache and states that each context is encrypted at rest.

The usual flow creates a context, attaches it to the first session with `persist: true`, completes login, ends the session, waits for synchronization, and reads the same context in later sessions. Do not have two sessions update one context concurrently: Browserbase warns that this can trigger logouts or overwrite state. A practical default is one context per site and login identity, read-only except during deliberate updates.

Contexts are also the platform's most sensitive assets. They may contain session cookies and OAuth tokens. “One browser per VM” does not remove the authority held by code that can select a context through the project API key. Treat context IDs as credential indexes, allowlist the IDs an agent may use, delete them when an account is decommissioned, and avoid placing raw passwords in prompts.

## 3. Proxies and browser identity are not an invisibility cloak

Browserbase's [proxy documentation](https://docs.browserbase.com/platform/identity/proxies) provides three paths: managed residential proxies, custom HTTP/HTTPS proxies, and ordered routing rules based on domain patterns. Country, state, and city selection is best effort; if a requested location is unavailable, Browserbase may choose the closest one. This is useful for regional-content validation and for keeping a persistent login on a consistent network path.

Changing an IP address is not the same as becoming undetectable. Standard sessions manage fingerprints and CAPTCHA handling, while the Scale plan offers [Verified sessions](https://docs.browserbase.com/platform/identity/overview). Browserbase says these use a purpose-built Chromium build with real browser fingerprints recognized by partner bot-protection systems. That is not permission to ignore a site's authorization model. Terms, robots policies, account rights, and data-use purposes remain the caller's responsibility. When a site refuses access, slow down, use its supported API, or obtain permission instead of rotating identities indefinitely.

## 4. Observability makes a recording evidence, not decoration

The worst remote-browser bugs are failures that will not reproduce locally. Browserbase's [Session Inspector](https://docs.browserbase.com/platform/browser/observability/observability) groups live view, session video, console output, and CDP network events under one session. Recording is enabled by default and supports up to ten tabs. Attach your own run ID as `userMetadata`; otherwise, an agent trace cannot reliably lead back to the page, request, and termination reason that produced it.

This creates a data-exposure surface. Video, console messages, and network logs can capture names, form inputs, or tokens. The security documentation allows logging and recording to be disabled when creating a session, producing a zero-data-retention mode. The choice should follow workload classification: retain full traces in testing; for production healthcare, financial, or personal data, redact inputs, minimize retention, or do not record at all.

## 5. Browserbase and Stagehand: the machine room is not the driver

[Stagehand](https://github.com/browserbase/stagehand) is Browserbase's MIT-licensed AI browser automation framework. It provides `act()`, `extract()`, `observe()`, and agent interfaces, and can run against either local Chromium or Browserbase. Conversely, a Browserbase session can run raw Playwright without Stagehand.

The useful boundary is simple: Browserbase owns browser lifecycle, identity, and telemetry; Stagehand translates semantic intent into browser actions. When a page is stable and selectors are known, raw Playwright is cheaper and more predictable than invoking a model for every step. Use Stagehand for the unstable semantic steps. Coupling both layers everywhere makes infrastructure failures and model failures harder to distinguish in a trace.

```text
Agent / workflow
  ├─ deterministic step ── Playwright ─┐
  └─ semantic step ─────── Stagehand ──┤
                                      ▼
Browserbase session ─ context ─ proxy/identity
                                      │
                              logs / live view / replay
```

## 6. Choosing among alternatives in the same layer

**Steel** has the clearest dividing line. [Steel Browser](https://github.com/steel-dev/steel-browser) is Apache-2.0 licensed, runs through Docker on your own infrastructure, and is also sold as a managed service. If data must remain inside your network and your team can operate the browser pool, Steel provides an exit route Browserbase does not. Browserbase instead integrates VM isolation, managed identity, and enterprise controls without requiring you to run them.

**Hyperbrowser** is the closest functional competitor, with sessions, recordings, proxies, profiles, and stealth. Its [profile documentation](https://www.hyperbrowser.ai/docs/sessions/profiles) optionally persists the HTTP cache, while [Ultra Stealth](https://www.hyperbrowser.ai/docs/sessions/parameters) is an enterprise feature. If its built-in scrape, crawl, or agent APIs matter to you, benchmark real target sites and inspect the resulting traces. A feature checklist cannot measure site success or debugging quality.

**Cloudflare Kitesurf** takes a different direction. It is not managed full Chromium; it is a stateless, agent-first browser running in Workers V8 isolates. Its [August 2026 documentation](https://developers.cloudflare.com/browser-run/kitesurf/) says it cannot yet play video, render WebGL, negotiate bot challenges requiring real TLS fingerprints, or maintain long authenticated sessions. For compatible one-shot HTML, PDF, or screenshot tasks, its lightweight design is more appropriate. Choose the Browserbase class when you need real Chromium, extensions, long logins, and persistent state.

## 7. Fit, non-fit, and production boundaries

Browserbase fits products with bursty session concurrency, expensive login flows, human takeover or per-run audit requirements, and no desire to operate a Chrome fleet. When one agent works across many third-party sites, contexts, proxies, and replay are not extras; they are the operable product.

It is excessive for static public pages—try HTTP fetch first. It does not fit strict self-hosting requirements—evaluate Steel. It is also a poor foundation for a business that treats “stealth” as authorization for bulk extraction. Before launch, set session timeouts and concurrency budgets, allowlist contexts, classify which sessions may be recorded, and create stop-or-handoff paths for expired logins, CAPTCHAs, and explicit site refusal.

The overall tradeoff is straightforward: Browserbase exchanges managed cost and vendor lock-in for the four hardest parts of operating browser fleets. The valuable outcome is not merely that an agent can open a page. It is that, when the agent fails, you can identify the session, identity, and network path involved—and stop it safely.

## References

- [Browserbase: Create a browser session](https://docs.browserbase.com/platform/browser/getting-started/create-browser-session) (session model, frameworks, and advanced features)
- [Browserbase Create Session API](https://docs.browserbase.com/reference/api/create-a-session) (connection endpoints, regions, timeouts, and settings)
- [Browserbase Contexts](https://docs.browserbase.com/platform/browser/core-features/contexts) (persisted data, synchronization, encryption, and login guidance)
- [Browserbase Proxies](https://docs.browserbase.com/platform/identity/proxies) (managed, custom, and rule-based proxies)
- [Browserbase Agent Auth & Identity](https://docs.browserbase.com/platform/identity/overview) (Verified, CAPTCHA handling, and signed agents)
- [Browserbase Observability](https://docs.browserbase.com/platform/browser/observability/observability) (live view, recordings, console, and network logs)
- [Browserbase Enterprise security](https://docs.browserbase.com/account/enterprise/security) (VM isolation, subnets, recording controls, and compliance)
- [Browserbase Evaluations](https://www.browserbase.com/evaluations) (company-reported monthly sessions and customers)
- [Building the future of web automation](https://www.browserbase.com/blog/series-b-and-beyond) (official Series B announcement)
- [browserbase/stagehand](https://github.com/browserbase/stagehand) (Stagehand source and execution environments)
- [steel-dev/steel-browser](https://github.com/steel-dev/steel-browser) (Steel self-hosting, CDP, and feature scope)
- [Hyperbrowser Profiles](https://www.hyperbrowser.ai/docs/sessions/profiles) (persistent state and network cache)
- [Hyperbrowser Session Parameters](https://www.hyperbrowser.ai/docs/sessions/parameters) (proxy and stealth settings)
- [Cloudflare Kitesurf documentation](https://developers.cloudflare.com/browser-run/kitesurf/) (stateless architecture, use cases, and limitations)
