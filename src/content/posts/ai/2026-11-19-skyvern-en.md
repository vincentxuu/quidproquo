---
title: "Skyvern: From Screenshots plus an Element List to Letting the Model Read HTML, with an SDK, Agents, and No-Code Workflows, and an AGPL License to Read First"
date: 2026-11-19
category: ai
type: deep-dive
tags: [skyvern, browser-automation, browser-agent, playwright, agpl]
lang: en
tldr: "Skyvern is AI browser automation built on Playwright that gives you a code SDK (page.act, page.extract), natural-language tasks, and no-code workflows assembled from blocks. In 1.0 and 2.0, each step hands the model a screenshot plus a list of interactive elements and the model picks an element ID; 3.0 lets the model write JavaScript to read the HTML itself (new Cloud agents default to it; the API still defaults to 1.0). It suits running one workflow across many unfamiliar sites. The costs: it's slow (users running it locally report four to five minutes for a login plus a form), CAPTCHA solving and proxies are Cloud-only, and most published scores are self-reported. The license is AGPL-3.0: modify it and let users interact with it over a network, and you must offer those users the source."
description: "A deep dive into Skyvern: how each step uses a screenshot plus an element list to let the model choose an action, and why 3.0 lets the model read HTML itself; its three entry points (SDK, tasks, block workflows including Studio); how self-hosting differs from Cloud and how billing works; what AGPL-3.0 section 13 means in three usage patterns; and how to read its WebVoyager 85.85% and WebBench scores."
draft: false
series:
  name: "AI Browser Automation"
  order: 12
---

> 🌏 [中文版](/posts/ai/2026-11-19-skyvern)

[AgentQL](/posts/ai/2026-08-21-agentql-semantic-web-extraction-en) lets you describe the data you want as a query, and relies on the DOM. [Midscene](/posts/ai/2026-05-23-midscene-vision-ui-automation-en) goes to the other extreme and looks only at screenshots. Skyvern sits in between: at each step it looks at both the screenshot and the page's interactive elements. It's also one of the few tools in this layer that gives you three ways in: an SDK for code, one-sentence tasks, and a workflow editor non-engineers can drag blocks around in.

This post answers: **when you need to run the same workflow across many unfamiliar sites, what Skyvern gains you and what it costs; and what its AGPL-3.0 license means for you.**

## How Skyvern sees a page

