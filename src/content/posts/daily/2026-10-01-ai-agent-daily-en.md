---
title: "AI Daily — 2026-10-01"
date: 2026-10-01
category: daily
tags: [ai-agent, daily]
lang: en
description: "Agent capability is no longer the bottleneck — trusting an agent is. Today's capability spread, website payment gateways, an FTC probe and a string of funding rounds all put the price tag on the trust layer"
tldr: "Anthropic's red team found Zhipu's open-weight GLM-5.3 nearly matches Claude Mythos Preview at writing exploits, with its safeguards bypassed 64%–100% of the time; Google launched Gemini 4 Argon, released first to trusted cyber-defense partners; Cloudflare says more than half of Internet traffic is now non-human, AI agent requests grew over 1,700% in a year, and it launched a Monetization Gateway that charges agents via HTTP 402; the FTC opened a binding consumer-protection probe into OpenAI, Anthropic and other labs; OpenAI's DevDay shipped the always-on agent dots, GPT-6.1 Sol and an Agents API public beta; two Series A rounds, Restate and Comp AI, both bet on the recovery and compliance layer for agents"
draft: false
series:
  name: "AI Daily"
  order: 47
---

> 🌏 [中文版](/posts/daily/2026-10-01-ai-agent-daily)

## The One-Line Take

**Not one story today says "agents got smarter." Every one of them is about how an agent gets trusted — identity, permissions, payment and recovery are becoming where the money in the agent era actually lands; for enterprises switching on agent features at scale this month, the first gap to close is authorization traceability, not model choice.**

## Deep Dive: Trust Has Become the Main Transaction Cost of Agents

I think today's signals fit one transaction-cost sentence: the cost of dealing with an agent is no longer "can it do the job" but "how do I confirm who it is, what it may do, and whether I can undo the damage."

Evidence A (attack capability is spreading): Anthropic's Frontier Red Team found Zhipu's open-weight GLM-5.3 built end-to-end exploits in 50 of 410 ExploitBench attempts, versus 56 for Claude Mythos Preview. More important, simple tricks — a false cover story, prefilled reasoning — bypassed GLM-5.3's safeguards 64% to 100% of the time. The same day, Google launched Gemini 4 Argon and also chose to hand it first to trusted security partners. Closed models can still manage risk through staged release; open weights have no such gate, so defenders can only add controls at the layer where the agent acts.

Evidence B (websites start pricing agents): Cloudflare says that this year, for the first time, more than half of Internet traffic was not human, and daily AI agent requests grew more than 1,700% over the past year. Its answer is not blocking but three things: Web Bot Auth so agents cryptographically sign who they are, separate Search/Agent/Training controls, and HTTP 402 so site owners can charge agents per request. That is a direct attempt to lower the cost of identifying and pricing a stranger that happens to be software.

Evidence C (capital and regulators converge on the same layer): Today's two Stage 1 Series A rounds — Restate for automatic recovery of agent workflows, Comp AI for agents that run compliance year-round — plus seed rounds for Munich's Kontext and Portugal's Humanos, all bet on keeping agents in check rather than making them stronger. The FTC opened a binding probe into the major labs after already saying developers would be liable for their agents' behavior. And the cautionary tales arrived on cue: Storm-3168 used a service principal credential left in a GitHub issue's edit history to delete hundreds of Azure resources in 18 hours, and Obot's official quickstart shipped with authentication off, CVSS 9.8.

What it means for builders: KPMG Taiwan turned on Copilot's Agent features for all staff starting October 1, and more enterprises will follow. Delinea's survey is the mirror — 99.6% of Australian organisations surveyed had an AI tool access data beyond its scope, and only 42% could trace a sensitive access back to a named approver. Before rollout, checking that every agent action maps to a human is worth more time than comparing benchmark scores.

## Today's Updates

### Vendor Updates

**OpenAI**: At DevDay on 9/29 it launched dots, an always-on agent powered by GPT-6 Astra with its own cloud computer (available first on Pro, Business Premium and Enterprise), GPT-6.1 Sol at a quarter of Astra's standard token price, and an Agents API public beta; it is also reportedly negotiating a bridge round of at least $30B at about a $1.4T valuation. ([DevDay](https://www.inside.com.tw/article/42519-openai-devday-2026-dots-chatgpt-space-gpt-6-1-sol), [funding](https://www.bloomberg.com/news/articles/2026-09-29/openai-targets-30-billion-in-new-funding-at-1-4-trillion-value))

