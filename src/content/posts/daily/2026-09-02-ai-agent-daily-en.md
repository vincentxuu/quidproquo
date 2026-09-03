---
title: "AI Daily — 2026-09-02"
date: 2026-09-02
category: daily
type: digest
tags: [ai-agent, daily]
lang: en
description: "Model leaderboard position is decoupling from procurement decisions — the same day Claude Fable 5.1 swept CursorBench's top two spots, the Pentagon bypassed Anthropic for ChatGPT and Grok"
tldr: "Claude Fable 5.1 quietly topped CursorBench and went GA on Bedrock, but Anthropic still hasn't officially announced it; the Pentagon added ChatGPT and Grok to a military AI platform, reportedly bypassing Anthropic; METR disclosed an API key theft that burned roughly $600,000 in inference credits, while NVIDIA's SkillSpector and AIR Security's $50M in combined Seed rounds both point to agent supply-chain trust becoming the new battleground; South Korea's 'AI for All' program starts beta in September aiming to give 52 million citizens free access to a homegrown AI agent by year-end, while Taiwan's financial sector is still working out AI agent governance and accountability basics"
draft: false
series:
  name: "AI Daily"
  order: 18
---

> 🌏 [中文版](/posts/daily/2026-09-02-ai-agent-daily)

## One-Line Verdict

**Model leaderboard position is decoupling from procurement decisions — the same day Claude Fable 5.1 swept CursorBench's top two spots, the Pentagon added ChatGPT and Grok to a military AI platform and bypassed Anthropic, showing that what enterprise and government buyers actually care about is supply-chain trust and diversification, not leaderboard rank.**

## Deep Dive: Winning the Leaderboard Doesn't Mean Winning the Contract

I think today's most notable fracture is that "model capability" and "procurement decisions" are decoupling — three independent events confirm this from different angles. (Framework: Five Forces)

The first piece of evidence comes from CursorBench: two configurations labeled Fable 5.1 debuted today and swept first and second place, pushing last week's champion Grok 4.6 down to third — and it's a rare reshuffle that cuts cost while raising scores at the same time. Fable 5.1 Max costs just $9.64 per task, 44% cheaper than its predecessor, yet scores higher. By the book, this should be a textbook demonstration of model superiority.

But the same day, the second piece of evidence was the Pentagon adding ChatGPT and Grok to its military AI platform, with reports saying this bypassed Anthropic, previously the more heavily relied-upon vendor. This shows that buyers — especially governments and large enterprises — don't simply pick "whoever scores highest." It's closer to the "buyer power" force in Five Forces analysis: vendor diversification, existing relationships, and political risk-spreading often outweigh a fraction-of-a-point leaderboard gap. Even if Anthropic genuinely holds the strongest model, that doesn't automatically win it the most sensitive procurement decisions.

The third piece of evidence shifts the lens to "what buyers are actually buying, beyond the score": NVIDIA released SkillSpector the same week, flagging that 26.1% of Claude Code/Codex/MCP skills contain vulnerabilities and 5.2% are suspected malicious. Supply-chain security startup AIR Security is an even sharper example — the company was still in stealth when Sequoia backed its first Seed round, skipping the kind of top-tier-fund validation that normally waits until Series A or B. This suggests that once model capability converges, what buyers are genuinely scarce on — and willing to pay for — is whether the agent supply chain can be verifiably trusted, not the model score itself.

What this means for practitioners: if you're helping a team pick an agent platform, leaderboards like CursorBench are worth watching, but shouldn't be your sole or final input — what actually determines whether governments and large enterprises sign is supply-chain auditability and diversification. For enterprises or public-sector teams in Taiwan adopting agents, that means "does this vendor offer an auditable security and governance layer" belongs on the same line item as the model score — not something you skip just because a vendor leads the leaderboard.

## Today's Updates

### Vendor Moves

