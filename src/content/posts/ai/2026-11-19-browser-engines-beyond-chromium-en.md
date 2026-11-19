---
title: "Browser Engines Beyond Chromium: What Lightpanda, Kitesurf, and Obscura Gain and Give Up for AI Agents"
date: 2026-11-19
category: ai
type: deep-dive
tags: [lightpanda, kitesurf, obscura, headless-browser, browser-automation, chromium]
lang: en
tldr: "Lightpanda, Cloudflare's Kitesurf, and Obscura are browser engines rewritten for agents and scraping that implement CDP themselves, so Puppeteer and Playwright connect by changing one address. Lightpanda doesn't render at all; Kitesurf and Obscura lay out and paint and can take screenshots, but the result isn't Chrome's. What you gain is mostly memory and CPU: in a third-party test, each extra page cost about 14 MB on Lightpanda versus about 69 MB on Chrome's headless shell; whether it's faster depends on concurrency. What you give up is silent differences (clicking a covered button, confirm() returning false), Lightpanda's easy-to-spot fingerprint, and screenshots. If you need pixels or a logged-in identity, stay on Chromium; bulk extraction of public pages is where these are worth trying."
description: "Non-Chromium browser engines for AI agents: why tools default to Chromium; the two routes, Lightpanda (no rendering) versus Kitesurf and Obscura (their own rendering); how much memory and CPU they save and why they aren't necessarily faster; the cost in silent compatibility differences, fingerprints, and screenshots; where Firefox and WebKit fit; and how to tell whether your workload can drop Chromium."
draft: false
series:
  name: "AI Browser Automation"
  order: 18
---

> 🌏 [中文版](/posts/ai/2026-11-19-browser-engines-beyond-chromium)

The [protocol post](/posts/ai/2026-11-19-cdp-webdriver-bidi-en) noted that tools speaking raw CDP are really tied to CDP, not strictly to Chromium: any engine that implements CDP itself can plug in. In 2026 there are several more of these: Lightpanda shipped 1.0, Cloudflare open-sourced Kitesurf, and Obscura added its own layout and painting. All of them pitch "built for agents, lighter than Chrome".

This post answers: **what these engines gain and give up; and whether your workload (bulk extraction, or something that needs screenshots, logins, and complex single-page apps) can drop Chromium.**

## Why everyone defaults to Chromium

Nearly every AI browser tool defaults to Chromium, for five separable reasons:

