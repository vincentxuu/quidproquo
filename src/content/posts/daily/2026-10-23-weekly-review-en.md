---
title: "AI Agent Weekly Review — 2026-10-23"
date: 2026-10-23
category: daily
type: digest
tags: [ai-agent, weekly, daily]
lang: en
description: "This week's biggest shift in thinking: the trust machinery behind agent security — evaluation, monitoring, LLM judges — is failing silently and systematically, while global capital is now betting bigger on execution-layer infrastructure (identity, sandboxes, SecOps) than on models themselves."
tldr: "CrowdStrike caught attackers who used Claude Code against South Korean banks, Apex Accelerator hijacked agent traffic through a malicious npm supply chain, and autonomous agents breached 1,200+ websites at $50 a site — the same week Google's Gemini 4 Argon, OpenAI's $1B \"Patch the Planet\" pledge, and open-sourced governance tooling from Microsoft and Cloudflare all shipped, scaling defense and offense in parallel; DeepSeek closed a $15B round two days after the US ordered federal agencies to strip its systems; four straight days of arXiv digests showed evaluation and monitoring infrastructure itself failing silently — nine LLM judges returned the identical score, and splitting an attack across multiple agents cut detector recall from 87% to 7%; Vertex AI, OpenAI, and Anthropic all retired legacy models this week, and the headline discount rarely matched the real savings; and in the same week Taiwan's financial regulator published its agentic-AI safety advisory, global capital poured eight large rounds into agent execution-layer infrastructure."
series:
  name: "AI Agent Weekly Review"
  order: 11
---

> 🌏 [中文版](/posts/daily/2026-10-23-weekly-review)

## The 5 things that mattered most this week

### 1. Security commoditized on both sides this week — defenders packaged governance into free tooling, attackers drove breach cost down to $50 a site

This week's security signals line up into a timeline. Monday, CrowdStrike disclosed that an actor tracked as ARTEX breached 7-9 South Korean banks using Claude Code — and, ironically, the attacker's own agent operation logs, left in a public directory, are what let defenders catch them. Tuesday, Elastic Security Labs exposed Apex Accelerator, a fake Web3 venture accelerator shipping two npm packages that installed infostealers and backdoors while also rewriting an open-source coding agent to redirect its LLM API traffic and inject an attacker-controlled MCP server. Wednesday, The Hacker News reported autonomous AI agents had already breached more than 1,200 websites at a cost of just $50 per site, and the same day's arXiv digest showed MCP tool poisoning pushing attack success rates to 84.2% against a detection rate of just 0.3%. Thursday, defenders finally struck back in unison: Google shipped Gemini 4 Argon, built to resist prompt injection (a 0.7% attack success rate in Gray Swan testing); OpenAI announced "Patch the Planet," a $1B commitment to subsidize defenders patching vulnerabilities; and Microsoft and Cloudflare each open-sourced governance and audit tooling that used to require serious in-house investment. But on that very same day, Symantec published a full attack transcript revealing "Skynet," an autonomous attack agent that chains layered jailbreaks to strip a commercial model's guardrails, then runs 100,000 steps unattended — scanning, breaching, and mining on its own. Defensive tooling got cheaper, but the same day proved offensive automation had already gone fully unattended too.