**Anthropic**: Claude Fable 5.1 went GA on Amazon Bedrock and Claude Platform on AWS; the official blog emphasized enterprise-grade Frontier Safeguards (data stays in the customer's own controlled cloud environment). ([source](https://aws.amazon.com/blogs/machine-learning/introducing-claude-fable-5-1-on-aws/))

**OpenAI**: said its ChatGPT ad business has hit a $1B annual run rate after only about 200 days live, cited as evidence of pre-IPO revenue diversification. ([source](https://the-decoder.com/openai-says-its-chatgpt-ad-business-hits-a-1-billion-annual-run-rate/)) Separately, Apple's trade-secret dispute with OpenAI escalated, alleging the defendant used power-converter circuit diagrams to train an AI agent — the news surfaced alongside Apple's CEO transition (John Ternus took over Sept. 1). ([source](https://uk.investing.com/news/stock-market-news/rosenblatt-raises-apple-stock-price-target-to-303-on-ceo-transition-93CH-4853821))

**Google**: DeepMind's new chief Koray Kavukcuoglu said frontier AI leadership is the only thing that matters, admitting the company's models are currently "slightly behind the frontier," and noted the Gemini Flash line is rapidly turning into a coding agent. ([source](https://the-decoder.com/google-deepminds-new-chief-says-frontier-ai-leadership-is-the-only-thing-that-matters/)) Google's banking agent platform went live in preview with Deutsche Bank, and Amazon's AI agent catalog reached GA in Ireland. ([source](https://buttondown.com/Horizonscan/archive/ai-pulse-daily-brief-2026-09-01)) Separately, Gemini Omni 1.1 Flash moved from preview to GA (see "Models & Infrastructure").

**Meta**: coding tool Muse Code officially exited beta, adding cross-session communication, orchestratable subagent-team workflows, and a developer preview SDK, alongside a subscription plan starting at $5/month. ([source](https://www.facebook.com/MetaforDevelopers/posts/muse-code-is-now-out-of-beta-with-new-features-and-updates-designed-to-help-you-/1511739397653057))

**Manus**: announced it is resuming independent operations, the latest step after joining Meta's ecosystem late last year and issuing a "note to users" in August, hinting that the prior dependency arrangement has ended. ([source](https://manus.im/blog/manus-resumes-independent-operations))

### Models & Infrastructure

**Gemini Omni 1.1 Flash**: Google moved its video-generation model from preview to GA — scene extension now reads 10 seconds of context, first/last-frame interpolation lets you set camera moves precisely, and 4K output is offered via upscaling, with tiered per-resolution pricing (see [model card](/posts/daily/2026-09-02-model-google-gemini-omni-1-1-flash-en)).

**CursorBench reshuffle**: two configurations labeled Fable 5.1 debuted today and swept first and second place, pushing last week's champion Grok 4.6 Extra High down to third; Anthropic has not yet made an official announcement (see [benchmark shift post](/posts/daily/2026-09-02-benchmark-cursorbench-en)).

**Benchmark moves**: MLCommons released MLPerf Storage v3.0, adding a test that measures storage-system performance for LLM inference KV-cache reads/writes ([source](https://www.hpcwire.com/bigdatawire/this-just-in/mlcommons-releases-new-mlperf-storage-v3-0-benchmark-results)); Optimizely launched Mark-Bench, an open marketing-task benchmark (285 tasks), alongside a purpose-built model family ([source](https://www.cmswire.com/digital-experience/optimizely-debuts-marketing-ai-models-open-benchmark)).

### Tools & Ecosystem

GitHub Trending today centers on "personal-agent ecosystem growth + supply-chain security scanners" — OpenClaw crossed 388K stars, NVIDIA's SkillSpector flags skill vulnerabilities (26.1% contain issues, 5.2% suspected malicious), and PageIndex offers vector-database-free retrieval (see [GitHub Digest](/posts/daily/2026-09-02-ai-agent-github-digest-en)).

**AWS Agent Registry**: reached general availability, offering a unified, governable catalog of an organization's agents, tools, and skills, with publishing, review, and discovery workflows. ([source](https://aws.amazon.com/blogs/machine-learning/manage-agents-tools-and-skills-at-scale-with-aws-agent-registry/))

**CrowdStrike Falcon Guardian**: unveiled at Fal.Con 2026, a runtime detection-and-response solution for AI agent behavior at the endpoint, leaning on CrowdStrike's existing endpoint deployment scale for visibility. ([source](https://ir.crowdstrike.com/news-releases/news-release-details/crowdstrike-unveils-falcon-guardian-secure-ai-agents-where-they))

**Airrived**: launched a sovereign AI platform letting government and enterprise customers run agentic AI in their own environment, targeting data-sovereignty- and compliance-sensitive public-sector buyers. ([source](https://securitybrief.asia/story/airrived-launches-sovereign-ai-platform-for-governments))

**mcp-spend-guard**: a proxy that wraps any MCP server with spend caps, rate limiting, and a kill switch (see [tool pick](/posts/daily/2026-09-02-tool-mcp-spend-guard-en)).

### Technical Progress

Today's three papers in the [AI Agent Arxiv Digest](/posts/daily/2026-09-02-ai-agent-arxiv-digest-en) all point to the same idea: managing an agent's memory and context isn't a matter of bolting on more structure — it's a concrete engineering problem that needs to be tested and trained. Hindsight Memory-PRM trains a memory-utility critic from the audit trail a trajectory already leaves behind, outperforming its own API teacher model; Selective Forgetting runs a controlled experiment showing graph-based memory isn't necessarily better than flat vector retrieval; TRACER uses reinforcement learning to decide, tool by tool, how much output to keep, cutting token use by roughly a third to nearly half in production. The three papers carry different levels of evidence maturity and each author flags their own limits, so none should be read as a general rule.

**Agno 3.0.5**: changed embedding failures during Knowledge ingestion from "silently reported as success" to "honestly reported as failure" — a fix to the data-integrity contract of the RAG pipeline (see [framework update](/posts/daily/2026-09-02-framework-agno-3.0.5-en)).

### Security Incidents & Defenses

**METR API key theft**: a researcher's self-built, vibe-coded agent dashboard was exposed by a fail-open auth bug; attackers directly instructed the exposed agent to hand over its API key, burning roughly $600,000 in inference credits over three weeks (see [security alert](/posts/daily/2026-09-02-security-metr-api-key-theft-en)).

**Langflow CVE-2026-0768**: an unauthenticated remote code execution flaw in the open-source AI app framework Langflow is being actively exploited to steal victims' OpenAI and AWS API keys. ([source](https://www.bleepingcomputer.com/news/security/critical-langflow-flaw-exploited-to-steal-openai-and-aws-keys/))

**CISA adds two CVEs to KEV**: CISA added a Linux Kernel flaw (CVE-2026-53362) and a JFrog Artifactory flaw (CVE-2026-66384) to its Known Exploited Vulnerabilities list, triggered by an exploitation incident involving an OpenAI agent. ([source](https://www.yahoo.com/news/science/articles/cisa-adds-linux-kernel-jfrog-094143954.html))

**AI agents finding zero-days**: security firm Trail of Bits demonstrated that an AI agent can find, within minutes, VM-escape zero-days that used to take human researchers days to weeks to discover, underscoring that "patched" software can still be exploited if a distro hasn't backported the fix yet. ([source](https://www.techtimes.com/articles/326131/20260901/ai-agents-now-discover-zero-days-escape-virtual-machines-trail-bits-proves.htm))

### Regulation & Governance

**G20 "Carolina Principles"**: at a G20 tech-ministers meeting in North Carolina, the US government is pushing other countries toward a "hands-off" AI regulatory stance, with OpenAI and Anthropic as the primary beneficiaries. ([source](https://www.usnews.com/news/top-news/articles/2026-09-01/us-to-urge-hands-off-ai-regulation-at-g-20-official-says))

**EU dual regulation under DSA**: the European Commission placed ChatGPT under the strictest platform-oversight tier of the Digital Services Act, meaning it is now subject to both the AI Act (model layer) and the DSA (platform-distribution layer) — seen as a precedent for governing conversational AI services. ([source](https://www.pymnts.com/news/artificial-intelligence/2026/chatgpt-facing-dual-regulatory-regimes-under-new-eu-designation))

### Regional Updates

**China**

China's memory maker CXMT produced its first small-batch HBM3E chips, still roughly 3-5 years behind Samsung, SK Hynix, and Micron technologically, but seen as a step toward easing the pressure of US export controls on China's AI chip supply. ([source](https://the-decoder.com/chinas-cxmt-makes-its-first-hbm3e-chips-closing-the-ai-memory-gap/))

**Taiwan**

The "Trustworthy AI Hackathon," guided by Taiwan's National Development Council and hosted by the Taiwan Blockchain Enthusiasts Association, was held on August 31. Jinyi FinTech won the "Trustworthy AI Governance Innovation Contribution Award" for its AI agent governance work. CEO Weng Chung-ho said the real bottleneck to scaling AI agents in Taiwan's financial sector isn't technical — it's that "once something goes wrong, no one on the board, compliance, or audit team is willing to take responsibility." Without governance, there's no trust; without trust, financial institutions won't scale AI agents. ([source](https://www.storm.mg/article/11160855)) That's a striking contrast with South Korea's government pouring serious money into "AI for All" the same week: while other countries race for scale, Taiwan's financial sector is still working out the trust-and-accountability groundwork that has to come before scaling.

**Japan & South Korea**

South Korea's government named the three winning consortia for its "AI for All" (모두의 AI) program — SK Telecom, Kakao, and KT — which will start beta testing in September and aim to give all 52 million citizens free, unlimited access to an AI service built primarily on domestic models by year-end. The scope goes beyond chatbots to AI agents that can complete public-service applications and cross-service navigation; the government is providing a combined 512 Nvidia B200 GPUs this year. ([source](https://www.theinvestor.co.kr/article/10855841))

In the same period, South Korea's ITCEN Group launched AgentGo Guard, an integrated protection package for enterprises and public institutions adopting generative AI and agent ecosystems, including PII de-identification and data-loss prevention aligned with Korean privacy law and international standards. ([source](https://biz.chosun.com/en/en-it/2026/09/01/U53QY3EKMJHZ7HYUZN57WIHT2Y?outputType=amp))

**India**

India's National Payments Corporation (NPCI) is preparing to let AI agents make payments directly via UPI within limits and rules users set, with plans for spend caps, audit trails, and identity-verification frameworks; Pine Labs' P3P protocol has already gone live. ([source](https://stratnewsglobal.com/technology/agentic-payments-upi))

**Middle East**

Saudi sovereign AI group HUMAIN moved on multiple fronts this week — investing in Arabic-language tech firms Arabic.AI and Tarjama, targeting Arabic-first translation management and reviewable-contract/tender AI agents ([source](https://www.fwdstart.me/p/humain-invests-in-arabic-ai-and-tarjama-to-expand-saudi-enterprise-ai-offering)); partnering with inference-infrastructure company Together AI to build AI infrastructure in the kingdom ([source](https://adgully.me/date/01-09-2026)); and teaming up with AMD to launch "AI in a Box," an all-in-one bundle lowering the barrier for Saudi enterprises to adopt AI ([source](https://www.facebook.com/ArabNews/posts/humain-amd-launch-ai-in-a-box-to-expand-enterprise-ai-access-in-saudi-arabia/1501726225325720)). Taken together, these three moves show Saudi Arabia using sovereign capital to fill in "model, compute, and application layer" all at once, not just buying compute.

**Africa**

South African security firm NEWORDER partnered with Israel's Lasso Security to bring AI agent security controls to the South African market, mapping the work against local financial-security standards and privacy-law limits on automated decision-making. ([source](https://techcentral.co.za/neworder-lasso-security-ai-agent-controls/285558))

**Oceania**

Australia's defense minister called AI the biggest sovereignty inflection point since WWII while pushing, in Washington, a roughly $21B buildout that would make Australia Anthropic's second frontier-model base — copyright and data-access details are still being negotiated. ⚠️ This is currently single-sourced and not cross-validated. ([source](https://aspicts.substack.com/p/early-edition-australia-makes-its)) At the same time, as Australia's central bank reviews payment-system rules, Commonwealth Bank, Westpac, and ANZ are pushing for immediate regulation of agentic AI payments, while NAB, Visa, Amex, and Apple argue it's too early to regulate — the two camps clashed directly in their submissions. ([source](https://www.capitalbrief.com/article/battlelines-drawn-as-big-banks-and-big-tech-square-off-over-agentic-ai-regulation-be11f1f9-20a3-4a7c-b8b0-706e965b8aad))

### Deals / Funding

**AIR Security**: an agent supply-chain security startup emerged from stealth with two combined Seed rounds worth $50M, led by Sequoia and Greenoaks respectively (see [funding brief](/posts/daily/2026-09-02-funding-air-security-en)).

**Tripo AI**: a native-3D foundation model company closed a combined Series B + B+ round worth roughly RMB 3B, led by MPCi (see [funding brief](/posts/daily/2026-09-02-funding-tripo-ai-en)).

## Key Numbers

| Item | Number | Source |
|------|--------|--------|
| CursorBench Fable 5.1 Max score | 73.4% (cost down 44%) | [Cursor](https://cursor.com/cursorbench) |
| Inference credits stolen from METR | ~$600,000 | [METR](https://metr.org/blog/2026-08-31-security-update/) |
| AIR Security's combined Seed rounds | $50M | [TechCrunch](https://techcrunch.com/2026/09/01/air-raises-50m-to-help-companies-vet-the-skills-and-add-ons-ai-agents-use) |
| Skills flagged by SkillSpector | 26.1% vulnerable, 5.2% suspected malicious | [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector) |
| South Korea's first-year "AI for All" GPU allocation | 512 Nvidia B200s | [The Investor](https://www.theinvestor.co.kr/article/10855841) |

## Today's Digests

- 📄 [AI Agent Arxiv Digest — 2026-09-02](/posts/daily/2026-09-02-ai-agent-arxiv-digest-en)
- 📄 [AI Agent GitHub Digest — 2026-09-02](/posts/daily/2026-09-02-ai-agent-github-digest-en)
- 📄 [Benchmark Shift: CursorBench](/posts/daily/2026-09-02-benchmark-cursorbench-en)
- 📄 [Framework Update: Agno 3.0.5](/posts/daily/2026-09-02-framework-agno-3.0.5-en)
- 📄 [Funding Brief: AIR Security](/posts/daily/2026-09-02-funding-air-security-en)
- 📄 [Funding Brief: Tripo AI](/posts/daily/2026-09-02-funding-tripo-ai-en)
- 📄 [Model Card: Gemini Omni 1.1 Flash](/posts/daily/2026-09-02-model-google-gemini-omni-1-1-flash-en)
- 📄 [Product Builder Interview Prep — 2026-09-02](/posts/daily/2026-09-02-product-builder-interview-daily-en)
- 📄 [Security Alert: METR API Key Theft](/posts/daily/2026-09-02-security-metr-api-key-theft-en)
- 📄 [Tool Pick: mcp-spend-guard](/posts/daily/2026-09-02-tool-mcp-spend-guard-en)

## Tomorrow's Watch

- Whether Anthropic officially announces Claude Fable 5.1 — so far it's only third-party leaderboards and community observation, and the official site/model docs still list only Fable 5
- Whether other AI safety/evaluation organizations follow METR's lead in auditing "researchers' personal accounts running vibe-coded agent tools"
- Early feedback from South Korea's AI for All beta in September, and whether this "AI for everyone" policy approach prompts similar debate in Taiwan or elsewhere

## Today's Takeaway

I used to assume government-led "AI for everyone" programs were mostly symbolic. But South Korea committing 512 B200 GPUs up front, aiming to give 52 million people free access to a homegrown AI agent by year-end, is too large in scale to be a PR move — it's treating AI access as public infrastructure. That's a sharp contrast with Taiwan's current approach of letting individual institutions adopt AI on their own and sort out governance themselves, which raises the question of whether Taiwan needs a policy conversation at a comparable scale.

## References

- [Claude Fable 5.1 GA on Amazon Bedrock — AWS ML Blog](https://aws.amazon.com/blogs/machine-learning/introducing-claude-fable-5-1-on-aws/)
- [OpenAI's ChatGPT ad business hits $1B run rate — The Decoder](https://the-decoder.com/openai-says-its-chatgpt-ad-business-hits-a-1-billion-annual-run-rate/)
- [Apple v. OpenAI trade-secret dispute escalates — Investing.com](https://uk.investing.com/news/stock-market-news/rosenblatt-raises-apple-stock-price-target-to-303-on-ceo-transition-93CH-4853821)
- [Google DeepMind's new chief on frontier AI leadership — The Decoder](https://the-decoder.com/google-deepminds-new-chief-says-frontier-ai-leadership-is-the-only-thing-that-matters/)
- [AI Pulse Daily Brief 2026-09-01 — Google banking agent, Amazon Ireland GA](https://buttondown.com/Horizonscan/archive/ai-pulse-daily-brief-2026-09-01)
- [Meta Muse Code exits beta — Meta for Developers](https://www.facebook.com/MetaforDevelopers/posts/muse-code-is-now-out-of-beta-with-new-features-and-updates-designed-to-help-you-/1511739397653057)
- [Manus Resumes Independent Operations — Manus Blog](https://manus.im/blog/manus-resumes-independent-operations)
- [MLPerf Storage v3.0 — HPCwire](https://www.hpcwire.com/bigdatawire/this-just-in/mlcommons-releases-new-mlperf-storage-v3-0-benchmark-results)
- [Optimizely debuts Mark-Bench — CMSWire](https://www.cmswire.com/digital-experience/optimizely-debuts-marketing-ai-models-open-benchmark)
- [AWS Agent Registry reaches GA — AWS ML Blog](https://aws.amazon.com/blogs/machine-learning/manage-agents-tools-and-skills-at-scale-with-aws-agent-registry/)
- [CrowdStrike unveils Falcon Guardian — CrowdStrike IR](https://ir.crowdstrike.com/news-releases/news-release-details/crowdstrike-unveils-falcon-guardian-secure-ai-agents-where-they)
- [Airrived launches sovereign AI platform — SecurityBrief Asia](https://securitybrief.asia/story/airrived-launches-sovereign-ai-platform-for-governments)
- [Critical Langflow flaw exploited — BleepingComputer](https://www.bleepingcomputer.com/news/security/critical-langflow-flaw-exploited-to-steal-openai-and-aws-keys/)
- [CISA adds Linux Kernel + JFrog Artifactory CVEs to KEV — Yahoo](https://www.yahoo.com/news/science/articles/cisa-adds-linux-kernel-jfrog-094143954.html)
- [Trail of Bits: AI agents discover zero-days to escape VMs — Tech Times](https://www.techtimes.com/articles/326131/20260901/ai-agents-now-discover-zero-days-escape-virtual-machines-trail-bits-proves.htm)
- [US to urge hands-off AI regulation at G20 — U.S. News](https://www.usnews.com/news/top-news/articles/2026-09-01/us-to-urge-hands-off-ai-regulation-at-g-20-official-says)
- [ChatGPT faces dual regulatory regimes under EU DSA — PYMNTS](https://www.pymnts.com/news/artificial-intelligence/2026/chatgpt-facing-dual-regulatory-regimes-under-new-eu-designation)
- [China's CXMT makes its first HBM3E chips — The Decoder](https://the-decoder.com/chinas-cxmt-makes-its-first-hbm3e-chips-closing-the-ai-memory-gap/)
- [Jinyi FinTech wins Trustworthy AI Governance award — Storm Media (Chinese)](https://www.storm.mg/article/11160855)
- [Korea picks SK Telecom, Kakao, KT for free nationwide AI — The Investor](https://www.theinvestor.co.kr/article/10855841)
- [ITCEN Group debuts AgentGo Guard — Chosun Biz](https://biz.chosun.com/en/en-it/2026/09/01/U53QY3EKMJHZ7HYUZN57WIHT2Y?outputType=amp)
- [India's NPCI prepares agentic payments rollout on UPI — StratNews Global](https://stratnewsglobal.com/technology/agentic-payments-upi)
- [HUMAIN invests in Arabic.AI and Tarjama — fwdstart](https://www.fwdstart.me/p/humain-invests-in-arabic-ai-and-tarjama-to-expand-saudi-enterprise-ai-offering)
- [Together AI partners with HUMAIN — Adgully](https://adgully.me/date/01-09-2026)
- [HUMAIN and AMD launch "AI in a Box" — Arab News](https://www.facebook.com/ArabNews/posts/humain-amd-launch-ai-in-a-box-to-expand-enterprise-ai-access-in-saudi-arabia/1501726225325720)
- [NEWORDER brings Lasso Security's AI agent controls to South Africa — TechCentral](https://techcentral.co.za/neworder-lasso-security-ai-agent-controls/285558)
- [Anthropic in talks for ~US$21B Australia AI data-center buildout — ASPI ICTS](https://aspicts.substack.com/p/early-edition-australia-makes-its)
- [Australian banks and big tech clash over agentic AI payments regulation — Capital Brief](https://www.capitalbrief.com/article/battlelines-drawn-as-big-banks-and-big-tech-square-off-over-agentic-ai-regulation-be11f1f9-20a3-4a7c-b8b0-706e965b8aad)
- [AIR raises $50M — TechCrunch](https://techcrunch.com/2026/09/01/air-raises-50m-to-help-companies-vet-the-skills-and-add-ons-ai-agents-use)
- [Update on Security at METR — METR Blog](https://metr.org/blog/2026-08-31-security-update/)
- [Pentagon adds ChatGPT and Grok to military AI platform, bypassing Anthropic — The AI Insider](https://theaiinsider.tech/2026/09/01/pentagon-adds-chatgpt-and-grok-to-military-ai-platform-bypassing-anthropic)
