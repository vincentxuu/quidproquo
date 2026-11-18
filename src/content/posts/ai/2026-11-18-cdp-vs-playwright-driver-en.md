---
title: "Raw CDP or Playwright: Why Browser Use and Stagehand Dropped Playwright, and What It Costs"
date: 2026-11-18
category: ai
type: deep-dive
tags: [cdp, playwright, browser-automation, browser-agent, browser-use, stagehand]
lang: en
tldr: "Browser Use and Stagehand dropped Playwright and wrote their own CDP drivers: agents query the page heavily, they needed frame-level control, and Playwright's Node.js driver (for Python) plus remote browsers magnified latency and state drift. The cost is Chromium only, crash handling on you, and auto-waiting, strict mode, and network interception rebuilt by hand. Talking CDP directly doesn't, by itself, make you harder to detect."
description: "The trade-offs at the driver layer of AI browser automation: Playwright's three-part architecture (client, Node.js driver, browser), why Browser Use and Stagehand dropped Playwright, what raw CDP costs (Chromium only, crash handling, no waiting or network interception), what Patchright actually changes, and why 'raw CDP is stealthier' doesn't hold."
draft: false
series:
  name: "AI Browser Automation"
  order: 16
---

> 🌏 [中文版](/posts/ai/2026-11-18-cdp-vs-playwright-driver)

The same sentence has come up in several earlier posts: since v3, Stagehand hasn't been built on Playwright, and Browser Use dropped Playwright in August 2025. Playwright is widely seen as mature. Why would teams building AI browser tools rewrite a layer themselves?

This post answers: **what the driver layer does, why some teams removed Playwright, and what removing it costs.** It's the most abstract post in the series and the first of the two layers you never see, so it starts with a scenario.

## One step of an agent

Before a browser agent can decide where to click next, it needs to know which elements are on the page, where each one sits, whether it's visible, whether something covers it, and whether it has a click handler. In the [post explaining why they dropped Playwright](https://browser-use.com/posts/playwright-to-cdp), Browser Use says that checking element position, opacity, paint order, JavaScript event listeners, and aria properties takes them "thousands of CDP calls."

People writing test scripts rarely see that volume. A test clicks ten buttons and checks five assertions, and nobody cares if each action takes a few extra milliseconds. An agent queries the page before every step, so the same overhead multiplied by thousands of calls turns into latency you can see.

## The driver is a translation layer

In the [five-layer map](/posts/ai/2026-11-18-ai-browser-automation-layers-en), the driver sits between the AI layer and the protocol: you say "click this button," and the driver turns it into protocol commands the browser understands. Chromium-based browsers speak CDP (the Chrome DevTools Protocol), a set of JSON commands such as `Page.navigate`, `DOM.getDocument`, and `Input.dispatchMouseEvent`.

The upside of a translation layer is that you don't need to know CDP. Behind one `locator.click()`, the driver waits for the element to appear, checks that it's visible and not covered, scrolls it into view, computes coordinates, and then sends the mouse events. The downside is that every extra layer is one more place that can fall out of sync with what the browser is actually doing.

## Playwright's three-part architecture