```diagram
title: This week's agent security arms race
desc: Attack and defense traded blows from 10/19 to 10/22, with defensive tooling and the Skynet disclosure landing on the same day.
caption: Dates follow each daily/arXiv digest's publication and reporting time; see references below.
---
<svg viewBox="0 0 760 260">
  <path class="dg-axis" d="M60 140H700"/>

  <g>
    <line class="dg-rule" x1="140" y1="86" x2="140" y2="134"/>
    <circle class="dg-dot" cx="140" cy="140" r="4"/>
    <text class="dg-label" x="140" y="50" text-anchor="middle" dominant-baseline="central">10/19 Logs expose attacker</text>
    <text class="dg-sub" x="140" y="72" text-anchor="middle" dominant-baseline="central">Agent logs trace attacker</text>
  </g>
  <g>
    <line class="dg-rule" x1="313" y1="146" x2="313" y2="194"/>
    <circle class="dg-dot" cx="313" cy="140" r="4"/>
    <text class="dg-label" x="313" y="208" text-anchor="middle" dominant-baseline="central">10/20 Supply-chain attack</text>
    <text class="dg-sub" x="313" y="230" text-anchor="middle" dominant-baseline="central">npm hijacks agent traffic</text>
  </g>
  <g>
    <line class="dg-rule" x1="486" y1="86" x2="486" y2="134"/>
    <circle class="dg-dot" cx="486" cy="140" r="4"/>
    <text class="dg-label" x="486" y="50" text-anchor="middle" dominant-baseline="central">10/21 Attacks scale up</text>
    <text class="dg-sub" x="486" y="72" text-anchor="middle" dominant-baseline="central">Autonomous agents breach 1,200+ sites</text>
  </g>
  <g>
    <line class="dg-rule" x1="660" y1="146" x2="660" y2="194"/>
    <circle class="dg-dot dg-dot--accent" cx="660" cy="140" r="6"/>
    <text class="dg-label" x="660" y="208" text-anchor="middle" dominant-baseline="central">10/22 Defense meets Skynet</text>
    <text class="dg-sub" x="660" y="230" text-anchor="middle" dominant-baseline="central">Argon ships as Skynet is exposed</text>
  </g>
</svg>
```

