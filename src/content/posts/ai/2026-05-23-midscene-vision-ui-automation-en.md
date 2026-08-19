---
title: "Midscene.js: Betting on Pure Vision for Cross-Platform UI Automation"
date: 2026-05-23
updated: 2026-08-19
category: ai
type: deep-dive
tags: [midscene, ui-automation, vision-language-model, mcp, agent, bytedance]
lang: en
tldr: "An MIT-licensed open-source UI automation framework from ByteDance. UI actions rely solely on feeding screenshots to a vision-language model, with no DOM parsing. A single JS API works across Web / Android / iOS / desktop. The trade-offs: each step is slower and more token-expensive, and everything hinges on the model's grounding ability. Note that Midscene retired MCP after 1.9.8 in favour of Skills + CLI."
description: "A deep dive into Midscene.js: design trade-offs of pure-vision UI automation, three API categories and two automation styles, multi-model strategy, caching mechanism, the shift from MCP to Skills, and how it compares to Stagehand and browser-use."
draft: false
series:
  name: "Browser Automation and MCP"
  order: 5
glossary:
  - term: "VLM"
    aliases: ["Vision-Language Model"]
    definition: "A multimodal model that understands both images and text, capable of interpreting screen content and element positions from screenshots."
    context: "Midscene uses VLMs to locate UI elements directly from screenshots for interaction."
  - term: "grounding"
    aliases: ["visual grounding"]
    definition: "The ability of a model to map text instructions to specific coordinates or regions in an image -- the key to whether pure-vision automation can click in the right place."
    context: "In this article, it refers to the VLM's ability to map 'click the login button' to specific screenshot coordinates."
---

> 🌏 [中文版](/posts/ai/2026-05-23-midscene-vision-ui-automation)

