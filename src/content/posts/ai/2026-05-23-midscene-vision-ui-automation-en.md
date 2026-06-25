---
title: "Midscene.js: Betting on Pure Vision for Cross-Platform UI Automation"
date: 2026-05-23
category: ai
type: deep-dive
tags: [midscene, ui-automation, vision-language-model, mcp, agent, bytedance]
lang: en
tldr: "An MIT-licensed open-source UI automation framework from ByteDance (~13k GitHub stars). UI actions rely solely on feeding screenshots to vision-language models (Qwen3-VL / Doubao / Gemini-3 / UI-TARS), with no DOM parsing. A single JS API works across Web / Android / iOS / desktop, and starting from v1.0, the DOM action mode was removed entirely. The trade-off: each step is slower and more token-expensive."
description: "A deep dive into Midscene.js: design trade-offs of pure-vision UI automation, three API categories and two automation styles, multi-model strategy, caching mechanism, MCP and Skills ecosystem, and how it compares to Stagehand and browser-use."
draft: false
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

[Midscene.js](https://midscenejs.com/) is an MIT-licensed UI automation framework open-sourced by ByteDance's Web Infra team (~13k GitHub stars). Its bet is straightforward: **UI actions rely solely on screenshots, with no DOM parsing** -- you describe your goal in natural language, and a vision-language model (VLM) looks at the screen to decide where to click. This article breaks down its core trade-offs, API design, model strategy, ecosystem tools, and how it differs from DOM-oriented alternatives like Stagehand and browser-use, to help you decide when to use it.

## Core Concept: From "How to Click" to "What to Achieve"

Traditional UI automation (Selenium, Playwright) is tied to DOM selectors or XPath. When the frontend changes a class name or structure, scripts break. Midscene removes this layer entirely. The official README puts it plainly:

> Midscene.js is all-in on the pure-vision route for UI actions: element localization and interactions are based on screenshots only.

Element localization and interaction are "based on screenshots only." You no longer write "find `#login-btn` and click it" but rather "click the login button," leaving the rest to the model's grounding capability. This design yields three benefits:

- **Cross-platform universality**: The same JS API runs on Web, Android, iOS, HarmonyOS, and desktop. Even `<canvas>` and WebGL interfaces -- where DOM can't access content -- are operable, because to Midscene, everything is pixels.
- **Resilience to structural changes**: As long as the visual appearance hasn't changed, frontend refactors don't matter.
- **Token savings during action steps**: Skips the DOM tree, which can easily span tens of thousands of nodes, and sends only screenshots. DOM is selectively included via `domIncluded` only when doing data extraction (`aiQuery` / `aiAsk`).

A note of caution: the official claim that pure vision "saves ~80% tokens" is **relative to Midscene's own legacy DOM mode**, not compared to DOM-first competitors like Stagehand -- don't misquote it.

## Key Design Decision: v1.0 Removed DOM Action Mode Entirely

Midscene doesn't just "support pure vision" -- it's "pure vision only." According to the official model-strategy documentation, starting from v1.0:

> Midscene 1.0 and later only support the pure-vision approach — the DOM-extraction compatibility mode has been removed.

In v0.x, there was still a DOM-extraction compatibility mode to assist with localization; v1.0 removed it (only for actions/localization; data extraction can still opt-in to include DOM). This is an opinionated trade-off: **sacrificing the precision of DOM-based localization for cross-platform consistency and resilience to change.** The version trajectory reflects this direction -- UI-TARS support arrived in v0.10.0, caching in v0.11.0, DeepThink in v0.13 -- steadily converging toward "let the model look at the screen."

Another pragmatic decision: **model-native thinking is disabled by default.** The official stance is that enabling reasoning chains "significantly increases task latency with limited improvement," so it's off by default. When needed, you can enable `deepThink` / `deepLocate` for hard-to-locate elements.

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

Since pure vision calls the model at every step, Midscene includes built-in caching. According to the official caching documentation, it caches **two things**: AI planning steps and element localization XPaths (Web only). Query results from `aiQuery` / `aiBoolean` / `aiAssert` are **not cached**. When cache hits, official examples show a script dropping from 51 seconds to 28 seconds.

But caching is fragile: if text at the XPath position or DOM structure changes, it misses and falls back to AI; Canvas, cross-origin iframes, and closed Shadow DOM can't use it either. The documentation says it plainly -- this is "not a tool for guaranteeing long-term script stability." In other words, caching is an accelerator, not a cure for flakiness.

## Model Strategy: Multi-Model Division of Labor, GPT Not Suited as Primary

Midscene's success depends heavily on the VLM's grounding capability. The README lists supported models including `Qwen3-VL`, `Doubao-1.6-vision`, `gemini-3-pro`, and `UI-TARS`. Notably, the official stance on GPT models is blunt -- the model-strategy documentation states:

> Models like gpt-5 perform poorly here [visual grounding], so they cannot serve as the default.

GPT's visual grounding isn't good enough; it can only serve in a "planning" role, not as the primary localization model. The solution is **multi-model composition**: a Default model handles localization (Locate), with an optional Planning model (for `aiAct` task decomposition -- the official recommendation is a strong reasoning model) and an Insight model (for `aiQuery` / `aiAssert`). The underlying admission: no single model excels at every subtask.

Model selection directly affects accuracy: documentation notes that Qwen3-VL outperforms Qwen2.5-VL, 72B outperforms 30B, and setting `MIDSCENE_MODEL_FAMILY` incorrectly causes "noticeable element localization drift." For self-hosting, UI-TARS, Qwen3-VL, and open-weight GLM-4.6V are all options.

## Ecosystem: MCP, Skills, and Three Browser Modes

Midscene isn't just an SDK -- it plugs into the agent ecosystem:

- **MCP Server**: Exposes every atomic action (connect, screenshot, Tap, Scroll, assert...) as MCP tools, letting upstream agents inspect and operate UI using natural language. Packages include `@midscene/web-bridge-mcp`, `@midscene/android-mcp`, and `@midscene/computer-mcp`.
- **Midscene Skills**: No MCP setup required -- lets AI coding tools (Claude Code, Cline, OpenClaw) run CLI commands to drive automation directly. Installation is one line: `npx skills add web-infra-dev/midscene-skills` (add `-a claude-code` for Claude Code, `-a openclaw` for OpenClaw).

On the web side, there are three browser modes, as the official documentation describes:

> default Puppeteer headless, `--bridge` to use your own Chrome, `--cdp` to connect via CDP

**Bridge Mode** is particularly practical: through a Chrome extension, it lets your local Node script control your **existing desktop Chrome** -- reusing logged-in cookies, extensions, and sessions. This is ideal for "human-in-the-loop" scenarios or operating pages behind login walls. Debugging relies on visual replay reports, a built-in Playground, and Chrome extension features -- no raw log reading required.

## How to Choose Between Stagehand and browser-use

While all three fall under "AI operating interfaces," their approaches differ significantly:

```
                Localization      Platform       Language   Orientation
Midscene    Pure vision (screenshot) Cross-platform  JS/TS    SDK + toolchain
Stagehand   DOM (chunk+rank)         Browser only    TS       Built on Playwright
browser-use DOM/screenshot/hybrid    Browser only    Python   Autonomous agent
```

- **vs Stagehand** (by Browserbase, the team behind [browse.sh](/posts/ai/2026-05-23-browse-sh-browser-skills)): Stagehand parses DOM for localization and is built on Playwright. Its action target accuracy is typically more stable than pure vision, but it's **browser-only**. Midscene's differentiator is pure vision + true cross-platform (mobile/desktop) + JS. (This comparison is synthesized from secondary sources.)
- **vs browser-use**: Python-based, autonomous agent loop, re-reasons at every step, browser-only -- positioned as "let the agent surf the web on its own." Midscene leans toward an SDK approach where you "write it as a script/test."

In short: Midscene's selling point is **vision-first + true cross-platform + complete JS toolchain (reports/caching/MCP/Skills)**, with the trade-off of slower steps and higher token costs. For a broader view of the browser agent landscape, see the site's [Comparison of Three AI Agents' Chrome Strategies](/posts/ai/2026-05-09-ai-browser-agents-claude-codex-gemini) and [OpenClaw's Browser Control](/posts/ai/2026-03-28-openclaw-tools-browser-search).

## When to Use and When Not To, Plus Limitations

**Good fit**: End-to-end flows across Web / mobile / desktop, Canvas/WebGL and other non-standard DOM interfaces, writing RPA or tests in natural language, self-hosting open-source VLMs.

**Not a good fit**: When per-step latency and token cost are critical concerns, when the page DOM is stable and localization precision requirements are extremely high (DOM-first tools like Stagehand/Playwright are more efficient and stable here), or when you need a fully offline zero-model-call setup.

**Known limitations**: Pure vision places high demands on the model itself, and runtime resource consumption exceeds a11y-tree approaches; localization drift is a documented common issue (mitigated by switching to larger models, correctly setting `MIDSCENE_MODEL_FAMILY`, using `deepLocate`, and setting Web DPR to 2); caching is fragile against DOM changes. There's also a security note worth remembering -- the Skills README warns that AI automation "may produce unexpected results, as it can control everything on screen."

## Overall Assessment

Midscene trades "pure vision + cross-platform + complete developer toolchain" for universality and resilience to structural changes, at the cost of per-step latency, token expense, and dependence on VLM localization accuracy. It shifts the question of "can the automation run" from "is the DOM structure stable" to "can the model see accurately" -- this is both its biggest bet and its biggest risk. If your requirements involve cross-platform or operating non-standard DOM interfaces, it has virtually no competitors; but for stable browser page testing alone, DOM-first approaches are currently more efficient and stable. As VLM localization capabilities advance rapidly, the odds on this bet are improving.

## References

- [Midscene.js Official Site](https://midscenejs.com/)
- [web-infra-dev/midscene (GitHub)](https://github.com/web-infra-dev/midscene)
- [Midscene Introduction Documentation](https://midscenejs.com/introduction)
- [Model Strategy Documentation](https://midscenejs.com/model-strategy)
- [Caching Documentation](https://midscenejs.com/caching)
- [MCP Documentation](https://midscenejs.com/mcp)
- [Skills Documentation](https://midscenejs.com/skills)
- [Bridge Mode Documentation](https://midscenejs.com/bridge-mode)
- [web-infra-dev/midscene-skills (GitHub)](https://github.com/web-infra-dev/midscene-skills)
- [UI-TARS (GitHub)](https://github.com/bytedance/ui-tars)
- [Stagehand (GitHub)](https://github.com/browserbase/stagehand)
- [browser-use (GitHub)](https://github.com/browser-use/browser-use)
