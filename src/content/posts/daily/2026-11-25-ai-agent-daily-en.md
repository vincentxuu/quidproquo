---
title: "AI Daily — 2026-11-25"
date: 2026-11-25
category: daily
tags: [ai-agent, daily]
lang: en
description: "Model capability is commoditizing fast, and the scarce layer is trust: five models shipped in the same window while three vendors staked out approval, isolation and data retention, as attackers' AI agents began finding zero-days on their own"
tldr: "GPT-6 Cyber, SWE-2.1, Hy3, ERNIE 5.5 Flash Preview and Ling-3.2-air all shipped in the same window, narrowing capability gaps; Anthropic's Claude Ship, OpenAI and Cisco's Shirudo, and AWS's Bedrock Trusted Access API each turned approval, runtime protection and data retention into products; Amazon disclosed an attacker's AI agent autonomously finding a MONAI Label zero-day in about 11 minutes; on the day Meta's Muse launched in the UK, the FCA warned that AI agents offering financial services may need authorization"
draft: false
series:
  name: "AI Daily"
  order: 102
---

## The One-Line Verdict

**The gap between models is closing quickly, and whether an agent can go into production increasingly depends on the trust layer -- approval, isolation and data retention; for Taiwan teams, choosing a model matters less each month, and choosing a deployment that can be audited matters more.**

## Deep Dive: Models Become Commodities, Trust Becomes the Entry Ticket

I think the most useful thing to connect today is that the capability layer and the trust layer are moving in opposite directions, a textbook complementary-assets picture: as the core asset (model capability) gets easier to match, what decides who turns it into a usable product is the scarce, hard-to-copy complement. (Framework: complementary assets)

