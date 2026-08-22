---
title: "Cloudflare Kitesurf: An Agent Browser That Is Not Chromium—and What It Trades for Scale"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cloudflare, kitesurf, browser-automation, ai-agent, webassembly, workers]
lang: en
tldr: "Kitesurf is a non-Chromium browser backend in Browser Run that remains in beta. It trades pixel compatibility, persistent authenticated sessions, WebGL, and full anti-bot behavior for low CPU and memory through Workers isolates, Rust/Wasm, and stateless components."
description: "An architectural guide to Cloudflare Kitesurf's Engine, PageScript, PageRenderer, and SandboxOutbound; its relationship to Browser Run and the former Browser Rendering name; and its selection boundary against Browserbase, Steel, and Hyperbrowser."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cloudflare-kitesurf-browser-infrastructure)

[Kitesurf](https://developers.cloudflare.com/browser-run/kitesurf/) is an agent-specific browser engine announced by Cloudflare on 2026-08-06. It is neither a Chromium wrapper nor a desktop browser for people. It implements the DOM, JavaScript, extraction, and rendering capabilities agents commonly need with Rust, WebAssembly, and Cloudflare Workers isolates.

The product levels need to be precise: **Browser Run is Cloudflare's managed browser API, while Kitesurf is an optional backend inside it that remains in beta.** Browser Run still defaults to Chromium; adding `browser=kitesurf` selects the new engine. The April 2026 renaming of Browser Rendering to Browser Run expanded the existing product with CDP, Live View, and Human in the Loop. It was not the Kitesurf release.

As of 2026-08-22, Kitesurf is free during beta but subject to per-account limits, so it is not a GA capability commitment. The selection question is direct: does your agent need to read pages, extract HTML, and take screenshots at high volume, or does it need a browser that stays authenticated, handles bot challenges, and reproduces Chrome? Kitesurf targets the former. Chromium remains the safer backend for the latter.

## Design philosophy: remove the human browser

Chromium must support tabs, extensions, video, WebGL, precise layout, and fluid interaction. An agent often needs only a readable DOM, website JavaScript, form interaction, and HTML, PDF, or screenshot output. Kitesurf does not slim Chromium down; it implements a different browser engine.

[Cloudflare's technical announcement](https://blog.cloudflare.com/kitesurf/) describes three principles: degrade failures into blank frames or missing elements instead of killing a session; treat every page load as untrusted input; and make every component stateless where possible. That makes one-shot work disposable, retryable, and highly parallel. The price is that Chrome compatibility cannot be assumed.

## Architecture: one stateful entry point and three isolated components

```text
CDP / REST client
       │
       ▼
Engine Worker ─── session state
   │        │
   │ RPC    └── SandboxOutbound ── origin assets
   ▼
PageScript isolate ── DOM + JavaScript + CSS
   │ scene
   ▼
PageRenderer Worker ── PNG / JPEG / PDF
```

The **Engine** is the only public component. It accepts CDP WebSocket and REST traffic and stores session state. This compatibility layer allows existing Puppeteer, Playwright, chrome-remote-interface, and Chrome DevTools clients to connect without learning a new protocol.

**PageScript** creates a Dynamic Worker isolate for every page or out-of-process iframe. Rust components Blitz and Stylo parse HTML and CSS, while site JavaScript and Wasm run in that isolate. Workers does not natively permit `eval`, so Kitesurf currently uses the Rust Boa JavaScript engine as a fallback. That is a compatibility bridge, not a promise of complete V8 behavior.

**PageRenderer** receives a scene over Workers RPC, loads fonts and images, and generates pixels. It holds no page state, so a stuck renderer can be discarded and restarted. **SandboxOutbound** is the only component allowed to request origin assets. It enforces CORS, shapes headers, filters responses, and maintains a separate cookie jar per page; other components cannot reach the network directly.

## Minimal usage: one API, one browser parameter

The shortest path is a Browser Run Quick Action. Create a least-privilege API token instead of placing a Global API Key in an agent:

```bash
curl -X POST \
  'https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/browser-run/screenshot?browser=kitesurf' \
  -H 'Authorization: Bearer <API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://example.com"}' \
  --output screenshot.png
```

For interaction, connect to the [CDP endpoint](https://developers.cloudflare.com/browser-run/kitesurf/):

```text
wss://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/browser-run/devtools/browser?browser=kitesurf
```

Do not switch every workflow globally. Establish a routing policy: public extraction, PDFs, and screenshots on compatible sites go to Kitesurf; authentication, payment, video, WebGL, and unknown compatibility stay on Chromium. Bound Kitesurf-to-Chromium fallback attempts so an agent cannot replay the same page forever.

## Performance: resource efficiency, not lower latency

Cloudflare's own benchmark used a 14-URL corpus with five Browser Run Quick Action runs per metric, comparing cold Kitesurf execution against a Chromium warm pool. The [reported result](https://blog.cloudflare.com/kitesurf/) shows seven times less memory and 3.8 times less CPU for HTML extraction, but 1.7 times slower wall time. These figures illustrate the architecture tradeoff; they do not establish that every site will be cheaper or faster.

Compatibility is also only a progress signal. Cloudflare reports roughly 215,000 passing Web Platform Tests. WPT measures standards behavior, not success on real sites, anti-bot systems, or visual regression. A useful test tonight is to run your top 20 target sites through both engines and compare required DOM fields, action outcomes, and screenshot diffs rather than relying on the WPT total.

## Security boundary: the site is isolated; the agent is not safe yet

Component isolation and one outbound worker reduce the chance that a malicious page can cross sessions or directly reach the control plane. Starting each session clean also limits cookie contamination. A browser sandbox protects against website code, however; it **does not stop prompt injection from persuading an agent to invoke an authorized tool**.

The control plane still needs URL allowlists and blocks for private IP and metadata endpoints, least-privilege tokens, reauthorization before sensitive actions, and a boundary between page content and tool instructions. Never treat DOM text as system instructions. Never give the browser tool cloud administration tokens, payment authority, and internal-network access at the same time.

## Explicit limitations

The [official documentation](https://developers.cloudflare.com/browser-run/kitesurf/) lists three current non-fits: video or WebGL, bot-challenge handshakes requiring real TLS fingerprints, and long-running authenticated sessions requiring persistent state. Kitesurf also does not promise pixel-perfect Chromium rendering. CSS and JavaScript edge differences are part of the product tradeoff, not merely untriaged bugs.

These limits make it something other than a drop-in Browserbase, Steel, or Hyperbrowser replacement. Kitesurf optimizes cheap creation and destruction for reading tasks. The other three primarily deliver complete Chrome sessions and bundle proxies, login state, and human intervention into their platforms.

## Choosing against Browserbase, Steel, and Hyperbrowser

| Most important requirement | Start with | Why |
|---|---|---|
| High-volume stateless reading, HTML/PDF/screenshots, existing Workers stack | Kitesurf | Non-Chromium, isolate-native, and exposed through Browser Run Quick Actions; accept beta and compatibility tradeoffs |
| Full Chrome, persistent login, live inspector, and managed proxy network | Browserbase | [Sessions are the core object](https://docs.browserbase.com/reference/api/overview), Contexts reuse environments across sessions, and managed proxy and observability features are deeper |
| Self-hosted full-browser API | Steel | The [Apache-2.0 project](https://github.com/steel-dev/steel-browser) supports Docker self-hosting with CDP, sessions, proxies, extensions, and quick actions |
| Full Chrome with stealth, CAPTCHA, profiles, and agent APIs | Hyperbrowser | [Session parameters](https://www.hyperbrowser.ai/docs/sessions/parameters) expose proxies, stealth, CAPTCHA, recording, and profiles; some features require paid or Enterprise plans |

Do not compare only whether each platform can open a page. Test the same target sites for persisted login, dynamic-flow completion, block rate, human takeover, and cost per successful task. Kitesurf is most likely to win replayable reading tasks. Complete Chromium platforms are most likely to win identity-bearing, long-lived workflows where website compatibility dominates.

## Overall

Kitesurf is not Cloudflare producing a cheaper Chrome. It turns “how much browser does an agent need?” into an architectural question. The Engine retains minimal session state, page scripts and rendering live in separate isolates, and networking is centralized in SandboxOutbound. That design fits short-lived, retryable web work at large scale.

It remains a free beta with clear capability gaps. The safest adoption pattern is to treat it as Browser Run's second execution backend: use task classification and compatibility tests to move extraction traffic first, while Chromium retains authenticated, anti-bot, and pixel-accurate workflows. Expand the routing share only after measured success rate and cost justify it.

## References

- [Kitesurf — Cloudflare Browser Run docs](https://developers.cloudflare.com/browser-run/kitesurf/) (beta status, usage, fits, and non-fits)
- [Introducing Kitesurf](https://blog.cloudflare.com/kitesurf/) (architecture, isolation model, WPT count, and vendor benchmark method)
- [Kitesurf playground](https://kitesurf.cloudflare.app/) (public CDP, outputs, and execution limits)
- [Browser Run: give your agents a browser](https://blog.cloudflare.com/browser-run-for-ai-agents/) (Browser Rendering rename and Browser Run scope)
- [Browserbase API Overview](https://docs.browserbase.com/reference/api/overview) and [Proxies](https://docs.browserbase.com/platform/identity/proxies) (session, context, and proxy model)
- [Steel Browser GitHub repository](https://github.com/steel-dev/steel-browser) (self-hosting, CDP, sessions, proxies, and quick actions)
- [Hyperbrowser Introduction](https://www.hyperbrowser.ai/docs/introduction) and [Session Parameters](https://www.hyperbrowser.ai/docs/sessions/parameters) (Chrome sessions, stealth, proxies, CAPTCHA, and recording)
