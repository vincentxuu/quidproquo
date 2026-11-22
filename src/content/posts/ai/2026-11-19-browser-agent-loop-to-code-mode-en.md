---
title: "What Happened to the AI Browser Agent Loop: What Stagehand, Notte, and Browser Use Removed, and Where Inference Went"
date: 2026-11-19
category: ai
type: deep-dive
tags: [browser-agent, browser-use, stagehand, code-mode, browser-automation]
lang: en
tldr: "In the second half of 2026, Stagehand v4 removed agent(), Notte 1.10 removed its whole agent loop, and Browser Use 1.0 replaced its engine. What they removed is the loop where the framework defines a menu of actions and has the model pick one per step; inference itself moved to two places: authoring time, where AI writes a script once and it runs as-is (Stagehand code mode, Skyvern's code replay, Playwright Test Agents); or a coding agent's loop, where each step becomes the model writing a piece of code (Browser Use 1.0, Stagehand's MCP run tool). Repeated tasks with a known path suit the first; open-ended search and unfamiliar sites still need inference on every run."
description: "Why the agent loop is leaving AI browser automation: why the old \"fixed action menu plus framework loop\" made sense in 2024 and later became the bottleneck; what Stagehand v4, Notte 1.10, and Browser Use 1.0 each removed; the evidence and costs for moving inference to authoring time versus handing the loop to a coding agent; and which tasks still need runtime inference."
draft: false
series:
  name: "AI Browser Automation"
  order: 15
---

> :globe: [中文版](/posts/ai/2026-11-19-browser-agent-loop-to-code-mode)

The [previous post on Browser Use](/posts/ai/2026-08-21-browser-use-complete-guide-en) covered the classic agent loop: read the page state, have the model pick an action (click, type, scroll), run it, read again. That post was written in the 0.x era. Browser Use 1.0, released November 10, 2026, replaced that engine entirely. Within four months, Stagehand v4 removed `agent()` and Notte 1.10 removed its whole agent loop.

This post answers: **what exactly these tools removed and where inference went; and whether your task should have AI write a script once, or decide inside a loop every time.**

## Three changes in four months