Evidence A: in the same window, [OpenAI's GPT-6 Cyber](https://openai.com/index/introducing-gpt-6-cyber/), [Cognition's SWE-2.1](https://cognition.com/blog/swe-2-1), [Tencent's Hy3](https://huggingface.co/tencent/Hy3-FP8), [Baidu's ERNIE 5.5 Flash Preview](/posts/daily/2026-11-25-model-baidu-ernie-5-5-flash-preview-en) and Ant Group's [Ling-3.2-air](https://i10x.ai/news/ant-ling-3-2-air-open-weights-124b-workflow-automation) all arrived. The last three are open-weight; the Hugging Face pages for Hy3 and ERNIE list Apache 2.0, and Ling is MIT. The results are mostly vendor-reported, but all three open-weight releases claim to match or beat same-tier rivals on office, front-end or multi-tool tasks, and security and coding strength is no longer limited to a few closed models. Capability is no longer one vendor's private advantage.

Evidence B: the same day, three vendors turned the trust layer into products. [Claude Ship](https://techcrunch.com/2026/11/23/anthropic-launches-claude-ship-letting-ai-agents-review-fix-and-approve-code-changes) lets an agent approve code changes under a policy file kept in the repo, and recommends starting in observe-only mode. [OpenAI and Cisco's Shirudo](https://openai.com/index/introducing-shirudo/) uses signed eBPF shields to block an exploit without restarting the service. The [AWS Bedrock Trusted Access API](https://aws.amazon.com/blogs/machine-learning/introducing-the-amazon-bedrock-trusted-access-api-with-anthropics-enterprise-frontier-safeguards-and-enterprise-data-controls/) lets customers retain data in their own account, with IAM policies controlling who can enroll. Set that against [the case Amazon disclosed](/posts/daily/2026-11-25-security-monai-label-cairn-zero-day-cisa-kev-en): an attacker's AI agent autonomously found a zero-day in about 11 minutes, so defense can no longer rely on people watching.

What this means for practitioners: models can be swapped, but approval policy, audit trails and where data is retained cannot, and that is where switching cost lives. For Taiwan teams, open weights make self-hosting feasible, but once you self-host you have to build this trust layer yourself; when evaluating purchases or adoption, first ask "when something goes wrong, who can prove what the agent did," and only then compare model scores.

```diagram
title: Capability and trust layers moving in opposite directions
desc: Five model releases in the same window narrow capability gaps, while three vendors simultaneously productized approval, protection and data retention, making the trust layer the new point of differentiation.
caption: Simplified illustration echoing the deep-dive's complementary-assets framing; a summary of today's signals, not a quantitative comparison.
---
<svg viewBox="0 0 680 280">
  <text class="dg-sub" x="170" y="24" text-anchor="middle" dominant-baseline="central">Capability layer</text>
  <rect class="dg-box dg-box--ghost" x="30" y="38" width="280" height="56" rx="6"/>
  <text class="dg-label" x="170" y="58" text-anchor="middle" dominant-baseline="central">Five models, one window</text>
  <text class="dg-sub" x="170" y="78" text-anchor="middle" dominant-baseline="central">Three are open-weight</text>

  <path class="dg-line" d="M170 94V140" marker-end="url(#arrow)"/>
  <rect class="dg-box dg-box--ghost" x="30" y="140" width="280" height="56" rx="6"/>
  <text class="dg-label" x="170" y="160" text-anchor="middle" dominant-baseline="central">Gaps narrow</text>
  <text class="dg-sub" x="170" y="180" text-anchor="middle" dominant-baseline="central">Switching models gets cheaper</text>

  <text class="dg-sub" x="510" y="24" text-anchor="middle" dominant-baseline="central">Trust layer</text>
  <rect class="dg-box" x="370" y="38" width="280" height="56" rx="6"/>
  <text class="dg-label" x="510" y="58" text-anchor="middle" dominant-baseline="central">Three vendors move at once</text>
  <text class="dg-sub" x="510" y="78" text-anchor="middle" dominant-baseline="central">Claude Ship / Shirudo / Bedrock</text>

  <path class="dg-line dg-line--accent" d="M510 94V140" marker-end="url(#arrow-accent)"/>
  <rect class="dg-box dg-box--accent" x="370" y="140" width="280" height="56" rx="6"/>
  <text class="dg-label" x="510" y="160" text-anchor="middle" dominant-baseline="central">Approval, shields, retention</text>
  <text class="dg-sub" x="510" y="180" text-anchor="middle" dominant-baseline="central">Hard-to-copy complements</text>

  <text class="dg-small" x="170" y="252" text-anchor="middle" dominant-baseline="central">Trending to commodity</text>
  <text class="dg-small dg-text--accent" x="510" y="252" text-anchor="middle" dominant-baseline="central">Becoming the entry ticket</text>
</svg>
```

## Today's Developments

### Vendor Updates

- **[Anthropic Claude Ship](https://techcrunch.com/2026/11/23/anthropic-launches-claude-ship-letting-ai-agents-review-fix-and-approve-code-changes)** (TechCrunch): made up of Code Review (GA) plus PR Steward and Claude Approvals (beta); the approval policy lives as a file in the repo, and it is available to Claude Team and Enterprise plans on GitHub.
  - **Why it matters**: it moves "who may approve a change" from people to policy; teams in Taiwan trying it should follow the vendor's advice to start in observe-only mode on a single repo.
- **[Meta Muse (UK)](https://about.fb.com/news/2026/11/introducing-muse-in-the-uk-a-personal-ai-agent-you-control/)** (Meta): the personal AI agent launches in the UK, handling shopping, travel booking and email, with important actions approved by the user first and payments via Stripe's Onelink or Shopify's Shop Pay.
- **[BestCom AgentX with IBM Bob](https://n.yam.com/Article/20261124209913)** (Yam News): Taiwan's BestCom is building an enterprise agent offering on IBM Bob, pitching built-in governance and on-premises deployment; IBM Taiwan's general manager is quoted saying that when enterprises move from pilots to full rollout, what stalls them is unclear accountability and activity trails.
  - **Why it matters**: a local Taiwan vendor selling the trust layer as the feature, in the same direction as the argument above.

### Models and Infrastructure

- **[GPT-6 Cyber](https://openai.com/index/introducing-gpt-6-cyber/)** (OpenAI): 48.5% on ExploitGym versus 32.1% for GPT-5.6 Cyber; in a test with deliberately exploitable decoy services, it avoided out-of-scope services 99.93% of the time without a deployment prompt. OpenAI rates it Critical under its Preparedness Framework.
- **[Cognition SWE-2.1](https://cognition.com/blog/swe-2-1)** (Cognition): pure reinforcement learning on Kimi K3, reporting 80% on ExploitBench and 27.3% on ExploitGym; during training the model found new sandbox vulnerabilities four times, and a more permissive SWE-2.1 Cyber is going to Devin Security.
- **[Tencent Hy3](https://huggingface.co/tencent/Hy3-FP8)** (Hugging Face): a 295B-parameter MoE with 21B active; Tencent says a blind evaluation with 270 experts scored it 2.67/4 against GLM-5.1's 2.51/4. Vendor-reported.
- **[ERNIE 5.5 Flash Preview](/posts/daily/2026-11-25-model-baidu-ernie-5-5-flash-preview-en)** (on-site model card): Baidu open-sources the weights; it edges Claude Opus 5.5 on multi-tool coordination and office automation but still trails on general knowledge reasoning.
- **[Ant Group Ling-3.2-air](https://i10x.ai/news/ant-ling-3-2-air-open-weights-124b-workflow-automation)** (i10X): MIT-licensed, 124B parameters with 5.5B active; AutomationBench-AA rises from 15.7% to 61% (vendor-reported), but on the LAB-AA legal benchmark the all-pass rate is only 8.3%, and 0.8% after excluding material hallucinations.
  - **Why it matters**: strong office-task scores do not mean you can skip review; document workflows still need a human check.

### Technical Progress

- **[Arxiv Digest](/posts/daily/2026-11-25-ai-agent-arxiv-digest-en)**: the three preprints share one direction -- the model stays fixed and the scaffold decides the outcome. The papers report that the same model's success rate in a real-time game can rise from 38.3% to 68.6%, and that 6-26% of runs with tool failures end in fabricated answers; these are results on author-built benchmarks, useful for deciding what to verify first rather than as production expectations.
- **[Pydantic AI v2.73.0](/posts/daily/2026-11-25-framework-pydantic-ai-v2.73.0-en)**: warns on deprecated models and lets SubAgents hand pending tool calls back to the caller.

### Tools and Ecosystem

- **[GitHub Digest](/posts/daily/2026-11-25-ai-agent-github-digest-en)**: most new repos add a piece an existing agent could not do, such as rewriting only the slowest part of a program or driving an iOS simulator from Linux.
- **[agentscan](/posts/daily/2026-11-25-tool-agentscan-en)**: a local CLI that scans MCP config files for hardcoded keys, unpinned packages and plain-text transport.

### Security Incidents

- **[Cairn autonomously finds a MONAI Label zero-day](/posts/daily/2026-11-25-security-monai-label-cairn-zero-day-cisa-kev-en)** (on-site security alert): Amazon disclosed an attacker using the open-source pentest framework Cairn, going from API discovery to arbitrary file write in about 11 minutes; CISA added CVE-2026-133968 to KEV, and the fix is in 0.8.6.
- **[Shirudo](https://openai.com/index/introducing-shirudo/)** (OpenAI): BSD 2-Clause open source, with signed shields and TPM-backed records of what was loaded; in the vendor demo, a Codex-generated shield blocked a Java4Shell exploit against a running Elasticsearch without a restart.

### Regulation and Governance

- **[UK FCA](https://finextra.com/newsarticle/48807/as-metas-muse-arrives-in-the-uk-fca-issues-agentic-ai-warning-to-tech-firms)** (Finextra): the FCA warned that calling yourself a technology provider does not exempt you from financial regulation; an agent that handles payments, financial promotions or advice may need authorization. Meta says the UK Muse does not access bank balances or investment data.
- **[Australian parliamentary inquiry](https://www.afr.com/politics/federal/push-to-hold-companies-legally-liable-for-their-ai-agents-20261124-p61gt3)** (AFR): a bipartisan committee made 46 recommendations, including that companies deploying AI agents be legally accountable and that the AI Safety Institute receive a major funding boost.
- **[EU AI Act Article 50(2)](https://mean.ceo/tpost/ai-act-watermark-deadline)** (mean.ceo): as summarized there, systems on the market before August 2026 have until 2 December to meet the machine-readable AI-content marking duty.
  - **Why it matters**: if a Taiwan team's product serves EU users under its own brand, the marking duty generally falls on the provider and cannot be left to the upstream model.

### Regional Developments

- **Malaysia**: the Digital Minister said the AI Governance Bill will set up an incident reporting mechanism and define duties by the roles of developers and deployers. ([Source](https://urgent.news/2026/11/24/ai-governance-bill-will-introduce-incident-reporting-mechanism-to))
- **Latin America**: Kaszek closed a $650M fund, planning 20 to 30 investments, mostly in the application layer. ([Source](https://dealroom.co/news/175348-kaszek-raises-650m-fund-to-back-latin-america-s-ai-startups/))
- **Middle East**: Qatar's Dukhan Bank signed with Anthropic for a phased Claude rollout, starting with a small group of employees and research and knowledge-synthesis uses. ([Source](https://www.zawya.com/en/press-release/companies-news/dukhan-bank-signs-an-agreement-with-anthropic-to-build-enterprise-ai-capability-with-claude-2498818))

No qualifying events were found for Japan/Korea or Africa in this time window, and the India and Singapore signals could not be traced back to a primary source, so they are not included.

## Key Numbers

| Item | Number | Source |
|------|------|------|
| GPT-6 Cyber ExploitGym | 48.5% (prior 32.1%) | [OpenAI](https://openai.com/index/introducing-gpt-6-cyber/) |
| SWE-2.1 ExploitBench | 80% | [Cognition](https://cognition.com/blog/swe-2-1) |
| Ling-3.2-air legal benchmark all-pass rate | 8.3% (0.8% excluding material hallucinations) | [i10X](https://i10x.ai/news/ant-ling-3-2-air-open-weights-124b-workflow-automation) |
| Kaszek new fund | $650M | [Dealroom](https://dealroom.co/news/175348-kaszek-raises-650m-fund-to-back-latin-america-s-ai-startups/) |
| Australian committee recommendations | 46 | [AFR](https://www.afr.com/politics/federal/push-to-hold-companies-legally-liable-for-their-ai-agents-20261124-p61gt3) |

## Today's Digests

- [AI Agent Arxiv Digest — 2026-11-25](/posts/daily/2026-11-25-ai-agent-arxiv-digest-en)
- [AI Agent GitHub Digest — 2026-11-25](/posts/daily/2026-11-25-ai-agent-github-digest-en)
- [Model Card: ERNIE 5.5 Flash Preview](/posts/daily/2026-11-25-model-baidu-ernie-5-5-flash-preview-en)
- [Security Alert | Cairn's Autonomous AI Agents Found a Zero-Day in MONAI Label on Their Own](/posts/daily/2026-11-25-security-monai-label-cairn-zero-day-cisa-kev-en)
- [Framework Update | Pydantic AI v2.73.0](/posts/daily/2026-11-25-framework-pydantic-ai-v2.73.0-en)
- [Tool Pick｜agentscan](/posts/daily/2026-11-25-tool-agentscan-en)
- [AI Engineer Interview Drill — 2026-11-25: ML System Design](/posts/daily/2026-11-25-ai-interview-daily-en)
- [Product Builder Interview Daily — 2026-11-25: Strategy & Execution](/posts/daily/2026-11-25-product-builder-interview-daily-en)

## Tomorrow's Watchlist

- Whether, once Claude Ship's approval agent is in beta, the community publishes cases of it approving changes it should not have, and how many teams actually adopt observe-only mode.
- Whether model APIs change their watermarking defaults before the EU marking duty lapses on 2 December.
- How the FCA and Meta's Muse interact: if Muse later opens access to bank data, whether it will be judged to need authorization.

## Today's Takeaway

I had assumed open-weight models catching up would mainly hit model vendors' pricing. Ling's legal benchmark corrected that: scores are catching up while the all-pass rate is still in single digits, so what has not been commoditized is the process of proving an output can be trusted. For Taiwan teams, self-hosting a model saves API fees but does not save the approval and audit engineering.

## References

- [Anthropic launches Claude Ship — TechCrunch](https://techcrunch.com/2026/11/23/anthropic-launches-claude-ship-letting-ai-agents-review-fix-and-approve-code-changes)
- [GPT-6 Cyber — OpenAI](https://openai.com/index/introducing-gpt-6-cyber/)
- [OpenAI and Cisco introduce Shirudo — OpenAI](https://openai.com/index/introducing-shirudo/)
- [Amazon Bedrock Trusted Access API — AWS Machine Learning Blog](https://aws.amazon.com/blogs/machine-learning/introducing-the-amazon-bedrock-trusted-access-api-with-anthropics-enterprise-frontier-safeguards-and-enterprise-data-controls/)
- [Introducing SWE-2.1 — Cognition](https://cognition.com/blog/swe-2-1)
- [tencent/Hy3-FP8 — Hugging Face](https://huggingface.co/tencent/Hy3-FP8)
- [Ling-3.2-air — i10X](https://i10x.ai/news/ant-ling-3-2-air-open-weights-124b-workflow-automation)
- [Introducing Muse in the UK — Meta](https://about.fb.com/news/2026/11/introducing-muse-in-the-uk-a-personal-ai-agent-you-control/)
- [As Meta's Muse arrives in the UK, FCA issues agentic AI warning — Finextra](https://finextra.com/newsarticle/48807/as-metas-muse-arrives-in-the-uk-fca-issues-agentic-ai-warning-to-tech-firms)
- [BestCom AgentX with IBM Bob — Yam News](https://n.yam.com/Article/20261124209913)
- [Parliamentary inquiry push to hold companies legally liable for their AI agents — AFR](https://www.afr.com/politics/federal/push-to-hold-companies-legally-liable-for-their-ai-agents-20261124-p61gt3)
- [AI Act Watermark Deadline — mean.ceo](https://mean.ceo/tpost/ai-act-watermark-deadline)
- [AI Governance Bill incident reporting — urgent.news (relaying New Straits Times)](https://urgent.news/2026/11/24/ai-governance-bill-will-introduce-incident-reporting-mechanism-to)
- [Kaszek closes $650M Fund VII — Dealroom](https://dealroom.co/news/175348-kaszek-raises-650m-fund-to-back-latin-america-s-ai-startups/)
- [Dukhan Bank and Anthropic — Zawya](https://www.zawya.com/en/press-release/companies-news/dukhan-bank-signs-an-agreement-with-anthropic-to-build-enterprise-ai-capability-with-claude-2498818)
- [AI Agent Arxiv Digest — 2026-11-25](/posts/daily/2026-11-25-ai-agent-arxiv-digest-en)
- [AI Agent GitHub Digest — 2026-11-25](/posts/daily/2026-11-25-ai-agent-github-digest-en)
- [Security Alert | Cairn's Autonomous AI Agents Found a Zero-Day in MONAI Label](/posts/daily/2026-11-25-security-monai-label-cairn-zero-day-cisa-kev-en)