[Midscene.js](https://midscenejs.com/) is an MIT-licensed UI automation framework open-sourced by ByteDance's Web Infra team. Its bet is straightforward: **UI actions rely solely on screenshots, with no DOM parsing** -- you describe your goal in natural language, and a vision-language model (VLM) looks at the screen to decide where to click. This article breaks down its core trade-offs, API design, model strategy, ecosystem tools, and how it differs from DOM-oriented alternatives like Stagehand and browser-use, to help you decide when to use it.

## Core Concept: From "How to Click" to "What to Achieve"

Traditional UI automation (Selenium, Playwright) is tied to DOM selectors or XPath. When the frontend changes a class name or structure, scripts break. Midscene removes this layer entirely. The official README puts it plainly:

> Midscene is all-in on pure vision for UI actions: element localization is based on screenshots only.

Element localization and interaction are "based on screenshots only." You no longer write "find `#login-btn` and click it" but rather "click the login button," leaving the rest to the model's grounding capability. This design yields three benefits:

- **Cross-platform universality**: The same JS API runs on Web, Android, iOS, HarmonyOS, and desktop. Even `<canvas>` and WebGL interfaces -- where DOM can't access content -- are operable, because to Midscene, everything is pixels.
- **Resilience to structural changes**: As long as the visual appearance hasn't changed, frontend refactors don't matter.
- **Token cost doesn't inflate with page complexity**: per the official model-strategy doc, token consumption depends only on page resolution and task complexity, and does not grow as the DOM does. DOM is selectively included only when doing data extraction (`aiQuery` / `aiAsk`).

## Key Design Decision: Actions Are Pure Vision Only

Midscene doesn't just "support pure vision" -- for actions and localization, pure vision is all there is. The docs state that UI actions and element localization do not depend on DOM data or extra annotations. Early versions still had a DOM-extraction compatibility mode to assist with localization; that was removed (for actions/localization only -- data extraction and page understanding can still opt in to DOM).

This is an opinionated trade-off: **sacrificing the precision of DOM-based localization for cross-platform consistency and resilience to change.** The project states the limitation itself: pure-vision localization "requires models with visual understanding capabilities — only designated models that are stable for GUI operations can be used, not any arbitrary LLM." It accepts a higher model bar in exchange for cross-platform consistency and lower UI maintenance cost.

## Three API Categories and Two Automation Styles

For developers, Midscene organizes its capabilities into three API categories:

- **Interaction**: `aiAct()` (auto-plan and execute), `aiTap()`, `aiInput()`, and other atomic operations
- **Data extraction**: `aiQuery()` (retrieve structured data), `aiBoolean()`, `aiAsk()`
- **Utilities**: `aiAssert()` (assertions), `aiLocate()` (localization), `aiWaitFor()` (waiting)

On top of these, there are two coding styles. **Auto-planning** sends a single sentence to the model for it to decompose:

```js
await aiAct('click all the records one by one. If one record contains the text "completed", skip it');
```

**Workflow style** lets you decompose steps in JS yourself, confining uncertainty to a smaller scope for greater stability:

```js
const recordList = await agent.aiQuery('string[], the record list');
for (const record of recordList) {
  const hasCompleted = await agent.aiBoolean(`check if the record "${record}" contains the text "completed"`);
  if (!hasCompleted) {
    await agent.aiTap(record);
  }
}
```

The trade-off is typical: auto-planning is faster to write but requires model reasoning at every step, making it slower and more expensive; workflow style pushes query results into program logic, calling the model only when you truly need it to "look at the screen." Beyond the JS SDK, you can also write flows in YAML.

## Caching: Speeds Up Replay, Not a Stability Guarantee

Since pure vision calls the model at every step, Midscene offers caching -- **but it is off by default**, and you enable it by passing a `cache` option when constructing the agent (with read-write / read-only / write-only strategies). According to the official caching documentation, it caches **two things**: AI planning steps and element localization XPaths (Web only). Query results from `aiQuery` / `aiBoolean` / `aiAssert` are **not cached**. When cache hits, official examples show a script dropping from 51 seconds to 28 seconds.

But caching is fragile: if text at the XPath position or DOM structure changes, it misses and falls back to AI; Canvas, cross-origin iframes, and closed Shadow DOM can't use it either. The documentation says it plainly -- this is "not a tool for guaranteeing long-term script stability." In other words, caching is an accelerator, not a cure for flakiness.

## Model Strategy: Division of Labour, Don't Memorise the Model Names

Midscene's success depends heavily on the VLM's grounding capability, and it explicitly requires a multimodal model that is "stable for GUI operations" -- not any LLM will do. **Which specific models are supported changes fast, so read the official [Model Strategy doc](https://midscenejs.com/model-strategy) and supported-model list directly** -- the README's lineup has turned over several times in the past year, and includes self-hostable open-weight options.

More durable than the model names, and more worth remembering, is the **multi-model division of labour**:

| Role | Responsibility |
|---|---|
| Default model | The foundation: element localization (Locate), plus anything not delegated |
| Planning model | Strengthens planning for complex goals, multi-step and branching tasks |
| Insight model | Strengthens data extraction, assertions, and page understanding |

The underlying admission: no single model excels at every subtask. But the docs also warn that adding models increases latency and token usage, and recommend **starting with the Default model alone and introducing specialists only for a clear capability bottleneck**.

One practical trap: get the `MIDSCENE_MODEL_FAMILY` environment variable right -- it tells Midscene which prompt and coordinate-handling conventions to use, and setting it wrong causes noticeable element localization drift.

## Ecosystem: From MCP to Skills, and Three Browser Modes

Midscene isn't just an SDK -- it plugs into the agent ecosystem:

- **MCP has been retired.** This is the biggest change of the past year: the official page is now titled "MCP integration has been retired." Midscene no longer ships MCP servers, and `@midscene/mcp`, `@midscene/web-bridge-mcp`, `@midscene/android-mcp`, `@midscene/ios-mcp`, `@midscene/harmony-mcp`, and `@midscene/computer-mcp` are all defunct -- remove them from your agent configuration. If you genuinely still need MCP, pin Midscene to `1.9.8`, the final version with MCP support. Anyone who set `MIDSCENE_MCP_CHROME_PATH` should move that value to `MIDSCENE_CHROME_PATH` (the old name is accepted as a temporary alias).
- **Midscene Skills is now the official path**: AI coding tools (Claude Code, Cline, OpenClaw) run the platform CLIs directly, with the agent taking screenshots and deciding the next action. Installation is one line: `npx skills add web-infra-dev/midscene-skills` (add `-a claude-code` for Claude Code, `-a openclaw` for OpenClaw). The covered platforms are Browser, Chrome Bridge, Desktop, Android, iOS, HarmonyOS, plus a Vitest + Midscene E2E testing skill.

The pivot itself is worth noting: Midscene's stated reason is the same one Microsoft gives in the Playwright MCP README -- **for coding agents, running a CLI costs less context than mounting an MCP server**. Two independent teams in this series reaching the same conclusion is unlikely to be a coincidence.

On the web side, there are three browser modes, as the official Skills documentation describes:

> Browser automation with three modes: default Puppeteer headless, `--bridge` to use your own Chrome, `--cdp <ws-endpoint>` to connect via CDP

**Bridge Mode** is particularly practical: through a Chrome extension, it lets your local Node script control your **existing desktop Chrome** -- reusing logged-in cookies, extensions, and sessions. This is ideal for "human-in-the-loop" scenarios or operating pages behind login walls. Debugging relies on visual replay reports, a built-in Playground, and Chrome extension features -- no raw log reading required.

## How to Choose Between Stagehand and browser-use

While all three fall under "AI operating interfaces," their approaches differ significantly:

```
                Localization      Platform       Language   Orientation
Midscene    Pure vision (screenshot) Cross-platform  JS/TS    SDK + toolchain
Stagehand   DOM (chunk+rank)         Browser only    TS       Built on Playwright
browser-use DOM/screenshot/hybrid    Browser only    Python   Autonomous agent
```

- **vs Stagehand** (by Browserbase, the team behind [browse.sh](/posts/ai/2026-05-23-browse-sh-browser-skills-en)): Stagehand parses DOM for localization and is built on Playwright. Its action target accuracy is typically more stable than pure vision, but it's **browser-only**. Midscene's differentiator is pure vision + true cross-platform (mobile/desktop) + JS. (This comparison is synthesized from secondary sources.)
- **vs browser-use**: Python-based, autonomous agent loop, re-reasons at every step, browser-only -- positioned as "let the agent surf the web on its own." Midscene leans toward an SDK approach where you "write it as a script/test."

In short: Midscene's selling point is **vision-first + true cross-platform + complete JS toolchain (reports/caching/Skills)**, with the trade-off of slower steps and higher token costs. For a broader view of the browser agent landscape, see the site's [Comparison of Three AI Agents' Chrome Strategies](/posts/ai/2026-05-09-ai-browser-agents-claude-codex-gemini-en) and [OpenClaw's Browser Control](/posts/ai/2026-03-28-openclaw-tools-browser-search-en).

## When to Use and When Not To, Plus Limitations

**Good fit**: End-to-end flows across Web / mobile / desktop, Canvas/WebGL and other non-standard DOM interfaces, writing RPA or tests in natural language, self-hosting open-source VLMs.

**Not a good fit**: When per-step latency and token cost are critical concerns, when the page DOM is stable and localization precision requirements are extremely high (DOM-first tools like Stagehand/Playwright are more efficient and stable here), or when you need a fully offline zero-model-call setup.

**Known limitations**: Pure vision places high demands on the model itself, and runtime resource consumption exceeds a11y-tree approaches; localization drift is a documented common issue (mitigated by switching to larger models, correctly setting `MIDSCENE_MODEL_FAMILY`, using `deepLocate`, and setting Web DPR to 2); caching is fragile against DOM changes. There's also a security note worth remembering -- the Skills README warns that AI automation "may produce unexpected results, as it can control everything on screen."

## Overall Assessment

Midscene trades "pure vision + cross-platform + complete developer toolchain" for universality and resilience to structural changes, at the cost of per-step latency, token expense, and dependence on VLM localization accuracy. It shifts the question of "can the automation run" from "is the DOM structure stable" to "can the model see accurately" -- this is both its biggest bet and its biggest risk. If your requirements involve cross-platform or operating non-standard DOM interfaces, it has virtually no competitors; but for stable browser page testing alone, DOM-first approaches are currently more efficient and stable. As VLM localization capabilities advance rapidly, the odds on this bet are improving.

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "Browser Automation and MCP" series.

## References

- [Midscene.js Official Site](https://midscenejs.com/)
- [web-infra-dev/midscene (GitHub)](https://github.com/web-infra-dev/midscene)
- [Midscene Introduction Documentation](https://midscenejs.com/introduction)
- [Model Strategy Documentation](https://midscenejs.com/model-strategy)
- [Caching Documentation](https://midscenejs.com/caching)
- [MCP retirement notice](https://midscenejs.com/mcp)
- [Skills Documentation](https://midscenejs.com/skills)
- [Bridge Mode Documentation](https://midscenejs.com/bridge-mode)
- [web-infra-dev/midscene-skills (GitHub)](https://github.com/web-infra-dev/midscene-skills)
- [UI-TARS (GitHub)](https://github.com/bytedance/ui-tars)
- [Stagehand (GitHub)](https://github.com/browserbase/stagehand)
- [browser-use (GitHub)](https://github.com/browser-use/browser-use)