| Tool | When | What was removed | What replaced it |
|---|---|---|---|
| [Stagehand v4](https://docs.stagehand.dev/v4/migrations/v3) | 2026-08 | `agent()`: the model picking one of act, extract, observe at each step | Code mode (AI writes a script once) is the recommended path; a route where the model calls tools during the run remains |
| [Notte 1.10](https://github.com/nottelabs/notte) | 2026-10 | `notte.Agent`, workflows, and the whole agent loop | Outside agents drive browsers through the SDK, CLI, or MCP; finished automations deploy as Functions |
| [Browser Use 1.0](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md) | 2026-11 | The engine that "picks one action per step from a DOM dump", plus recorded replay | Each step, the model writes code in a persistent Python REPL and talks raw CDP |

The three moves aren't identical. Browser Use 1.0's `Agent` is still a loop at runtime; only what happens inside each step changed. So the common thread isn't "no more inference". It's this: **the framework no longer defines its own action menu or writes its own loop.**

## Why the old loop made sense, and why it became the bottleneck

In the old approach, the framework decided two things up front: what the model sees (the clickable elements on the page) and what the model can do (a handful of actions like click, type, scroll). At each step the model just picked one.

In 2024 that was right. Browser Use looks back in "[The Bitter Lesson of Browser Agents](https://browser-use.com/posts/bitter-lesson-browser-agents)": "When we launched Browser Use in November 2024, GPT-4o wasn't trained for computer use." Stagehand's [migration guide](https://docs.stagehand.dev/v4/migrations/v3) likewise says `agent()` "was built for models that couldn't reliably drive a browser on their own", and picking one tool per step "was the right shape for the models available at the time".

As models got stronger, those two predefined lists became the limit:

- **The page state the framework hands over misses things.** In Browser Use's words: "A cookie button can be right there on the screen and missing from the state we send." The button is on screen but not in the list the framework built, so no model, however smart, can click it. They illustrate it with a simplified healthcare-system example where a button sits inside a closed shadow root inside a cross-origin iframe inside an open shadow root.
- **Every step is an inference call.** Stagehand's migration guide names the problem: a good script uses `page.locator()` directly where a selector is stable and spends a model call only where judgment is needed, and "`agent()` couldn't make that split, because every step it ran was an inference call".
- **A fixed toolset can't keep up with the models.** Browserbase is blunter in "[Evolving computer use with code](https://www.browserbase.com/blog/evolving-computer-use-with-code)": act, extract, and observe were designed on the assumption that models were untrustworthy, "But we were so wrong", and those abstractions "ended up becoming hurtful limitations with every new generation of frontier model".

```diagram
title: Where inference happens
desc: Three rows. Row one, "old loop": at each step the model picks an action from a fixed menu and the framework runs it; every step is an inference call. Row two, "authoring time": the model writes a script once, and every later run executes the script without inference. Row three, "handed to a coding agent": inside the coding agent's loop, the model writes a piece of code at each step that drives the browser directly.
caption: Row two moves inference before execution and asks the model again only when the script breaks; row three keeps the loop, but the unit of action changes from "one tool" to "a piece of code", and the loop is no longer maintained by the browser framework.
---
<svg viewBox="0 0 640 336">
  <text class="dg-tag" x="24" y="32" dominant-baseline="central">OLD LOOP (STAGEHAND V3 AGENT(), BROWSER USE 0.X)</text>
  <rect class="dg-box" x="24" y="48" width="180" height="56" rx="6"/>
  <text class="dg-label" x="114" y="68" text-anchor="middle" dominant-baseline="central">Model picks action</text>
  <text class="dg-sub" x="114" y="88" text-anchor="middle" dominant-baseline="central">inference every step</text>
  <rect class="dg-box" x="436" y="48" width="180" height="56" rx="6"/>
  <text class="dg-label" x="526" y="68" text-anchor="middle" dominant-baseline="central">Framework runs it</text>
  <text class="dg-sub" x="526" y="88" text-anchor="middle" dominant-baseline="central">click, type, scroll</text>
  <path class="dg-line" d="M204 76H432" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="320" y="62" text-anchor="middle" dominant-baseline="central">fixed menu</text>

  <text class="dg-tag" x="24" y="144" dominant-baseline="central">AUTHORING TIME (CODE MODE, CODE REPLAY, TEST AGENTS)</text>
  <rect class="dg-box dg-box--accent" x="24" y="160" width="180" height="56" rx="6"/>
  <text class="dg-label" x="114" y="180" text-anchor="middle" dominant-baseline="central">Model writes script</text>
  <text class="dg-sub" x="114" y="200" text-anchor="middle" dominant-baseline="central">asked again on breakage</text>
  <rect class="dg-box" x="436" y="160" width="180" height="56" rx="6"/>
  <text class="dg-label" x="526" y="180" text-anchor="middle" dominant-baseline="central">Script runs each time</text>
  <text class="dg-sub" x="526" y="200" text-anchor="middle" dominant-baseline="central">no runtime inference</text>
  <path class="dg-line dg-line--accent" d="M204 188H432" marker-end="url(#arrow-accent)"/>
  <text class="dg-edge" x="320" y="174" text-anchor="middle" dominant-baseline="central">ordinary code</text>

  <text class="dg-tag" x="24" y="256" dominant-baseline="central">HANDED TO A CODING AGENT (BROWSER USE 1.0, STAGEHAND MCP)</text>
  <rect class="dg-box" x="24" y="272" width="180" height="56" rx="6"/>
  <text class="dg-label" x="114" y="292" text-anchor="middle" dominant-baseline="central">Model writes code</text>
  <text class="dg-sub" x="114" y="312" text-anchor="middle" dominant-baseline="central">harness runs the loop</text>
  <rect class="dg-box" x="436" y="272" width="180" height="56" rx="6"/>
  <text class="dg-label" x="526" y="300" text-anchor="middle" dominant-baseline="central">Browser</text>
  <path class="dg-line" d="M204 300H432" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="320" y="286" text-anchor="middle" dominant-baseline="central">CDP or Playwright code</text>
</svg>
```

## Road one: move inference to authoring time

Have AI write a script once during development; every run after that is ordinary code.

- **Stagehand code mode.** From the migration guide: "The model writes the code once instead of driving the browser on every run." The output is "ordinary code: reviewable, diffable, and free of per-step inference", and when a site changes, "re-run the assistant on the step that broke". This is where Browserbase recommends starting.
- **Playwright Test Agents.** The generator turns a test plan into ordinary Playwright tests, and the healer finds replacement elements and proposes a patch when a test breaks. No model runs during the tests; see [Stagehand vs Playwright](/posts/ai/2026-11-18-stagehand-vs-playwright-en).
- **Skyvern's code replay.** After an agent run succeeds, Skyvern generates code and runs it directly from then on; if the code fails, it falls back to the agent and regenerates by default; see the [Skyvern post](/posts/ai/2026-11-19-skyvern-en).

Teams running this in production reached the same conclusion. The healthcare-integration team and Forus mentioned in [the hybrid SDK comparison](/posts/ai/2026-11-19-ai-browser-sdk-comparison-en) both have AI write Playwright scripts and don't let it make decisions at runtime. A section heading in [Forus](https://build.forus.com/ehr-browser-automation-ai-agents)'s post says it outright: "Agents for authoring, but not for execution".

## Road two: hand the loop to a coding agent, and make actions code

The other road doesn't remove runtime inference. It changes two things: the unit of action goes from "pick a tool" to "write a piece of code", and the loop itself goes to coding agents that already have a large user base.

**Browser Use 1.0** is the most thorough example. The first line of [MIGRATING.md](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md): "The agent no longer picks one action per step from a DOM dump. It writes Python in a persistent REPL with browser-harness helpers and raw CDP, on Pydantic AI." One step is one model request, one piece of Python. The Bitter Lesson post lays out the evolution in stages: first let the model write code instead of picking actions, then let it talk to CDP directly and choose what to observe ("No mandatory list of clickable elements"), and finally hand the loop to an existing harness: "Pi, Codex and OpenCode already handle the agent loop. Coding agents have millions of users trying all sorts of work." Its CLI is meant to be installed as a skill for Claude Code or Codex.

Note that Browser Use 1.0 also [removed recorded replay](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md) (`rerun_history()`, `save_as_playwright_script()`); the docs' advice is "run the task again". It's betting on road two, the opposite direction from road one.

**Stagehand's tools for agents.** Browserbase offers three MCP tools, `run` (execute a piece of code), `snapshot`, and `screenshot`, so your own agent can write code to drive the browser. In "[Evolving computer use with code](https://www.browserbase.com/blog/evolving-computer-use-with-code)" they describe a snag: models couldn't write Stagehand syntax well, "Stagehand was simply not in the weights", so they let models write Playwright code and transpile it to Stagehand on the fly.

**Notte 1.10**, after removing its agent, has outside agents drive the browser through the SDK, CLI, and MCP. Its README and [PR](https://github.com/nottelabs/notte/pull/1202) don't give a reason, only what was removed and what to use instead; [the same release](https://github.com/nottelabs/notte/releases/tag/v1.10.0) added integrations with a long list of outside agent frameworks, including the OpenAI Agents SDK and the Claude Agent SDK.

Model providers do the same. The example in OpenAI's [computer use guide](https://developers.openai.com/api/docs/guides/tools-computer-use) is a turn-by-turn loop where the `exec_js` tool lets the model write JavaScript against Playwright objects each turn.

Where does this road save? [The hybrid SDK comparison](/posts/ai/2026-11-19-ai-browser-sdk-comparison-en) mentioned LangChain's [comparison of seven toolsets](https://www.langchain.com/blog/how-we-optimized-browser-use-for-deep-agents) (written after they chose Stagehand). What matters here is the step count: Playwright MCP, which does one action per call, averaged 26 steps per task, while Stagehand's toolset, where the agent writes code, averaged 10, and cost differed by about 13x as a result. Both are runtime inference; the saving is going from one inference per action to one inference per piece of code.

## Where inference can't be avoided

An authoring-time script assumes the path is known in advance. These cases don't fit:

- **Open-ended search.** [BrowseComp](https://arxiv.org/abs/2504.12516) tests persistently hunting for hard-to-find information on the web, and the paper finds that "Accuracy scales smoothly with test-time compute". There's no path to write down ahead of time.
- **Sites you haven't seen.** A workflow running for the first time has no script to replay, and both Skyvern's and Stagehand's code replay need an agent run first.
- **Pages that drift.** Layout tweaks, copy changes, and A/B tests all break generated scripts. That's why every vendor keeps a way back: Skyvern's AI fallback is on by default, Stagehand keeps the route where the model calls tools during the run, and Playwright has the healer.

For a sense of what runtime inference costs, see Browserbase's [HardBench](https://www.stagehand.dev/evals) leaderboard (self-reported): 102 harder browser tasks, where the top combinations of models and coding agents cost $0.12 to $3.07 and several minutes per task. It compares models and harnesses, doesn't measure script replay, and can't be compared to scripts directly.

## How to choose: AI writes it once, or decides in a loop every time

- **The same workflow runs hundreds of times along a mostly fixed path: write a script once.** Use the model for authoring and repair, and at runtime reach for single-step calls like `act()` only on steps that genuinely need judgment.
- **One-off or exploratory tasks, unfamiliar sites: let an agent work in a loop.** Pick tools whose unit of action is code (Browser Use 1.0, Stagehand's `run`); they take fewer steps and cost less than one-action-per-call tools.
- **Mistakes are expensive: don't let AI make decisions at runtime.** The healthcare team's conclusion: "Runtime AI is fine when the worst case is a retry, but not when the agent is making decisions you can't anticipate or review" ([Libretto](https://libretto.sh/blog/what-we-learned-building-healthcare-integrations)).
- **AI writing code to drive the browser: treat it like running an unfamiliar program on your machine.** Browser Use 1.0's REPL runs model-written Python as your user, and its [docs](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md) say plainly "This is not a sandbox"; put untrusted tasks in a container or VM.

## Going deeper

The Bitter Lesson post says they let the model talk to CDP directly instead of using Playwright, partly because "Playwright adds assumptions, such as locators that cannot see closed shadow roots". Why teams building agent tools drop Playwright and write their own driver, and what it costs, is the subject of the next post, the [driver post](/posts/ai/2026-11-18-cdp-vs-playwright-driver-en).

## References

- [Browser Use: MIGRATING.md (0.x → 1.0)](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md)
- [Browser Use: The Bitter Lesson of Browser Agents](https://browser-use.com/posts/bitter-lesson-browser-agents)
- [Stagehand: Migrate v3 to v4](https://docs.stagehand.dev/v4/migrations/v3)
- [Browserbase: Evolving computer use with code](https://www.browserbase.com/blog/evolving-computer-use-with-code)
- [nottelabs/notte README](https://github.com/nottelabs/notte)
- [nottelabs/notte PR #1202: notte 1.10](https://github.com/nottelabs/notte/pull/1202)
- [Playwright: Test Agents](https://playwright.dev/docs/test-agents)
- [Skyvern: Browser automation (cached code)](https://github.com/Skyvern-AI/skyvern/blob/main/docs/developers/browser-automation.mdx)
- [Forus: EHR browser automation with AI agents](https://build.forus.com/ehr-browser-automation-ai-agents)
- [Libretto: What we learned building healthcare integrations](https://libretto.sh/blog/what-we-learned-building-healthcare-integrations)
- [LangChain: How we optimized browser use for Deep Agents](https://www.langchain.com/blog/how-we-optimized-browser-use-for-deep-agents)
- [OpenAI: Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)
- [Wei et al., BrowseComp (arXiv 2504.12516)](https://arxiv.org/abs/2504.12516)
- [Stagehand: Evals (HardBench)](https://www.stagehand.dev/evals)