Playwright supports TypeScript, Python, Java, and .NET, with the core logic written once, in Node.js. The Python binding starts a Node.js driver process in the background, and the two exchange messages over stdin/stdout. A Playwright maintainer explained in a [GitHub issue](https://github.com/microsoft/playwright-python/issues/2688) why the Python package is so large: browser communication, retries, and the logic around them live in the driver. The driver is written in Node.js, so the Python package ships a copy of Node.js.

The TypeScript binding skips that hop. The [Playwright source](https://github.com/microsoft/playwright/blob/c0cc9802/packages/playwright-core/src/inProcessFactory.ts) shows the Node.js client and server created in the same process, passing messages to each other directly. The `Page` you hold is still a copy, though, which comes up again with Stagehand below.

```diagram
title: Command paths in Playwright and in raw CDP
desc: The top row is Playwright's Python, Java, and .NET bindings: your program sends Playwright-protocol messages over a pipe to a Node.js driver, which controls the browser. The bottom row is raw CDP: your program controls the browser over CDP directly.
caption: In the top row, state is spread across three processes; in the bottom row, two. The driver uses CDP when it controls Chromium. Stagehand v4 also moved the layer that dispatches CDP into an extension inside the browser; see the diagram in the Stagehand v4 post.
---
<svg viewBox="0 0 640 244">
  <text class="dg-tag" x="24" y="32" dominant-baseline="central">PLAYWRIGHT (PYTHON, JAVA, .NET)</text>
  <rect class="dg-box" x="24" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="68" text-anchor="middle" dominant-baseline="central">Your program</text>
  <text class="dg-sub" x="100" y="88" text-anchor="middle" dominant-baseline="central">keeps object copies</text>
  <rect class="dg-box" x="244" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="320" y="68" text-anchor="middle" dominant-baseline="central">Node.js driver</text>
  <text class="dg-sub" x="320" y="88" text-anchor="middle" dominant-baseline="central">waits, retries</text>
  <rect class="dg-box" x="464" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="76" text-anchor="middle" dominant-baseline="central">Browser</text>
  <path class="dg-line" d="M176 76H240" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M396 76H460" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="210" y="62" text-anchor="middle" dominant-baseline="central">pipe</text>
  <text class="dg-edge" x="430" y="62" text-anchor="middle" dominant-baseline="central">CDP</text>

  <text class="dg-tag" x="24" y="148" dominant-baseline="central">RAW CDP (BROWSER USE, STAGEHAND V3)</text>
  <rect class="dg-box dg-box--accent" x="24" y="164" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="184" text-anchor="middle" dominant-baseline="central">Your program</text>
  <text class="dg-sub" x="100" y="204" text-anchor="middle" dominant-baseline="central">handles waits, crashes</text>
  <rect class="dg-box" x="464" y="164" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="192" text-anchor="middle" dominant-baseline="central">Browser</text>
  <path class="dg-line dg-line--accent" d="M176 192H460" marker-end="url(#arrow-accent)"/>
  <text class="dg-edge" x="320" y="178" text-anchor="middle" dominant-baseline="central">CDP</text>
</svg>
```

The design keeps behavior identical across four languages, and objects like `Page` and `BrowserContext` wrap the browser's targets, frames, and sessions cleanly. The cost is several copies of the same state: the real state in the browser, the state the driver remembers, and the objects your program holds.

## Why Browser Use dropped it

Browser Use's post gives three reasons, all from their own experience, with no controlled comparison.

**An extra hop.** Every command passes through the Node.js layer before reaching the browser, and over thousands of CDP queries the latency adds up. They describe this as a network hop through a websocket; according to the issue above, though, Python and the driver talk over stdin/stdout on the same machine, not a network. What you add is a cross-process round trip and a translation per call, which hurts more the more calls you make.

**State drifts across three places.** The browser, the driver, and Python occasionally disagree. The worst case they describe: a tab crashes in the browser, the driver waits forever for a reply that never comes, Python hangs too, and the only recourse is `kill -9` and starting over. These issues appear in about 1% of cases under specific slow network conditions, but an eval runs thousands of steps, so they drag down the overall success rate.

**Edge cases they couldn't get around.** Their list includes:

- Full-page screenshots taller than 16,000 pixels crash Playwright
- Handling `alert()`, `confirm()`, and `onbeforeunload`
- Keyboard or mouse input sent before a page is focused
- File uploads and downloads on remote browsers
- Special pages such as `chrome://`
- Crashed tabs

`DEBUG=pw:api` helps a little, but they concluded that writing workarounds around a relay layer they couldn't change no longer paid off.

After the switch, they send commands directly through [cdp-use](https://github.com/browser-use/cdp-use), their generated Python bindings for CDP, moved to an architecture that subscribes to CDP events, and watch for downloads and crashes with dedicated watchdogs. They say element extraction, screenshots, and default actions all got much faster (no numbers given), and cross-origin iframes finally work properly. The cost is stated just as plainly: for tab crashes alone they list at least ten ways, estimate Playwright handled half of them well, and say the other half was blocked by the driver. After the switch they own all of it: "now we're faced with the difficult challenge of solving 100% of these cases ourself."

## Why Stagehand dropped it

Stagehand dropped Playwright in v3. In October 2025, Browserbase's "[Why we're graduating from Playwright](https://www.browserbase.com/blog/stagehand-playwright-evolution-browser-automation)" gave three reasons, also from their own experience:

- **Waiting designed for tests slows automation down.** Playwright clicks only when an element is visible, stable, and actionable, which is great for end-to-end tests; for automation they often want to act directly, and those checks add latency.
- **They needed CDP-level control, especially over frames.** Stagehand reads accessibility trees, DOM snapshots, and network events from CDP to give the model context. Playwright doesn't expose a unique frame ID, which makes routing CDP commands to a specific frame awkward, and heavy CDP work through Playwright's `CDPSession` means too many round trips.
- **Long-running problems.** Users reported memory growth in long sessions, and they hit version-specific regressions.

v4 went a step further, and that reason is about remote browsers. Every framework that hands you a `page` object keeps a local copy of the browser's state; Playwright does, and so did Stagehand v3. The farther away the browser, the more easily that copy goes stale; a tab opened with `window.open` could even start loading before domain blocking took effect. So v4 moved state management and CDP dispatch into an extension inside the browser. The details and a v3/v4 diagram are in the [Stagehand v4 post](/posts/ai/2026-11-18-stagehand-v4-en).

Stagehand v4 doesn't remove a layer, though: the SDK sends a message to the extension in the browser, and the extension issues CDP. What changed is where that layer sits, moved from your machine to beside the browser. Browserbase also says there's less to gain when the browser is on your laptop.

Remote browsers constrain Playwright in another way too. To reach a hosted browser, Playwright usually attaches through [`connectOverCDP()`](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp), and its docs say that connection is "significantly lower fidelity" than its own protocol; if the browser wasn't launched with Playwright's arguments, some features may break.

## What dropping it costs

Both teams' reasons hold, but under a specific premise: lots of calls, remote browsers, built for agents. Stagehand's own [migration guide](https://docs.stagehand.dev/v4/migrations/playwright) lays out most clearly what you lose without Playwright:

- **Chromium only.** CDP is Chromium's protocol. In version 141, Firefox [removed its experimental CDP implementation](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/141); automation there goes through WebDriver, with WebDriver BiDi as the main path. A tool that speaks raw CDP is all but locked to Chromium.
- **Waiting, strict mode, and network interception are yours to build.** These are driver-layer features. Stagehand v4 has no auto-waiting, clicks the first element when a selector matches several, and has no `page.route()`. The item-by-item comparison is in the [Stagehand vs Playwright](/posts/ai/2026-11-18-stagehand-vs-playwright-en) post.
- **Crashes and edge cases are yours to handle.** Every crash case Playwright used to handle for you is now yours.

## A common misconception: raw CDP is harder to detect

There's no evidence for this. When Playwright drives Chromium, it uses CDP too; "raw CDP" and "CDP through Playwright" are the same protocol.

Sites detect automation from the traces a protocol leaves and from the environment as a whole, not from which library you use. A classic example is `Runtime.enable`: once an automation tool enables this CDP domain, a page could use a bit of JavaScript to detect that DevTools was previewing objects. An [article](https://blog.castle.io/why-a-classic-cdp-bot-detection-signal-suddenly-stopped-working-and-nobody-noticed/) from the detection company Castle reports that two V8 changes in May 2025 made this signal stop working. They add that other JavaScript signals still reveal CDP automation in some setups, and that they now rely mainly on layered signals: mouse and scroll behavior, characteristics of the execution environment, proxies and network, and time-series analysis of large-scale activity.

[Patchright](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright) shows where the detection surface actually is. It's a modified Playwright with the same API, changing only the parts that leave traces:

- It avoids `Runtime.enable` and runs JavaScript in isolated execution contexts.
- It disables the Console API entirely, so console features don't work.
- It adjusts launch flags, for example removing `--enable-automation`.

It also supports Chromium only; SDKs such as [Notte](https://github.com/nottelabs/notte) install their browser through Patchright. In other words, how detectable you are depends on these traces and the environment, not on whether Playwright is involved.

## Who's on which side

| Uses an existing driver | Speaks raw CDP |
|---|---|
| Playwright, Puppeteer, Selenium | Stagehand (since v3; in v4, dispatched by an extension inside the browser) |
| AI tools on an existing driver, such as [@playwright/mcp](/posts/tech/2026-06-20-playwright-mcp-en) and [Midscene.js](/posts/ai/2026-05-23-midscene-vision-ui-automation-en), which works with Playwright or Puppeteer | Browser Use (since August 2025, cdp-use) |
| Notte, via Patchright | [agent-browser](https://github.com/vercel-labs/agent-browser) (a daemon written in Rust) |

## How to choose

- **Writing tests or ordinary automation scripts: use Playwright.** You don't issue that many commands, and waiting, strict mode, cross-browser support, and traces save you a lot of work. You won't feel the cost of the three-part architecture.
- **Building an agent framework that queries the page heavily every step, or running mostly remote Chromium: raw CDP starts to make sense.** First make sure you're willing to handle crashes, dialogs, and special pages yourself, and to accept Chromium only.
- **You care about automation traces: know what Patchright can and can't change.** It handles only traces left by the protocol and launch flags; the behavior, environment, and network signals Castle describes are out of its reach. It's also Chromium only, and console doesn't work. Before going near it, read the target site's terms of use.
- **You just use Stagehand or Browser Use: this was the tool author's call.** What you need to know is the constraints it brings: Chromium only, and which Playwright features are missing.

## Going deeper

Below the driver is the protocol. CDP belongs to Chromium alone, and Firefox automation has moved to WebDriver BiDi. How the two protocols differ, and whether "locked to Chromium" will box in your toolchain over time, is the topic of the next post in the series.

## References

- [Browser Use: Closer to the Metal: Leaving Playwright for CDP](https://browser-use.com/posts/playwright-to-cdp)
- [Browserbase: Why we're graduating from Playwright](https://www.browserbase.com/blog/stagehand-playwright-evolution-browser-automation)
- [Browserbase: Introducing Stagehand v4](https://www.browserbase.com/blog/stagehand-v4)
- [Stagehand: Migrate Playwright to v4](https://docs.stagehand.dev/v4/migrations/playwright)
- [microsoft/playwright-python issue #2688: Why is the python package so large?](https://github.com/microsoft/playwright-python/issues/2688)
- [microsoft/playwright: inProcessFactory.ts](https://github.com/microsoft/playwright/blob/c0cc9802/packages/playwright-core/src/inProcessFactory.ts)
- [Playwright: BrowserType.connectOverCDP](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp)
- [MDN: Firefox 141 release notes](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/141)
- [Castle: Why a classic CDP bot detection signal suddenly stopped working](https://blog.castle.io/why-a-classic-cdp-bot-detection-signal-suddenly-stopped-working-and-nobody-noticed/)
- [Patchright GitHub](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright)
- [browser-use/cdp-use](https://github.com/browser-use/cdp-use)
- [Notte GitHub](https://github.com/nottelabs/notte)
