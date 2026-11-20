---
title: "Comparing Hybrid AI Browser SDKs: Three Ways to Sort Seven Tools, and Why Vendor Success Rates Can't Be Compared"
date: 2026-11-19
category: ai
type: deep-dive
tags: [browser-automation, stagehand, midscene, skyvern, benchmark, playwright]
lang: en
tldr: "Stagehand, Midscene, Skyvern, AgentQL, Magnitude, HyperAgent, and Notte all follow the same pattern (your code controls the flow, individual steps go to a model) and differ in three things: how they see the page (DOM, screenshots, a query language), which driver sits underneath (which decides whether they fit into an existing Playwright script), and their cloud ties and license. Vendors' WebVoyager success rates can't be compared with each other: the removed tasks, models, browsers, and judges all differ, and the benchmark itself is easy enough that an agent that only runs a Google search solves half of it. There's no shared public benchmark for hybrid SDKs yet; to compare them, run your own tasks repeatedly."
description: "A comparison of hybrid AI browser SDKs: Stagehand v4, Midscene, Skyvern, AgentQL, Magnitude, HyperAgent, and Notte sorted by perception, driver, cloud ties, and license; why WebVoyager overestimates, how vendors' self-reported scores differ in their conditions, and how judges and browser environments shift scores; where things actually fail in production, and how to pick one or two candidates."
draft: false
series:
  name: "AI Browser Automation"
  order: 13
---

> :globe: [中文版](/posts/ai/2026-11-19-ai-browser-sdk-comparison)

Posts 8 through 12 covered four hybrid SDKs: [Stagehand v4](/posts/ai/2026-11-18-stagehand-v4-en), [Midscene](/posts/ai/2026-05-23-midscene-vision-ui-automation-en), [AgentQL](/posts/ai/2026-08-21-agentql-semantic-web-extraction-en), and [Skyvern](/posts/ai/2026-11-19-skyvern-en). What they share: your code controls the flow, and only individual steps go to a model. The same layer also holds Magnitude, HyperAgent, and Notte, and every README comes with an impressive success rate.

This post doesn't teach each tool again. It answers two questions: **which questions separate the SDKs in this layer, and whether vendors' published success rates can be compared.**

## First split: how it sees the page

The model has to know what's on the page before it can decide where to click. Four approaches:

