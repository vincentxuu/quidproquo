---
title: "AI Daily — 2026-11-28"
date: 2026-11-28
category: daily
tags: [ai-agent, daily]
lang: en
description: "Identity and human approval are turning from best-practice advice into governance infrastructure regulators and security vendors are building in parallel — the same week Switzerland confirmed a nation-level agentic attack, Kenya and US banking regulators both demanded agents get their own identity"
tldr: "Switzerland's NCSC confirmed its first nation-level agentic attacks, 4 of 5 confirmed cases succeeded, the same week Kenya and US banking regulators moved to require independent agent identities and human approval; Cognition's SWE-2.1 doubled Terminal-Bench from 24.2 to 50.0; Claude Opus 4.5 retires January 22, prices drop 20% but a new tokenizer could make some bills go up instead; Sber open-sourced a 708B flagship model, GigaChat 4, under MIT; the UAE launched a national agentic AI ecosystem, FedAI"
draft: false
series:
  name: "AI Daily"
  order: 105
---

## The One-Line Verdict

**Identity and human approval are turning from best-practice advice into governance infrastructure that multiple regulators and security vendors are building in parallel — the same week Switzerland's government confirmed a nation-level agentic attack, Kenya and US banking regulators both demanded independent agent identities, and product vendors shipped matching identity control planes.**

## Deep Dive: Agent Identity and Approval Are Becoming a Necessary Complementary Asset for Scaling Deployment

I think the thread worth pulling today isn't which model topped another leaderboard — it's how fast "who gets to act on an agent's behalf, and who approves what it does" is turning from a design detail into standalone governance infrastructure. (Framework: complementary assets)

Evidence A: Switzerland's NCSC this week confirmed the country's first "Agentic Offensive Framework" attacks — 4 of 5 confirmed cases breached, 2 of those hit critical infrastructure. Italy and the UK's agencies published near-identical warnings the same week. The attack chains aren't new (weak passwords, known vulnerabilities, exposed systems) — AI only changed the speed, and the "human attack tempo" defense assumption is breaking down.

Evidence B: regulators and vendors converged on the same prescription at once. Kenya requires agents that can autonomously pay to get human sign-off first and keep a record; US banking regulators recommend every agent get a distinct non-human identity and short-lived credentials. HYPR's AgentPass issues each agent a credential, NVIDIA's SkillSpector scans agent skills for supply-chain risk, and Mastra added encrypted secrets — all filling the same gap. Sokin's deliberate choice to keep its AI finance connector read-only is the most honest mirror on the enterprise side: the capability is already there, what's missing is the infrastructure to trust it.

```diagram
title: Three signals converging on the same governance layer today
desc: From the bottom up: the attack confirmed by Swiss officials, the identity/supply-chain tooling shipped by HYPR, NVIDIA and Mastra, and the governance-infrastructure requirements from Kenya and US banking regulators — three layers mapping to today's security, tooling, and regulatory signals.
caption: Illustrative: three independent events mapped to three levels of governance becoming infrastructure, not a technical dependency chain — just an editorial grouping of today's identity/approval signals from the field up to the rulebook.
---
<svg viewBox="0 0 640 248">
  <path class="dg-axis" d="M36 220V40" marker-end="url(#arrow)"/>
  <text class="dg-tag" x="36" y="28" text-anchor="middle" dominant-baseline="central">Abstract</text>
  <text class="dg-tag" x="36" y="232" text-anchor="middle" dominant-baseline="central">Concrete</text>

  <rect class="dg-box dg-box--accent" x="72" y="24" width="552" height="72" rx="6"/>
  <text class="dg-tag" x="92" y="60" dominant-baseline="central">L3</text>
  <text class="dg-label" x="124" y="42" dominant-baseline="central">Governance infrastructure layer</text>
  <text class="dg-sub" x="124" y="64" dominant-baseline="central">Kenya, US banking regulators: agents need their own</text>
  <text class="dg-sub" x="124" y="84" dominant-baseline="central">identity and human approval, with a kept record</text>

  <rect class="dg-box" x="72" y="104" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="132" dominant-baseline="central">L2</text>
  <text class="dg-label" x="124" y="120" dominant-baseline="central">Product layer</text>
  <text class="dg-sub" x="124" y="144" dominant-baseline="central">HYPR AgentPass, NVIDIA SkillSpector, Mastra encrypted secrets</text>

  <rect class="dg-box" x="72" y="168" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="196" dominant-baseline="central">L1</text>
  <text class="dg-label" x="124" y="184" dominant-baseline="central">Field reality</text>
  <text class="dg-sub" x="124" y="208" dominant-baseline="central">Swiss NCSC: 5 agentic attacks, 4 breached, 2 hit critical infra</text>
</svg>
```

