---
title: "Stagehand vs Playwright: You Already Have Playwright Scripts. Should You Switch?"
date: 2026-11-18
category: ai
type: deep-dive
tags: [stagehand, playwright, browser-automation, testing, browser-agent]
lang: en
tldr: "Stagehand v4 can't take a Playwright page, so switching means porting, and you lose auto-waiting, strict mode, getByRole, network interception, the test runner, and Firefox/WebKit. Keep testing your own site in Playwright, with Test Agents stepping in while tests are written and repaired; move only the steps whose selectors keep breaking on other people's sites to Stagehand, and if you just want a few AI steps, look first at SDKs that sit on Playwright."
description: "Stagehand v4 compared with Playwright item by item: the Hacker News script written both ways; what a port loses (auto-waiting, strict mode, getBy*, network interception, test tooling); Playwright's own AI route, Test Agents; and which scripts to keep and which steps to swap."
draft: false
series:
  name: "AI Browser Automation"
  order: 9
---

> 🌏 [中文版](/posts/ai/2026-11-18-stagehand-vs-playwright)

The previous post covered the three methods in [Stagehand v4](/posts/ai/2026-11-18-stagehand-v4-en). This one tackles the next question: **you already have Playwright scripts. Should you switch them to Stagehand, and what would you give up?**

One fact first: since v3, Stagehand hasn't been built on Playwright. It drives Chromium itself over CDP (the Chrome DevTools Protocol). Why it dropped Playwright is the subject of the series' [driver post](/posts/ai/2026-11-18-cdp-vs-playwright-driver-en); this post only looks at what that means for your code.

## They are not the same kind of thing

