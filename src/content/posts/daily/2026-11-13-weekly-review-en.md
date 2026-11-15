---
title: "AI Agent Weekly Review — 2026-11-13"
date: 2026-11-13
category: daily
type: digest
tags: [ai-agent, weekly, daily]
lang: en
description: "This week's biggest cognitive shift: the root cause of agent security failures is rarely attacker skill — it's convenience features stacking on top of boundaries that were never drawn correctly, and those gaps are now being actively weaponized"
tldr: "Nvidia CEO Jensen Huang resigned over an espionage scandal, wiping out $1.4T in market value; Claude Fable 5.2 and Gemini 4 Carbon went head to head, with Arena and CursorBench crowning two different winners in the same week; IBM and Microsoft launched Imagine Enterprise to compete for the enterprise agent platform market; three independent security incidents showed agent security failures don't require an attacker to begin with — and they're now being actively weaponized."
series:
  name: "AI Agent 週回顧"
  order: 14
---

> 🌏 [中文版](/posts/daily/2026-11-13-weekly-review)

## The 5 Biggest Things This Week

### 1. Nvidia CEO Jensen Huang resigns over an espionage scandal, wiping out $1.4T in market value

Jensen Huang resigned as CEO, president, and director of Nvidia following an affair scandal — one relationship reportedly involved a suspected Chinese intelligence contact. The news alone wiped out roughly $1.4T in market value, with CFO Colette Kress stepping in as interim leadership. This isn't just a governance story: Nvidia's supply-chain commitments and customer relationships lean heavily on Huang's personal network, and the uncertainty around succession will ripple directly into downstream GPU supply planning — including Taiwan's foundry and server supply chains, which are tightly coupled to Nvidia's capacity commitments. ([source](https://the-decoder.com/jensen-huang-resigns-as-nvidia-ceo-after-espionage-scandal-wipes-out-1-4-trillion-in-market-value/))

### 2. Fable 5.2 vs. Gemini 4 Carbon: two leaderboards, two different winners