([CrowdStrike: ARTEX targets South Korean finance](https://www.crowdstrike.com/en-us/blog/unknown-threat-actor-uses-artex-to-target-south-korean-finance/), [Elastic: Apex Accelerator malicious npm packages](https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages), [The Hacker News: autonomous agents breach 1,200+ sites](https://thehackernews.com/2026/10/hackers-use-autonomous-ai-agents-to.html), [Google ships Gemini 4 Argon — Mashable](https://mashable.com/tech/google-launches-gemini-4-argon), [OpenAI: Patch the Planet](https://openai.com/index/coordinated-disclosure-of-critical-vulnerabilities/), [Symantec: the "Skynet" autonomous attack agent](https://www.security.com/blog-post/ai-llmjacking-skynet))

### 2. DeepSeek closes a $15B round two days after a US ban — Chinese capital answers geopolitical pressure with its largest AI raise ever

Just two days after the US ordered federal agencies to strip DeepSeek's systems entirely, DeepSeek announced a roughly $15B funding round, with Tencent, CATL, Geely, and more than 15 other Chinese investors participating — pushing its valuation from $50B to nearly $89B in just four months. The same week, China protested the US DeepSeek ban while continuing to block ChatGPT, Claude, and Gemini domestically — a contrast that is itself part of the geopolitical script: when a country can apply "protect our own industry" and "restrict foreign industry" as two separate standards simultaneously, capital markets don't wait and see, they double down. The size and timing of this round signal that China now treats DeepSeek as a national asset it cannot afford to let fail in the US-China AI race.

([DeepSeek closes $15B two days after US restrictions — TechCrunch](https://techcrunch.com/2026/10/22/deepseek-reportedly-raises-15b-days-after-us-restrictions/), [US bars DeepSeek from federal agencies — Bloomberg](https://www.bloomberg.com/news/articles/2026-10-19/us-moves-to-bar-deepseek-from-federal-agencies-and-contracts), [China protests the US ban while blocking foreign AI at home — the-decoder](https://the-decoder.com/china-protests-the-us-deepseek-ban-while-blocking-chatgpt-claude-and-gemini-at-home/))

### 3. Four straight days of arXiv digests show agent trust machinery failing systemically — and silently

This week's four consecutive arXiv digests stack into one conclusion: the infrastructure used to judge whether an agent misbehaved is more fragile than it looks. Tuesday's three papers found that 76-80% of apparent "defenses" were really just the agent not responding — swap the system prompt and attack success jumps from 0.2% to 43% — and that writing safety rules into harness-level permissions still let 58% of scenarios escalate to overly broad grants, with 81% completing a malicious task silently. Wednesday's research found that how a scaffold handles re-queryable context can swing the same model's performance by 92.5 percentage points, and that splitting an attack across multiple agents cuts a monitor's detection rate from 87% for a single agent down to 7%. Thursday's audit was sharper still: of 114 papers on recursive self-improvement, 90% tested the final model but only 22% actually audited the improvement loop itself — and in a case study on the Uniphore platform, nine entirely different test configurations fed into an LLM verifier all returned the identical score. Nothing crashed, nothing threw an error; the evaluation had just quietly stopped happening. Friday's paper extended the problem to persistent memory: writing policy into the prompt still let 13-15% of policy-violating tool calls through, and only a separately trained gatekeeper model cut the attack success rate roughly in half. Together, the four days make the same point: before trusting a safety score, ask whether it's actually measuring what you assume — and whether the mechanism doing the judging has itself ever been verified.

([Ignored, Not Refused — arXiv 2610.23254](https://arxiv.org/abs/2610.23254), [From Approval to Abuse — arXiv 2610.22987](https://arxiv.org/abs/2610.22987), [When the harness decides success — arXiv 2610.26632](https://arxiv.org/abs/2610.26632), [Red-Teaming Multi-Agent Attacks — arXiv 2610.24052](https://arxiv.org/abs/2610.24052), [Auditing the Product, Not the Recursion — arXiv 2610.27610](https://arxiv.org/abs/2610.27610), [RSI Control — arXiv 2610.27735](https://arxiv.org/abs/2610.27735), [AgentPolicyForge — arXiv 2610.28989](https://arxiv.org/abs/2610.28989))

### 4. Vertex AI, OpenAI, and Anthropic all retired legacy models this week — and the headline discount rarely matches the real savings

Three separate pricing-tracker stories this week teach the same lesson. On Tuesday, Google Cloud retired the entire Gemini 2.5 family on Vertex AI, even as the Gemini developer API's own page still said "no shutdown date announced" for the same models the same day — the entry point you call through decides how long a model actually lives. Migrating the cheapest tier, Flash-Lite, to the recommended replacement raised costs by 221%. On Wednesday, OpenAI shut down 12 legacy models at once — o1, o1-pro, o3-mini, o4-mini, GPT-4, GPT-4 Turbo, GPT-3.5-turbo, and more — and while migrating o1 to GPT-5.6 Sol cut input/output prices by 73%/67%, migrating o3-mini and o4-mini actually made them 1.8 to 3.6 times more expensive. On Friday, Anthropic announced Claude Sonnet 4.5 will retire on 11/30, with the recommended replacement Sonnet 5.5 priced 33% lower on paper — but its new tokenizer produces roughly 30% more tokens for the same text, so real-world bill reductions typically land at just 10-15%. All three vendors independently demonstrated the same thing this week: the discount percentage in a deprecation notice is never what you'll actually pay. Run your own traffic through the numbers; don't trust the press release.

([Vertex AI retires Gemini 2.5](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions), [Gemini API deprecations (official: no shutdown date)](https://ai.google.dev/gemini-api/docs/deprecations), [OpenAI API Deprecations](https://developers.openai.com/api/docs/deprecations), [Claude Platform Docs: model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations))

### 5. Taiwan is still in its "cost-cutting" phase while global capital is already racing to build out agent execution-layer infrastructure

Taiwan's Financial Supervisory Commission published an advisory this week on agentic AI safety for financial institutions, using a three-tier risk scheme that defaults to the stricter tier, open for 30 days of consultation. The same week, Taiwanese business media reported the country is moving from "cost-cutting" to "value-adding" in agent adoption: Environment Minister Peng Chi-ming is using an agent to cross-check listed-company data for circular-economy policy analysis, 91APP has packaged its internal agent experience into a custom service called "AgentOne," and Ogilvy is using WPP's $318M WPP Open platform — which integrates more than a dozen large models including GPT, Gemini, and Claude — for decision support. Against that backdrop, global capital this week put eight large rounds (see the startup radar below) into the identity, sandbox, SecOps, and enterprise-planning layers that sit underneath agent execution — betting not on "whose agent has more features" but on "who builds the infrastructure agents need to live inside an enterprise's systems long-term." The implication is direct: most Taiwanese enterprises are still operating at the efficiency-tool layer, while international capital is already laying infrastructure that's invisible from the outside. By the time Taiwanese companies are ready to move from "saving money" to "letting agents make autonomous decisions," the execution-layer architecture — identity governance, sandbox isolation, memory auditing — may already be locked in by a handful of international platforms. At that point it won't be a vendor-selection problem anymore; it'll be a lock-in problem.

([Taiwan FSC's agentic AI safety advisory — CTEE, in Mandarin](https://www.ctee.com.tw/news/20261014700624-430301), [Taiwan moves from cost-cutting to value-adding in agent adoption — Business Today/China Times, in Mandarin](https://www.chinatimes.com/realtimenews/20261018000015-260410))

## This week's updated thinking

- I used to think the biggest risk in agent security was "can the model be tricked" — now I know the entire machinery used to judge whether an agent misbehaved can fail systemically and silently. Nine completely different test setups fed into Uniphore's LLM verifier returned the identical score; RSI Control Arena's detection rate stayed at just 56-81% even without evasion hints; and splitting an attack across multiple agents cut single-agent monitoring's detection rate from 87% to 7%.
- I used to think a model "price cut" meant a smaller bill — now I know all three vendors' legacy-model retirements this week decoupled the headline discount from the real savings. Vertex's Gemini 2.5 Flash-Lite migration actually cost 221% more, and Claude Sonnet 5.5's new tokenizer ate most of its advertised 33% discount, leaving real savings at just 10-15%.
- I used to think competition at the agent execution layer was about "whose platform has more features" — now, seeing Daytona, Town, and Mave stake out completely different bets this week (sub-minute sandbox compute units, assistants delegating to each other, automated SecOps investigation) all competing for the same "keep agents living inside enterprise systems long-term" need, I realize this layer is splitting into several independent infrastructure races, not a single winner-take-all market.

## Enterprise adoption watch

I think the most important enterprise signal this week isn't Daytona's funding amount, but what it means that a $60M Series B pushed it to a $1B valuation.

Applying a **complementary assets** lens (Teece, 1986): Daytona's bet isn't "cheaper compute" — it's that the traditional cloud's VM abstraction (built for humans, second-scale boot times, long-lived) and what agents actually need (spun up in under 60 milliseconds, thrown away after use, thousands running in parallel) were never the same complementary asset to begin with. For AWS, GCP, or Azure to catch up, they'd need to redesign billing and isolation from the ground up — adding a new instance type won't do it. That's also why NVIDIA, ServiceNow, and Oracle all pushed into enterprise agent application platforms this week (launching Arc, AI Agent Studio, and similar products respectively) without any of them announcing an equivalent agent-native compute layer: building complementary assets takes far longer than shipping an application, and the big players are currently racing on the application layer, not the foundation.

For Taiwanese enterprises, the takeaway is this: before deciding whether to build your own agent sandbox, ask whether your agents actually need sub-minute spin-up/teardown cycles. A customized service like 91APP's AgentOne is still operating at the efficiency-tool layer, where off-the-shelf cloud VMs are good enough — it hasn't yet reached the scale that would require Daytona-style agent-native infrastructure. But if Taiwan follows the path the FSC's advisory opens up, toward "autonomous decision-making" tiers, the choice of execution environment will become an architectural decision made as early as identity governance — not an implementation detail you can migrate painlessly later. Decide this unclearly now, and what you'll have to replace later won't be one component — it'll be the whole foundation.

## Worth watching next week

- OpenAI's 12 retired models enter their three-day grace period starting 10/23 — watch whether the migration pain concentrates on the models that got more expensive (o3-mini/o4-mini) rather than the ones that got cheaper (o1)
- Whether the EU AI Office's information requests to OpenAI and Anthropic (issued last week) produce an official response or further enforcement this week
- MiniMax M3.1 Flash's weights are slated for release on 10/23 — watch whether independent testing confirms the elevated hallucination rate VentureBeat cited from Artificial Analysis
- Taiwan's FSC "agentic AI safety advisory for financial institutions" 30-day consultation period (ending roughly mid-November) — watch what the financial sector's feedback actually says

## Watchlist update suggestions

### 🆕 Suggested additions

Among the companies appearing in this week's signals, the most frequent ones are all already on the watchlist (OpenAI, Google, NVIDIA, Anthropic, Microsoft, DeepSeek, Alibaba-Qwen). No company outside the watchlist appeared 3+ times this week, so there are no new addition candidates.

### ⚠️ Considered for removal

✅ No companies met the removal criteria this week

## This week's startup radar

| Company | What it does | Funding | Why it matters |
|---|---|---|---|
| Town | Expanding personal AI assistants into a network of team assistants that delegate work to each other | Series B $108M ($1B valuation) | Hit unicorn status just 4 months after public launch |
| Arda | AI agents for manufacturing engineers | Series A $160M ($1.5B valuation) | Founded by former OpenAI chief research officer Bob McGrew; compresses a 3-6 month production-line change into days |
| Daytona | Agent-native cloud sandbox infrastructure | Series B $60M ($1B valuation) | Argues agents need a sub-60-millisecond compute unit independent of traditional VMs |
| Legora | Legal AI where agents take over entire case workflows | Series E $550M ($8.8B valuation) | Valuation jumped from $5.6B to $8.8B in 7 months |
| Pigment | Agents that run an entire enterprise planning workflow end to end | Series E $250M ($2.3B valuation) | 85% of new metrics on the platform are now created by agents |
| Mave | Agentic SecOps that connects existing security tools to auto-investigate alerts | $34M (including $28M Series A) | ARR grew more than 4x in a year |
| Flapping Airplanes | AI research lab betting on training models with less data | Series A $1B ($6B valuation) | Valuation quadrupled in a year to make "data efficiency" the next arms-race dimension |
| Duvo | A shared execution system for people and AI agents at retail/CPG enterprises | Series A $32M | Rohlik founder Tomáš Čupr's second venture, targeting the exact segment Gartner predicts will drive the 40% of agentic AI projects getting canceled |

## What I learned this week

The biggest update to my thinking this week is that evaluation and monitoring infrastructure fails in a more insidious way than I'd assumed, because it doesn't throw an error — it just quietly keeps returning "all clear." In the Uniphore case, nine completely different test configurations fed into the same LLM verifier produced the identical score: nothing crashed, no warning fired, the evaluation had simply stopped happening. That changes a concrete judgment call: before adopting an agent, the question to ask isn't "which benchmark did your agent pass" — it's "how do you know your monitoring system hasn't been asleep this week." A score can lie, and a silent failure is more dangerous than an obvious error, because nobody goes back to double-check a dashboard that looks fine.

## References

- [CrowdStrike — Unknown Threat Actor Uses ARTEX to Target South Korean Finance](https://www.crowdstrike.com/en-us/blog/unknown-threat-actor-uses-artex-to-target-south-korean-finance/)
- [Elastic Security Labs — Apex Accelerator: Malicious npm packages target Web3 startups](https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages)
- [The Hacker News — Hackers use autonomous AI agents to breach over 1,200 websites](https://thehackernews.com/2026/10/hackers-use-autonomous-ai-agents-to.html)
- [Google ships Gemini 4 Argon — Mashable](https://mashable.com/tech/google-launches-gemini-4-argon)
- [OpenAI — Patch the Planet: coordinated disclosure of critical vulnerabilities](https://openai.com/index/coordinated-disclosure-of-critical-vulnerabilities/)
- [Symantec/security.com — Autonomous LLMjacking: 'Skynet' Agent Hijacks Exposed AI Models](https://www.security.com/blog-post/ai-llmjacking-skynet)
- [DeepSeek reportedly raises $15B days after US restrictions — TechCrunch](https://techcrunch.com/2026/10/22/deepseek-reportedly-raises-15b-days-after-us-restrictions/)
- [US moves to bar DeepSeek from federal agencies and contracts — Bloomberg](https://www.bloomberg.com/news/articles/2026-10-19/us-moves-to-bar-deepseek-from-federal-agencies-and-contracts)
- [China protests the US DeepSeek ban while blocking ChatGPT, Claude and Gemini at home — the-decoder](https://the-decoder.com/china-protests-the-us-deepseek-ban-while-blocking-chatgpt-claude-and-gemini-at-home/)
- [Ignored, Not Refused — arXiv 2610.23254](https://arxiv.org/abs/2610.23254)
- [From Approval to Abuse — arXiv 2610.22987](https://arxiv.org/abs/2610.22987)
- [When the harness decides success — arXiv 2610.26632](https://arxiv.org/abs/2610.26632)
- [Red-Teaming Multi-Agent Attacks for Loss-of-Control Risks — arXiv 2610.24052](https://arxiv.org/abs/2610.24052)
- [Auditing the Product, Not the Recursion — arXiv 2610.27610](https://arxiv.org/abs/2610.27610)
- [RSI Control — arXiv 2610.27735](https://arxiv.org/abs/2610.27735)
- [AgentPolicyForge: From Executable Environments to Policy Benchmarks and Adaptive Guards — arXiv 2610.28989](https://arxiv.org/abs/2610.28989)
- [Model versions and lifecycle — Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions)
- [Gemini deprecations — Gemini API](https://ai.google.dev/gemini-api/docs/deprecations)
- [OpenAI API Deprecations](https://developers.openai.com/api/docs/deprecations)
- [Claude Platform Docs — Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Taiwan FSC's agentic AI safety advisory — CTEE (in Mandarin)](https://www.ctee.com.tw/news/20261014700624-430301)
- [Taiwan moves from cost-cutting to value-adding in agent adoption — Business Today/China Times (in Mandarin)](https://www.chinatimes.com/realtimenews/20261018000015-260410)
- [AI assistant startup Town nabs unicorn valuation — TechCrunch](https://techcrunch.com/2026/10/19/ai-assistant-startup-town-nabs-unicorn-valuation-four-months-after-launch/)
- [Ex-OpenAI executive builds $1.5 billion AI manufacturing startup Arda — CNBC](https://www.cnbc.com/2026/10/20/ex-openai-executive-builds-1point5-billion-ai-manufacturing-startup-arda.html)
- [Daytona, a startup building the 'agentic cloud', valued at $1 billion — Fortune](https://fortune.com/2026/10/20/daytona-startup-building-the-agentic-cloud-valued-at-1-billion-in-latest-funding-round/)
- [Legal AI startup Legora raises $550M Series E at $8.8B valuation — TechCrunch](https://techcrunch.com/2026/10/21/legal-ai-startup-legora-raises-550m-series-e-at-8-8b-valuation/)
- [Pigment Raises $250M at $2.3B Valuation — PR Newswire](https://www.prnewswire.com/news-releases/pigment-raises-250m-at-2-3b-valuation-302914892.html)
- [Mave Raises $34 Million to Build the Agentic SecOps System — PR Newswire](https://www.prnewswire.com/news-releases/mave-raises-34-million-to-build-the-agentic-secops-system-for-the-modern-enterprise-302916859.html)
- [Year-old AI lab Flapping Airplanes raises $1B at a $6B valuation — TechCrunch](https://techcrunch.com/2026/10/21/year-old-ai-lab-flapping-airplanes-raises-1b-at-a-6b-valuation/)
- [Duvo Raises $32 Million Series A — PR Newswire](https://www.prnewswire.com/news-releases/duvo-raises-32-million-series-a-to-become-the-one-platform-enterprises-run-their-operations-on-302908575.html)
</content>