**Anthropic**: A leaked IPO prospectus obtained by Reuters shows $7.33B in first-half operating expenses, with the listing possibly slipping past the November midterms; Amazon Bedrock also opened in-region inference for Claude Opus 5 and Sonnet 5 in Seoul and Sonnet 5 in Singapore, with requests never leaving the Region. ([CNBC/Reuters](https://www.cnbc.com/2026/09/28/anthropics-ipo-prospectus-shows-sweeping-ai-vision-surging-costs-reuters.html), [AWS](https://aws.amazon.com/blogs/machine-learning/introducing-anthropic-models-on-amazon-bedrock-for-in-region-inference-in-seoul-and-singapore/))

**Cloudflare**: Beyond the agent-traffic report and the Monetization Gateway closed beta (settling in USDC on Base), it rebuilt Containers to start 6x faster as agent sandboxes. ([Agentic web](https://blog.cloudflare.com/agentic-web/), [Monetization Gateway](https://blog.cloudflare.com/monetization-gateway-beta/), [Sandboxes](https://blog.cloudflare.com/faster-agent-sandboxes/))

### Models & Infrastructure

**Gemini 4 Argon**: Google says it sets a record in real-world software engineering and ties GPT-6 Astra and Grok 4.7 for first on cybersecurity benchmarks; it goes to trusted cyber partners first, with pre-release safety testing alongside the US government. ([CNBC](https://www.cnbc.com/2026/09/30/google-gemini-4-argon-ai.html))

**Naive-N0.5-Flash**: Beijing's NaiveAI open-sourced a 309B MoE that drops every full-attention layer, self-reporting 73.6 on SWE-bench Pro; see the [model card](/posts/daily/2026-10-01-model-naiveai-naive-n0-5-flash-en).

**DeepSeek × Huawei Ascend**: On 9/30 DeepSeek ported TileLang, DeepGEMM, DeepEP and FlashMLA to Ascend, one-to-one with the existing Nvidia versions. ([Pandaily](https://pandaily.com/deepseek-ascend-infra-oss-tilelang-deepgemm-deepep-superpod-flex))

### Technical Progress

**Arxiv**: Today's three papers argue over how thick an agent's harness should be — JAZ matches a dedicated memory system with a single invoke primitive, and Harness-Zero distills harness behavior into the weights and then removes the harness; but TraceDance, built from 250k real deployment traces, shows frontier models send valid tool calls 67.9% of the time while doing the checks they should run before acting only 8.1% of the time. That fits today's theme: models won't police themselves, so the checks have to live outside. See the [Arxiv Digest](/posts/daily/2026-10-01-ai-agent-arxiv-digest-en).

**Pydantic AI v2.52.0**: Patches a web_fetch flaw where deeply nested HTML exhausts resources and folds harness capabilities into a unified Workspace interface; see the [framework update](/posts/daily/2026-10-01-framework-pydantic-ai-2.52.0-en).

### Tools & Ecosystem

**GitHub**: Today's rising repos all fill in the agent periphery — feder-cr/dots uses a modified Firefox engine so web agents go undetected, the exact opposite end of the tug-of-war from Cloudflare's "agents sign their identity" push; context-mode cuts tool output by 98%. See the [GitHub Digest](/posts/daily/2026-10-01-ai-agent-github-digest-en).

**mcp-lint**: Runs 21 rules over an MCP server's tool schemas and descriptions, including prompt-injection traces, before an agent calls them, and works as a CI gate; see the [tool pick](/posts/daily/2026-10-01-tool-mcp-lint-en).

### Security

**GLM-5.3 capability spread**: See the deep dive above; NIST CAISI's 9/17 assessment also called it the most cyber-capable open-weight model released to date. ([Anthropic](https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities))

**Storm-3168 (JADEPUFFER)**: Leaked credentials led to an Azure tenant takeover and mass deletion, but the evidence for "an AI agent made the calls" is thin; see the [security alert](/posts/daily/2026-10-01-security-storm-3168-azure-agentic-destruction-en).

**Obot CVE-2026-101065**: The open-source agent/MCP platform's Docker quickstart disabled authentication and mounted docker.sock, so unauthenticated requests got Owner/Admin; the fix is setting `OBOT_SERVER_ENABLE_AUTHENTICATION=true`. ([NVD summary](https://github.com/sattyamjjain/agent-audit-kit/issues/835))

### Regulation & Governance

**FTC probe of major AI labs**: Chair Ferguson will use legally binding Civil Investigative Demands to compel documents and executive testimony from OpenAI, Anthropic and others; METR is also in scope. ([The Decoder](https://the-decoder.com/ftc-launches-sweeping-probe-into-openai-anthropic-and-other-ai-labs-over-consumer-protection-concerns/))

### Regional Updates

**Taiwan**

KPMG Taiwan gave all staff paid Microsoft 365 Copilot with Agent features enabled from October 1, the first Big Four firm in Taiwan to roll it out firm-wide. ([Economic Daily News](https://udn.com/news/story/7240/9775570))

**Japan / Korea**

Amazon Bedrock's Seoul Region opened in-region Claude inference (see Vendor Updates); Samsung held its 10th Samsung AI Forum on 9/30 under the theme "Agentic Shift." ([Europe Says](https://www.europesays.com/3280251/))

**India**

IBM and Yotta launched a sovereign agentic AI platform combining watsonx Orchestrate with Shakti Cloud, keeping data, inference and governance controls in India. ([Economic Times](https://economictimes.indiatimes.com/ai/ai-insights/ibm-yotta-launch-sovereign-agentic-ai-platform-for-indian-enterprises/articleshow/134557690.cms))

**Oceania**

Delinea survey: 99.6% of Australian organisations surveyed had an AI tool or agent access sensitive data beyond its scope, and only 12% could detect it in real time. ([IT Brief](https://itbrief.co.nz/story/australian-firms-struggle-to-enforce-ai-data-rules))

Southeast Asia, Latin America, Africa and the Middle East were searched, but no qualifying same-day event directly tied to AI agents turned up, so none are included.

### Business Cases / Funding

**Restate**: $20M Series A for a durable execution layer for agent workflows; see the [funding brief](/posts/daily/2026-10-01-funding-restate-en).

**Comp AI**: $34M Series A for agents that execute compliance work directly; see the [funding brief](/posts/daily/2026-10-01-funding-comp-ai-en).

## Key Numbers

| Item | Number | Source |
|------|--------|--------|
| GLM-5.3 safeguard bypass rate | 64%–100% | [Anthropic](https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities) |
| Growth in daily AI agent requests (1 year) | >1,700% | [Cloudflare](https://blog.cloudflare.com/agentic-web/) |
| Australian orgs with AI out-of-scope access | 99.6% | [IT Brief](https://itbrief.co.nz/story/australian-firms-struggle-to-enforce-ai-data-rules) |
| TraceDance: pre-action check pass rate | 8.1% | [Arxiv Digest](/posts/daily/2026-10-01-ai-agent-arxiv-digest-en) |
| Obot CVE-2026-101065 | CVSS 9.8 | [NVD summary](https://github.com/sattyamjjain/agent-audit-kit/issues/835) |

## Today's Digests

- 📄 [AI Agent Arxiv Digest — 2026-10-01](/posts/daily/2026-10-01-ai-agent-arxiv-digest-en)
- 📄 [AI Agent GitHub Digest — 2026-10-01](/posts/daily/2026-10-01-ai-agent-github-digest-en)
- 📄 [Model Card: Naive-N0.5-Flash](/posts/daily/2026-10-01-model-naiveai-naive-n0-5-flash-en)
- 📄 [Framework Update: Pydantic AI v2.52.0](/posts/daily/2026-10-01-framework-pydantic-ai-2.52.0-en)
- 📄 [Tool Pick｜mcp-lint](/posts/daily/2026-10-01-tool-mcp-lint-en)
- 📄 [Security Alert: Storm-3168 (JADEPUFFER)](/posts/daily/2026-10-01-security-storm-3168-azure-agentic-destruction-en)
- 📄 [Funding Brief｜Restate $20M Series A](/posts/daily/2026-10-01-funding-restate-en)
- 📄 [Funding Brief｜Comp AI $34M Series A](/posts/daily/2026-10-01-funding-comp-ai-en)
- 📄 [AI Engineer Interview Daily — LLM & Agent Engineering](/posts/daily/2026-10-01-ai-interview-daily-en)
- 📄 [Product Builder Interview Daily — AI Product Design](/posts/daily/2026-10-01-product-builder-interview-daily-en)

## What to Watch Tomorrow

- Which documents the FTC's Civil Investigative Demands, due within weeks, actually request — and whether agent behavior logs are on the list
- When Gemini 4 Argon widens from cyber partners to the general API, and details on the four safeguard areas Google named, including prompt injection
- How fast other Taiwanese enterprises follow KPMG in enabling agent permissions, and whether local clouds offer in-country Claude/GPT inference like Bedrock's

## Today's Takeaway

I used to treat agent safety mainly as an alignment problem, expecting models to learn to refuse and self-check; put GLM-5.3's easy bypass next to TraceDance's 8.1% and the more practical assumption is that models won't police themselves. For teams in Taiwan, that means an agent project's budget needs a slice reserved for permissions, auditing and recovery, not everything spent on model APIs.

## References

- [GLM-5.3 and the spread of advanced cyber capabilities — Anthropic](https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities)
- [Google rolls out Gemini 4 Argon — CNBC](https://www.cnbc.com/2026/09/30/google-gemini-4-argon-ai.html)
- [The Internet has a second audience — Cloudflare](https://blog.cloudflare.com/agentic-web/)
- [Monetization Gateway beta: charge AI agents with HTTP 402 — Cloudflare](https://blog.cloudflare.com/monetization-gateway-beta/)
- [Faster agent sandboxes — Cloudflare](https://blog.cloudflare.com/faster-agent-sandboxes/)
- [FTC launches sweeping probe into OpenAI, Anthropic and other AI labs — The Decoder](https://the-decoder.com/ftc-launches-sweeping-probe-into-openai-anthropic-and-other-ai-labs-over-consumer-protection-concerns/)
- [CVE-2026-101065 (Obot) — agent-audit-kit](https://github.com/sattyamjjain/agent-audit-kit/issues/835)
- [OpenAI DevDay 2026: dots and GPT-6.1 Sol — INSIDE](https://www.inside.com.tw/article/42519-openai-devday-2026-dots-chatgpt-space-gpt-6-1-sol)
- [OpenAI Targets $30 Billion in Funding at $1.4 Trillion Value — Bloomberg](https://www.bloomberg.com/news/articles/2026-09-29/openai-targets-30-billion-in-new-funding-at-1-4-trillion-value)
- [Anthropic's IPO prospectus shows sweeping AI vision, surging costs — CNBC/Reuters](https://www.cnbc.com/2026/09/28/anthropics-ipo-prospectus-shows-sweeping-ai-vision-surging-costs-reuters.html)
- [Anthropic models on Amazon Bedrock for in-region inference in Seoul and Singapore — AWS](https://aws.amazon.com/blogs/machine-learning/introducing-anthropic-models-on-amazon-bedrock-for-in-region-inference-in-seoul-and-singapore/)
- [DeepSeek Open-Sources Ascend Versions of TileLang, DeepGEMM and More — Pandaily](https://pandaily.com/deepseek-ascend-infra-oss-tilelang-deepgemm-deepep-superpod-flex)
- [KPMG rolls out Copilot to all staff from October — Economic Daily News](https://udn.com/news/story/7240/9775570)
- [Samsung Electronics Marks 10th AI Forum — Europe Says](https://www.europesays.com/3280251/)
- [IBM, Yotta launch sovereign agentic AI platform for Indian enterprises — Economic Times](https://economictimes.indiatimes.com/ai/ai-insights/ibm-yotta-launch-sovereign-agentic-ai-platform-for-indian-enterprises/articleshow/134557690.cms)
- [Australian firms struggle to enforce AI data rules — IT Brief](https://itbrief.co.nz/story/australian-firms-struggle-to-enforce-ai-data-rules)
