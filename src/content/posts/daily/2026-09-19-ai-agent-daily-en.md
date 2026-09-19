---
title: "AI Daily — 2026-09-19"
date: 2026-09-19
category: daily
tags: [ai-agent, daily]
lang: en
description: "MCP went from protocol to default feature in a year — Safari, Amazon Ads, and GitLab all added MCP servers on the same day, but the same cost-lowering logic that makes integration cheap also made JADEPUFFER's fully autonomous ransomware chain cheap; California's AI kill-switch order is an attempt to put that cost back"
tldr: "California Governor Newsom signs an executive order pushing frontier models toward an emergency kill switch and independent safety oversight; Azure AI Foundry discloses a CVSS 10.0 vulnerability, and the JADEPUFFER campaign confirms an AI agent can run a full ransomware attack chain on its own through an old Langflow bug; Apple Safari 27, Amazon Ads, and GitLab 19.4 each ship MCP servers into a browser, an ad platform, and a DevOps tool the same day; Alibaba, Cloudflare, and Microsoft open-source production-tested agent guardrails as CLIs and skills the same week, while three arXiv papers show with controlled experiments that harness components have conditional value and a read-only verifier blocks 61% of false passes for under a cent; Chinese AI agent startup Manus is reportedly in talks to raise $500M at a $4B valuation; manufacturing AI data platform CADDi closes a $114M Series D at double its prior valuation; Taiwan's Ministry of Digital Affairs holds an AI-agent-driven next-gen network forum the same day"
draft: false
series:
  name: "AI Daily"
  order: 35
---

> 🌏 [中文版](/posts/daily/2026-09-19-ai-agent-daily)

## The One-Line Take

**Lowering transaction costs has no allegiance — today Safari, Amazon Ads, and GitLab all put MCP servers on the table, compressing "wiring up a new capability" down to reading a config file, but JADEPUFFER shows the other end of the same curve: "wiring up an attack chain" got just as cheap. California's AI kill-switch order is an attempt to manually add friction back in; for teams adopting the MCP ecosystem, "how fast can we integrate" can no longer be the only question that matters.**

## Deep Dive: MCP Lowers the Cost of Integration — and of Attack

I think the thread most worth pulling on today is that "lowering transaction costs" has no allegiance of its own — it benefits developers and attackers equally, and today's regulatory moves are trying to price that cost back in.

Start with the supply side: at least three major platforms put MCP servers front and center today. Apple built a Safari MCP server into Safari 27, letting coding agents like Claude Code and Codex directly drive a browser window to inspect rendered output. Amazon Ads launched its MCP Server into open beta, packaging account setup, report generation, and cross-region campaign duplication into a single prompt-triggerable tool. GitLab 19.4 brought MCP server tools and the Duo CLI's `/goal` command into public beta, letting developers hand off an open-ended goal instead of supervising each task step by step. All three are doing the same thing: compressing the transaction cost of "wiring an agent up to a capability" — writing adapters, wiring APIs, managing auth — down to reading a config file. (Framework: transaction cost)

The problem is the same logic holds for attackers. The JADEPUFFER campaign shows an AI agent breaking in through a known, unpatched Langflow vulnerability and then autonomously completing an entire attack chain — reconnaissance, lateral movement, encryption — with no human operator involved at any point. The same day, Azure AI Foundry disclosed a CVSS 10.0 unauthenticated privilege-escalation vulnerability. Once the cost of "wiring up a capability" drops to reading a config file, the cost of "wiring up an attack chain" drops to roughly the same level — MCP lets legitimate developers skip writing adapters, and it lets attackers skip writing a one-off, custom exploit chain. Both are the same curve, viewed from opposite ends.

Today's regulatory move is a direct response to exactly this: California Governor Newsom's executive order calls for independent oversight recommendations within two months and pushes frontier models toward an emergency "kill switch" — which is, at its core, an attempt to manually add back a "stop" friction after transaction costs have already been driven to near zero. This isn't a coincidence of same-day news; it's two faces of one structural trend — infrastructure keeps pushing the cost of "connecting" toward zero, so regulation has to find a way to push the cost of "shutting it down" toward zero too, and both sides are racing to set the friction coefficient where they want it.