Installing Playwright gets you two things: a library that drives the browser, and a test runner on top of it, `@playwright/test` (fixtures, `expect()`, retries, the HTML report, the trace viewer, codegen). Stagehand covers only the first. Its [migration guide](https://docs.stagehand.dev/v4/migrations/playwright) says so up front: Stagehand is not a test framework.

You can't mix them either. A Playwright `Page` can't be passed to Stagehand's `act()`. In the guide's words, "There is no interop; moving a flow to Stagehand means porting it." In the [v4 launch post](https://www.browserbase.com/blog/stagehand-v4), Browserbase lists bringing a Playwright `Page` into a Stagehand script as future work. It isn't available yet.

So switching isn't a matter of adding a package. It's a decision to rewrite.

## One script, two versions

The migration guide's example opens Hacker News, switches to the newest stories, and reads the top five titles. The Playwright version:

```typescript
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto("https://news.ycombinator.com");
await page.getByRole("link", { name: "new" }).click();
await page.waitForLoadState("domcontentloaded");

const titles = await page.locator(".titleline > a").allTextContents();
console.log(titles.slice(0, 5));

await browser.close();
```

The Stagehand v4 version (the official example, running on Browserbase; to run locally, open the browser with `localBrowser.launch()` instead):

```typescript
import { browserbase, Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod/v4";

const browser = await browserbase.launch({ apiKey: process.env.BROWSERBASE_API_KEY });
const stagehand = await Stagehand.create({ browser });

try {
  const page = await browser.context.newPage("https://news.ycombinator.com");

  // getByRole() has no built-in equivalent, and the link has no stable selector.
  await stagehand.act("Click the 'new' link in the top navigation");
  await page.waitForLoadState("domcontentloaded");

  // extract() replaces the allTextContents() loop and returns typed data in one call.
  const { data } = await stagehand.extract(
    "Extract the titles of the first five stories",
    z.object({ titles: z.array(z.string()) }),
  );
  console.log(data.titles);
} finally {
  await stagehand.close();
  await browser.close();
}
```

The difference comes down to two lines. In Playwright, `getByRole()` needs no model; it reads the page's roles and names. Stagehand has no such method, so the official example uses `act()` to ask a model to find the link, which by default adds an inference to every run. Replacing `allTextContents()` with `extract()` costs another inference, but this one isn't necessary: `.titleline > a` is a stable selector, and the migration guide gives a model-free alternative elsewhere, reading the items one by one with `count()` and `nth()`.

That is the price of switching in miniature: what Playwright does without a model, Stagehand either does with one or leaves you to rebuild with `page.evaluate()`. When porting, ask at every step: does this one really need a model?

## What a port loses

The migration guide is thorough. These are the items most likely to bite:

| Playwright has | Stagehand v4 | What the port needs |
|---|---|---|
| Every action auto-waits until the element is attached, visible, stable, and enabled | Resolves the selector once and throws if it isn't there | `waitForSelector()` before the action, or a retry loop |
| Strict mode: refuses to act when a selector matches several elements | Acts on the first match | Check `count() === 1` yourself |
| `getByRole()`, `getByLabel()`, `filter()`, chained locators | None | Rewrite as CSS, use `text=`, hand it to `observe()`, or rebuild with `evaluate()` |
| `page.route()`, request mocking, `waitForResponse()` | No network layer; `page.on()` supports `"console"` only | Only `browser.context.setDomainPolicy()` allow/block lists, which block whole domains |
| `page.on("dialog")` | None | Stub `window.confirm` with `addInitScript()` before the page loads |
| Multiple contexts, `storageState()` | One context per browser | Separate browsers for isolation; keep logins with the cookie API |
| `@playwright/test`, trace viewer, codegen | None | Bring a runner such as Vitest or Jest; debug with Browserbase recordings or `stagehand.metrics()` |
| Firefox, WebKit | Chromium only | No substitute |
| `goto()` waits for `load` by default | Waits for `domcontentloaded` by default | Spell out `waitUntil` where you need subresources loaded |

**Strict mode is the dangerous one.** Most other differences throw an error, so you find out quickly. Two don't: the default wait in `goto()`, and strict mode. Strict mode is worse. After a redesign, a selector that used to match one button now matches three. Playwright refuses to act and reports it; Stagehand quietly clicks the first. The guide puts it this way: "a selector that quietly went ambiguous keeps working on the wrong element."

**Auto-waiting is the usual source of flakiness.** The guide says waiting "is where most ported scripts start flaking." Playwright retries until the element is actionable; Stagehand looks once. The guide includes a retry loop, with a warning: don't wrap `act()` in it, because a failed `act()` may already have clicked. Retry `observe()`, which only plans.

Three methods also changed meaning: in v4, `page.click()`, `page.hover()`, and `page.type()` take coordinates or text, not selectors. The type checker catches this; route every element through `page.locator(selector).click()`.

## What a port gains

- **Steps that describe the target in a sentence.** `act()`, `extract()`, and `observe()`, covered in the [previous post](/posts/ai/2026-11-18-stagehand-v4-en). This is the main reason to switch.
- **Easier shadow DOM and iframes.** CSS selectors pierce shadow DOM, closed roots included, and `page.locator("iframe#checkout >> button.submit")` reaches into an iframe directly, replacing `frameLocator()`.
- **Less inference, faster remote runs.** `observe()` replay with `selfHeal`, Browserbase's server-side cache, and v4's in-browser extension each have their own scope; see [Stagehand v4](/posts/ai/2026-11-18-stagehand-v4-en). Note there is no local cache.

## Playwright's own AI route

Playwright has its own AI route, and it puts the model in the opposite place.

[Playwright Test Agents](https://playwright.dev/docs/test-agents) ships three agents. The planner explores your app and writes a Markdown test plan. The generator turns the plan into Playwright test files, verifying selectors and assertions live as it goes. When a test fails, the healer replays the failing steps, finds the equivalent elements, suggests a patch, and reruns until the test passes or a guardrail stops the loop; if it decides the feature itself is broken, it marks the test skipped. `npx playwright init-agents --loop=claude` (also `vscode`, `codex`, `opencode`) generates the agent definitions, and the coding agent you already use drives them.

What matters is the output: the generator writes ordinary Playwright tests that use `getByRole()` and `expect()`. A model takes part only while tests are written and repaired. The daily runs use no model at all.

```diagram
title: When the model takes part
desc: Two routes compared. Playwright with Test Agents: the model takes part when tests are written and when they break; each run uses no model. Stagehand: the model takes part in the act and extract steps of every run, and selfHeal re-infers when something breaks.
caption: Stagehand's observe replay and Browserbase caching can take inference out of stable steps, but by default act and extract call the model on every run.
---
<svg viewBox="0 0 640 228">
  <text class="dg-sub" x="256" y="28" text-anchor="middle" dominant-baseline="central">Writing</text>
  <text class="dg-sub" x="408" y="28" text-anchor="middle" dominant-baseline="central">Every run</text>
  <text class="dg-sub" x="560" y="28" text-anchor="middle" dominant-baseline="central">When it breaks</text>

  <text class="dg-label" x="24" y="76" dominant-baseline="central">Playwright</text>
  <text class="dg-sub" x="24" y="96" dominant-baseline="central">+ Test Agents</text>
  <rect class="dg-box dg-box--accent" x="192" y="56" width="128" height="56" rx="6"/>
  <text class="dg-label" x="256" y="76" text-anchor="middle" dominant-baseline="central">Model</text>
  <text class="dg-sub" x="256" y="96" text-anchor="middle" dominant-baseline="central">planner, generator</text>
  <rect class="dg-box" x="344" y="56" width="128" height="56" rx="6"/>
  <text class="dg-label" x="408" y="76" text-anchor="middle" dominant-baseline="central">Plain tests</text>
  <text class="dg-sub" x="408" y="96" text-anchor="middle" dominant-baseline="central">no model</text>
  <rect class="dg-box dg-box--accent" x="496" y="56" width="128" height="56" rx="6"/>
  <text class="dg-label" x="560" y="76" text-anchor="middle" dominant-baseline="central">Model</text>
  <text class="dg-sub" x="560" y="96" text-anchor="middle" dominant-baseline="central">healer patches once</text>

  <text class="dg-label" x="24" y="164" dominant-baseline="central">Stagehand</text>
  <rect class="dg-box" x="192" y="144" width="128" height="56" rx="6"/>
  <text class="dg-label" x="256" y="164" text-anchor="middle" dominant-baseline="central">You write it</text>
  <text class="dg-sub" x="256" y="184" text-anchor="middle" dominant-baseline="central">or a coding agent</text>
  <rect class="dg-box dg-box--accent" x="344" y="144" width="128" height="56" rx="6"/>
  <text class="dg-label" x="408" y="164" text-anchor="middle" dominant-baseline="central">Model</text>
  <text class="dg-sub" x="408" y="184" text-anchor="middle" dominant-baseline="central">act, extract</text>
  <rect class="dg-box dg-box--accent" x="496" y="144" width="128" height="56" rx="6"/>
  <text class="dg-label" x="560" y="164" text-anchor="middle" dominant-baseline="central">Model</text>
  <text class="dg-sub" x="560" y="184" text-anchor="middle" dominant-baseline="central">selfHeal at run time</text>
</svg>
```

Playwright also has an MCP server for coding agents, covered in the series' [@playwright/mcp](/posts/tech/2026-06-20-playwright-mcp-en) post. It lets an agent operate a browser in the moment; it doesn't produce scripts meant to run for months.

## How to choose

Start with one question: **whose pages are these?**

- **You're testing your own site: stay with Playwright.** The pages are yours, so a broken selector can be fixed at the source, for example by adding a `data-testid`. Auto-waiting, strict mode, network mocks, cross-browser runs, traces: Stagehand has none of them. If you want AI help, use Test Agents to generate and repair tests; runs still use no model. Review the healer's patches and skips like any PR instead of letting them land unreviewed.
- **You run a flow repeatedly on someone else's site, and redesigns keep breaking selectors: swap the breaking steps for Stagehand.** You can't change their HTML, which is exactly where `act()` and `extract()` help. Keep `page.locator()` for the stable steps rather than rewriting the whole script in natural language.
- **You want a few AI steps inside existing Playwright scripts without porting: look at SDKs that sit on Playwright first.** [Midscene.js](/posts/ai/2026-05-23-midscene-vision-ui-automation-en) and [AgentQL](/posts/ai/2026-08-21-agentql-semantic-web-extraction-en) work with a Playwright `page`, so auto-waiting, strict mode, and cross-browser support stay; they differ in how they read the page and how they charge, which the series' SDK comparison post lines up.
- **You need Firefox, WebKit, request interception, or isolated contexts: Playwright is the only option.** Stagehand has no substitute for these.
- **The steps differ every run: neither is the first choice.** Without fixed steps, the cost of writing a script never pays back; look at tools like [Browser Use](/posts/ai/2026-08-21-browser-use-complete-guide-en), where the model picks its own next step.

Once you decide to port, the guide's recommended order is:

1. Port one script unchanged and get it running.
2. Add explicit waits where you relied on auto-waiting.
3. Replace `getBy*` and assertions.
4. Swap the selectors that break most often for `act()` and `extract()`.
5. Turn on caching once the flow is stable.

The guide includes porting rules for coding agents that you can paste into a rules file such as `CLAUDE.md` and let the agent do the mechanical mapping.

Before you switch, do one thing: sort your last twenty failures by error message, into "element not found / matched several" versus timeouts, pop-ups, and wrong data. Only the first kind is what Stagehand fixes; the rest won't improve with a different SDK. That is why a [write-up on EHR (electronic health record) integrations](https://dev.to/michael_kronovet_261e3cc1/what-we-learned-building-healthcare-integrations-for-the-past-year-4n94) ended with the team moving from Stagehand back to Playwright and using AI only when writing scripts; details are in the [Stagehand v4 post's limits](/posts/ai/2026-11-18-stagehand-v4-en).

## References

- [Stagehand: Migrate Playwright to v4](https://docs.stagehand.dev/v4/migrations/playwright)
- [Browserbase: Introducing Stagehand v4](https://www.browserbase.com/blog/stagehand-v4)
- [Playwright: Test Agents](https://playwright.dev/docs/test-agents)
- [Stagehand GitHub](https://github.com/browserbase/stagehand)
- [Michael Kronovet: What we learned building healthcare integrations for the past year](https://dev.to/michael_kronovet_261e3cc1/what-we-learned-building-healthcare-integrations-for-the-past-year-4n94)
