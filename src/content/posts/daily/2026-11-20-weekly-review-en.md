---
title: "AI Agent Weekly Review — 2026-11-20"
date: 2026-11-20
category: daily
type: digest
tags: [ai-agent, weekly, daily]
lang: en
description: "This week's biggest cognitive shift: agent security stopped being a proof-of-concept in a paper. Unattended autonomous attack chains, research showing authorization boundaries failing across the board, and a run of supply-chain credential thefts all converged in the same week"
tldr: "Anthropic listed on Nasdaq on 11/18; Google, Amazon, and Unit 42 each independently confirmed unattended autonomous attack agents are now showing up in real intrusions; four mainstream agent orchestration frameworks were shown to fail authorization boundaries across the board; Microsoft's agent-framework, SGLang/NEAR AI, and Fireworks/Cursor supply-chain credential incidents all broke in the same week; OpenAI is deprecating GPT-5/o3 for GPT-6.2 — with mini/nano tiers actually getting more expensive."
series:
  name: "AI Agent 週回顧"
  order: 15
---

> 🌏 [中文版](/posts/daily/2026-11-20-weekly-review)

## The 5 Biggest Things This Week

### 1. Anthropic completes its IPO, lists on Nasdaq on 11/18

Anthropic's updated filing priced 825 million Class A shares at $70–78 each, with pricing on 11/18 followed by listing on Nasdaq under ticker ANT. This is the clearest landscape-level event of the week — a frontier model lab moved from private valuations to a publicly traded instrument, which means its R&D pace, pricing strategy, and security incidents (a supply-chain credential leak happened this same week, coincidentally) now face real-time public-market pricing reactions, not just the next private funding round's negotiation. ([source](https://finance.yahoo.com/technology/ai/article/anthropic-ipo-what-we-know-143321078.html))

### 2. Unattended autonomous attack agents go from theoretical to independently confirmed by three separate parties

Google's threat intelligence team published the first documented case of an attacker-operated agent autonomously turning two PHP CVEs into working exploit code with no human involvement. Almost the same week, Amazon's MadPot honeypot network captured the operational logs of the ARTEX agent — autonomously scanning internet-exposed AI platforms like LiteLLM, Dify, and RAGFlow, then feeding verified stolen provider keys into a shared key pool to fuel further attacks. Separately, Unit 42 disclosed that Chinese-speaking threat actors wired the open-source pentesting framework Cairn to Zhipu GLM and DeepSeek, letting a single-line target spin up autonomous planning and execution; over two months, this ran 25 operations against 19 semiconductor, defense, and civil-society organizations, breaching 10 of them. The FBI warned the same week that frameworks like these are already showing up in real intrusions. Three unrelated teams independently observed the same inflection point: autonomous attack chains are no longer proof of concept — they're production tooling already in use. ([Google Cloud Blog](https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold/), [AWS Security Blog](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-observes-threat-actors-running-cybercrime-campaigns-with-artex-ai-agents/), [Unit 42](https://unit42.paloaltonetworks.com/cairn-framework-ai-autonomous-attacks/))

```diagram
title: Three independently confirmed autonomous-attack-agent cases, on a timeline
desc: Google, Amazon, and Unit 42 — three unrelated teams — each published a case of unattended autonomous attack the same week, with no cross-reference between them, yet all pointing to the same inflection point.
caption: Dates reflect each threat-intelligence report's public disclosure date.
---
<svg viewBox="0 0 760 240">
  <path class="dg-axis" d="M48 124H700"/>
  <path class="dg-axis" d="M120 124V130M300 124V130M480 124V130M660 124V130"/>
  <text class="dg-small" x="120" y="144" text-anchor="middle" dominant-baseline="central">11/16</text>
  <text class="dg-small" x="300" y="144" text-anchor="middle" dominant-baseline="central">11/17</text>
  <text class="dg-small" x="480" y="144" text-anchor="middle" dominant-baseline="central">11/18</text>
  <text class="dg-small" x="660" y="144" text-anchor="middle" dominant-baseline="central">11/19</text>

  <g>
    <line class="dg-rule" x1="120" y1="76" x2="120" y2="118"/>
    <circle class="dg-dot" cx="120" cy="124" r="4"/>
    <text class="dg-label" x="120" y="40" text-anchor="middle" dominant-baseline="central">Google discloses exploit_agent</text>
    <text class="dg-sub" x="120" y="62" text-anchor="middle" dominant-baseline="central">Unattended PHP CVE-to-exploit</text>
  </g>
  <g>
    <line class="dg-rule" x1="300" y1="156" x2="300" y2="172"/>
    <circle class="dg-dot" cx="300" cy="124" r="4"/>
    <text class="dg-label" x="300" y="186" text-anchor="middle" dominant-baseline="central">Amazon discloses ARTEX</text>
    <text class="dg-sub" x="300" y="208" text-anchor="middle" dominant-baseline="central">Self-sustaining key-theft loop</text>
  </g>
  <g>
    <line class="dg-rule" x1="480" y1="76" x2="480" y2="118"/>
    <circle class="dg-dot" cx="480" cy="124" r="4"/>
    <text class="dg-label" x="480" y="40" text-anchor="middle" dominant-baseline="central">Unit 42 discloses Cairn</text>
    <text class="dg-sub" x="480" y="62" text-anchor="middle" dominant-baseline="central">10 orgs breached in 2 months</text>
  </g>
  <g>
    <line class="dg-rule" x1="660" y1="156" x2="660" y2="172"/>
    <circle class="dg-dot dg-dot--accent" cx="660" cy="124" r="6"/>
    <text class="dg-label" x="740" y="186" text-anchor="end" dominant-baseline="central">FBI issues public warning</text>
    <text class="dg-sub" x="740" y="208" text-anchor="end" dominant-baseline="central">Same frameworks seen in intrusions</text>
  </g>
</svg>
```

### 3. A multi-agent meta-analysis and an authorization-boundary study both puncture the "coordination means safety" assumption, in the same week

A meta-analysis spanning 9 studies and 516 configurations found that, on a sample-size-matched baseline, multi-agent systems average -0.042 accuracy, with 74% of comparable setups failing to beat a single model. Almost the same week, a separate study ran 12 OWASP-mapped experiments against four mainstream orchestration frameworks — LangChain, LangGraph, AutoGen, OpenClaw — and every single one showed prompt injection or unauthorized tool execution. Read together, these say: no amount of coordination-logic tuning makes a system more reliable or safer if the authorization boundary itself isn't sound — and this gets more extreme once you add delegation: another paper demonstrated that delegating to a weaker sub-agent pushes attack success from 0/180 to 75/180. A system's security is bounded by its weakest agent, not its strongest. ([More Agents, More Samples, or More Thinking? (arXiv:2611.17610)](https://arxiv.org/abs/2611.17610), [Evaluating Authorization and Trust Boundaries in Agentic Orchestration Frameworks (arXiv:2611.21259)](https://arxiv.org/abs/2611.21259), [Only as Safe as the Weakest Agent (arXiv:2611.17520)](https://arxiv.org/abs/2611.17520))

### 4. A string of supply-chain credential incidents: Fireworks/Cursor, Microsoft's agent-framework, SGLang/NEAR AI

Three independent supply-chain credential incidents strung together this week into a single thread. Cursor published the results of a two-week investigation: attackers used a leaked Fireworks AI access key to move laterally into Cursor's internal SaaS tooling, which is what let them plant a tampered Claude Code extension on the Marketplace — the same leaked key also hit Uber and Notion. A few days later, attackers published malicious versions 1.26.1/1.26.2 of Microsoft's official `agent-framework` PyPI package, using a `.pth` startup hook so credential-stealing code runs on any Python startup — no import of the package required — to exfiltrate Azure and GitHub Actions credentials. The week closed with an SGLang RCE vulnerability used to breach NEAR AI's confidential-inference environment, exposing account data for roughly 100 users and conversation history for 18 legacy agents. Three incidents hit three different layers of the dependency chain — a third-party API key, official package distribution, and an open-source inference engine — but the conclusion is the same: the attack surface across agent infrastructure's supply chain is spreading faster than governance can react. ([Cursor supply-chain incident](/posts/daily/2026-11-16-security-fireworks-ai-key-theft-cursor-supply-chain-en), [Microsoft agent-framework](/posts/daily/2026-11-19-security-microsoft-agent-framework-pypi-credential-stealer-en), [SGLang/NEAR AI](/posts/daily/2026-11-20-security-sglang-rce-near-ai-confidential-inference-breach-en))

### 5. OpenAI deprecates GPT-5/o3, flagship prices drop 85%+ — but mini/nano tiers actually get more expensive

OpenAI's deprecations page lists gpt-5, gpt-5-mini, gpt-5-nano, gpt-5-pro, o3, and o3-pro as retiring on 2026-12-11, migrating to the GPT-6.1/GPT-6 lineup. Published rates show flagship and Pro tiers dropping 60%-92%, but gpt-5-mini's successor gpt-6.1-terra costs 300% more on input and 150% more on output — the "upgrade" at the mini tier is actually a price hike. The same week, GPT-6.2 Astra cut input/output list prices 20% each, landing exactly at the same price as Claude Fable 5.2, launched just eight days earlier ($8/$40). Meanwhile Gemini 4 Neon debuted straight into third place on the Arena Agent leaderboard, statistically tied with second-place Claude Opus 5.5 within overlapping confidence intervals. Model generation cycles are now fast enough that flagship pricing converges automatically — but real costs at the mid/low tiers can quietly rise under cover of a model deprecation. ([Pricing tracker: GPT-5/o3 deprecation](/posts/daily/2026-11-16-pricing-openai-gpt-5-o3-family-shutdown-en), [Pricing tracker: GPT-6.2 Astra](/posts/daily/2026-11-20-pricing-openai-gpt-6-2-astra-sol-cut-en), [Benchmark: Gemini 4 Neon](/posts/daily/2026-11-20-benchmark-gemini-4-neon-en))

## This Week's Cognitive Updates

- I used to think multi-agent systems should be more reliable than a single model as long as the coordination logic is well designed. Now I know a meta-analysis spanning 9 studies and 516 configurations found that, on a sample-size-matched baseline, the average is actually -0.042, with 74% failing to beat a single model — and four mainstream orchestration frameworks all showed prompt injection or unauthorized tool execution across 12 OWASP-mapped experiments. Good coordination logic doesn't help if the authorization boundary never held in the first place.
- I used to think delegating a task to a weaker, cheaper sub-agent mostly just cost you some answer quality. Now I know *Only as Safe as the Weakest Agent* demonstrated, on unmodified Claude Code and Codex, that attack success jumps from 0/180 to 75/180 — a system's security boundary is set by its weakest agent, not its strongest.
- I used to think LLM-as-judge grading in agent evaluations was fast and objective enough to trust by default. Now I see that two memory-system papers this week — *RAG in a Trenchcoat*'s adversarial-probe grading and *Multi-Agent Memory Inconsistency*'s "Judge Pass" determination — both rely entirely on a single LLM judge with no reported human-agreement rate. That's a shared, unexamined assumption across this week's memory research, and it belongs in the fine print whenever anyone cites these papers' exact numbers.
- I used to think autonomous exploit development still needed a human to finish the job. Now I know Google's threat intelligence team published the first unattended case: an agent turning two PHP CVEs into working exploit code with zero human involvement, while the FBI warned the same week that frameworks like ARTEX and Cairn are already recurring in real intrusions.

## Enterprise Adoption Watch

I think the most important enterprise signal this week is OpenAI's GPT-5/o3 deprecation pricing table — not whichever model just topped a leaderboard.

Through a **switching-cost** lens: a model ID deprecation forces a passive migration, and the direction of that migration isn't a uniform price cut — flagship and Pro tiers drop 60%-92%, but the mini/nano tier's recommended replacement actually costs 100%-300% more. That's a quieter way for a vendor to erode your bargaining power: the headline says "price cut," but the cheap model you're actually running might be the one getting more expensive — and you won't notice until the 12/11 deprecation deadline forces the issue.

The implication for enterprise adoption in Taiwan: if your product runs high-volume, low-cost agent tasks (customer-service triage, content moderation, batch summarization) on mini/nano tiers, go check the actual billed model ID now — don't wait for an auto-migration notice to discover cost drift. This is also a good moment to re-evaluate a routing layer like LiteLLM or OpenRouter, which abstracts model choice and spreads out single-vendor lock-in risk — but note that routing layers like these were themselves a target of ARTEX's automated scanning this week. Abstraction doesn't substitute for basic credential hygiene like key rotation and expiration.

## Worth Tracking Next Week

- Whether OpenAI announces an auto-migration mechanism before the 12/11 GPT-5/o3 deprecation deadline, or genuinely requires enterprises to manually switch model IDs
- Whether the four orchestration frameworks (LangChain, LangGraph, AutoGen, OpenClaw) ship patches or governance guidance following this week's authorization-boundary research
- Whether Gemini 4 Neon's self-reported CursorBench 4.1 score of 65.4% gets independently verified
- Whether Nvidia's interim CEO team's supply-chain commitments and earnings guidance stay stable after the founder's departure

## Watchlist Update Suggestions

### 🆕 Candidates to add

✅ Every company that appeared most frequently this week (OpenAI, Google, Microsoft, Nvidia, Alibaba-Qwen, Meta, Anthropic, Amazon, Sourcegraph, Cohere) is already on the watchlist — no new candidates this week.

### ⚠️ Candidates to remove

✅ No companies met the removal criteria this week.

## This Week's Startup Radar

| Company | What it does | Funding | Why it's notable |
|---|---|---|---|
| Corma | Trains its own foundation models for defensive security | Series A $125M ($1B valuation) | Went from stealth to unicorn in three months; led by NEA |
| Remanence | Converts an enterprise's agent execution data into the enterprise's own post-trained model | Seed $30M | Founded by three former H Company researchers, betting that "who owns the agent's data" will matter more than raw model performance |
| Linq | AI agent communication infrastructure (messaging, voice, computer use) | New round $90M | Led by a16z, with Ben Horowitz personally joining the board; cumulative messages processed passed 1 billion |
| Numa | AI operating system for car dealerships | Series C $45M ($500M valuation) | Secured official certification from GM, FordDirect, and Stellantis — certification as the scaling path instead of single-store pilots |

## What I Learned This Week

My biggest cognitive update this week is that agent security is moving from a statistical, theoretical risk to a repeatable production attack chain. I used to think cases like exploit_agent, ARTEX, and Cairn were still isolated incidents. After reading Google's, Amazon's, and Unit 42's independent confirmations in the same week, I now see autonomous exploitation isn't a proof of concept anymore — it's production tooling the FBI is publicly warning is recurring in real intrusions. The implication for teams anywhere: when assessing exposed AI infrastructure (gateways like LiteLLM or Dify), don't just ask "can this be jailbroken" — assume an automated scanning loop is already hunting for your keys, and make sure your patching and key-rotation speed keeps up with the pace of attack automation.

## References

- Watchlist comparison baseline: `src/data/agent-watchlist.json`
- [Anthropic IPO: What We Know — Yahoo Finance](https://finance.yahoo.com/technology/ai/article/anthropic-ipo-what-we-know-143321078.html)
- [Google Cloud Blog: exploit_agent threat intelligence report](https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold/)
- [AWS Security Blog: ARTEX AI agent operational logs](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-observes-threat-actors-running-cybercrime-campaigns-with-artex-ai-agents/)
- [Security Alert: ARTEX scans LiteLLM, Dify, and other AI apps to steal provider keys](/posts/daily/2026-11-17-security-artex-ai-agent-key-theft-litellm-dify-en)
- [Unit 42: Cairn framework autonomous-attack report](https://unit42.paloaltonetworks.com/cairn-framework-ai-autonomous-attacks/)
- [Security Alert: Chinese threat actors wire the open-source pentesting framework Cairn to GLM/DeepSeek](/posts/daily/2026-11-18-security-cairn-china-nexus-ai-pentest-breach-en)
- [More Agents, More Samples, or More Thinking? (arXiv:2611.17610)](https://arxiv.org/abs/2611.17610)
- [Only as Safe as the Weakest Agent (arXiv:2611.17520)](https://arxiv.org/abs/2611.17520)
- [Unfinished-Bench: Measuring Rule Violations by Persistent Agents (arXiv:2611.17460)](https://arxiv.org/abs/2611.17460)
- [Evaluating Authorization and Trust Boundaries in Agentic Orchestration Frameworks (arXiv:2611.21259)](https://arxiv.org/abs/2611.21259)
- [RAG in a Trenchcoat: When Minimal Memory Is Enough for Agentic Systems (arXiv:2611.22179)](https://arxiv.org/abs/2611.22179)
- [Multi-Agent Memory Inconsistency: Where Factual Conflicts Disappear in LLM Agents (arXiv:2611.22245)](https://arxiv.org/abs/2611.22245)
- [AI Agent Arxiv Digest — 2026-11-17](/posts/daily/2026-11-17-ai-agent-arxiv-digest-en)
- [AI Agent Arxiv Digest — 2026-11-19](/posts/daily/2026-11-19-ai-agent-arxiv-digest-en)
- [Security Alert: Cursor discloses that a leaked Fireworks AI key is the root cause of the extension backdoor incident](/posts/daily/2026-11-16-security-fireworks-ai-key-theft-cursor-supply-chain-en)
- [Security Alert: Microsoft Agent Framework's official package compromised with a .pth startup hook](/posts/daily/2026-11-19-security-microsoft-agent-framework-pypi-credential-stealer-en)
- [Security Alert: SGLang RCE breaches NEAR AI's confidential-inference environment](/posts/daily/2026-11-20-security-sglang-rce-near-ai-confidential-inference-breach-en)
- [NEAR AI official incident report](https://near.ai/blog/security-incident-report-sglang-vulnerability)
- [Pricing Tracker: OpenAI deprecates GPT-5/o3 on 12/11](/posts/daily/2026-11-16-pricing-openai-gpt-5-o3-family-shutdown-en)
- [Pricing Tracker: GPT-6.2 Astra cuts prices 20%](/posts/daily/2026-11-20-pricing-openai-gpt-6-2-astra-sol-cut-en)
- [Benchmark Shift: Gemini 4 Neon debuts](/posts/daily/2026-11-20-benchmark-gemini-4-neon-en)
- [Funding Alert: Corma's $125M Series A](/posts/daily/2026-11-17-funding-corma-en)
- [Funding Alert: Remanence's $30M seed round](/posts/daily/2026-11-18-funding-remanence-en)
- [Funding Alert: Linq's $90M new round](/posts/daily/2026-11-20-funding-linq-en)
- [Funding Alert: Numa's $45M Series C](/posts/daily/2026-11-17-funding-numa-en)
