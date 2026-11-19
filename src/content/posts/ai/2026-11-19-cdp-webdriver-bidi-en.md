---
title: "CDP and WebDriver BiDi: The Two Protocols Under AI Browser Tools, and What \"Chromium Only\" Costs"
date: 2026-11-19
category: ai
type: deep-dive
tags: [cdp, webdriver-bidi, browser-automation, playwright, puppeteer, chromium]
lang: en
tldr: "CDP is Chromium's debugging protocol and the most capable one, but Google has never guaranteed compatibility, and since September 2026 its official docs state outright that direct use by third parties is \"unsupported\". WebDriver BiDi is the W3C cross-browser standard, and Firefox 141 removed CDP, moving automation to WebDriver with BiDi as the main path; but the spec is still a Working Draft, BiDi in Chrome is a translation layer on top of CDP and slower, and Puppeteer over BiDi can't get the browser's accessibility tree yet. Tools that speak raw CDP (Browser Use, Stagehand, agent-browser) get full capability and pay with Chromium-family browsers only, tracking Chrome releases, and no official support."
description: "The protocol layer of AI browser automation: CDP's domain, session, and target model, Google's 2026 stance on third parties using CDP directly, and how the Runtime.enable detection signal was fixed; WebDriver BiDi's spec status, how Chrome, Firefox, and Safari implement it, how far Puppeteer, Playwright, and Selenium support it; who can see closed shadow roots; and what \"Chromium only\" actually costs."
draft: false
series:
  name: "AI Browser Automation"
  order: 17
---

> 🌏 [中文版](/posts/ai/2026-11-19-cdp-webdriver-bidi)

The [driver post](/posts/ai/2026-11-18-cdp-vs-playwright-driver-en) ended on a cost: once Browser Use and Stagehand dropped Playwright and spoke CDP themselves, they could only use Chromium. Firefox removed CDP in version 141, and its automation now goes through WebDriver BiDi.

This post goes one layer down and answers: **what kind of protocols CDP and WebDriver BiDi are and why both exist; what "Chromium only" means beyond losing Firefox; and whether protocols will box in your toolchain later.**

## What the protocol layer does

A driver turns "click this button" into a series of JSON messages, sends them into the browser over a WebSocket (or a pipe), and receives results and events back. The protocol defines what those messages look like and what the browser promises to do.

A CDP command, its response, and an event look roughly like this (illustrative, values elided):

```json
{"id": 1, "sessionId": "8F2…", "method": "Page.navigate", "params": {"url": "https://example.com"}}
{"id": 1, "sessionId": "8F2…", "result": {"frameId": "…", "loaderId": "…"}}
{"sessionId": "8F2…", "method": "Page.loadEventFired", "params": {"timestamp": 1234.5}}
```

The same thing in WebDriver BiDi:

```json
{"id": 1, "method": "browsingContext.navigate", "params": {"context": "…", "url": "https://example.com", "wait": "complete"}}
{"type": "success", "id": 1, "result": {"navigation": "…", "url": "https://example.com"}}
{"type": "event", "method": "browsingContext.load", "params": {…}}
```

The shapes are similar: commands with an id, matching responses, and events without one. The differences are in the model underneath and who is accountable for it.

## CDP: a protocol built for DevTools