The [official docs](https://github.com/Skyvern-AI/skyvern/blob/main/docs/concepts.mdx) describe a four-step loop; this is how 1.0 and 2.0 work (3.0's changes come in the next section):

```diagram
title: One Skyvern 1.0/2.0 step
desc: Four boxes left to right: read the page (screenshot plus interactive element list), model picks an action (returns an element ID), Playwright runs it (click, type), check the goal (loop again if not met). A line runs from the last box back to the first.
caption: Each pass is one step. The model returns an element ID from the list, not screen coordinates, so Skyvern depends heavily on how well it parses the DOM.
---
<svg viewBox="0 0 640 172">
  <rect class="dg-box" x="24" y="40" width="130" height="64" rx="6"/>
  <text class="dg-label" x="89" y="62" text-anchor="middle" dominant-baseline="central">Read page</text>
  <text class="dg-sub" x="89" y="84" text-anchor="middle" dominant-baseline="central">screenshot + list</text>
  <rect class="dg-box dg-box--accent" x="180" y="40" width="130" height="64" rx="6"/>
  <text class="dg-label" x="245" y="62" text-anchor="middle" dominant-baseline="central">Model picks</text>
  <text class="dg-sub" x="245" y="84" text-anchor="middle" dominant-baseline="central">an element ID</text>
  <rect class="dg-box" x="336" y="40" width="130" height="64" rx="6"/>
  <text class="dg-label" x="401" y="62" text-anchor="middle" dominant-baseline="central">Playwright</text>
  <text class="dg-sub" x="401" y="84" text-anchor="middle" dominant-baseline="central">click, type</text>
  <rect class="dg-box" x="492" y="40" width="130" height="64" rx="6"/>
  <text class="dg-label" x="557" y="62" text-anchor="middle" dominant-baseline="central">Check goal</text>
  <text class="dg-sub" x="557" y="84" text-anchor="middle" dominant-baseline="central">loop if not met</text>
  <path class="dg-line" d="M154 72H176" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M310 72H332" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M466 72H488" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M557 104V140H89V108" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="323" y="154" text-anchor="middle" dominant-baseline="central">next step</text>
</svg>
```

1. Take a screenshot and read the page's interactive elements: inputs, buttons, links, dropdowns. Each element gets an ID.
2. The model looks at the screenshot, the element list, and your goal together and picks the next action: click, type, select, scroll, upload, or extract. What it returns is an element ID from the list.
3. Playwright runs the action in Chromium.
4. Check whether the goal is met; if not, loop again with the new page.

Early versions drew a numbered box around each element on the screenshot before sending it to the model; the current version [marks that feature deprecated](https://github.com/Skyvern-AI/skyvern/blob/main/skyvern/webeye/scraper/scraper.py). When the model can't take images, Skyvern works from the element list alone, though the [docs recommend](https://github.com/Skyvern-AI/skyvern/blob/main/docs/developers/self-hosted/overview.mdx) a vision model for complex pages.

So "vision-based" is only half right. In an October 2026 [blog post](https://www.skyvern.com/blog/deleting-rag-from-our-web-agent-made-it-2-3x-faster/), Skyvern admits that its earlier versions were stuck on DOM parsing: Shadow DOM, iframes, Canvas, and assorted UI component libraries each needed handling, and "agent performance did not improve with better LLMs. Instead, it was bottlenecked by this DOM parsing logic". A stronger model didn't help, because the element list it received was incomplete to begin with.

### 3.0 lets the model read HTML itself

The same post introduces a rewritten Skyvern 3.0. Instead of sending a screenshot and element list at every step, it gives the model a few tools: write JavaScript to scan the HTML, act on the page, take a screenshot when needed, and declare the run finished. By the vendor's numbers, screenshots now account for 2.7% of all model calls (down from 27%); in an A/B across roughly 100,000 production runs, mean run time fell from 593 to 262 seconds and cost per run from $0.039 to $0.0302. These are all the vendor's own measurements.

Watch the defaults: agents created in Skyvern Cloud run on 3.0 by default, but `run_task` from the API or SDK still [defaults](https://github.com/Skyvern-AI/skyvern/blob/main/docs/concepts.mdx) to 1.0, labeled Legacy, unless you specify otherwise.

## Three ways in

**SDK: add AI steps to a Playwright script.** The [README](https://github.com/Skyvern-AI/skyvern) calls it "a Playwright extension that adds AI-powered browser automation". The `page` object gains `act`, `extract`, `validate` (returns a boolean), and `prompt`, and the regular Playwright actions accept a `prompt` too:

```python
await page.click("#submit-button")                       # plain Playwright
await page.click(prompt="Click the green Submit button")  # hand it to the model
await page.click("#submit-btn", prompt="Click the Submit button")  # try the selector, fall back to the model
```

The third form is the most useful: stable steps keep using selectors, and you pay for inference only when a selector breaks. It's the same direction [Stagehand v4](/posts/ai/2026-11-18-stagehand-v4-en) encourages. In Python you need `pip install "skyvern[local]"` for these page methods; plain `pip install skyvern` is just a client for the Cloud API.

**Tasks: one sentence and a URL.** `skyvern.run_task(prompt="...")` hands the job to the agent, optionally with a schema for the data to return and error codes.

**Agents (workflows): chain blocks together.** The API and older docs call them workflows. [Blocks](https://github.com/Skyvern-AI/skyvern/blob/main/docs/reference/blocks.mdx) cover browser actions (tasks, extraction, login, go to URL), data (file parsing, Google Sheets read and write), control flow (loops, conditionals, AI validation, waits), files (downloads, PDF filling), and communication (email, HTTP requests, waiting for a human). One block's output can feed the next. The Studio web app includes a Copilot: describe the job in plain words and it assembles the blocks. This is what sets Skyvern apart from the other SDKs in this layer: a workflow can be maintained by colleagues who don't write code.

Agents have one more feature worth noting: **run once, then keep it as code.** After an agent run succeeds, Skyvern can [generate code](https://github.com/Skyvern-AI/skyvern/blob/main/docs/developers/browser-automation.mdx) from the actions it took, and later runs execute that code instead of asking the model at every step (`run_with="code"`). If a page change breaks the code, it falls back to the agent and regenerates it by default. It's the same idea as Stagehand's observe replay: pay for inference the first time and when something breaks.

## Self-hosting versus Cloud

You can run Skyvern locally with `pip install "skyvern[server]"` and `skyvern quickstart`, or bring up the full interface with Docker Compose. But the [official docs](https://github.com/Skyvern-AI/skyvern/blob/main/docs/developers/production.mdx) and [pricing page](https://www.skyvern.com/pricing) are clear that some things exist only in Cloud:

| | Self-hosted | Cloud |
|---|---|---|
| Credential storage (the model sees only a placeholder) | Yes; can also use Bitwarden/Vaultwarden | Yes; 1Password from the Pro plan |
| TOTP two-factor | Set a TOTP key | Yes, from the Pro plan |
| CAPTCHA | Not solved; it waits 30 seconds for you to solve it by hand | Common ones solved (basic on Hobby, advanced on Pro); "Solving is not guaranteed" |
| Proxies and geolocation | Bring your own | Yes; residential proxies from the Pro plan |
| Anti-bot measures | None; this part isn't open source | Yes |

Three self-hosted defaults to change yourself (see the [self-hosted docs](https://github.com/Skyvern-AI/skyvern/blob/main/docs/developers/self-hosted/overview.mdx)):

- **Telemetry is on by default**, and the usage events include each task's starting URL. Turn it off with `SKYVERN_TELEMETRY=false`.
- **Internal addresses aren't blocked by default**, so a page could steer the agent into services on your internal network. Set `ENABLE_URL_VALIDATION=true`.
- **The Kubernetes manifests have no authentication**, and the docs say plainly to keep the cluster off the public internet.

Cloud bills by [action](https://github.com/Skyvern-AI/skyvern/blob/main/docs/cloud/account.mdx): one credit is $0.001, an AI action (a click, a keystroke, an extraction) is 30 credits, or $0.03; an action replayed from code is 15 credits; and browser uptime is 200 credits an hour. The [monthly plans](https://www.skyvern.com/pricing) are Hobby at $29 (30,000 credits) and Pro at $149 (150,000 credits). Roughly, Hobby covers about a thousand AI actions. If a site blocks a workflow at its last step, every step before it is still billed. That said, the pricing page FAQ says billing is per run rather than per step, which doesn't match the credit table in the docs; check the usage breakdown on the billing page, or ask the vendor.

## AGPL-3.0: figure out which use case you're in

Skyvern's repo is standard [AGPL-3.0](https://github.com/Skyvern-AI/skyvern/blob/main/LICENSE) with no added exceptions. The README says all the core logic is in the open-source repo except the anti-bot measures kept in Cloud, and for licensing questions says "contact us"; there's no public statement about buying a separate commercial license.

What distinguishes AGPL from GPL is [section 13](https://www.gnu.org/licenses/agpl-3.0.en.html), which counts use over a network:

> if you modify the Program, your modified version must prominently offer all users interacting with it remotely through a computer network (if your version supports such interaction) an opportunity to receive the Corresponding Source of your version

What follows summarizes the clause; it isn't legal advice. Three common patterns land differently:

1. **Calling Skyvern Cloud through its API**: you neither receive nor modify Skyvern's code, and section 13 is premised on "you modify the Program", so it doesn't reach you.
2. **Self-hosting it unmodified as a separate service that your product calls over HTTP**: section 13 only binds modified versions. Whether your own code counts as a derivative work depends on how tightly the two are combined, which is a general AGPL interpretation question; Skyvern hasn't published guidance.
3. **Modifying Skyvern, or putting its code inside your service**: when users interact with a modified version over a network, you must offer the corresponding source. Note that the Python SDK from `pip install skyvern` lives in the same AGPL repo, so think before you `import skyvern` into a closed-source SaaS.

If you plan to embed it in a closed-source product, ask a lawyer or contact Skyvern about licensing. Someone in the community has [asked in an issue](https://github.com/Skyvern-AI/skyvern/issues/8757) for a permissive license; as of November 2026 there's no official reply.

## How to read the scores

Two numbers show up most in the README and on the website, and both need their conditions:

- **WebVoyager 85.85%** (January 2025, Skyvern 2.0): [self-reported](https://www.skyvern.com/blog/skyvern-2-0-state-of-the-art-web-navigation-with-85-8-on-webvoyager-eval/), run on Skyvern Cloud with GPT-4o and GPT-4o-mini. They removed 8 tasks whose "results are no longer valid" and updated stale dates in the flight and hotel booking tasks. The post itself admits WebVoyager "only captures 15 hand-picked websites". Problems with the benchmark itself, such as [a search-only agent scoring about half](https://arxiv.org/abs/2504.01382), are left for the next post's comparison.
- **WebBench 64.4%** (May 2025): the README calls it "SOTA performance", but on the [WebBench leaderboard](https://webbench.ai/) Anthropic's Sonnet 3.7 computer use scored 66.0%, higher than Skyvern 2.0; Skyvern was highest among fully automated agents only on write tasks (filling and submitting forms), at 46.6%. And the benchmark was [built by Halluminate in partnership with Skyvern](https://halluminate.ai/blog/benchmark), with both Skyvern founders among the authors, and Skyvern plus the two computer-use agents ran on Skyvern's infrastructure, so it isn't an independent evaluation.

User reports, meanwhile, are a reminder about speed: in a GitHub issue, someone running version 1.0.2 of the package locally on a "login, navigate, fill a form" workflow reported [around five minutes](https://github.com/Skyvern-AI/skyvern/issues/4375); in 2024 another user reported [four minutes to fill one form](https://github.com/Skyvern-AI/skyvern/issues/1271). 3.0 and code replay may have improved this, but so far only the vendor's numbers say so.

## When it fits

- **Fits: one workflow across many unfamiliar sites.** For example, downloading invoices from dozens of supplier portals, or filling the same application on different government sites. Writing a Playwright script per site is too expensive, and "look at the screenshot, pick an element" doesn't need to know the page structure in advance.
- **Fits: workflows maintained by non-engineers.** The block editor and Copilot are something the other SDKs don't have.
- **Fits: tasks that write and submit forms.** That's where it did relatively well in WebBench, though Skyvern took part in that evaluation.
- **Doesn't fit: one or two sites you know well.** Plain Playwright is faster, cheaper, and more stable.
- **Doesn't fit: you need Firefox or WebKit.** It [supports Chromium only](https://github.com/Skyvern-AI/skyvern/blob/main/docs/developers/self-hosted/overview.mdx).
- **Doesn't fit: latency matters at every step.** An AI action is a model call that takes seconds; a selector takes milliseconds.
- **Think first:** self-hosted has no CAPTCHA handling or proxies, so sites that block often effectively mean Cloud; and embedding it in a closed-source product means dealing with AGPL first.

## Going deeper

This layer now has four ways of seeing a page: Stagehand reads the accessibility tree, AgentQL uses a query language, Midscene looks only at screenshots, and Skyvern uses both. The [next post](/posts/ai/2026-11-19-ai-browser-sdk-comparison-en) puts these hybrid SDKs side by side and explains why vendors' benchmark scores can't be compared directly.

## References

- [Skyvern-AI/skyvern README](https://github.com/Skyvern-AI/skyvern)
- [Skyvern: Concepts](https://github.com/Skyvern-AI/skyvern/blob/main/docs/concepts.mdx)
- [Skyvern: Browser automation (SDK and cached code)](https://github.com/Skyvern-AI/skyvern/blob/main/docs/developers/browser-automation.mdx)
- [Skyvern: Blocks reference](https://github.com/Skyvern-AI/skyvern/blob/main/docs/reference/blocks.mdx)
- [Skyvern: Self-hosted overview](https://github.com/Skyvern-AI/skyvern/blob/main/docs/developers/self-hosted/overview.mdx)
- [Skyvern: Production (CAPTCHA, proxies, cost)](https://github.com/Skyvern-AI/skyvern/blob/main/docs/developers/production.mdx)
- [Skyvern: Account and credits](https://github.com/Skyvern-AI/skyvern/blob/main/docs/cloud/account.mdx)
- [Skyvern Pricing](https://www.skyvern.com/pricing)
- [Skyvern: Deleting RAG from our web agent made it 2.3x faster (Skyvern 3.0)](https://www.skyvern.com/blog/deleting-rag-from-our-web-agent-made-it-2-3x-faster/)
- [Skyvern: Skyvern 2.0 WebVoyager benchmark results](https://www.skyvern.com/blog/skyvern-2-0-state-of-the-art-web-navigation-with-85-8-on-webvoyager-eval/)
- [Halluminate: WebBench](https://halluminate.ai/blog/benchmark)
- [WebBench leaderboard](https://webbench.ai/)
- [GNU Affero General Public License v3](https://www.gnu.org/licenses/agpl-3.0.en.html)
- [Xue et al., An Illusion of Progress? Assessing the Current State of Web Agents (arXiv 2504.01382)](https://arxiv.org/abs/2504.01382)
- [Skyvern issue #4375](https://github.com/Skyvern-AI/skyvern/issues/4375)
- [Skyvern issue #1271](https://github.com/Skyvern-AI/skyvern/issues/1271)