- **Read the DOM or the accessibility tree.** Stagehand trims the accessibility tree and hands it to the model; [HyperAgent](https://github.com/hyperbrowserai/HyperAgent)'s `perform()` also uses the accessibility tree, with no screenshots; [Notte](https://docs.notte.cc/llms-full.txt) turns the page into its visible text with elements marked in place, like `[I1] Full name`. Cheap and fast, but the model only sees what DOM parsing produced, and anything the parser misses is invisible to it.
- **Look only at screenshots.** Since v1.0, Midscene locates elements purely from screenshots and [says](https://midscenejs.com/changelog) dropping DOM extraction cut token use by about 80%; Magnitude is also pure vision, with the model outputting pixel coordinates. Both need a model with UI grounding, and [Magnitude's README](https://github.com/magnitudedev/browser-agent) says it requires a "large visually grounded model". The upside is immunity to iframes, Canvas, and messy DOM; the cost is sending an image at every step.
- **A query language.** AgentQL lets you write a query shaped like the data you want back, and its backend finds the matching elements or data.
- **Screenshot plus an element list.** Skyvern sends both and has the model pick an element ID from the list. It admits its results were bottlenecked on DOM parsing, and 3.0 lets the model write JavaScript to read the HTML instead (details in the [Skyvern post](/posts/ai/2026-11-19-skyvern-en)).

A tiny third-party [microbenchmark](https://github.com/Rajeev-SG/web-automation-microbench/blob/main/artifacts/2026-09-11/report.md) shows the trade-off between the two main lines: on the same TodoMVC task with the same model, Magnitude passed every run but used about three times Stagehand's input tokens and about four times the time; Stagehand passed one run in four, which the author attributes to Stagehand's strict JSON schemas amplifying that model's weaknesses. The sample is tiny, so take only the direction, though it matches the trade-off between the two routes: the vision route is steadier, pricier, and slower; the DOM route's results are tightly tied to the model.

## Second split: the driver underneath

This decides whether you can drop it into an existing Playwright script and which browsers you get.

| Driver | Tools | What it means for you |
|---|---|---|
| Playwright | Skyvern, AgentQL, HyperAgent | Skyvern and AgentQL can add AI steps to your existing script, no rewrite; Skyvern actually launches only Chromium |
| Patchright (a Playwright fork) | Magnitude, Notte | Same API as Playwright, but Chromium only |
| Puppeteer or Playwright | Midscene | Works with either, plus Android, iOS, and desktop |
| Its own CDP plus a browser extension | Stagehand v4 | Can't take a Playwright `Page`; switching means a rewrite |

Stagehand v4 is the most commonly misunderstood. Its [migration guide](https://docs.stagehand.dev/v4/migrations/playwright) is blunt: it "has no Playwright dependency, so you can't hand a Playwright `Page` to `act()`. There is no interop". Plenty of comparison articles still describe it as "built on Playwright"; that was v2. For why, see the [driver post](/posts/ai/2026-11-18-cdp-vs-playwright-driver-en); for item-by-item differences, see [Stagehand vs Playwright](/posts/ai/2026-11-18-stagehand-vs-playwright-en).

## Third split: cloud ties and license

READMEs don't put these above the fold, but they often decide whether you can use a tool at all:

- **AgentQL always needs an API key.** The model runs on its backend; the [free plan](https://www.agentql.com/pricing) gives 50 calls a month, then $0.02 per call (prices as of November 2026).
- **Stagehand's cache works only on Browserbase.** The v4 [docs](https://docs.stagehand.dev/v4/best-practices/caching) say that with a local browser "the `cache` option has no effect and every call runs inference", and you have to email to get it enabled. v3's local cache is gone.
- **Skyvern's CAPTCHA solving, proxies, and anti-bot measures are Cloud-only.**
- **Licenses vary widely.** Stagehand and Midscene are MIT, Magnitude is Apache-2.0; HyperAgent and Skyvern are AGPL-3.0; Notte is SSPL (only `node-sdk/` is MIT); AgentQL open-sources only examples, with the core behind a closed API. To embed one in a closed-source product, AGPL and SSPL both need dealing with first.

Two more items affect long-term cost:

- **Caching or replay.** [Midscene](https://midscenejs.com/caching) stores planning steps and element locations locally in `.cache.yaml` files; [HyperAgent](https://github.com/hyperbrowserai/HyperAgent) records each action's XPath, and `runFromActionCache()` tries the XPath first and asks the model only if the page changed, and can export a TypeScript script; Skyvern generates code after one successful run and replays it. [Magnitude](https://github.com/magnitudedev/browser-agent)'s caching is still marked "in progress".
- **A test runner.** Midscene has YAML test cases plus Playwright and Vitest integration; Magnitude has its own `magnitude-test`. The others don't.

### Seven tools in one table

| | How it sees the page | Driver | Cloud ties | License | Recent activity |
|---|---|---|---|---|---|
| [Stagehand v4](https://github.com/browserbase/stagehand) | Accessibility tree | Its own CDP | Cache only on Browserbase | MIT | Active |
| [Midscene](https://github.com/web-infra-dev/midscene) | Screenshots only | Puppeteer or Playwright | None | MIT | Active |
| [Skyvern](https://github.com/Skyvern-AI/skyvern) | Screenshot + element list | Playwright | CAPTCHA, proxies in Cloud | AGPL-3.0 | Active |
| [AgentQL](https://github.com/tinyfish-io/agentql) | Query language | Playwright | API key required | Closed core | Active |
| [Magnitude](https://github.com/magnitudedev/browser-agent) | Screenshots only | Patchright | None | Apache-2.0 | No updates since Feb 2026 |
| [HyperAgent](https://github.com/hyperbrowserai/HyperAgent) | Accessibility tree (screenshots optional) | Playwright | Hyperbrowser optional | AGPL-3.0 | No updates since May 2026 |
| [Notte](https://github.com/nottelabs/notte) | Page text + element markers | Patchright | No key needed locally | SSPL | Active |

"Recent activity" reflects GitHub as of mid-November 2026. [Notte removed its agent loop in 1.10](https://github.com/nottelabs/notte) and Stagehand v4 removed `agent()`: the tools in this layer are converging on "a human writes the flow, the model handles single steps". Why that's happening is the subject of post 15.

## Why vendor success rates can't be compared

### WebVoyager itself is easy

The benchmark READMEs cite most is WebVoyager. The 2025 paper "[An Illusion of Progress?](https://arxiv.org/abs/2504.01382)" points out three problems: it covers only 15 websites; many tasks have shortcuts, so **an agent that only does "Google search, click into a result" solves 51%** (on 100 tasks the authors graded by hand); and its automatic judge agrees poorly with human judgment, while agents often claim success in their final answer, producing false positives.

The authors built Online-Mind2Web instead: 300 tasks across 136 websites, each labeled by at least two human annotators. The same search agent drops to 22% there (again on a 100-task sample). Under human grading, Browser Use scored 30.0%, 56.3% for Claude Computer Use 3.7, and 61.3% for OpenAI Operator.

### Three self-reported WebVoyager scores, three sets of conditions

| | Score | Tasks | Model and environment | Judge |
|---|---|---|---|---|
| [Browser Use](https://browser-use.com/posts/sota-technical-report) (2024-12) | 89.1% | 55 tasks removed | GPT-4o | WebVoyager's automatic judge, with "unknown" and "failed" verdicts manually reviewed and corrected |
| [Skyvern](https://www.skyvern.com/blog/skyvern-2-0-state-of-the-art-web-navigation-with-85-8-on-webvoyager-eval/) (2025-01) | 85.85% | 8 tasks removed, stale dates updated | GPT-4o + 4o-mini, Skyvern Cloud browsers | Not stated |
| [Magnitude](https://github.com/magnitudedev/webvoyager) (2025-07) | 93.9% | 590 tasks, dates patched, a few impossible tasks removed | Claude Sonnet 4 | LLM judge with some human review; reruns after browser crashes |

Which tasks were removed, which model, which browser, who judged: all four differ. Magnitude itself calls it "a very strange and awkward eval to run": dates need patching and the sites keep changing.

### Judges and browser environments change scores

- **Who judges.** Under the paper's human grading, Browser Use scored 30.0% on Online-Mind2Web; in 2026 it self-reports 98% on [its own site](https://browser-use.com/best-web-agents), using its own agentic judge, and admits the agent was developed against that same judge and that the judge's agreement with human graders hasn't been published. The agent changed generations in between, so not all of the gap is the judge, but the two numbers clearly can't sit side by side.
- **Which browser it runs on.** In [WebBench](https://webbench.ai/), the same Skyvern 2.0 scored 64.4% on its own infrastructure and 60.7% on Browserbase.

### Hybrid SDKs have no shared public benchmark

The newer benchmarks since 2025 mostly don't compare this layer: [BU Bench](https://browser-use.com/benchmarks/agents) and Browserbase's [HardBench](https://www.stagehand.dev/evals) compare combinations of models and agent harnesses; [BrowseComp](https://arxiv.org/abs/2504.12516) and [Mind2Web 2](https://arxiv.org/abs/2506.21506) test finding information; WebBench compares agents. Stagehand, Midscene, AgentQL, HyperAgent, and Notte have never been compared on the same task set. Even Browser Use's [comparison page](https://browser-use.com/best-web-agents) says to "read the scores as claims, not a head-to-head".

So a comparable number needs at least: the same task set (including the list of removed tasks), the same model, the same browser environment, a judge with published agreement against humans, and repeated runs with a reported spread.

## Where things actually fail

More useful than benchmarks is what people running these in production report.

A team building healthcare (EHR) integrations [wrote up their year](https://dev.to/michael_kronovet_261e3cc1/what-we-learned-building-healthcare-integrations-for-the-past-year-4n94): first agents, which were too slow, too expensive, and got things wrong; then Stagehand (v3 at the time), whose accessibility tree didn't map to the right elements on complex DOMs like Athena; and finally back to Playwright. The errors they hit were random popups, screens that rendered extremely slowly, and business edge cases (such as duplicate patient records), "something you absolutely don't want an AI resolving on its own"; the "selector changed" problem Stagehand was built for wasn't the main cause. Their fix was to use Claude Code to generate and iterate on Playwright scripts at development time, keeping an AI fallback at runtime only for a few cases, such as finding and closing popups from a screenshot. The team later open-sourced its own tool, so the post has a promotional angle.

[Forus](https://build.forus.com/ehr-browser-automation-ai-agents), another company doing EHR prior authorization, reached the same conclusion: "Agents for authoring, but not for execution". The agent proposes actions, a human approves, and only steps that ran successfully go into a fixed Playwright script.

When LangChain picked tools for its own product, it [compared seven toolsets](https://www.langchain.com/blog/how-we-optimized-browser-use-for-deep-agents): on 100 WebVoyager tasks, success rates all landed between 78% and 90%, but cost differed by about 13x (Stagehand's toolset $1.98, Playwright MCP $26.71). Note that the post was written after LangChain chose Stagehand, and it compared toolsets for agents, not the "human writes the flow, single-step act()" usage. Still, the pattern of "similar success rates, an order of magnitude apart in cost" is worth remembering.

## How to pick one or two candidates

Ask in order:

1. **You already have Playwright scripts and just want AI on the steps that keep breaking?** Pick a tool you can use inside a Playwright script (Skyvern's SDK or AgentQL), or Midscene, which works with either Playwright or Puppeteer. Stagehand v4 means a rewrite.
2. **The DOM is a mess (nested iframes, Canvas, legacy systems)?** Consider the vision route (Midscene, Magnitude) and accept more tokens, slower runs, and the model requirements.
3. **Mostly extracting data?** AgentQL's query is the shape of the output, but every call costs money and needs an API key.
4. **Writing tests to run in CI?** Midscene has test integrations; Magnitude has a runner too, but hasn't been updated in most of a year.
5. **Embedding the code in a closed-source product?** AGPL (Skyvern, HyperAgent) and SSPL (Notte) need dealing with first; calling someone else's cloud service through an API is a different situation, and the three usage patterns are laid out in the [Skyvern post](/posts/ai/2026-11-19-skyvern-en). This isn't legal advice. MIT-licensed Stagehand and Midscene and Apache-2.0 Magnitude don't have this issue.
6. **Want local replay without paying for inference every time?** Midscene's and HyperAgent's caches work locally; Stagehand v4's cache needs Browserbase; Skyvern's docs don't say whether its code replay fully works self-hosted.

Once you have one or two, take 20 of your own real tasks, run each at least three times, and record success rate, cost per run, and time. The production reports above all point the same way: your pages, your model, and your browser environment predict results better than any number in a README.

## Going deeper

The shared premise of this layer is "your code controls the flow". The next post, [Browser Use](/posts/ai/2026-08-21-browser-use-complete-guide-en), takes the other road: give the model one task and let it decide every step. When Stagehand v4 removed `agent()`, it [said](https://docs.stagehand.dev/v4/migrations/v3) "Nothing in v4 replaces it one-for-one", and Skyvern has its own agent mode too, so the line between the two roads is blurrier than it looks.

## References

- [browserbase/stagehand](https://github.com/browserbase/stagehand)
- [Stagehand: Caching](https://docs.stagehand.dev/v4/best-practices/caching)
- [Stagehand: Migrate Playwright to v4](https://docs.stagehand.dev/v4/migrations/playwright)
- [Stagehand: Migrate v3 to v4](https://docs.stagehand.dev/v4/migrations/v3)
- [web-infra-dev/midscene](https://github.com/web-infra-dev/midscene)
- [Midscene: Caching](https://midscenejs.com/caching)
- [Skyvern-AI/skyvern](https://github.com/Skyvern-AI/skyvern)
- [tinyfish-io/agentql](https://github.com/tinyfish-io/agentql)
- [AgentQL Pricing](https://www.agentql.com/pricing)
- [magnitudedev/browser-agent](https://github.com/magnitudedev/browser-agent)
- [magnitudedev/webvoyager](https://github.com/magnitudedev/webvoyager)
- [hyperbrowserai/HyperAgent](https://github.com/hyperbrowserai/HyperAgent)
- [nottelabs/notte](https://github.com/nottelabs/notte)
- [Xue et al., An Illusion of Progress? Assessing the Current State of Web Agents (arXiv 2504.01382)](https://arxiv.org/abs/2504.01382)
- [Browser Use: SOTA technical report](https://browser-use.com/posts/sota-technical-report)
- [Browser Use: Best web agents](https://browser-use.com/best-web-agents)
- [Skyvern: Skyvern 2.0 WebVoyager benchmark results](https://www.skyvern.com/blog/skyvern-2-0-state-of-the-art-web-navigation-with-85-8-on-webvoyager-eval/)
- [Halluminate: WebBench](https://halluminate.ai/blog/benchmark)
- [WebBench leaderboard](https://webbench.ai/)
- [Midscene: Changelog](https://midscenejs.com/changelog)
- [Notte docs (llms-full.txt)](https://docs.notte.cc/llms-full.txt)
- [Browser Use: Agent benchmarks (BU Bench)](https://browser-use.com/benchmarks/agents)
- [Stagehand: Evals (HardBench)](https://www.stagehand.dev/evals)
- [Wei et al., BrowseComp (arXiv 2504.12516)](https://arxiv.org/abs/2504.12516)
- [Gou et al., Mind2Web 2 (arXiv 2506.21506)](https://arxiv.org/abs/2506.21506)
- [Michael Kronovet: What we learned building healthcare integrations for the past year](https://dev.to/michael_kronovet_261e3cc1/what-we-learned-building-healthcare-integrations-for-the-past-year-4n94)
- [Forus: EHR browser automation with AI agents](https://build.forus.com/ehr-browser-automation-ai-agents)
- [LangChain: How we optimized browser use for Deep Agents](https://www.langchain.com/blog/how-we-optimized-browser-use-for-deep-agents)
- [Rajeev-SG/web-automation-microbench (2026-09-11 report)](https://github.com/Rajeev-SG/web-automation-microbench/blob/main/artifacts/2026-09-11/report.md)
