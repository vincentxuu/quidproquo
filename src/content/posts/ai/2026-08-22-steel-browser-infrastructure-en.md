---
title: "Steel Browser: An Open-Source Browser API and the Boundary of Self-Hosting"
date: 2026-08-22
category: ai
tags: [steel, browser-automation, ai-agent, browser-infrastructure, playwright, open-source]
lang: en
type: deep-dive
tldr: "Steel packages Chromium sessions, CDP, proxies, stealth, and debugging behind an Apache-2.0 browser API. Its public repository has about 7,400 stars and it entered the Stripe Projects developer preview in 2026. Self-hosting fits development and data-control needs; Cloud addresses concurrency, managed proxies, CAPTCHA, recordings, and SLAs."
description: "An architecture and selection-focused guide to Steel Browser: sessions, CDP, Playwright, proxies, stealth, observability, credential security, single-host limits, and competing browser infrastructure."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-steel-browser-infrastructure)

[Steel](https://steel.dev/) is not a browser agent. It is infrastructure that lets an agent use a browser. A model decides what to click, Playwright or Puppeteer sends the action, and Steel creates Chromium, retains the session, attaches a proxy, manages lifecycle, and leaves evidence when a run fails.

Its most interesting property is not being another cloud browser. The same SDK can point its `baseURL` at Steel Cloud or a local server. The core [steel-browser repository](https://github.com/steel-dev/steel-browser) is Apache-2.0 licensed and had roughly 7,400 stars when checked on 2026-08-22. In July 2026, Steel also became a co-design and launch partner in the [Stripe Projects developer preview](https://steel.dev/blog/steel-browser-is-live-in-stripe-projects). Those are verifiable adoption signals. Funding figures repeated by startup databases have no company, investor, or reliable media announcement I could verify, so this article does not use them.

## Design philosophy: a browser runtime, not an agent framework

Steel deliberately stops at the infrastructure layer. It does not choose the model, prompt, DOM grounding, or planning loop. It exposes two interfaces:

- **Quick Actions**: `/scrape`, `/screenshot`, and `/pdf` for one-shot reads and conversions.
- **Sessions**: a complete browser controlled through Chrome DevTools Protocol (CDP) by Playwright, Puppeteer, or Selenium, for login, multiple pages, downloads, and long workflows.

This preserves the existing automation ecosystem. A team does not have to adopt a provider's action schema or rewrite mature Playwright tests. Steel owns the browser process while the application retains page and context control.

```text
Agent / deterministic script
            │
     Playwright / Puppeteer
            │  CDP over WebSocket
            ▼
Steel session API ── lifecycle, proxy, profile, recording
            │
            ▼
 Chromium runtime ── pages, cookies, storage, downloads
```

The session ID identifies a control-plane resource; the CDP WebSocket is the browser control channel. This distinction matters. An API key creates and releases resources, while the connection URL lets an automation library speak directly to Chrome. If the agent crashes, a timeout or explicit release still has to reclaim the browser, or an orphan consumes both concurrency and money.

## Minimal usage: create a session, then attach over CDP

The [official Playwright guide](https://docs.steel.dev/overview/guides/playwright-python) follows a short path:

```python
import os
from steel import Steel
from playwright.sync_api import sync_playwright

client = Steel(steel_api_key=os.environ["STEEL_API_KEY"])
session = client.sessions.create(block_ads=True)

try:
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(
            f"wss://connect.steel.dev?apiKey={os.environ['STEEL_API_KEY']}"
            f"&sessionId={session.id}"
        )
        page = browser.contexts[0].pages[0]
        page.goto("https://example.com")
        print(page.title())
finally:
    client.sessions.release(session.id)
```

For self-hosting, start the official image:

```bash
docker run -p 3000:3000 -p 9223:9223 \
  ghcr.io/steel-dev/steel-browser
```

Then set the SDK's `base_url` to `http://localhost:3000`. A common API reduces migration work, but a local container and Steel Cloud are not feature-equivalent. Managed proxies, CAPTCHA solving, cloud recordings, Stealth Browser, reserved pools, multi-machine scheduling, and SLAs belong to the Cloud operations layer.

## Proxies and stealth do not guarantee access

Ordinary Chromium automation exposes datacenter IPs, inconsistent fingerprints, or unnatural traffic patterns. A Steel session can use a customer proxy; Cloud adds managed proxies, CAPTCHA solving, dedicated IPs, and Stealth Browser. The 2026 Stealth Browser is a custom Chromium fork that produces more consistent browser-level signals from startup instead of relying only on JavaScript patches after page load.

These features may improve success rates. They do not create permission to bypass a site's rules. A dedicated IP is valuable not because it hides better, but because the same profile returns from a stable network origin. Login agents should generally prefer identity consistency over rotating an IP on every run. Large public-data workloads may instead need geographic routing and a proxy pool.

Test representative flows against target sites and record success rate, CAPTCHA rate, proxy bytes per successful task, and failure categories. Do not infer reliability from a “stealth” label, and do not treat anti-detection as an access policy when authorization is absent.

## Observability is core browser infrastructure

After an agent clicks the wrong element, a text log often leaves only `TimeoutError`. Steel makes a session inspectable: Cloud provides live view, recordings, and session data, while the open-source runtime includes a UI, request logging, and a console debugger. Applications should still record prompts, model actions, CDP events, and business outcomes to distinguish model error, selector drift, network blocking, and site changes.

The 2026 [Projects](https://steel.dev/blog/introducing-projects) release places sessions, credentials, profiles, and API keys in separate namespaces. This is more than dashboard organization: a development key cannot see production sessions, giving revocation and incident investigation a real boundary.

The [Profiles API](https://docs.steel.dev/overview/profiles-api/overview) stores a browser user-data directory, including cookies, extensions, and settings. A profile is limited to 300 MB, is removed after 30 inactive days, and only writes session changes back when persistence is explicitly enabled. Treat profiles as a database: isolate them by user or service and define retention and deletion instead of sharing one login state across agents.

## Security boundary: anything visible to the browser may reach the agent

A browser sandbox is not a secrets vault. Page content, cookies, downloads, local storage, and internal URLs can become prompt-injection or exfiltration paths. At minimum, restrict destinations, isolate tenant profiles, keep dashboard and CDP ports on private networks, and require human or policy approval before high-risk actions are submitted.

Steel Cloud's [Credentials API](https://docs.steel.dev/overview/credentials-api/overview) remains in beta. It encrypts each item with an AES-256-GCM data key wrapped by an organization-specific KMS key, then injects login values without exposing them to the model or live viewer. This is safer than putting passwords in a prompt, but it is not a complete boundary. The resulting session cookie carries authority, and a logged-in agent can still perform actions available to the account. Payments, deletion, publishing, and permission changes need separate approval.

Self-hosting is not automatically secure. The default Docker command exposes API and debugger ports on the host. Anyone who reaches CDP effectively controls the browser. Production deployments need authentication, TLS, network isolation, resource limits, and a rapid Chrome patching process.

## Self-host or Steel Cloud

**Choose self-hosting** for development, low-concurrency internal flows, data that cannot leave your network, runtime modifications, or teams that already operate container scheduling, proxies, and Chrome patching. Its key advantage is an inspectable, modifiable Apache-2.0 runtime without changing the SDK surface.

**Choose Cloud** for multi-tenant concurrency, residential or geographic proxies, CAPTCHA, Stealth Browser, recordings, durable profiles, dedicated IPs, and SLAs. The [June 2026 pricing announcement](https://steel.dev/blog/pricing-update) gives Launch 10 concurrent 15-minute sessions and Scale 100 concurrent one-hour sessions; Enterprise reaches 1,000-plus concurrency and sessions up to 24 hours. These are capacity limits, not success guarantees.

Do not compare only browser-hour rates. Cloud also meters proxy bandwidth, CAPTCHA, and `/scrape`; self-hosting adds resident Chrome memory, nodes, egress, proxy vendors, orchestration, and on-call work. Cost per successful workflow over a representative week is the honest metric.

## Choosing among Browserbase, Hyperbrowser, and Kitesurf

[Browserbase](https://www.browserbase.com/) also provides CDP-compatible managed browsers and places the agent-friendly Stagehand framework in the same ecosystem. Teams already using Stagehand get a shorter integration path. Teams that require an inspectable and modifiable Apache-2.0 browser server get a clearer answer from Steel.

[Hyperbrowser](https://www.hyperbrowser.ai/) packages web-agent and extraction capabilities above cloud browsers. It is worth testing when a team wants fewer agent components to assemble. Steel draws a cleaner boundary when the team wants to keep its own agent loop and swap only the browser backend.

Cloudflare's Kitesurf represents its agent-browser direction, while [Browser Run](https://developers.cloudflare.com/browser-run/) places browser execution inside the Cloudflare developer platform. A team already running agents on Workers, Durable Objects, and Cloudflare's network should first evaluate the same-platform latency, billing, and data path. Steel becomes more attractive when local and cloud environments must share an open runtime or Chromium orchestration needs deep modification.

These are not permanent rankings. Fix a Playwright script and target sites, then compare success rate, p95 session startup, recording usefulness, proxy cost, and login persistence across providers.

## Conclusion

Steel's central judgment is sound: an agent does not need another click-tool vocabulary. It needs an observable browser runtime, controllable by standard CDP clients, with identity and network management. The open-source server supports a local start and preserves modification and exit paths. Cloud sells the proxy, anti-detection, concurrency, and debugging operations that are hardest to maintain.

Steel fits teams that already know Playwright and are now blocked by browser-fleet operations. If the requirement is static extraction without login or interaction, start with HTTP fetch or an extraction API. If there is only one stable flow, a complete browser platform may be premature. Browsers remain expensive, privileged execution environments: Steel reduces operational friction, not site drift, authorization, or security risk.

## References

- [Steel Browser GitHub repository](https://github.com/steel-dev/steel-browser)
- [Steel Playwright Python guide](https://docs.steel.dev/overview/guides/playwright-python)
- [Steel Profiles API overview](https://docs.steel.dev/overview/profiles-api/overview)
- [Steel Credentials API overview](https://docs.steel.dev/overview/credentials-api/overview)
- [Introducing Projects](https://steel.dev/blog/introducing-projects)
- [Simpler pricing, built for how agents run](https://steel.dev/blog/pricing-update)
- [Steel Browser is live in Stripe Projects](https://steel.dev/blog/steel-browser-is-live-in-stripe-projects)
- [Browserbase](https://www.browserbase.com/)
- [Hyperbrowser](https://www.hyperbrowser.ai/)
- [Cloudflare Browser Run documentation](https://developers.cloudflare.com/browser-run/)
