---
title: "Choosing AI Browser Automation: A Five-Layer Map from the AI Layer to Drivers, Protocols and Browsers"
date: 2026-11-18
category: ai
type: deep-dive
tags: [browser-automation, browser-agent, stagehand, playwright, cdp, mcp]
lang: en
tldr: "Playwright MCP, Stagehand and Browser Use all sit in the AI layer and differ in who decides the next step: an outside coding agent, your code, or the agent itself; Browserbase and Cloudflare Browser Run sit in the browser layer at the bottom and only provide the browser. Choose by asking three separate questions: who decides the next step, whether the driver must cover more than Chromium, and where the browser lives."
description: "Overview of the AI Browser Automation series: Playwright MCP, Stagehand, Browser Use, Playwright, CDP, WebDriver BiDi, Browserbase and Cloudflare Browser Run placed on one five-layer map, with what each layer solves, how one task looks in each layer, and the three questions to ask separately when choosing."
draft: false
series:
  name: "AI Browser Automation"
  order: 0
---

> 🌏 [中文版](/posts/ai/2026-11-18-ai-browser-automation-layers)

Say you want an AI to work a web page for you: grab a pricing table, fill in a form, run through a sign-up flow. Search around, and you will meet [Playwright MCP](https://github.com/microsoft/playwright-mcp), [Stagehand](https://github.com/browserbase/stagehand), [Browser Use](https://github.com/browser-use/browser-use), [Browserbase](https://www.browserbase.com/) and [Cloudflare Browser Run](https://developers.cloudflare.com/browser-run/) all at once, often lined up in the same comparison table, but they are not the same kind of thing. The first three all decide what to do next and differ in who holds control: a coding agent like Claude Code, your own code, or the agent itself. The last two only provide a remote Chrome.

This post is the entry point to the AI Browser Automation series. After reading it, you should be able to look at a new tool and say which layer it lives in, what it actually competes with, and which three questions to ask separately when choosing.

## The five-layer map

From what you write down to the browser that actually runs, the stack splits into five layers. Each layer does one job and relies on the one below to finish it.

```diagram
title: The five layers of AI browser automation
desc: From top to bottom: application, AI layer, driver, protocol, and browser plus where it runs; the AI layer decides what to do next and is the layer most often confused when choosing tools.
caption: Simplified: one product can span several layers. Browser Use, for example, ships an agent, its own driver and a cloud browser.
---
<svg viewBox="0 0 640 384">
  <path class="dg-axis" d="M36 336V64" marker-end="url(#arrow)"/>
  <text class="dg-tag" x="36" y="44" text-anchor="middle" dominant-baseline="central">ABSTRACT</text>
  <text class="dg-tag" x="36" y="356" text-anchor="middle" dominant-baseline="central">CONCRETE</text>

  <rect class="dg-box" x="72" y="24" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="52" dominant-baseline="central">L5</text>
  <text class="dg-label" x="124" y="52" dominant-baseline="central">Application</text>
  <text class="dg-sub" x="604" y="52" text-anchor="end" dominant-baseline="central">Your product, Claude Code, a scraper</text>

  <rect class="dg-box dg-box--accent" x="72" y="88" width="552" height="72" rx="6"/>
  <text class="dg-tag" x="92" y="114" dominant-baseline="central">L4</text>
  <text class="dg-label" x="124" y="114" dominant-baseline="central">AI layer</text>
  <text class="dg-sub" x="124" y="138" dominant-baseline="central">Decides what to do next</text>
  <text class="dg-sub" x="604" y="114" text-anchor="end" dominant-baseline="central">Stagehand, Browser Use, Playwright MCP</text>

  <rect class="dg-box" x="72" y="168" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="196" dominant-baseline="central">L3</text>
  <text class="dg-label" x="124" y="196" dominant-baseline="central">Driver</text>
  <text class="dg-sub" x="604" y="196" text-anchor="end" dominant-baseline="central">Playwright, Puppeteer, own CDP client</text>

  <rect class="dg-box" x="72" y="232" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="260" dominant-baseline="central">L2</text>
  <text class="dg-label" x="124" y="260" dominant-baseline="central">Protocol</text>
  <text class="dg-sub" x="604" y="260" text-anchor="end" dominant-baseline="central">CDP, WebDriver BiDi</text>

  <rect class="dg-box" x="72" y="296" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="324" dominant-baseline="central">L1</text>
  <text class="dg-label" x="124" y="324" dominant-baseline="central">Browser</text>
  <text class="dg-sub" x="604" y="324" text-anchor="end" dominant-baseline="central">Chromium, Lightpanda; local or hosted</text>
</svg>
```

**Application** is your own thing: a support bot, a scraper that runs every morning, or the Claude Code session you have open.

**The AI layer** decides what to do next, and it is where most apples-to-oranges comparisons happen. It splits into three kinds, and the difference is who holds the control flow:

| Kind | Who decides the next step | Examples |
|---|---|---|
| Tools for coding agents | The model of an outside agent (Claude Code, Codex) | [Playwright MCP](/posts/tech/2026-06-20-playwright-mcp-en), [Chrome DevTools MCP](/posts/tech/2026-06-20-chrome-devtools-mcp-en), [agent-browser](/posts/ai/2026-11-19-agent-browser-cli-en), [browse CLI](/posts/ai/2026-05-23-browse-sh-browser-skills-en) |
| Hybrid SDKs | Your code, handing individual steps to a model | [Stagehand](/posts/ai/2026-11-18-stagehand-v4-en), [Midscene](/posts/ai/2026-05-23-midscene-vision-ui-automation-en), [AgentQL](/posts/ai/2026-08-21-agentql-semantic-web-extraction-en), the [Skyvern](/posts/ai/2026-11-19-skyvern-en) SDK |
| Autonomous agents | The model, at every step | [Browser Use](/posts/ai/2026-08-21-browser-use-complete-guide-en), the Skyvern agent |

The tools contain no model at all, so the quality of their decisions depends mainly on whatever model you plug in; in other words, the deciding happens one layer up, where the model of an application like Claude Code drives the browser through the tool. A hybrid SDK lets you write `stagehand.act("click the sign in button")` in your code while stable steps keep using selectors. An autonomous agent takes a one-line task, looks at the page and clicks on its own.

**The driver** turns "click this button" into commands the browser understands. On one side are off-the-shelf libraries: [Playwright](https://playwright.dev/), [Puppeteer](https://pptr.dev/), [Selenium](https://www.selenium.dev/), and [Patchright](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright), a Playwright fork that removes automation fingerprints. On the other are drivers written in-house: [Stagehand since v3](https://developers.cloudflare.com/browser-run/stagehand/), [Browser Use since August 2025](https://browser-use.com/posts/playwright-to-cdp) and the Rust-based agent-browser all dropped Playwright and talk to the browser directly.

**The protocol** is the language between driver and browser. Chromium-based browsers speak CDP (Chrome DevTools Protocol); W3C WebDriver BiDi is the new cross-browser standard. Firefox [removed CDP entirely](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/141) as of version 141, leaving BiDi as the only route. The [protocol post](/posts/ai/2026-11-19-cdp-webdriver-bidi-en) covers how the two differ.

**The browser** layer holds two questions. First, which engine: almost always Chromium, though non-Chromium engines exist, such as [Lightpanda](https://github.com/lightpanda-io/browser) and [Cloudflare Kitesurf](/posts/ai/2026-08-22-cloudflare-kitesurf-browser-infrastructure-en). Second, where it runs: your laptop, or a hosted cloud such as [Browserbase](/posts/ai/2026-08-22-browserbase-browser-infrastructure-en), [Steel](/posts/ai/2026-08-22-steel-browser-infrastructure-en), [Hyperbrowser](/posts/ai/2026-08-22-hyperbrowser-browser-infrastructure-en) or Cloudflare Browser Run.

## One task, done in different layers

Take one concrete task through the stack: **every day, open a competitor's public pricing page and capture each plan's name and monthly price as JSON.** The four approaches below each sit in a different layer; the snippets follow each vendor's own documentation.

**1. Playwright MCP inside Claude Code.** Install it, then ask in plain language. Claude reads the page through the accessibility tree and decides where to click:

```bash
claude mcp add playwright npx @playwright/mcp@latest
# then in the chat: open https://example.com/pricing and list every plan's name and monthly price as JSON
```

Good for a one-off, or for figuring out what the page looks like first. Running it daily is wasteful: every run is a full agent conversation.

**2. A Stagehand script.** Navigation stays ordinary code; only "read the table" goes to the model:

```typescript
// Snippet: setup for browser, stagehand and z is in the Stagehand v4 post
const [page] = await browser.context.pages();
await page.goto("https://example.com/pricing");
const { data } = await stagehand.extract(
  "extract every plan with its name and monthly price",
  z.object({ plans: z.array(z.object({ name: z.string(), monthlyPrice: z.number() })) }),
);
```

When the pricing page is redesigned, `extract()` still reads it with no selector changes. The price is one model call per run, unless you run on Browserbase with its server-side cache enabled (details in the [Stagehand v4 post](/posts/ai/2026-11-18-stagehand-v4-en)).

**3. Hand it to Browser Use.** Give it the task; the agent decides everything from opening the page to formatting the result:

```python
# Snippet: needs a Browser Use API key or your own model configuration
from browser_use import Agent
result = Agent("Open https://example.com/pricing and list every plan with its monthly price as JSON").run_sync()
```

The least effort and the least predictable: every step is inference, and two runs of the same task can take different paths.

**4. Call a Cloudflare Browser Run Quick Action.** No browser code at all. The `/json` endpoint opens a browser, renders the page and extracts the data with [Workers AI](https://developers.cloudflare.com/workers-ai/):

```bash
curl -X POST 'https://api.cloudflare.com/client/v4/accounts/<accountId>/browser-run/json' \
  -H 'Authorization: Bearer <apiToken>' \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://example.com/pricing", "prompt": "list every plan with its monthly price"}'
```

When the page needs no login and no clicks, this is the shortest path. Once you need a login or several steps, you open a Browser Session and drive the browser yourself with Playwright, Puppeteer or CDP; on Browser Run, Stagehand currently works only in the older v2.5.x.

The first three can all run on your laptop, and all three can swap the browser for a hosted cloud. The fourth bundles the AI layer and the browser into one API. That is what the layers buy you: the choice for a single task is really several independent decisions combined.

## Three questions to ask separately

**Who decides the next step?** Fixed steps that repeat every day: write code and use a model only where judgment is needed (hybrid SDK). Steps you can't know in advance and that change each time: an autonomous agent. Something you only need now and then: give your coding agent a tool. This choice decides whether every run needs inference, and so whether cost grows with the number of runs.

**Must the driver cover more than Chromium?** If you test on Firefox or WebKit, Playwright itself supports them; if you already own a Playwright suite, the AI tools built on it (Midscene, Skyvern, AgentQL) fit in more easily. If you mostly run many remote Chromium sessions, the in-house CDP tools (Stagehand, Browser Use) have an architectural edge, at the cost of being Chromium-only.

**Where does the browser live?** Your laptop is simplest and also the easiest to get blocked by anti-bot systems. Paying for hosting makes sense when you need high concurrency, proxies and CAPTCHA handling, or session recordings. Whether anti-bot systems block you depends mainly on the browser environment, how input is generated, and which network it connects from; swapping one AI SDK for another usually will not change that. Whether you should do this at all starts with the target site's terms of use.

## Three common misconceptions

**"Raw CDP or Playwright" is not an either-or.** When Playwright drives Chromium, what it sends underneath is CDP too. The difference is whether that ready-made wrapper sits in between. The tools that removed it did so because the wrapper gets in the way for AI work, not because they use a different protocol.

**Browser Run does not compete with Stagehand.** Browser Run provides the browser; Stagehand decides what to do in it. Right now they do not fit together well, though: Browser Run's Stagehand integration [supports only v2.5.x](https://developers.cloudflare.com/browser-run/stagehand/); Cloudflare's explanation is that Stagehand v3 and later are not Playwright-based.

**Vendor success rates cannot be compared with each other.** Many of the vendor claims of 90%-plus success come from the [WebVoyager](https://arxiv.org/abs/2401.13919) (arXiv:2401.13919) benchmark. The [Online-Mind2Web paper](https://arxiv.org/abs/2504.01382) (arXiv:2504.01382) shows it covers few websites with mostly easy tasks: an agent that only runs a Google search and glances at one result already scores 51% on it. Moved to over a hundred real websites with human grading, most agents in the same paper land around 30%. When you see numbers like that, first ask which benchmark and who did the grading.

## A cross-layer problem: security

One class of problem belongs to no single layer, and every layer has to deal with it: **an agent that reads web pages is also reading text written by attackers.** A hidden instruction on a page can make the agent send data somewhere it should not. Each layer defends differently:

- Tool layer: agent-browser's [security settings](https://agent-browser.dev/security) include encrypted stored logins (the model never sees the password), a domain allowlist, action policies, and boundary markers that flag page content as untrusted; these controls are off by default and you have to turn them on.
- SDK layer: Stagehand's [`variables`](https://docs.stagehand.dev/v4/basics/act) send only variable names to the model and substitute the real secret locally (except when Browserbase server-side caching is on, which sends the values to the cache service); [v4](https://www.browserbase.com/blog/stagehand-v4) moved domain policy into the browser, so a blocked request is stopped before it leaves.
- Browser layer: session isolation and recordings on hosted services make after-the-fact investigation possible.

The posts in this series handle these as they come up. For now, one rule: before you give an agent a browser, decide which domains it is allowed to reach.

## How to read the series

The series runs down the five layers from the top, one post per choice within a layer. Start at whichever section your current tool belongs to:

| Section | Published |
|---|---|
| Tools for coding agents | [Claude, Codex and Gemini in Chrome](/posts/ai/2026-05-09-ai-browser-agents-claude-codex-gemini-en), [@playwright/mcp](/posts/tech/2026-06-20-playwright-mcp-en), [Puppeteer MCP](/posts/tech/2026-06-20-puppeteer-mcp-en), [Chrome DevTools MCP](/posts/tech/2026-06-20-chrome-devtools-mcp-en), [Choosing a browser MCP](/posts/tech/2026-06-20-browser-mcp-comparison-en), [agent-browser and the CLI route](/posts/ai/2026-11-19-agent-browser-cli-en), [browse.sh](/posts/ai/2026-05-23-browse-sh-browser-skills-en) |
| AI SDKs you script against | [Stagehand v4](/posts/ai/2026-11-18-stagehand-v4-en), [Stagehand vs Playwright](/posts/ai/2026-11-18-stagehand-vs-playwright-en), [Midscene.js](/posts/ai/2026-05-23-midscene-vision-ui-automation-en), [AgentQL](/posts/ai/2026-08-21-agentql-semantic-web-extraction-en), [Skyvern](/posts/ai/2026-11-19-skyvern-en), [Comparing hybrid SDKs](/posts/ai/2026-11-19-ai-browser-sdk-comparison-en) |
| Letting the model decide | [Browser Use](/posts/ai/2026-08-21-browser-use-complete-guide-en) |
| Drivers and protocols | [Raw CDP or Playwright](/posts/ai/2026-11-18-cdp-vs-playwright-driver-en), [CDP and WebDriver BiDi](/posts/ai/2026-11-19-cdp-webdriver-bidi-en) |
| Browsers and where they run | [Browserbase](/posts/ai/2026-08-22-browserbase-browser-infrastructure-en), [Steel](/posts/ai/2026-08-22-steel-browser-infrastructure-en), [Hyperbrowser](/posts/ai/2026-08-22-hyperbrowser-browser-infrastructure-en), [Cloudflare Kitesurf](/posts/ai/2026-08-22-cloudflare-kitesurf-browser-infrastructure-en) |

The gaps get filled next: why the agent loop is being retired, non-Chromium engines, a hosting comparison, and Cloudflare Browser Run.

The series leaves two things out. If you just want a ready-made scraping service, see the [Search and Scraping in Practice](/en/series/search-and-scraping) series. Techniques for getting around anti-bot systems are not covered; where they come up, the posts stick to compliance and limits.

## Check yourself

1. **Are Midscene and Stagehand in the same layer?** Yes. Both are hybrid SDKs: your code holds the control flow and hands individual steps to a model. They differ in how they perceive the page (Midscene looks at screenshots, Stagehand reads the accessibility tree) and in their driver (Midscene runs on Playwright or Puppeteer, Stagehand talks CDP itself).
2. **Does Cloudflare Browser Run compete with Stagehand?** No. Browser Run is in the browser layer, alongside Browserbase and Steel; Stagehand is in the AI layer and can run on Browser Run, currently only as v2.5.x.
3. **Your task is "a weekly competitor survey whose steps differ every time." Which kind do you start with?** An autonomous agent, or a tool for your coding agent. With no fixed steps, the cost of writing a script never pays back.

## References

- [Stagehand (GitHub)](https://github.com/browserbase/stagehand)
- [Stagehand v4: Migrate Playwright to v4](https://docs.stagehand.dev/v4/migrations/playwright)
- [Stagehand v4: Extract](https://docs.stagehand.dev/v4/basics/extract)
- [Browserbase: Introducing Stagehand v4](https://www.browserbase.com/blog/stagehand-v4)
- [Browser Use (GitHub)](https://github.com/browser-use/browser-use)
- [Browser Use: Closer to the Metal: Leaving Playwright for CDP](https://browser-use.com/posts/playwright-to-cdp)
- [microsoft/playwright-mcp (GitHub)](https://github.com/microsoft/playwright-mcp)
- [vercel-labs/agent-browser (GitHub)](https://github.com/vercel-labs/agent-browser)
- [agent-browser: Security](https://agent-browser.dev/security)
- [Skyvern (GitHub)](https://github.com/Skyvern-AI/skyvern)
- [Cloudflare Browser Run documentation](https://developers.cloudflare.com/browser-run/)
- [Cloudflare Browser Run: /json endpoint](https://developers.cloudflare.com/browser-run/quick-actions/json-endpoint/)
- [Cloudflare Browser Run: Stagehand](https://developers.cloudflare.com/browser-run/stagehand/)
- [MDN: Firefox 141 release notes for developers](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/141)
- [Xue et al., An Illusion of Progress? Assessing the Current State of Web Agents (arXiv:2504.01382)](https://arxiv.org/abs/2504.01382)
- [Lightpanda (GitHub)](https://github.com/lightpanda-io/browser)
- [Patchright (GitHub)](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright)
- [Playwright: Test Agents](https://playwright.dev/docs/test-agents)
- [Puppeteer: WebDriver BiDi support](https://pptr.dev/webdriver-bidi)