CDP (Chrome DevTools Protocol) started as the way Chrome's developer tools talk to the browser. In the [official docs](https://chromedevtools.github.io/devtools-protocol/)' terms, functionality is split into domains (`DOM`, `Network`, `Runtime`, …), and each domain defines its own commands and events. The current [definition files](https://github.com/ChromeDevTools/devtools-protocol) have 59 domains, including profiling, memory, and coverage, so it can do far more than automation needs.

For people building agent tools, three properties of CDP matter:

- **You attach before you act.** Every tab, every cross-origin iframe, and every worker is a separate target. The client calls `Target.attachToTarget` to get a `sessionId` and includes it in every message after that ([Getting Started with CDP](https://github.com/aslushnikov/getting-started-with-cdp) explains it in full). A cross-origin iframe runs in another process as another target, so it has to be attached separately and then mapped back to the right frame on the page. That's what the driver post meant when it said Browser Use and Stagehand had to "do their own frame mapping".
- **Events have to be turned on.** Most domains only start sending events after `X.enable`, and that state is kept per session. For example, only after `Runtime.enable` do you hear that the page created a new JavaScript execution context, which a driver needs in order to know where to run scripts.
- **Full capability, no promises.** Many methods are marked experimental, including `Accessibility.getFullAXTree`, which agent tools rely on.

### Since 2026, third-party direct use is officially unsupported

CDP has never guaranteed backward compatibility. On September 28, 2026, the [CDP homepage](https://chromedevtools.github.io/devtools-protocol/) was rewritten ([commit 4bd3de39](https://github.com/ChromeDevTools/debugger-protocol-viewer/commit/4bd3de39)) with a new "Scope and support" section:

> CDP is not a public or supported API for Chrome, and it does not guarantee backwards compatibility. Syntax and semantics may change without notice based on Chromium's requirements and Chrome's product needs.
>
> Direct use of CDP by third-party applications is unsupported.

The same section lists the officially supported products built on CDP: Chrome, the Chrome DevTools frontend, [Chrome DevTools for agents](https://developer.chrome.com/docs/devtools/agents), Lighthouse, Puppeteer, and ChromeDriver, and recommends that third-party tools connect through Chrome DevTools for agents, Puppeteer, or ChromeDriver instead. The FAQ says direct third-party use "has been tolerated" but "may break without notice" when the protocol changes.

That list doesn't include Playwright, nor Browser Use, Stagehand, or agent-browser. Before the rewrite, the page only said the latest development protocol (tip-of-tree) had "no backwards compatibility support guaranteed"; now there's an explicit position. In practice: if Chrome changes a method, fixing it is the tool author's job. Puppeteer uses experimental methods too, but it's on the official list, with the Chrome team keeping it current.

### Runtime.enable: a trace the protocol left behind

"Events have to be turned on" was once the best-known detection signal. Once `Runtime.enable` is on, when the page calls `console.debug(err)`, the browser serializes err to send it to the client and reads err's `stack` property along the way; a site that replaces `stack` with a getter knows a CDP client is listening when the getter runs ([Castle's explanation](https://blog.castle.io/why-a-classic-cdp-bot-detection-signal-suddenly-stopped-working-and-nobody-noticed/)). In May 2025, Playwright maintainer Pavel Feldman landed two V8 commits ([object preview](https://chromium.googlesource.com/v8/v8/+/61a907540d4c1dda4733476e54c977910f31041d), [error preview](https://chromium.googlesource.com/v8/v8/+/e08e97347454255a337dcea361808fb25ca09077)) so previews no longer run the page's getters, and from Chrome 138 (V8 13.8) the signal stopped working. For other traces and how detection works overall, see the [driver post](/posts/ai/2026-11-18-cdp-vs-playwright-driver-en).

## WebDriver BiDi: putting events into the standard

The original WebDriver (now called WebDriver Classic) is a W3C standard and what Selenium uses. It runs over HTTP, strictly request and response: the client sends a command, the browser returns a result, and the browser has no way to tell you on its own that the page logged a line or that a request went out. CDP can, so newer tools like Puppeteer went to CDP and ended up tied to Chromium; Playwright instead patched Firefox and WebKit and used its own protocols.

WebDriver BiDi is the new standard that fills this gap. The [spec](https://www.w3.org/TR/webdriver-bidi/) states its purpose up front:

> In place of the strict command/response format of WebDriver, this permits events to stream from the user agent to the controlling software, better matching the evented nature of the browser DOM.

BiDi runs over WebSocket and defines 10 modules: `session`, `browser`, `browsingContext`, `emulation`, `network`, `script`, `storage`, `log`, `input`, and `webExtension`. The spec's editors come from Mozilla and Google, and as of November 2026 its status is still **W3C Working Draft**, not yet a Candidate Recommendation.

Compared with CDP (assembled from both definitions; not a one-to-one mapping):

| Task | CDP | WebDriver BiDi |
|---|---|---|
| Address a tab or frame | Attach to a target; messages carry `sessionId` | Use the browsing context id directly, no attach |
| Receive events | Send `X.enable` per session | `session.subscribe`, optionally scoped to contexts |
| Run JavaScript | `Runtime.evaluate` in an execution context | `script.evaluate` in a realm (one JavaScript global environment), optionally a sandbox page scripts can't touch |
| Intercept requests | `Fetch` domain | `network.addIntercept` |
| Find elements | No locators; run scripts or query the DOM | `browsingContext.locateNodes` (CSS, XPath, text, accessibility) |
| Read the accessibility tree | `Accessibility.getFullAXTree` (experimental) | Not in the spec yet; Chrome has `goog:`-prefixed extensions |

The two also start from different assumptions. A [Chrome team article](https://developer.chrome.com/blog/webdriver-bidi) notes that CDP clients almost always run on the same machine as the browser, so latency is low, while BiDi assumes they may be across a network and minimizes round trips; fetching an object's id and value takes one round trip in BiDi and two in CDP. The same article's FAQ is clear that BiDi won't replace CDP: Chromium will keep using CDP for debugging.

## How the three browsers implement it

- **Firefox: native BiDi, CDP removed.** Firefox's CDP was always an experimental, partial implementation (supporting 82 APIs when it was enabled by default in 2021). It was [deprecated](https://fxdx.dev/deprecating-cdp-support-in-firefox-embracing-the-future-with-webdriver-bidi/) in version 129 and [removed entirely](https://fxdx.dev/cdp-retirement-in-firefox/) in 141. Mozilla suggests that anyone still on CDP move to Firefox 140 ESR as a stopgap.
- **Chrome: BiDi is a translation layer.** Chrome's BiDi comes from the [chromium-bidi](https://github.com/GoogleChromeLabs/chromium-bidi) project, whose README describes it as "a JavaScript layer translating between BiDi and CDP, running inside a Chrome tab". Through ChromeDriver, this mapper runs in a browser tab; when Puppeteer or Playwright enable BiDi on Chrome, they run the same mapper inside the Node.js process on top of a CDP connection. In other words, BiDi on Chrome still ends up as CDP.
- **Safari: just getting started.** As of fall 2026, Safari Technology Preview is still adding BiDi commands (screenshots arrived [in October](https://webkit.org/blog/18420/)), and Selenium's Ruby bindings [warn that it's experimental](https://github.com/SeleniumHQ/selenium/pull/17729) when BiDi is enabled on Safari.

```diagram
title: The same action's path to three browsers
desc: Top row: a tool controls Chrome directly over CDP. Middle row: a tool sends WebDriver BiDi commands, chromium-bidi translates them to CDP, and CDP controls Chrome. Bottom row: a tool controls Firefox directly over WebDriver BiDi.
caption: On Chrome, BiDi commands are still translated into CDP in the end; on Firefox, there's no CDP to use. Playwright's default Firefox and WebKit run its own patched builds and protocols and aren't shown.
---
<svg viewBox="0 0 640 320">
  <text class="dg-tag" x="24" y="32" dominant-baseline="central">RAW CDP (BROWSER USE, STAGEHAND, AGENT-BROWSER)</text>
  <rect class="dg-box" x="24" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="76" text-anchor="middle" dominant-baseline="central">Your tool</text>
  <rect class="dg-box" x="464" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="76" text-anchor="middle" dominant-baseline="central">Chrome</text>
  <path class="dg-line" d="M176 76H460" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="320" y="62" text-anchor="middle" dominant-baseline="central">CDP</text>

  <text class="dg-tag" x="24" y="136" dominant-baseline="central">BIDI TO CHROME</text>
  <rect class="dg-box" x="24" y="152" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="180" text-anchor="middle" dominant-baseline="central">Your tool</text>
  <rect class="dg-box dg-box--accent" x="244" y="152" width="152" height="56" rx="6"/>
  <text class="dg-label" x="320" y="172" text-anchor="middle" dominant-baseline="central">chromium-bidi</text>
  <text class="dg-sub" x="320" y="192" text-anchor="middle" dominant-baseline="central">BiDi to CDP</text>
  <rect class="dg-box" x="464" y="152" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="180" text-anchor="middle" dominant-baseline="central">Chrome</text>
  <path class="dg-line" d="M176 180H240" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M396 180H460" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="210" y="166" text-anchor="middle" dominant-baseline="central">BiDi</text>
  <text class="dg-edge" x="430" y="166" text-anchor="middle" dominant-baseline="central">CDP</text>

  <text class="dg-tag" x="24" y="240" dominant-baseline="central">BIDI TO FIREFOX</text>
  <rect class="dg-box" x="24" y="256" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="284" text-anchor="middle" dominant-baseline="central">Your tool</text>
  <rect class="dg-box" x="464" y="256" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="284" text-anchor="middle" dominant-baseline="central">Firefox</text>
  <path class="dg-line" d="M176 284H460" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="320" y="270" text-anchor="middle" dominant-baseline="central">BiDi</text>
</svg>
```

The extra layer has a cost. In a February 2026 [draft PR](https://github.com/puppeteer/puppeteer/pull/14676), a Puppeteer maintainer measured the same workload on Chrome once: counting only the underlying CDP commands, total time waiting on the browser was 7,662 ms in BiDi mode and 4,505 ms in CDP mode, meaning that going through the mapper made the underlying CDP round trips more numerous or slower. It's a single measurement, but chromium-bidi's [own performance doc](https://github.com/GoogleChromeLabs/chromium-bidi/blob/main/docs/benchmark.md) names "a 0% performance delta" against CDP as the goal and admits it's ambitious.

## How far tools support it

**Puppeteer** has officially supported Firefox since version 23, with Firefox using BiDi by default; Chrome still defaults to CDP, [officially](https://pptr.dev/webdriver-bidi) because "not all CDP features are supported by WebDriver BiDi yet". The official list of what doesn't work over BiDi is long. The items that matter most for agent tools:

- **No Accessibility at all**, and no ARIA selectors. An agent that reads pages through Puppeteer's Accessibility API loses its main source of perception when it switches to BiDi.
- **No response bodies** (`HTTPResponse.text()`, `buffer()`, and so on), so extraction tools need another route.
- **No Tracing, Coverage, or `createCDPSession()`.**

**Playwright** doesn't rely on the standard protocols by default. Its [docs](https://playwright.dev/docs/browsers) state that its Firefox and WebKit are patched builds and that it "doesn't work with the branded version"; the Firefox route uses Juggler, a protocol Playwright wrote for it. Running stock Firefox over BiDi already works (through channels such as `moz-firefox`), but it hasn't been officially announced. In the [tracking issue](https://github.com/microsoft/playwright/issues/37277), the latest Firefox Nightly passes most of Playwright's tests, with gaps remaining in popup lifecycle, double-click, workers, and more. The maintainers say the main benefit of BiDi would be dropping their browser patches, but "BiDi support in WebKit doesn't look feasible in the foreseeable future", so in practice the question is only whether Firefox moves from Juggler to BiDi.

**Selenium** is the most committed. It's moving its [whole implementation](https://www.selenium.dev/documentation/webdriver/bidi/) from WebDriver Classic to BiDi, its CDP pages are marked "being phased out", and it [removed CDP support for Firefox](https://www.selenium.dev/blog/2025/remove-cdp-firefox/) in 4.29.

## Closed shadow roots: who can see them

[Stagehand vs Playwright](/posts/ai/2026-11-18-stagehand-vs-playwright-en) mentioned that Stagehand's CSS selectors can cross closed shadow roots and Playwright's locators can't. The difference lives at the protocol layer.

A closed shadow root is designed to be unreachable from the page's JavaScript: `element.shadowRoot` returns `null`. Playwright's locators run inside the page, and the [docs](https://playwright.dev/docs/locators) say plainly, "Closed-mode shadow roots are not supported".

CDP stands outside the page and can see them. `DOM.getDocument` with `pierce: true` returns shadow roots too, with nodes marked `shadowRootType: "closed"`. Stagehand v4 uses that to find closed roots, gets a reference to each one from outside the page, and hands it to an in-page function so the selector can run inside; on the extension side it uses an extension-only Chrome API to get the closed root directly. That's why [its docs](https://docs.stagehand.dev/v4/reference/locator) note "Closed roots require a navigated page": those privileged APIs aren't available on `about:blank` or `data:` pages.

The accessibility tree depends on where it comes from. Puppeteer maintainer Alex Rudenko [says](https://stackoverflow.com/questions/78684488) ARIA selectors, which are based on the browser's own accessibility tree, can find elements inside closed shadow roots over CDP, provided the element is included in the accessibility tree. A tool that builds its "accessibility snapshot" by walking the DOM with JavaScript inside the page can't reach closed roots either.

The BiDi spec includes the shadow root when serializing a node and marks it `mode: "closed"`, so the standard can see it as well. But Puppeteer over BiDi has no accessibility tree, so that route isn't connected yet.

## "Chromium only," stated precisely

Tools that speak raw CDP are really tied to CDP, not strictly to Chromium: agent-browser can also drive engines like Lightpanda that implement CDP themselves. But desktop Firefox and Safari are definitely out of reach. The cost comes in three layers:

1. **No Firefox or Safari.** That matters if you write tests and need cross-browser coverage; agents that scrape data or run workflows mostly don't care.
2. **Tracking Chrome releases.** The protocol promises no compatibility, and experimental methods can change at any time. The tool has to follow Chrome updates, and you have to manage tool and browser versions together. Selenium's approach is to support CDP for only the three most recent Chrome versions in each release.
3. **No official support.** Since September 2026, Google has said third-party direct use of CDP is unsupported and recommends going through Puppeteer, ChromeDriver, or Chrome DevTools for agents.

BiDi's costs run the other way: the spec is still a draft, Chrome adds a translation layer and is slower, and capabilities agents use often, like the browser's accessibility tree and response bodies, aren't there yet. Neither route is going away soon. Chrome says BiDi won't replace CDP; Firefox no longer has CDP.

## Will protocols box in your toolchain?

- **You only run agents or scrape on Chrome**: keep using Browser Use, Stagehand, or agent-browser. Pin the Chrome version, upgrade the browser together with the tool, and check release notes for CDP changes.
- **You need Firefox or Safari**: tools on raw CDP are out. Use Playwright (with its patched builds), or Puppeteer or Selenium over BiDi; first check that what you need isn't on Puppeteer's unsupported list.
- **You're writing your own driver**: given Google's current position, building on Puppeteer gets you a layer of official support that raw CDP doesn't; the price is the control discussed in the driver post.
- **Your tool depends on the accessibility tree**: check where it comes from first. Tools that read the browser's native tree (CDP's `Accessibility.getFullAXTree`, Puppeteer's Accessibility API) need to stay on Chromium and CDP for now; that's BiDi's biggest gap today. Tools like Playwright that compute an aria snapshot inside the page work on all three browsers, but can't see closed shadow roots.

## Going deeper

The protocol decides which engines you can control. The [next post](/posts/ai/2026-11-19-browser-engines-beyond-chromium-en) moves to the bottom layer: which engines besides Chromium an agent can use, and what new engines like Lightpanda, which implement CDP themselves, gain and give up.

## References

- [Chrome DevTools Protocol documentation](https://chromedevtools.github.io/devtools-protocol/)
- [ChromeDevTools/debugger-protocol-viewer commit 4bd3de39 (Scope and support rewrite)](https://github.com/ChromeDevTools/debugger-protocol-viewer/commit/4bd3de39)
- [ChromeDevTools/devtools-protocol (protocol definitions)](https://github.com/ChromeDevTools/devtools-protocol)
- [Andrey Lushnikov: Getting Started with Chrome DevTools Protocol](https://github.com/aslushnikov/getting-started-with-cdp)
- [Castle: Why a classic CDP bot detection signal suddenly stopped working](https://blog.castle.io/why-a-classic-cdp-bot-detection-signal-suddenly-stopped-working-and-nobody-noticed/)
- [V8 commit 61a9075: Prevent side effects during object preview](https://chromium.googlesource.com/v8/v8/+/61a907540d4c1dda4733476e54c977910f31041d)
- [V8 commit e08e973: Prevent side effects during error preview](https://chromium.googlesource.com/v8/v8/+/e08e97347454255a337dcea361808fb25ca09077)
- [W3C: WebDriver BiDi](https://www.w3.org/TR/webdriver-bidi/)
- [Chrome for Developers: WebDriver BiDi - The future of cross-browser automation](https://developer.chrome.com/blog/webdriver-bidi)
- [GoogleChromeLabs/chromium-bidi](https://github.com/GoogleChromeLabs/chromium-bidi)
- [MDN: Firefox 141 release notes](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/141)
- [Firefox Developer Experience: CDP Retirement in Firefox](https://fxdx.dev/cdp-retirement-in-firefox/)
- [Firefox Developer Experience: Deprecating CDP Support in Firefox](https://fxdx.dev/deprecating-cdp-support-in-firefox-embracing-the-future-with-webdriver-bidi/)
- [WebKit: Release Notes for Safari Technology Preview 254](https://webkit.org/blog/18420/)
- [Puppeteer: WebDriver BiDi support](https://pptr.dev/webdriver-bidi)
- [Puppeteer PR #14676 (BiDi vs CDP performance measurement)](https://github.com/puppeteer/puppeteer/pull/14676)
- [Playwright: Browsers](https://playwright.dev/docs/browsers)
- [Playwright: Locators (Shadow DOM)](https://playwright.dev/docs/locators)
- [microsoft/playwright issue #37277: Firefox over BiDi](https://github.com/microsoft/playwright/issues/37277)
- [Selenium: WebDriver BiDi](https://www.selenium.dev/documentation/webdriver/bidi/)
- [Selenium: Removing ChromeDevTools Support For Firefox](https://www.selenium.dev/blog/2025/remove-cdp-firefox/)
- [Stack Overflow: Access elements inside closed shadow DOM (Alex Rudenko's answer)](https://stackoverflow.com/questions/78684488)
- [Stagehand: Locator](https://docs.stagehand.dev/v4/reference/locator)
- [Chrome for Developers: Chrome DevTools for agents](https://developer.chrome.com/docs/devtools/agents)
- [chromium-bidi: benchmark](https://github.com/GoogleChromeLabs/chromium-bidi/blob/main/docs/benchmark.md)
- [SeleniumHQ/selenium PR #17729 (Safari BiDi)](https://github.com/SeleniumHQ/selenium/pull/17729)