- **CDP is its native protocol.** Any other engine has to implement CDP itself to work with these tools.
- **Versions can be pinned.** [Chrome for Testing](https://developer.chrome.com/blog/chrome-for-testing) is Chrome built for automation: no auto-update, available for every release, so test results are reproducible. agent-browser downloads from it when it can't find Chrome.
- **There's a lightweight headless build.** Since Chrome 132, the old headless mode ships as a standalone [`chrome-headless-shell`](https://developer.chrome.com/docs/chromium/headless), which Playwright uses by default when running headless.
- **Sites are tested against Chrome.** In October 2026, [StatCounter](https://gs.statcounter.com/browser-market-share) put Chrome at 68.79% worldwide, and Edge, Opera, and Samsung Internet are Chromium-based too. It's the engine web developers test most.
- **The fingerprint matches real users.** A browser unlike most visitors is recognizable for that reason alone.

Dropping Chromium means giving ground on each of these five in exchange for resource use.

## Two routes: no rendering, or your own

| | Lightpanda | Kitesurf | Obscura |
|---|---|---|---|
| Maker | Lightpanda (company) | Cloudflare | An individual developer |
| Built with | Zig, with V8 for JavaScript | Rust components, JavaScript in Workers | Rust, with V8 for JavaScript |
| Rendering | **No layout, no painting** | Its own layout and painting; screenshots and PDFs | Its own layout and painting; screenshots and PDFs |
| Protocols | CDP, MCP; WebDriver BiDi just starting | CDP, Playwright, Puppeteer, MCP | CDP, MCP |
| License | AGPL-3.0 (contributions require a CLA) | Apache-2.0 | Apache-2.0 |
| Status | [1.0 released](https://lightpanda.io/blog/posts/lightpanda-1-0) 2026-10 | Optional Browser Run engine; open-sourced 2026-11 | v0.2.x; agent-browser labels it experimental |

**[Lightpanda](https://github.com/lightpanda-io/browser)** is the most extreme. JavaScript runs on V8, HTML parsing uses html5ever from the Servo project, and the DOM and Web APIs are written in Zig, but there's no layout or painting at all. The [official docs](https://lightpanda.io/docs/core-concepts/architecture-overview) are clear: element positions are "simulated" from DOM depth and sibling order, and `Page.captureScreenshot` returns a placeholder image; `--dump png` just draws the page's markdown as an image. It also sends usage telemetry by default; turn it off with `LIGHTPANDA_DISABLE_TELEMETRY=true`.

**[Kitesurf](https://developers.cloudflare.com/browser-run/kitesurf/)** is an alternative engine inside Cloudflare Browser Run, which still defaults to Chromium if you don't pick one. It uses Blitz for HTML, the DOM, layout, and painting, Stylo for CSS, and runs JavaScript in Workers, falling back to Boa only when it can't. In November 2026 it was [open-sourced under Apache-2.0](https://blog.cloudflare.com/kitesurf-open-source/) and can be deployed to your own Workers (a paid plan is required); the README warns that locally its JavaScript runs in `workerd`, which isn't a hardened sandbox, so don't open untrusted sites with it. The officially listed poor fits: playing video and WebGL, passing bot challenges with real TLS fingerprints, and long logged-in sessions that need persistent state. Architecture details are in the [Kitesurf post](/posts/ai/2026-08-22-cloudflare-kitesurf-browser-infrastructure-en).

**[Obscura](https://github.com/h4ckf0r0day/obscura)** is written in Rust with V8 embedded, and later added its own CSS layout and painting, so it can take screenshots and produce PDFs; its README admits that long-tail CSS, some Web APIs, and font rasterization "may differ from Chromium". It also offers an optional stealth mode with features like fingerprint randomization. [Cloudflare says](https://blog.cloudflare.com/kitesurf/) Kitesurf's initial inspiration came from Obscura. Details are in the site's [Obscura post](/posts/ai/2026-09-28-obscura-rust-headless-browser-en).

Beyond these three, there are new projects like [Moli](https://github.com/lexmount/moli), written in Rust; [Ladybird](https://ladybird.org/) has no first alpha yet; and [Servo](https://servo.org/) is positioned as a WebView to embed in applications, not an automation target.

## What you gain: memory and CPU, not necessarily time

Vendors' own numbers look great, but read the conditions:

- **Lightpanda's README** claims 16x less memory and 9x faster; its text says 933 web pages on an AWS m5.large, while the table is labeled 100 pages. Its own [method doc](https://github.com/lightpanda-io/demo/blob/main/BENCHMARKS.md) says m5.xlarge instead, and the 123 MB, roughly 5-second figures come from the row with 25 parallel processes, crawling Lightpanda's own demo site.
- **Kitesurf's [docs](https://developers.cloudflare.com/browser-run/kitesurf/)** report, for HTML extraction, about 3.8x less CPU and about 7x less memory, but total time about 1.7x slower than a pre-warmed Chromium; the screenshot row is 3.1x less CPU, 4.7x less memory, and 1.8x slower.

Two third-party tests agree on resources and disagree on speed. [Bright Data](https://brightdata.com/blog/comparison/lightpanda-vs-playwright-and-headless-chrome) ran Lightpanda 1.0.2 against Chrome's headless shell on 16 public sites: each extra concurrent page added about 14 MB on Lightpanda and about 69 MB on the headless shell, with CPU time 44% to 48% of the latter; but in tests of up to 8 concurrent pages, "Neither browser was consistently faster in wall time", and the author concludes "The main gain is memory, not speed". [Gologin's review](https://gologin.com/blog/lightpanda-review/), at 25 concurrent pages, found Lightpanda about twice as fast (9.0 seconds versus 20.7). The higher the concurrency, the more the saved resources can turn into speed.

The same post does some arithmetic: the CPU saved comes to about 12 CPU-minutes per thousand pages, and if you pay for proxy traffic, the 1.6 to 2 GB those thousand pages use costs more than those 12 minutes. Blocking images in Chrome saves about as much proxy traffic as switching to Lightpanda.

Note that Bright Data and the other review, from Gologin, both come from companies selling Chrome-based cloud browsers or anti-detect products, and the same author wrote both. Every hands-on test available so far comes from a vendor with a stake.

## What you give up: differences that don't throw errors

The real danger isn't errors; it's runs that look successful and behave differently. Bright Data ran 44 Playwright checks, and Lightpanda matched Chrome on only 22 by default, 30 with four flags. Eleven differed without raising an error, for example:

- **Clicking a covered button.** With no layout, it doesn't know an overlay sits on top of the button. On Chrome, Playwright notices the button is covered and the click times out with an error; Lightpanda clicks straight through.
- **`confirm()` returns false.** The dialog never appears for you to handle.
- **CSS `:hover` menus stay closed**, and `@media` rules don't change with the viewport.
- **IntersectionObserver reports every element as in view.** Pages that use it to trigger infinite scroll, like YouTube, load differently from Chrome as a result; one Next.js page prefetched 21 linked pages where Chrome fetched 4.

Three more raised errors outright: a second page in one browser context, file downloads (fixed in 1.0.3), and service workers.

Other costs:

- **Fingerprint.** Lightpanda sends a user agent of `Lightpanda/1.0`, `--user-agent` rejects any value containing "Mozilla", and its TLS and HTTP/2 fingerprints differ from Chrome's, so sites with bot detection can recognize every request. Gologin's review got the same FingerprintJS visitor ID across 19 Lightpanda Cloud sessions. Kitesurf's official docs also list "passing bot challenges with real TLS fingerprints" as a poor fit.
- **Compatibility.** Lightpanda [says](https://lightpanda.io/blog/posts/lightpanda-1-0) it passes 1.7 million WPT subtests, but most of those are generated encoding tests; with the encoding tests removed from both sides, Bright Data's recount puts Lightpanda at about 57% of Chrome's count, and only 24% on CSS. Kitesurf's own pages also give inconsistent WPT figures, so cross-vendor comparisons mean little.
- **Captured text.** Of 19 pages, Lightpanda captured over 90% of the text on 15; on Medium it got only 2% to 25%. In Lightpanda's [own agent tests](https://lightpanda.io/docs/core-concepts/benchmarks), agent-browser with Lightpanda scored 81.1% on GAIA Level 1 versus 84.9% with Chromium, which the vendor attributes to "text-only output misses content a rendered page would show".

## Firefox and WebKit are a different axis

Firefox and WebKit are full browser engines, no lighter than Chromium. You pick them for cross-browser testing, or so that not all your traffic looks like Chrome, not to save resources:

- Playwright's Firefox and WebKit are [patched builds](https://playwright.dev/docs/browsers); the regular Firefox and Safari don't work.
- [Camoufox](https://github.com/daijro/camoufox) is a modified Firefox for scraping and agents, controlled through Playwright's Juggler protocol; its README says it's under development and may not suit stable production use. This series doesn't cover evading detection; these are just the facts.
- For real Safari, agent-browser can [drive Mobile Safari in the iOS Simulator](https://agent-browser.dev/ios) through Appium. It needs macOS and Xcode, takes 30 to 60 seconds to start the first time, and supports a single tab.

## Can your workload drop Chromium?

Ask in order:

1. **Do you need pixels?** Screenshots, vision models that look at the screen, computer-use agents, clicks based on layout position: stay on Chromium. Kitesurf and Obscura can take screenshots, but there's no guarantee they match Chrome.
2. **Do you need an identity?** Logins, long-lived state, target sites with bot detection: stay on Chromium. Lightpanda's fingerprint stands out immediately, and Kitesurf's docs say it isn't suited to passing bot checks.
3. **What's left is bulk extraction of public pages?** Try plain HTTP requests first; in Bright Data's 19 pages, that was enough for 9. If not, try Lightpanda, check site by site that it captures as much as Chrome, and keep a path back to Chrome. Hermes Agent, which Lightpanda [lists](https://lightpanda.io/blog/posts/lightpanda-1-0) as a user, does exactly this: when it needs something Lightpanda doesn't support, like a screenshot, it switches to Chrome automatically.
4. **Modifying Lightpanda's code and putting it in a network service?** It's AGPL-3.0: modify it and let users interact with it over a network, and you must offer them the modified source; what the clause means is covered in the AGPL section of the [Skyvern post](/posts/ai/2026-11-19-skyvern-en). This isn't legal advice.

The savings really pay off when concurrency is high, machine costs dominate, pages are mostly text, and you can accept calibrating site by site.

## Going deeper

These engines are mostly used through hosted services: Kitesurf lives in Cloudflare Browser Run, and Lightpanda has its own cloud. The [next post](/posts/ai/2026-11-19-hosted-browser-comparison-en) moves to where the browser runs: what Browserbase, Browser Run, Steel, Hyperbrowser, and Browser Use Cloud each suit, and when to host it yourself.

## References

- [lightpanda-io/browser](https://github.com/lightpanda-io/browser)
- [Lightpanda: Architecture overview](https://lightpanda.io/docs/core-concepts/architecture-overview)
- [Lightpanda: Lightpanda 1.0](https://lightpanda.io/blog/posts/lightpanda-1-0)
- [lightpanda-io/demo: BENCHMARKS.md](https://github.com/lightpanda-io/demo/blob/main/BENCHMARKS.md)
- [Cloudflare: Kitesurf (Browser Run docs)](https://developers.cloudflare.com/browser-run/kitesurf/)
- [Cloudflare blog: Kitesurf is now open source](https://blog.cloudflare.com/kitesurf-open-source/)
- [cloudflare/kitesurf](https://github.com/cloudflare/kitesurf)
- [h4ckf0r0day/obscura](https://github.com/h4ckf0r0day/obscura)
- [agent-browser: Obscura engine](https://agent-browser.dev/engines/obscura)
- [agent-browser: iOS](https://agent-browser.dev/ios)
- [Bright Data: Lightpanda vs Playwright and headless Chrome](https://brightdata.com/blog/comparison/lightpanda-vs-playwright-and-headless-chrome)
- [Gologin: Lightpanda review](https://gologin.com/blog/lightpanda-review/)
- [Chrome for Developers: Chrome for Testing](https://developer.chrome.com/blog/chrome-for-testing)
- [Chrome for Developers: Headless Chrome](https://developer.chrome.com/docs/chromium/headless)
- [StatCounter: Browser Market Share Worldwide](https://gs.statcounter.com/browser-market-share)
- [Playwright: Browsers](https://playwright.dev/docs/browsers)
- [daijro/camoufox](https://github.com/daijro/camoufox)
- [Ladybird](https://ladybird.org/)
- [Servo](https://servo.org/)