Where that friction should live, today's papers and open-source releases give the same answer: in the harness wrapped around the model — and it's cheap to put there. The three papers in [today's Arxiv Digest](/en/posts/daily/2026-09-19-ai-agent-arxiv-digest-en) show with controlled experiments that a coding agent's performance is decided by harness components — planning, context management, action space — and that a read-only verifier blocks about six in ten false passes for under a cent. In [today's GitHub Digest](/en/posts/daily/2026-09-19-ai-agent-github-digest-en), none of what Alibaba, Cloudflare, and Microsoft open-sourced is a new framework; they packaged guardrails like "hand the steps that can't tolerate errors to deterministic code" and "the agent that finds a bug can't be the one that verifies it" into a CLI or a skill. Regulators are working out how to put friction back; engineering teams are already demonstrating where it goes and what it costs.

For teams building on the MCP ecosystem, this means evaluating a new MCP server can no longer stop at "does it integrate fast" — how trustworthy the source is, whether its version pins float, and whether authorization can be revoked instantly if something goes wrong now matter just as much as integration speed, especially as enterprises start wiring agents into finance and supply-chain workflows where the stakes are higher — and those checks belong in the harness as deterministic steps, not left to the agent's own judgment.

## Today's Developments

### Vendor Moves

**OpenAI**: Launched Astra for Law, packaging GPT-6 Astra's capabilities into legal-specific tools for contract review and case research. ([source](https://openai.com/index/astra-for-law/))

**Anthropic**: Published research on how Claude is being used to uplift biomolecular modeling work, the latest entry in its "AI accelerating science" series. ([source](https://www.anthropic.com/research/claude-uplifts-biomolecular-modeling))

**Circle**: Launched Arc Studio, an AI coding agent that turns a natural-language prompt into a complete onchain app — frontend, backend, and Solidity contracts. ([source](https://www.bitbase.com/news/circle-launches-arc-studio-ai-agent-for-building-onchain-apps))

**Certinia**: Added 14 more autonomous agents to its Veda suite and expanded its Intelligent Actions library to 135 items, coordinating real actions like general-ledger entries via MCP. ([source](https://martech.org/the-latest-ai-powered-martech-news-and-releases/))

**Alibaba Cloud**: Shipped "Qwen Work for Teachers," targeting teachers' administrative load and lesson design — the latest vertical education deployment for Qwen. ([source](https://www.alibabacloud.com/blog/qwen-work-for-teachers_603576))

### Models & Infrastructure

**Amazon Bedrock adds Kimi K3**: AWS listed Moonshot AI's Kimi K3 on Bedrock, with a 1M-token context window, native vision, and explicit prompt caching — another open-weight model absorbed into a major cloud. ([source](https://aws.amazon.com/blogs/machine-learning/introducing-kimi-k3-on-amazon-bedrock/))

**Google Android Bench 2.0**: Google shipped a new benchmark for AI models handling complex Android development tasks; GPT-6 Astra leads with a 28% pass rate, Gemini 3.8 Flash trails at 8%. ([source](https://androidcentral.com/apps-software/android-os/android-bench-2-0))

### Coding Agent Track

**Claude Code**: Starting with 2.1.277, Claude Code falls back to reading AGENTS.md when a folder has no CLAUDE.md, implemented through a new Claude Code mods mechanism to improve cross-tool config compatibility; the same release also fixed stability issues including lost self-hosted runner configs, connection failures on 4xx responses from MCP servers, and infinite retry loops from corrupted transcripts. ([source 1](https://simonwillison.net/2026/Sep/18/thariq-shihipar/) · [source 2](https://releasebot.io/updates/anthropic/claude-code))

**Cognition (Devin)**: Doubled down on Brazil as part of its international expansion, reflecting rising enterprise demand for AI coding agents in Latin America. ([source](https://valorinternational.globo.com/business/news/2026/09/18/cognition-bets-on-brazil-as-ai-expansion-accelerates.ghtml))

### Tools & Ecosystem

**Apple Safari 27**: Ships a built-in Safari MCP server, letting coding agents like Claude Code and Codex directly drive the browser window to inspect rendered output — the server runs entirely locally and makes no network calls of its own. ([source](https://9to5mac.com/2026/09/17/webkit-blog-breaks-down-whats-new-with-safari-27-for-developers-including-mcp-support/))

**Amazon Ads MCP Server**: Now in open beta, packaging account setup, report generation, and campaign creation/duplication across regions into single prompt-triggered tools. ([source](https://advertising.amazon.com/library/news/amazon-ads-mcp-server-open-beta))

**ElevenLabs**: Folded its voice, music, image, and video generation tools into its hosted MCP connector, letting Claude, ChatGPT, and Cursor call these generation capabilities directly from a conversation. ([source](https://trewknowledge.com/2026/09/18/ai-this-week-the-infrastructure-around-ai-gets-serious/))

**NVIDIA AIPerf**: Released a benchmarking tool for measuring LLM inference performance (latency, throughput) at scale, to help teams check whether a deployment is actually "fast enough." ([source](https://developer.nvidia.com/blog/benchmarking-llm-inference-at-scale-with-aiperf/))

**WPVibe**: A full WordPress MCP server implementation letting any MCP-capable client — Claude, ChatGPT, Cursor — directly manage WordPress site content and settings. ([source](https://wordpress.org/plugins/vibe-ai/))

**Hermes Agent**: NousResearch open-sourced a self-improving agent built around an autonomous skill-creation loop and cross-session memory, supporting seven backend targets including local, Docker, and Modal. ([source](https://github.com/nousresearch/hermes-agent))

**Qwen3.8-Flash-Next**: Alibaba's Qwen team open-sourced weights for a multimodal MoE model that doubles as an early preview of the Qwen4 architecture. ([source](https://qwen.ai/research))

**TrustDex**: A local-first, zero-dependency CLI that gates MCP servers, Agent Skills, and plugins with an ALLOW/ASK/BLOCK verdict before they're ever exposed to an agent — see [today's tool pick](/en/posts/daily/2026-09-19-tool-trustdex-en).

**Three big-tech guardrail releases**: Alibaba's open-code-review (an AI code review CLI used internally for two years; deterministic filtering plus an agent, at roughly 1/9 the token cost of a general-purpose agent), Cloudflare's security-audit-skill (its own six-phase vulnerability-hunting workflow packaged as a skill, with finder and verifier kept separate), and microsoft/skills (175 Azure SDK domain skills, one-command install). What they share: production-tested guardrails dropped into the agent you already use, not a framework swap — see [today's GitHub Digest](/en/posts/daily/2026-09-19-ai-agent-github-digest-en).

### Technical Progress

**Today's Arxiv Digest — harness design decides the outcome**: Three independent papers point at the same capability gap — a coding agent's performance is decided by the harness around the model, and every component's value is conditional. A 176-pair ablation shows context management matters more as the budget tightens and planning is an accuracy crutch for weak models but only a cost saver for strong ones; NVIDIA/MIT's SoL-Pi treats the harness itself as the research object and auto-optimizes it, cutting token traffic 44.7–49.0%; a sham-controlled experiment shows planning guidance lifts τ²-bench success by a significant 7.17 percentage points. All three are preprints with claims scoped to "what this component is worth under these conditions" — methods and limits in the [full Arxiv Digest](/en/posts/daily/2026-09-19-ai-agent-arxiv-digest-en).

**Pydantic AI v2.45.0 / v2.46.0**: Two feature releases in two days — `TypeSafeModel`, a `Choices` helper, and union output types, with no breaking changes; the pace has visibly picked up after v2.44.0 fixed four security issues the day before. ([source](https://github.com/pydantic/pydantic-ai/releases/tag/v2.46.0))

**GitLab 19.4**: Brought MCP server tools and the Duo CLI's `/goal` command into public beta, letting developers delegate an open-ended goal instead of supervising individual tasks one by one, plus new cost-control features. ([source](https://www.archynewsy.com/gitlab-19-4-launches-new-mcp-server-tools-in-public-beta-for-ai-agent-automation/))

### Pricing & API Lifecycle

**xAI X Search**: Starting 9/21, Grok API's `x_search` tool switches from "$5 per 1,000 calls" to "$5 per 1,000 posts fetched + $10 per 1,000 user profiles fetched," with parent/quoted posts in a thread counting toward the total — heavy users could see bills go up, not down. See [today's pricing tracker](/en/posts/daily/2026-09-19-pricing-xai-x-search-billing-change-en).

**OpenAI**: Reportedly cut standard API pricing 20-33%, with the output-token discount reaching 33.3% (single-sourced; not yet independently cross-verified). ([source](https://www.aipricing.guru/openai-pricing/))

### Security Incidents & Defense

**Azure AI Foundry critical vulnerability**: CVE-2026-85889 (CVSS 10.0) allows unauthenticated remote privilege escalation; Microsoft has patched it server-side. ([source](https://www.thehackerwire.com/vulnerability/CVE-2026-85889/))

**JADEPUFFER**: A disclosed attack campaign in which an AI agent broke in through a known, unpatched Langflow vulnerability (CVE-2025-3248) and then autonomously executed a full ransomware attack chain with no human operator involved. ([source](https://cybersecuritynews.com/ai-agents-3/))

**AI Agent Automation platform vulnerabilities**: An open-source workflow platform disclosed two high-severity CVEs (CVE-2026-54519/54520) involving broken access control in its backend memory-management subsystem. ([source](https://www.thehackerwire.com/vulnerability/CVE-2026-54520/))

**mayfly-go AI Assistant**: An open-source ops platform (≤1.11.5) was found to have a missing authorization check in its built-in AI Assistant module, affecting its ai.go component. ([source](https://vulners.com/cvelist/CVELIST:CVE-2026-92992))

### Regulation & Governance

**California's AI kill-switch executive order**: Governor Newsom signed an order requiring independent-oversight and safety-regulation recommendations within two months, and pushing for frontier models to have an emergency "kill switch." ([source](https://www.gov.ca.gov/2026/09/18/governor-newsom-issues-executive-order-to-accelerate-independent-oversight-and-advance-the-creation-of-an-ai-kill-switch/))

**Australia's "design for reversibility" guidance**: Australian cyber agencies (ACSC and others) are urging companies to build reversibility into AI agent actions before deployment; a 2024 privacy amendment act will also require disclosure of significant automated decisions starting December 10. ([source](https://www.nbh.co/learn/can-you-undo-what-an-ai-agent-just-did))

### Global Regional Roundup

**Taiwan**

Taiwan's Ministry of Digital Affairs Administration for Digital Industries held an "AI Agent-Driven Next-Gen Smart Network" international forum and matchmaking event at Taipei World Trade Center on 9/18, bringing together AWS, Nokia, and Ericsson alongside domestic telecom and healthcare vendors to showcase eight next-gen communications and AI-healthcare pilot solutions, echoing the government's "AI New Ten Major Constructions" policy and pushing AI solutions from the lab toward being "usable and sellable" at industrial scale. ([source](https://www.thehubnews.net/archives/666657))

**Japan/Korea**

Japan's CAC Corporation and South Korean financial-AI firm DeepSearch signed a partnership to build an "agent-type AI" platform for Japanese financial institutions, where AI agents autonomously handle deal sourcing, corporate analysis, and document production rather than just assisting human staff. ([source](https://itbusinesstoday.com/tech/ai/cac-and-deepsearch-team-up-on-agentic-ai-in-japan/))

**Southeast Asia**

Tencent Cloud and AI Singapore, alongside DBS, Keppel, and other institutions, launched an industry-scale agentic AI hackathon spanning five tracks — another marker of enterprise AI adoption in Singapore. ([source](https://technode.global/2026/09/18/tencent-cloud-ai-singapore-industry-ai-hackathon-dbs-keppel/))

**India**

Indian startup Signoff launched an enterprise Agentic AI decision-intelligence platform, with its first major customer Juniper Hotels already live across nine properties, with plans to expand from hospitality into healthcare, retail, and real estate. ([source](https://m.thewire.in/article/ptiprnews/signoff-launches-enterprise-agentic-ai-intelligence-platform))

**Africa**

A cross-national roundup mapped several African countries' AI plans: Sierra Leone's data embassy, Rwanda's smart-city platform, Gambia's AI talent accelerator, and Kenya's digital-governance project — all prioritizing infrastructure gaps over the model layer. ([source](https://www.businesstechafrica.co.za/article/africas-ai-plans-are-starting-with-the-infrastructure-problem))

North America, Europe (Health Force's funding round), Latin America (Cognition's Brazil push), and Oceania (Australia's reversibility guidance) already appear above under Business Cases, Coding Agent Track, and Regulation & Governance and aren't repeated here; searches for China and the Middle East today turned up no independent event clearing the bar (China's Manus funding is covered under Business Cases).

### Business Cases / Funding

**Manus**: The Chinese AI agent startup, having resumed independent operations after its acquisition talks with Meta fell through, is reportedly in talks to raise $500M at a $4B valuation. ([source](https://jingletree.com/manus-seeks-4b-valuation-in-new-500m-fundraise-as-it-resumes-independent-ops-272156.html))

**CADDi**: The manufacturing AI data platform closed a $114M Series D at a $1.2B valuation, more than double its $470M valuation from March 2025; its new CADDi Agent product takes over part-standardization decisions and quality-impact assessments — see [today's funding brief](/en/posts/daily/2026-09-19-funding-caddi-en).

**Magentic**: The end-to-end manufacturing procurement agent raised an $18M Series A led by Felicis, bringing its total to $23.5M raised in 14 months — see [today's funding brief](/en/posts/daily/2026-09-19-funding-magentic-en).

**Hang Ten Systems**: The enterprise AI services company founded by former Infosys CEO Vishal Sikka closed two seed rounds totaling $85M within four months of founding — see [today's funding brief](/en/posts/daily/2026-09-19-funding-hang-ten-systems-en).

**Health Force**: The Barcelona-based healthcare startup raised a €4.2M seed round; its AI agents already automate insurance claims and regulatory filings for back-office operations at several European hospitals. ([source](https://www.eu-startups.com/2026/09/barcelona-based-health-force-raises-e4-2-million-to-streamline-hospital-operations-with-ai-agents))

## Key Numbers

| Item | Number | Source |
|------|--------|--------|
| Azure AI Foundry vulnerability CVSS score | 10.0 (max) | [TheHackerWire](https://www.thehackerwire.com/vulnerability/CVE-2026-85889/) |
| Manus reported valuation / raise | $4B / $500M | [Jingletree](https://jingletree.com/manus-seeks-4b-valuation-in-new-500m-fundraise-as-it-resumes-independent-ops-272156.html) |
| CADDi valuation growth (Mar 2025 → Sep 2026) | $470M → $1.2B (2.55x) | [Today's funding brief](/en/posts/daily/2026-09-19-funding-caddi-en) |
| xAI x_search old vs. new pricing (example scenario, monthly) | $300 → $5,100 (+1,600%) | [Today's pricing tracker](/en/posts/daily/2026-09-19-pricing-xai-x-search-billing-change-en) |
| Android Bench 2.0 pass rate | GPT-6 Astra 28% vs. Gemini 3.8 Flash 8% | [AndroidCentral](https://androidcentral.com/apps-software/android-os/android-bench-2-0) |
| False passes blocked by a read-only verifier | 61% (under one cent) | [Today's Arxiv Digest](/en/posts/daily/2026-09-19-ai-agent-arxiv-digest-en) |
| open-code-review token cost vs. general-purpose agent | ~1/9 | [Today's GitHub Digest](/en/posts/daily/2026-09-19-ai-agent-github-digest-en) |

## Today's Digests

- 📄 [AI Agent Arxiv Digest — 2026-09-19](/en/posts/daily/2026-09-19-ai-agent-arxiv-digest-en)
- 📄 [AI Agent GitHub Digest — 2026-09-19](/en/posts/daily/2026-09-19-ai-agent-github-digest-en)
- 📄 [AI Engineer Interview Prep — 2026-09-19: Paper Reading](/en/posts/daily/2026-09-19-ai-interview-daily-en)
- 📄 [Product Builder Interview Prep — 2026-09-19: Technical PM](/en/posts/daily/2026-09-19-product-builder-interview-daily-en)
- 📄 [Funding Brief｜CADDi Series D $114M](/en/posts/daily/2026-09-19-funding-caddi-en)
- 📄 [Funding Brief｜Hang Ten Systems Seed Extension $53M](/en/posts/daily/2026-09-19-funding-hang-ten-systems-en)
- 📄 [Funding Brief｜Magentic Series A $18M](/en/posts/daily/2026-09-19-funding-magentic-en)
- 📄 [Pricing Tracker｜xAI X Search Switches to Per-Post Billing](/en/posts/daily/2026-09-19-pricing-xai-x-search-billing-change-en)
- 📄 [Tool Pick｜TrustDex](/en/posts/daily/2026-09-19-tool-trustdex-en)

## Tomorrow's Watch

- Whether evidence of active exploitation surfaces for the maxed-out Azure AI Foundry vulnerability
- Whether other US states or the federal government follow California's lead on an AI kill-switch requirement within its two-month review window
- Whether Manus's $500M round actually closes, and whether Chinese AI agent startups can keep raising independently under geopolitical scrutiny

## Today's Takeaway

I used to assume agent funding was concentrating around "smarter models," but today's CADDi and Magentic rounds made me realize capital is also flowing in a different direction — turning the judgment calls a veteran engineer never wrote down, or the fine print of supplier compliance, into data an agent can actually consume is already its own business, and arguably a more urgent one than training the next stronger model, because the physical world's production cycle can't be sped up by an exponential curve.

## References

- [Governor Newsom issues executive order on AI oversight and kill switch](https://www.gov.ca.gov/2026/09/18/governor-newsom-issues-executive-order-to-accelerate-independent-oversight-and-advance-the-creation-of-an-ai-kill-switch/)
- [CVE-2026-85889 — Azure AI Foundry critical vulnerability](https://www.thehackerwire.com/vulnerability/CVE-2026-85889/)
- [OpenAI — Astra for Law](https://openai.com/index/astra-for-law/)
- [Anthropic — Claude uplifts biomolecular modeling](https://www.anthropic.com/research/claude-uplifts-biomolecular-modeling)
- [Amazon Bedrock adds Kimi K3](https://aws.amazon.com/blogs/machine-learning/introducing-kimi-k3-on-amazon-bedrock/)
- [NVIDIA AIPerf benchmarking tool](https://developer.nvidia.com/blog/benchmarking-llm-inference-at-scale-with-aiperf/)
- [Google Android Bench 2.0](https://androidcentral.com/apps-software/android-os/android-bench-2-0)
- [Safari 27 ships Safari MCP server — 9to5Mac](https://9to5mac.com/2026/09/17/webkit-blog-breaks-down-whats-new-with-safari-27-for-developers-including-mcp-support/)
- [Amazon Ads MCP Server open beta](https://advertising.amazon.com/library/news/amazon-ads-mcp-server-open-beta)
- [OpenAI cuts API pricing 20-33%](https://www.aipricing.guru/openai-pricing/)
- [Claude Code adds AGENTS.md support — Simon Willison](https://simonwillison.net/2026/Sep/18/thariq-shihipar/)
- [High-severity CVEs in AI Agent Automation platform](https://www.thehackerwire.com/vulnerability/CVE-2026-54520/)
- [JADEPUFFER: AI agent runs ransomware attack end-to-end](https://cybersecuritynews.com/ai-agents-3/)
- [mayfly-go AI Assistant module vulnerability](https://vulners.com/cvelist/CVELIST:CVE-2026-92992)
- [Circle launches Arc Studio](https://www.bitbase.com/news/circle-launches-arc-studio-ai-agent-for-building-onchain-apps)
- [Manus seeks $4B valuation in new $500M fundraise](https://jingletree.com/manus-seeks-4b-valuation-in-new-500m-fundraise-as-it-resumes-independent-ops-272156.html)
- [GitLab 19.4 launches MCP server tools in public beta](https://www.archynewsy.com/gitlab-19-4-launches-new-mcp-server-tools-in-public-beta-for-ai-agent-automation/)
- [ElevenLabs expands hosted MCP connector](https://trewknowledge.com/2026/09/18/ai-this-week-the-infrastructure-around-ai-gets-serious/)
- [Claude Code fixes — Releasebot](https://releasebot.io/updates/anthropic/claude-code)
- [Qwen3.8-Flash-Next open weights](https://qwen.ai/research)
- [Tencent Cloud and AI Singapore launch agentic AI hackathon](https://technode.global/2026/09/18/tencent-cloud-ai-singapore-industry-ai-hackathon-dbs-keppel/)
- [Cognition bets on Brazil](https://valorinternational.globo.com/business/news/2026/09/18/cognition-bets-on-brazil-as-ai-expansion-accelerates.ghtml)
- [Africa's national AI plans start with infrastructure](https://www.businesstechafrica.co.za/article/africas-ai-plans-are-starting-with-the-infrastructure-problem)
- [Australia design-for-reversibility guidance](https://www.nbh.co/learn/can-you-undo-what-an-ai-agent-just-did)
- [Health Force raises €4.2M seed](https://www.eu-startups.com/2026/09/barcelona-based-health-force-raises-e4-2-million-to-streamline-hospital-operations-with-ai-agents)
- [Signoff launches Enterprise Agentic AI platform](https://m.thewire.in/article/ptiprnews/signoff-launches-enterprise-agentic-ai-intelligence-platform)
- [Certinia expands Veda suite](https://martech.org/the-latest-ai-powered-martech-news-and-releases/)
- [Hermes Agent — NousResearch GitHub](https://github.com/nousresearch/hermes-agent)
- [alibaba/open-code-review](https://github.com/alibaba/open-code-review)
- [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill)
- [microsoft/skills](https://github.com/microsoft/skills)
- [Pydantic AI v2.46.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.46.0)
- [An Empirical Study of Harness Design for Coding Agents — arXiv 2609.20804](https://arxiv.org/abs/2609.20804)
- [SoL-Pi: Recursively Scaling Auto-Research Loops for Efficient Agent Harness — arXiv 2609.20519](https://arxiv.org/abs/2609.20519)
- [How Do Agent Harnesses Create Value? — arXiv 2609.20474](https://arxiv.org/abs/2609.20474)
- [WPVibe WordPress MCP server](https://wordpress.org/plugins/vibe-ai/)
- [Alibaba Cloud ships Qwen Work for Teachers](https://www.alibabacloud.com/blog/qwen-work-for-teachers_603576)
- [Taiwan's Ministry of Digital Affairs AI Agent forum — The Hub News](https://www.thehubnews.net/archives/666657)
- [CAC and DeepSearch team up on agentic AI in Japan](https://itbusinesstoday.com/tech/ai/cac-and-deepsearch-team-up-on-agentic-ai-in-japan/)