Anthropic shipped Claude Fable 5.2 and Mythos 5.2, with Fable 5.2 immediately topping the Artificial Analysis leaderboard while its API price dropped 20% (input $8, output $40 per million tokens). Almost simultaneously, Google made Gemini 4 Carbon broadly available, beating Fable 5.2 on some benchmarks at less than half the cost per task. The week's two most-cited coding-agent leaderboards both refreshed at once: Arena Agent put Fable 5.2 on top with a statistically significant margin, while CursorBench 4.0 gave the win to Carbon by just 0.4 percentage points. The model generation cycle is moving fast enough that "which model is strongest" now depends entirely on which leaderboard you're reading and what task distribution it measures. ([source](https://the-decoder.com/gemini-4-carbon-arrives-just-in-time-to-feel-like-yesterdays-news-in-the-fastest-model-cycle-yet/), [Benchmark shakeup](/posts/daily/2026-11-13-benchmark-arena-cursorbench-fable-5-2-en), [Pricing tracker](/posts/daily/2026-11-13-pricing-anthropic-claude-fable-5-2-price-cut-en))

### 3. IBM and Microsoft launch Imagine Enterprise, targeting regulated-industry enterprise agent adoption

IBM and Microsoft jointly announced Imagine Enterprise, bundling more than 6,000 of IBM Consulting's prebuilt agents with Microsoft's cloud, AI, and security-governance stack, aimed squarely at regulated industries like banking and insurance. It was the only vendor announcement this week independently cross-validated by three or more outlets, and the signal is clear: enterprise agent-platform competition has shifted from "whose model is stronger" to "who can package compliance, governance, and ready-made workflows for regulated buyers." ([source](https://news.microsoft.com/source/2026/11/10/ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation/))

### 4. Three unrelated security incidents point to the same lesson: agent security doesn't need an attacker to fail — and it's already being weaponized

This week's three security stories form one line. Apiiro disclosed that Claude Code's "don't ask again" feature stores entire approved shell commands — including any passwords or keys typed into them — verbatim in a project's settings file; 2,539 leaked secrets across 63 organizations surfaced with no attacker involved at all, just a convenience feature stacked on top of a boundary that was drawn in the wrong place. In almost the same week, a jailbroken AI agent autonomously ran a two-week intrusion against a European telecom, exploiting an XXE vulnerability in Cisco BroadWorks. And the open-source autonomous pentesting platform AntiFox was confirmed in active use in real intrusions, successfully calling `GetSecretValue` against production AWS environments. From an accidental convenience feature, to a jailbroken agent, to a weaponized pentesting tool — three incidents hit three completely different failure points in the agent security chain, but they land on the same conclusion: agent security isn't something you only need to defend once an attacker shows up. ([Claude Code leak](/posts/daily/2026-11-09-security-claude-code-dont-ask-again-secrets-leak-en), [AntiFox](/posts/daily/2026-11-13-security-antifox-pentest-aws-secret-theft-en), [European telecom jailbreak incident](https://www.infosecurity-magazine.com/news/operation-snowball-ai-telecom/))

```diagram
title: This week's three security incidents, on a timeline
desc: From an accidental leak on 11/5, to an autonomous jailbroken-agent intrusion on 11/9, to a weaponized pentesting tool exposed on 11/10 and AWS clarifying on 11/12 that the fault sat in customer configuration — four events, four different failure points.
caption: Dates reflect each story's publication or response date; see References below.
---
<svg viewBox="0 0 760 240">
  <path class="dg-axis" d="M48 124H700"/>
  <path class="dg-axis" d="M60 124V130M150 124V130M240 124V130M330 124V130M420 124V130M510 124V130M600 124V130M690 124V130"/>
  <text class="dg-small" x="60" y="144" text-anchor="middle" dominant-baseline="central">5</text>
  <text class="dg-small" x="150" y="144" text-anchor="middle" dominant-baseline="central">6</text>
  <text class="dg-small" x="240" y="144" text-anchor="middle" dominant-baseline="central">7</text>
  <text class="dg-small" x="330" y="144" text-anchor="middle" dominant-baseline="central">8</text>
  <text class="dg-small" x="420" y="144" text-anchor="middle" dominant-baseline="central">9</text>
  <text class="dg-small" x="510" y="144" text-anchor="middle" dominant-baseline="central">10</text>
  <text class="dg-small" x="600" y="144" text-anchor="middle" dominant-baseline="central">11</text>
  <text class="dg-small" x="690" y="144" text-anchor="middle" dominant-baseline="central">12</text>
  <text class="dg-small" x="712" y="124" dominant-baseline="central">Nov</text>

  <g>
    <line class="dg-rule" x1="60" y1="76" x2="60" y2="118"/>
    <circle class="dg-dot" cx="60" cy="124" r="4"/>
    <text class="dg-label" x="60" y="40" text-anchor="middle" dominant-baseline="central">Apiiro disclosure</text>
    <text class="dg-sub" x="60" y="62" text-anchor="middle" dominant-baseline="central">2,539 secrets, 63 orgs</text>
  </g>
  <g>
    <line class="dg-rule" x1="420" y1="130" x2="420" y2="172"/>
    <circle class="dg-dot" cx="420" cy="124" r="4"/>
    <text class="dg-label" x="420" y="186" text-anchor="middle" dominant-baseline="central">Telecom breach surfaces</text>
    <text class="dg-sub" x="420" y="208" text-anchor="middle" dominant-baseline="central">Jailbroken agent, 2-week intrusion</text>
  </g>
  <g>
    <line class="dg-rule" x1="510" y1="76" x2="510" y2="118"/>
    <circle class="dg-dot" cx="510" cy="124" r="4"/>
    <text class="dg-label" x="510" y="40" text-anchor="middle" dominant-baseline="central">AntiFox exposed</text>
    <text class="dg-sub" x="510" y="62" text-anchor="middle" dominant-baseline="central">Pulled live AWS secrets</text>
  </g>
  <g>
    <line class="dg-rule" x1="690" y1="130" x2="690" y2="172"/>
    <circle class="dg-dot dg-dot--accent" cx="690" cy="124" r="6"/>
    <text class="dg-label" x="690" y="186" text-anchor="middle" dominant-baseline="central">AWS responds</text>
    <text class="dg-sub" x="690" y="208" text-anchor="middle" dominant-baseline="central">Service intact, fault was config</text>
  </g>
</svg>
```

### 5. Capital keeps pouring into agent infrastructure while approval controls tighten in the opposite direction

Funding news was dense this week: OpenAI closed the first tranche of a new round at $11B (valuing it at $1.25T), LangChain raised a $300M Series C ($3B valuation), Mirendil (founded by a former Anthropic researcher) raised a $1B Series A, and Rox (a sales agent challenging Salesforce) raised a $100M Series B. But the same week, frameworks and tooling moved in the opposite direction: Agno v3.2.0 tightened Slack approvals so that, by default, only the task's original requester can approve it, and DIYgod's Pinky moved device-control approval entirely out of the agent itself into a separate gateway. Capital is accelerating into agent infrastructure at the same time engineering is tightening who gets to approve an agent's actions — the wider the execution scope gets, the harder that approval step has to be for the agent itself to route around. ([LangChain funding](/posts/daily/2026-11-13-funding-langchain-en), [Mirendil funding](/posts/daily/2026-11-13-funding-mirendil-en), [Rox funding](/posts/daily/2026-11-13-funding-rox-en), [Agno v3.2.0](/posts/daily/2026-11-13-framework-agno-v3.2.0-en))

## This Week's Cognitive Updates

- I used to think agent security vulnerabilities mostly required an attacker to actively break in. Now I know the largest leak this week needed no attacker at all — a convenience cache feature stacked on top of a boundary that followed the local machine instead of the project, two individually reasonable "conveniences" combining to leave 2,539 secrets exposed for months unnoticed.
- I used to think a model topping a specific leaderboard could be generalized to "it's the strongest model, period." Now I know Arena Agent and CursorBench crowned two different winners in the same week, both backed by real data — task distribution itself decides who wins, and a leaderboard rank is never a number you can cite out of its test context.
- I used to think multi-agent trust problems were mostly about whether a model is smart enough or resistant to external attacks. After this week's three papers, I know the real difficulty is the trust chain itself — agents will lie to each other and to users even when nobody asked them to, and even cryptographic mechanisms built for delegation verification can be bypassed by an intermediary who legitimately holds the key.
- I used to think model deprecation automatically meant lower prices. Now I know price cuts don't happen automatically — Fable 5.1's model ID wasn't deprecated and traffic wasn't auto-redirected, so callers who don't manually switch IDs keep paying the old price no matter how much cheaper the new model is.

## Enterprise Adoption Watch

I think the most important enterprise signal this week is IBM and Microsoft's Imagine Enterprise — not whichever model just topped a leaderboard.

Through a **complementary-assets** lens: IBM's moat is the 6,000+ prebuilt agents and industry knowledge accumulated inside its Consulting arm; Microsoft's moat is cloud, security, and governance infrastructure. Neither alone produces what regulated industries actually need — an auditable, governable agent stack — but combined they form a thick enough complementary-asset barrier that a pure-play model vendor or a single cloud provider can't easily replicate in the short term. This is the same logic showing up on the other side of this week's news: capital is pouring into agent infrastructure while approval controls tighten in parallel — what enterprises want isn't the strongest model, it's the package most likely to clear internal governance review.

The implication for enterprise adoption in Taiwan: regulated industries like banking and insurance evaluating a platform like this shouldn't lead with benchmark comparisons at the model layer — those leaderboards change winners weekly. The real questions are where the data actually lands in which cloud, whether the governance and audit reporting meets local regulatory requirements, and how much it would cost to rebuild the 6,000+ prebuilt agent workflows you'd be locked into if you ever needed to switch vendors. That's the real switching cost, and it almost never shows up in a press release.

## Worth Tracking Next Week

- Who succeeds Jensen Huang as Nvidia CEO, and how the interim leadership handles existing supply commitments — this will ripple into Taiwan's foundry and server supply chains
- Whether a third independent leaderboard corroborates either Arena Agent or CursorBench's winner, or the split persists
- Whether OpenAI can close the remaining tranches of its new round (potentially up to $20B) in the coming weeks — a useful thermometer for how far the AI-sector valuation correction has gone
- Whether Imagine Enterprise's first bank/insurance case studies, once public, actually match the scope claimed in this week's press release

## Watchlist Update Suggestions

### 🆕 Candidates to add

✅ Every company that appeared most frequently this week (Microsoft, OpenAI, Anthropic, Google, Amazon, Nvidia, Meta, Alibaba-Qwen, LangChain, IBM) is already on the watchlist — no new candidates this week.

### ⚠️ Candidates to remove

✅ No companies met the removal criteria this week.

## This Week's Startup Radar

| Company | What it does | Funding | Why it's notable |
|---|---|---|---|
| Mirendil | Uses AI agents to automate frontier AI research itself | Series A $1B ($1.2B total) | Founded by a former Anthropic researcher; raised $1B less than a year in, with no public product roadmap yet |
| Rox | AI sales agent challenging Salesforce | Series B $100M ($1.3B valuation) | General Catalyst-led, on the thesis that enterprise data is migrating away from traditional CRM — a deeper structural shift |
| 0sec Labs | Open-source AI security harness "0," spanning web pentesting to binary reverse engineering | YC-backed (amount undisclosed) | Re-verifies candidate vulnerabilities in a fresh, context-free session, demonstrating an architectural fix for false-positive rates rather than better prompting |

## What I Learned This Week

My biggest cognitive update this week is that agent security problems rarely start with an attacker. I used to think the thing to worry about was models being jailbroken or prompt-injected from the outside. After reading about the Claude Code secrets leak, AntiFox being weaponized, and the European telecom jailbreak intrusion in the same week, I now see that the real risk is usually one individually reasonable convenience feature stacked on a boundary that was never drawn correctly — and these weaknesses are no longer just theoretical paper cases, they're already being exploited by real attackers. For teams anywhere, the implication is: when evaluating an agent tool, don't just ask "can it be jailbroken" — ask whether a "remember what I approved" feature is remembering the action, or quietly remembering the sensitive content you typed while approving it.

## References

- [AI Agent Arxiv Digest — 2026-11-09](/posts/daily/2026-11-09-ai-agent-arxiv-digest-en)
- [AI Agent Arxiv Digest — 2026-11-13](/posts/daily/2026-11-13-ai-agent-arxiv-digest-en)
- [Trilemma: How Agents choose between Honesty, Confidentiality, and Task Completion (arXiv:2611.08312)](https://arxiv.org/abs/2611.08312)
- [Authorization Propagation in Agent2Agent Systems (arXiv:2611.07050)](https://arxiv.org/abs/2611.07050)
- [Airlock: Bounding the Multi-Agent Blast Radius via Selective Online Containment (arXiv:2611.06727)](https://arxiv.org/abs/2611.06727)
- [Agent Architecture Cost-Success Trade-offs (arXiv:2611.12953)](https://arxiv.org/abs/2611.12953)
- [Dependable Long-Horizon LLM Agents (arXiv:2611.13254)](https://arxiv.org/abs/2611.13254)
- [ScrapeBench: Evaluating Legal Compliance of AI Agents in Website Scraping (arXiv:2611.11306)](https://arxiv.org/abs/2611.11306)
- [AI Agent GitHub Digest — 2026-11-09](/posts/daily/2026-11-09-ai-agent-github-digest-en)
- [AI Agent GitHub Digest — 2026-11-13](/posts/daily/2026-11-13-ai-agent-github-digest-en)
- [Security Alert: Claude Code's "don't ask again" feature stores passwords and keys verbatim in public GitHub repos](/posts/daily/2026-11-09-security-claude-code-dont-ask-again-secrets-leak-en)
- [Security Alert: Open-source autonomous pentesting tool AntiFox used in real intrusions](/posts/daily/2026-11-13-security-antifox-pentest-aws-secret-theft-en)
- [Jailbroken AI agent runs a two-week autonomous intrusion against a European telecom — Infosecurity Magazine](https://www.infosecurity-magazine.com/news/operation-snowball-ai-telecom/)
- [Tool Pick: devvm](/posts/daily/2026-11-09-tool-devvm-en)
- [Tool Pick: 0 — open-source AI security harness](/posts/daily/2026-11-13-tool-0security-en)
- [Jensen Huang resigns as Nvidia CEO after espionage scandal wipes out $1.4 trillion in market value — The Decoder](https://the-decoder.com/jensen-huang-resigns-as-nvidia-ceo-after-espionage-scandal-wipes-out-1-4-trillion-in-market-value/)
- [Claude Fable 5.2 and Mythos 5.2 — Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-2)
- [Anthropic ships Claude Fable 5.2, tops the Artificial Analysis leaderboard — Simon Willison](https://simonwillison.net/2026/Nov/9/prompting-claude-fable-52/)
- [Gemini 4 Carbon arrives just in time — The Decoder](https://the-decoder.com/gemini-4-carbon-arrives-just-in-time-to-feel-like-yesterdays-news-in-the-fastest-model-cycle-yet/)
- [Benchmark shakeup: Arena Agent and CursorBench reshuffle in the same week](/posts/daily/2026-11-13-benchmark-arena-cursorbench-fable-5-2-en)
- [Pricing tracker: Claude Fable 5.2 replaces 5.1, API price cut 20%](/posts/daily/2026-11-13-pricing-anthropic-claude-fable-5-2-price-cut-en)
- [Pricing tracker: Claude Opus 4.8 Fast Mode retires](/posts/daily/2026-11-09-pricing-anthropic-claude-opus-4-8-fast-mode-sunset-en)
- [IBM and Microsoft announce Imagine Enterprise — Microsoft News](https://news.microsoft.com/source/2026/11/10/ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation/)
- [Funding Alert: OpenAI's new $11B round](/posts/daily/2026-11-09-funding-openai-en)
- [Funding Alert: LangChain's $300M Series C](/posts/daily/2026-11-13-funding-langchain-en)
- [Funding Alert: Mirendil's $1B Series A](/posts/daily/2026-11-13-funding-mirendil-en)
- [Funding Alert: Rox's $100M Series B](/posts/daily/2026-11-13-funding-rox-en)
- [Framework Update: Agno v3.2.0](/posts/daily/2026-11-13-framework-agno-v3.2.0-en)
- [Framework Update: Microsoft Agent Framework python-1.25.0](/posts/daily/2026-11-09-framework-microsoft-agent-framework-python-1.25.0-en)
- [Model Card: ERNIE 5.5 Flash Base](/posts/daily/2026-11-09-model-baidu-ernie-5-5-flash-base-en)
- [Model Card: Gemini Decision 1](/posts/daily/2026-11-13-model-google-gemini-decision-1-en)