What this means for practitioners: headlines like Cognition's SWE-2.1 and GPT-6 Astra are eye-catching, but if an agent moves money, changes config, or touches internal systems, what to fix isn't a stronger model — it's distinct identity, scoped permissions, and where the human-approval checkpoint sits. The same applies for Taiwanese enterprises: put the identity-and-approval layer on the procurement checklist before model selection, not after something breaks.

## Today's Developments

### Vendor Updates

- **[Alibaba Cloud](https://www.alibabacloud.com/blog/alibabas-full-stack-ai-drives-continued-cloud-growth-acceleration-as-adoption-deepens_603826)** (Alibaba Cloud Blog): Says its full-stack AI strategy is accelerating cloud revenue growth and profitability, crediting deepening enterprise adoption of its full-stack AI offerings.
- **[SAP](https://news.sap.com/2026/11/build-first-agentic-use-case-new-whitepaper-road-map-enterprise-ai/)** (SAP News): Published a whitepaper arguing that enterprise agentic AI success hinges on trustworthy data, business context, clear human accountability, and disciplined management of autonomy — plus a roadmap for shipping a first use case.

### Models & Infrastructure

- **[GigaChat 4 (708B-A41B)](/posts/daily/2026-11-28-model-sber-gigachat-4-708b-en)** (Sber): Fully open-sourced flagship under MIT, 1M-token context, one checkpoint switching between instant and reasoning modes, 79.55 on BFCL v4 tool-calling — the top score on its comparison table — but only 35.40% on DeepSWE, well behind DeepSeek 4.1. Full benchmarks in today's model card.
- **[Yandex AliceAI-Foundation 80B](https://aiweekly.co/alerts/yandex-open-sources-aliceai-foundation-80b-moe-trained-on-175t-tokens-under)** (aiweekly.co): Open-sourced under Apache 2.0, an 80B/3B-active MoE whose technical report adds two new Russian-language benchmarks for fact retrieval and multi-hop QA.
- **[KRAFTON Raon-1 Mini 28.8B](https://aiweekly.co/alerts/krafton-releases-raon-1-mini-a-288b43b-active-moe-hitting-967-on-aime-2026)** (aiweekly.co): South Korean gaming company open-sourced under Apache 2.0, hitting 96.7 on AIME 2026 and running a 256K context on 20GB of VRAM.
- **[OpenAI's GPT-6 Astra tops DeepSWE](https://benchleader.com/benchmarks/deepswe)** (BenchLeader): Scored 74.1% on DeepSWE v1.1, ahead of Gemini 3.8 Flash's 73.8%; only these two configurations cleared 73% among 69 tested.
- **[Google DeepMind's "Humanity's First Exam"](https://gcn.com/google-deepmind-launches-humanity-first-exam/23561)** (GCN): Requires a model to pass all four variants of the same question; across 18 frontier models the top five hit 96-98% pass@1, but their average family-pass⁴ was only 85.6%.
  - **Why it matters**: high single-question accuracy doesn't mean a model is consistent — that consistency gap is another version of today's "the headline number doesn't apply to every scenario" signal, same as Opus 5.5's pricing fine print and GigaChat's weaker long-horizon score.
- **[Sakana AI's Namazu Small 30B](https://ncijnetwork.com/sakana-ai-releases-namazu-small-a-30b-model-built-on-nemotron-3-nano)** (ncijnetwork.com): Built on NVIDIA's Nemotron 3 Nano, scored 73.5 on BrowseComp, well ahead of peers in its size class.

### Pricing & API Lifecycle

- **[Claude Opus 4.5 retirement, Opus 5.5 pricing](/posts/daily/2026-11-28-pricing-anthropic-claude-opus-4-5-retirement-en)** (Anthropic): Opus 4.5 retires 2027-01-22; Opus 5.5 lists 20% cheaper with cached reads down 60%, but a new tokenizer can inflate uncached token counts by up to 35% — right past the 20% discount's 1.25x break-even point, so some bills could come out higher, not lower. Full math in today's pricing tracker.

### Coding Agent Race

- **[Cognition's SWE-2.1](https://thenewstack.io/cognition-swe21-coding-model)** (The New Stack): Trained with pure reinforcement learning on Kimi K3, jumping Terminal-Bench 4.1 from 24.2 to 50.0; shipped alongside an Ultrafast variant on Cerebras and a security-focused Cyber variant.
  - **Why it matters**: while general-purpose models fight over leaderboards, a narrow coding model is still pulling ahead through pure RL — a sign that domain-specific models still have headroom general models haven't closed.

### Tools & Ecosystem

- **[Claude-BugHunter](/posts/daily/2026-11-28-ai-agent-github-digest-en)** (GitHub Trending): Turned 681 public HackerOne reports into 85 skills, gaining +1,597 stars in a day to top the trending charts; obra/superpowers' cross-tool development methodology gained +854 the same day. Full highlights in today's GitHub Digest.
- **[NVIDIA's SkillSpector](https://github.com/NVIDIA/SkillSpector)** (GitHub): Open-source scanner for prompt-injection, data-exfiltration, and supply-chain patterns inside AI agent skills.
  - **Why it matters**: it's the flip side of Claude-BugHunter's skill-packaging trend — as the skill ecosystem grows, it's starting to need its own supply-chain scanners, echoing today's broader identity-and-governance theme.
- **[HYPR's AgentPass](https://www.cybersecurity-insiders.com/hypr-introduces-agentpass-to-bring-identity-security-and-human-oversight-to-ai-agents/)** (Cybersecurity Insiders): Issues each AI agent its own credential tied to a designated human overseer, building an identity-first control plane.
- **[Mastra's Encrypted Secrets](https://mastra.ai/blog/announcing-encrypted-secrets)** (Mastra Blog): The agent framework added encrypted secrets management, decrypting environment variables only at server startup to cut credential-leak risk.
- **[INE MCP](/posts/daily/2026-11-28-tool-ine-mcp-en)** (Spain's national statistics office): An official MCP server that enforces a five-step query order server-side to block guessed statistical codes. Full writeup in today's tool pick.
- **[StackAI's Auto Agents](https://ycombinator.com/launches/P7T-stackai-embedded-ai-agents)** (YC Launches) and **[Epsilla](https://ycombinator.com/launches/Ls3-epsilla-ship-production-ready-ai-agents-on-day-1)** (YC Launches): Two enterprise agent-building platforms launched the same day — one auto-generating multi-step agents from natural language, the other focused on private-knowledge-base integration.
- **[Hugging Face: Swarms, Flocks, Gangs](https://huggingface.co/blog/rl-multi-agents)** (Hugging Face Blog): A systematic write-up on building, training, and evaluating multi-agent systems — a common-format developer-community resource.

### Technical Progress

Today's Arxiv Digest splits "agent memory management" into three independent problems often lumped together: TASK Memory shows that even correctly retrieved memory can get overridden by a model's own stale knowledge; MGMem replaces generative indexing with a deterministic parser and still beats three generative memory systems on conversational-memory tests; Contexture pushes the problem down to the GPU serving layer, finding that evicting superseded execution history lifts throughput 20-73% but can cost up to 3.7 points of accuracy in the worst case. All three papers bring solid evidence and are upfront about their own limits — full writeups in the [AI Agent Arxiv Digest](/posts/daily/2026-11-28-ai-agent-arxiv-digest-en).

- **[Pydantic AI v2.76.0](/posts/daily/2026-11-28-framework-pydantic-ai-v2.76.0-en)** (Pydantic AI): Realtime sessions gain `UpdateTools`, letting voice/live agents unlock or revoke tools mid-connection without reconnecting; the release also adds nested sub-agent cost roll-up, and the easiest breaking change to miss is `FileSystem.read_file`'s offset switching to 1-indexed. Full migration guide in today's framework update.

### Business Cases / Funding / M&A

- **[nextesy's $10.4M seed](/posts/daily/2026-11-28-funding-nextesy-en)** (led by Swisscom Ventures): The Swiss bookkeeping-automation startup's valuation jumped 3.4x just 21 months after its pre-seed, pitching bexio customers on "an honestly-drawn automation boundary, filled in step by step by agents." Full analysis in today's funding brief.
- **[Blackletter's $6M seed](https://dealroom.co/news/176745-ex-cohere-founders-ai-law-firm-blackletter-raises-6m-seed)** (Dealroom): An AI law firm founded by ex-Cohere co-founders, led by Lerer Hippeau, pairing AI software with human lawyers on cross-border legal work.
- **[XEBO.ai's $10.5M Series A](https://peepalsglobal.com/global/article/xebo-ai-10-5-million-series-a-emirates-growth-fund-2026-11-27)** (Emirates Growth Fund): Dubai's customer-experience analytics company closed its first institutional round, expanding call analytics, agentic AI features, and a US push.
- **[Kaszek Ventures' $650M seventh fund](https://latinfinance.com/daily-brief/2026/11/26/kaszek-raises-funds-for-early-stage-start-ups)** (LatinFinance): Latin America's largest-ever single early-stage VC fund raise, with a focus on AI investments.
- **[Everful's $48.5M Series A](https://theaiinsider.tech/2026/11/27/everful-secures-48-5m-series-a-to-scale-ai-powered-factory-direct-sourcing/)** (The AI Insider): An AI-driven factory-direct sourcing platform raising to expand into the US and Europe.
- **[South Africa's proposed $5.7M AI startup fund](https://africa.businessinsider.com/local/lifestyle/south-africa-set-to-join-ai-race-against-us-and-china-with-dollar57-million-fund/h7j2805)** (Business Insider Africa): A public-private fund proposed after President Ramaphosa's Silicon Valley trip to help local AI startups access compute; timeline still unconfirmed.

### Security Incidents

- **[Switzerland's NCSC confirms nation-level agentic attacks](/posts/daily/2026-11-28-security-switzerland-critical-infrastructure-agentic-attack-en)** (Swiss NCSC): The country's first "Agentic Offensive Framework" attacks — 4 of 5 confirmed cases breached, 3 targeted critical infrastructure with 2 succeeding; Italy and the UK's agencies issued near-identical warnings the same week. Full attack-surface analysis in today's security alert.
- **[modelcontextprotocol/servers v2.6.0](/posts/daily/2026-11-28-ai-agent-github-digest-en)** (official MCP reference servers): Fixed 8 security vulnerabilities at once, mostly in `mcp-server-git` — arbitrary code execution via Git LFS, credential leaks, and more. Anyone running these official reference servers should upgrade immediately.
- **[DB-GPT CVE-2026-137681](https://www.cve.org/CVERecord?id=CVE-2026-137681)** (CVE.org): A high-severity vulnerability found in the open-source agent framework DB-GPT's (0.8.2 and earlier) `_react_agent_stream_impl` function.

### Regulation & Governance

- **[Kenya's ODPC guidance update](https://ppc.land/kenyas-privacy-regulator-says-ai-agents-need-human-approval-before-paying)** (ppc.land): Adds a new chapter requiring agents that can autonomously pay, transfer, or deactivate accounts to get documented human approval first.
- **[US banking regulators' recommendations](https://www.artificialintelligence-news.com/news/us-banks-ai-agent-security-controls/)** (AI News): Recommends banks assign each agent a distinct non-human identity, restrict its permissions, and issue short-lived credentials for traceability.
- **[Sokin deliberately keeps its AI finance connector read-only](https://asianbankingandfinance.net/videos/sokin-retains-human-approval-ai-assisted-payments)** (Asian Banking & Finance): The cross-border payments company's AI connector only analyzes — every money-moving action still needs human sign-off, reflecting enterprise caution around autonomous agent payments.
- **[Australia's ACCC issues a Black Friday warning](https://ppc.land/businesses-stay-liable-for-what-their-ai-agents-tell-shoppers-accc-says)** (ppc.land): Names Meta's Muse, OpenAI's ChatGPT dots, and Google Tasks shopping agents, reaffirming that businesses remain liable for their agents' wrong answers.
- **[EU delays part of the AI Act's high-risk obligations](https://2eu.brussels/en/news/ai-omnibus-rapporteurs-say-delaying-some-ai-act-obligations-prevents-regulatory-mess-for-companies)** (2eu.brussels): Pushes some obligations to 2027/2028 to avoid compliance chaos while standards aren't ready; the Act itself is already in force.
- **[Bloomberg traces NVIDIA chips to a sanctioned Shanghai data center](https://the-decoder.com/us-spies-tracked-nvidia-scandal-figures-ties-to-chinese-intelligence-for-over-a-year/)** (the-decoder.com): Two Shanghai companies reportedly used NVIDIA GB300/GB200 server racks as loan collateral, with a supply chain traced to a US trade-blacklisted company — a possible export-control violation.

### Global Regional Signals

Today's China/Hong Kong, Korea, Europe, and Oceania developments are already covered above under regulation/models/security and aren't repeated here; below are regional items without a better-fitting section.

- **[Middle East: UAE launches a national agentic AI ecosystem, FedAI](https://thenationalnews.com/news/uae/2026/11/27/sheikh-hamdan-oversees-expansion-of-government-ai-ecosystem-as-17-partners-join)** (The National): The cabinet approved what it calls the world's first national agentic AI strategy, with G42, Microsoft, AWS, Google Cloud, IBM, Oracle, and Cohere among the first 17 partners, aiming to convert 50% of government operations to agent execution within two years.
- **[Africa: three Nigerian startups join Google's first Africa Applied AI Lab cohort](https://vanguardngr.com/2026/11/three-nigerian-startups-make-first-africa-applied-ai-lab-cohort)** (Vanguard): Three of the first 10 selected startups are Nigerian, working with Google engineers and getting priority access to Gemini and Gemma; a Demo Day follows in Accra in December.
- **[Taiwan: sovereign AI strategy focuses on small, localized models](https://www.computerweekly.com/news/366655559/Inside-Taiwans-sovereign-AI-strategy)** (ComputerWeekly): Reporting finds Taiwan's direction is building small, purpose-built models reflecting local language, values, and regulation, rather than chasing large general-purpose models head-on.
- **[Southeast Asia / South Asia: 4 in 5 developers now work under AI usage limits](https://www.bignewsnetwork.com/news/279464682/four-in-five-developers-in-southeast-asia-and-india-now-work-under-ai-usage-limits-agoda-report-finds)** (Big News Network): An Agoda survey of 800+ developers and engineering leads in Southeast Asia and India found four in five now work under company-set AI usage rules, versus mostly self-set rules a year ago.

## Key Numbers

| Item | Number | Source |
|------|------|------|
| Swiss NCSC confirmed agentic attacks | 4 of 5 breached | [Swiss NCSC](https://www.bacs.admin.ch/en/26-ki-agenten-1-en) |
| Cognition SWE-2.1 Terminal-Bench 4.1 | 24.2 → 50.0 | [The New Stack](https://thenewstack.io/cognition-swe21-coding-model) |
| GigaChat 4 SWE-bench Verified | 80.89% (prior gen 64.70%) | [Site model card](/posts/daily/2026-11-28-model-sber-gigachat-4-708b-en) |
| Opus 5.5 input price | $4.00/1M tokens (↓20%) | [Site pricing tracker](/posts/daily/2026-11-28-pricing-anthropic-claude-opus-4-5-retirement-en) |
| nextesy seed round | $10.4M (3.4x valuation jump in 21 months) | [Site funding brief](/posts/daily/2026-11-28-funding-nextesy-en) |

## Today's Digest Roundup

- [AI Agent Arxiv Digest — 2026-11-28](/posts/daily/2026-11-28-ai-agent-arxiv-digest-en)
- [AI Agent GitHub Digest — 2026-11-28](/posts/daily/2026-11-28-ai-agent-github-digest-en)
- [AI Engineer Interview Daily — 2026-11-28: Paper Reading](/posts/daily/2026-11-28-ai-interview-daily-en)
- [Product Builder Interview Daily — 2026-11-28: Technical PM](/posts/daily/2026-11-28-product-builder-interview-daily-en)
- [Framework Update: Pydantic AI v2.76.0](/posts/daily/2026-11-28-framework-pydantic-ai-v2.76.0-en)
- [Funding Brief: nextesy's $10.4M Seed](/posts/daily/2026-11-28-funding-nextesy-en)
- [Model Card: GigaChat 4 (708B-A41B)](/posts/daily/2026-11-28-model-sber-gigachat-4-708b-en)
- [Pricing Tracker: Claude Opus 4.5 Retirement](/posts/daily/2026-11-28-pricing-anthropic-claude-opus-4-5-retirement-en)
- [Security Alert: Switzerland's Critical Infrastructure Agentic Attack](/posts/daily/2026-11-28-security-switzerland-critical-infrastructure-agentic-attack-en)
- [Tool Pick: INE MCP](/posts/daily/2026-11-28-tool-ine-mcp-en)

## Watching Tomorrow

- Will other countries' financial regulators cite Kenya's and the US banking regulators' agent-identity recommendations as a model to follow?
- Will identity and skill-scanning tools like HYPR's AgentPass and NVIDIA's SkillSpector see their first wave of enterprise adoption cases in the coming weeks?
- Once real-world latency numbers for Cognition's Cerebras-based SWE-2.1 Ultrafast come out, will other narrow coding models follow with their own dedicated-inference-hardware variants?

## Today's Takeaway

I used to think breaching critical infrastructure required a sophisticated zero-day; reading Switzerland's NCSC account changed that — the agentic attacks used nothing but old problems: weak passwords, known vulnerabilities, exposed systems. What AI changed was only the speed of finding and exploiting them. That flips the defense priority list: shrink your attack surface, patch within 24 hours, enforce MFA — the basics — before shopping for an "AI-specific" defense product. Most organizations are nowhere close to losing to a sophisticated AI; they're far more likely to lose to basics they never got around to fixing.

## References

- [AI Agent Arxiv Digest — 2026-11-28](/posts/daily/2026-11-28-ai-agent-arxiv-digest-en)
- [AI Agent GitHub Digest — 2026-11-28](/posts/daily/2026-11-28-ai-agent-github-digest-en)
- [UAE launches national agentic AI ecosystem FedAI](https://thenationalnews.com/news/uae/2026/11/27/sheikh-hamdan-oversees-expansion-of-government-ai-ecosystem-as-17-partners-join)
- [Kenya's ODPC new AI guidance](https://ppc.land/kenyas-privacy-regulator-says-ai-agents-need-human-approval-before-paying)
- [Australia's ACCC Black Friday warning](https://ppc.land/businesses-stay-liable-for-what-their-ai-agents-tell-shoppers-accc-says)
- [EU delays part of AI Act's high-risk obligations](https://2eu.brussels/en/news/ai-omnibus-rapporteurs-say-delaying-some-ai-act-obligations-prevents-regulatory-mess-for-companies)
- [Sber's official GigaChat 4 announcement](https://giga.chat/blog/en/posts/gigachat-4)
- [Yandex open-sources AliceAI-Foundation 80B](https://aiweekly.co/alerts/yandex-open-sources-aliceai-foundation-80b-moe-trained-on-175t-tokens-under)
- [Cognition's SWE-2.1 — The New Stack](https://thenewstack.io/cognition-swe21-coding-model)
- [OpenAI's GPT-6 Astra tops DeepSWE — BenchLeader](https://benchleader.com/benchmarks/deepswe)
- [Google DeepMind's Humanity's First Exam — GCN](https://gcn.com/google-deepmind-launches-humanity-first-exam/23561)
- [Sakana AI's Namazu Small 30B](https://ncijnetwork.com/sakana-ai-releases-namazu-small-a-30b-model-built-on-nemotron-3-nano)
- [KRAFTON's Raon-1 Mini](https://aiweekly.co/alerts/krafton-releases-raon-1-mini-a-288b43b-active-moe-hitting-967-on-aime-2026)
- [Blackletter's $6M seed — Dealroom](https://dealroom.co/news/176745-ex-cohere-founders-ai-law-firm-blackletter-raises-6m-seed)
- [XEBO.ai's $10.5M Series A](https://peepalsglobal.com/global/article/xebo-ai-10-5-million-series-a-emirates-growth-fund-2026-11-27)
- [NVIDIA's SkillSpector — GitHub](https://github.com/NVIDIA/SkillSpector)
- [DB-GPT CVE-2026-137681](https://www.cve.org/CVERecord?id=CVE-2026-137681)
- [South Africa's proposed $5.7M AI startup fund](https://africa.businessinsider.com/local/lifestyle/south-africa-set-to-join-ai-race-against-us-and-china-with-dollar57-million-fund/h7j2805)
- [Three Nigerian startups join Google's Africa Applied AI Lab](https://vanguardngr.com/2026/11/three-nigerian-startups-make-first-africa-applied-ai-lab-cohort)
- [Kaszek raises $650M Latin America fund](https://latinfinance.com/daily-brief/2026/11/26/kaszek-raises-funds-for-early-stage-start-ups)
- [Alibaba Cloud's full-stack AI drives cloud growth](https://www.alibabacloud.com/blog/alibabas-full-stack-ai-drives-continued-cloud-growth-acceleration-as-adoption-deepens_603826)
- [SAP's enterprise agentic use-case whitepaper](https://news.sap.com/2026/11/build-first-agentic-use-case-new-whitepaper-road-map-enterprise-ai/)
- [HYPR's AgentPass](https://www.cybersecurity-insiders.com/hypr-introduces-agentpass-to-bring-identity-security-and-human-oversight-to-ai-agents/)
- [Mastra's Encrypted Secrets](https://mastra.ai/blog/announcing-encrypted-secrets)
- [US banking regulators' AI agent identity recommendations](https://www.artificialintelligence-news.com/news/us-banks-ai-agent-security-controls/)
- [Sokin keeps its AI finance connector read-only](https://asianbankingandfinance.net/videos/sokin-retains-human-approval-ai-assisted-payments)
- [Everful's $48.5M Series A](https://theaiinsider.tech/2026/11/27/everful-secures-48-5m-series-a-to-scale-ai-powered-factory-direct-sourcing/)
- [Taiwan's sovereign AI strategy — ComputerWeekly](https://www.computerweekly.com/news/366655559/Inside-Taiwans-sovereign-AI-strategy)
- [Southeast Asia and India developer AI usage survey — Big News Network](https://www.bignewsnetwork.com/news/279464682/four-in-five-developers-in-southeast-asia-and-india-now-work-under-ai-usage-limits-agoda-report-finds)
- [Bloomberg: NVIDIA chips traced to sanctioned Shanghai data center](https://the-decoder.com/us-spies-tracked-nvidia-scandal-figures-ties-to-chinese-intelligence-for-over-a-year/)
- [StackAI's Auto Agents — YC Launches](https://ycombinator.com/launches/P7T-stackai-embedded-ai-agents)
- [Epsilla — YC Launches](https://ycombinator.com/launches/Ls3-epsilla-ship-production-ready-ai-agents-on-day-1)
- [Hugging Face: Swarms, Flocks, Gangs](https://huggingface.co/blog/rl-multi-agents)
